import type QueryT from "../types/QueryT";
import {createDbConnection} from "../database";
import * as SQL from "./lib/sqlHelpers";
import isLngLatCriterion from "./lib/isLngLatCriterion";
import pg from "pg";

function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// https://www.motofakty.pl/artykul/sprawdz-z-jaka-srednia-predkoscia-jezdzi-sie-po-polsce.html
const max_velocity = 28;

interface AlgorithmParams {
    destination: QueryT.Destination
    criterions: QueryT.CriterionAny[]
}

export default async function (args: AlgorithmParams) {
    console.log(args);
    let client;

    try {
        client = await createDbConnection();

        return await algorithm({
            ...args,
            client
        })
    } catch (e) {
        client?.release();
        throw e;
    }
}

const vert_graph_car_query_by_length = `
select gid::int4            as id,
       source::int4,
       target::int4,
       cost::float8         as cost,
       reverse_cost::float8 as reverse_cost,
       x1, y1, x2, y2
from ways_cars
`;

const vert_graph_car_query_by_time = `
select gid::int4              as id,
       source::int4,
       target::int4,
       cost_s::float8         as cost,
       reverse_cost_s::float8 as reverse_cost,
       x1, y1, x2, y2
from ways_cars
`;


async function algorithm(args: AlgorithmParams & {
    client: pg.PoolClient
}): Promise<QueryT.Result[]> {
    const {criterions, destination, client} = args;

    let select_base: string[] = [];
    let last_query = "";
    let group_by: string[] = [];

    let find_verts_for_alias: string[] = [];
    let preform_astar: {
        has_osm_id: boolean
        alias: string
        by: "length" | "time",
        distance: number
    }[] = [];
    let sumarize: {
        alias: string
        has_osm_id: boolean
        type: QueryT.DistanceType
    }[] = [];


    select_base.push(`inner_one.osm_id as "osm_id"`);
    select_base.push(`inner_one.way as "way"`);
    select_base.push(`inner_one.name as "name"`);
    group_by.push(`inner_one.osm_id`);
    group_by.push(`inner_one.way`);
    group_by.push(`inner_one.name`);

    last_query = `
        select ${select_base.join(', ')}
        from planet_osm_typed inner_one
        where inner_one."type" = '${destination.type}'
    `;

    for (let criterion of criterions) {

        const my_alias = SQL.genName();

        let max_distance = criterion.distance.value;
        if (criterion.distance.type === "car_time") {
            max_distance = max_velocity * criterion.distance.value;
        }

        if (isLngLatCriterion(criterion)) {
            const ll_point = SQL.planetPoint(criterion.lng, criterion.lat);

            last_query = `
            select inner_one.*, 
                   array[${ll_point}] as "${my_alias}_way",
                   array[${SQL.planetDistance('inner_one.way', ll_point)}] as "${my_alias}_distance"
            from (${last_query}) inner_one
            where ${SQL.planetDistance('inner_one.way', ll_point)} < ${max_distance}
            `;

        } else {

            last_query = `
            select ${select_base.join(', ')}, 
                   array_agg(outer_one.osm_id) as "${my_alias}_osm_id",
                   array_agg(outer_one.way) as "${my_alias}_way",
                   array_agg(outer_one.name) as "${my_alias}_name",
                   array_agg(${SQL.planetDistance('inner_one.way', 'outer_one.way')}) as "${my_alias}_distance"
            from (${last_query}) inner_one,
                  planet_osm_typed outer_one
            where (inner_one.osm_id != outer_one.osm_id)
                and outer_one.type = '${criterion.type}'
                and ${SQL.planetDistance('inner_one.way', 'outer_one.way')} < ${max_distance}
            group by ${group_by.join(', ')}
            `;

            select_base.push(`inner_one.${my_alias}_osm_id as "${my_alias}_osm_id"`);
            group_by.push(`inner_one.${my_alias}_osm_id`);
            select_base.push(`inner_one.${my_alias}_name as "${my_alias}_name"`);
            group_by.push(`inner_one.${my_alias}_name`);
        }

        select_base.push(`inner_one.${my_alias}_way as "${my_alias}_way"`);
        group_by.push(`inner_one.${my_alias}_way`);
        select_base.push(`inner_one.${my_alias}_distance as "${my_alias}_distance"`);
        group_by.push(`inner_one.${my_alias}_distance`);

        if ((criterion.distance.type === "car_distance") ||
            (criterion.distance.type === "car_time")) {
            find_verts_for_alias.push(my_alias);

            preform_astar.push({
                has_osm_id: !isLngLatCriterion(criterion),
                alias: my_alias,
                by: criterion.distance.type === "car_distance" ? "length" : "time",
                distance: criterion.distance.value
            });

        }

        sumarize.push({
            has_osm_id: !isLngLatCriterion(criterion),
            alias: my_alias,
            type: criterion.distance.type
        });
    }

    let query = `
begin;
    drop table if exists my_points_astar;
    drop table if exists my_points_with_verts;
    drop table if exists my_points;

    create temp table my_points as
    ${last_query};
    
    create temp table my_points_with_verts as
    select point.*
           ${find_verts_for_alias.length > 0 ? `,spbd_find_pgr_vert_car(point.way)    as "vert_id"` : ""}
           ${find_verts_for_alias.map(alias => {
        return `,(select array_agg(spbd_find_pgr_vert_car(way))
                         from unnest(point.${alias}_way) way) as "${alias}_vert_id"`
    }).join('')}
    from my_points point;
    
    create temp table my_points_astar as
    select point.*
            ${preform_astar.map(options => {
        return `,(
               select json_agg(to_json(astar))
               from (
                   select astar.start_vert as "vert_id",
                       point.${options.alias}_way[array_position(point.${options.alias}_vert_id, astar.start_vert)] as "way",
                       ${options.has_osm_id ? `point.${options.alias}_osm_id[array_position(point.${options.alias}_vert_id, astar.start_vert)] as "osm_id",` : ""}
                       ${options.has_osm_id ? `point.${options.alias}_name[array_position(point.${options.alias}_vert_id, astar.start_vert)] as "name",` : ""}
                       astar.sum,
                       ( -- zamiana [index, node][] na [lng,lat][]
                        select json_agg(pos.lon_lat)
                        from (select to_json(array [vert.lon, vert.lat]) as lon_lat
                              from spbd_unnest_2d_table(astar.nodes) nodes,
                                   ways_vertices_pgr_cars vert
                              where nodes.second = vert.id
                              order by nodes.first) pos
                        ) as "nodes"
                   from (
                       select astar.start_vid                               as "start_vert",
                           sum(astar.cost)                               as "sum",
                           array_agg(array [astar.path_seq, astar.node]) as "nodes"
                       from pgr_astar(
                           '${options.by === "length" ? vert_graph_car_query_by_length : vert_graph_car_query_by_time}',
                           point.${options.alias}_vert_id, point.vert_id, true) astar
                        group by astar.start_vid
                   ) astar
               ) astar
               where astar.sum < ${options.distance}
           ) as "${options.alias}_astar"`
    }).join('')}
    from my_points_with_verts point;
    
    select point.osm_id,
       to_json(point.way) as "way",
       point.name,
       json_build_array(${
        sumarize.map(options => {
            switch (options.type) {
                case "straight_line": {
                    return `select json_build_object('type', 'straight_line', 'matches', json_agg(to_json(v)))
                            from (
                                select point.${options.alias}_way[i] as "way"
                                      ,point.${options.alias}_distance[i] as "distance"
                                      ${options.has_osm_id ? `,point.${options.alias}_osm_id[i] as "osm_id"` : ""}
                                      ${options.has_osm_id ? `,point.${options.alias}_name[i] as "name"` : ""}
                                from generate_subscripts(point.${options.alias}_way, 1) i
                                ) v`
                }
                case "car_time": {
                    return `select json_build_object('type', 'car_time', 'matches', ${options.alias}_astar)`
                }
                case "car_distance": {
                    return `select json_build_object('type', 'car_distance', 'matches', ${options.alias}_astar)`
                }
            }
        }).map(SQL.brackets)
    }) as "criterions"
    from my_points_astar point
    where ${preform_astar.length > 0 ? SQL.and(preform_astar.map(options => `${options.alias}_astar notnull`)) : true};

       
commit;
    `

    console.log(query);

    // @ts-ignore
    let resp = await client.query(query) as pg.QueryResult<>[];

    console.log(resp);

    return resp[7].rows;
}