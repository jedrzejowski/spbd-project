import type QueryT from "../types/QueryT";
import {createDbConnection} from "../database";
import * as SQL from "./lib/sqlHelpers";
import isLngLatCriterion from "./lib/isLngLatCriterion";
import pg from "pg";

function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// https://www.motofakty.pl/artykul/sprawdz-z-jaka-srednia-predkoscia-jezdzi-sie-po-polsce.html
const max_velocity = 30 * (1000 / (60 * 60)) * (/*offset*/1.1);

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

async function algorithm(args: AlgorithmParams & {
    client: pg.PoolClient
}): Promise<QueryT.Result[]> {
    const {criterions, destination, client} = args;

    let select_base: string[] = [];
    let last_query = "";
    let group_by: string[] = [];

    select_base.push(`object1.osm_id as "osm_id"`);
    select_base.push(`object1.way as "way"`);
    group_by.push(`object1.osm_id`);
    group_by.push(`object1.way`);
    last_query = `
        select ${select_base.join(', ')}
        from planet_osm_typed object1
        where object1.type = '${destination.type}'
    `;

    for (let criterion of criterions) {

        function myDistance(from: string, to: string) {

            switch (criterion.distance.type) {
                case "straight_line": {
                    return SQL.planetDistance(from, to) + ' < ' + criterion.distance.value
                }

                case "car_distance": {
                    // odległość w samochodzie zawszę będzie mniejsza niż linii prostej
                    return SQL.planetDistance(from, to) + ' < ' + criterion.distance.value
                }

                case "car_time": {
                    return SQL.planetDistance(from, to) +
                        ' < ' + criterion.distance.value / max_velocity
                }

                default:
                    throw new Error();
            }
        }

        const my_alias = SQL.genName();

        if (isLngLatCriterion(criterion)) {

            last_query = `
            select object1.*
            from (${last_query}) object1
            where ${myDistance('object1.way', SQL.planetPoint(criterion.lng, criterion.lat))}
            `;

        } else {

            last_query = `
            select ${select_base.join(', ')}, array_agg(object2.osm_id) as "${my_alias}"
            from (${last_query}) object1,
                  planet_osm_typed object2
            where (object1.osm_id != object2.osm_id)
                and object2.type = '${criterion.type}'
                and ${myDistance('object1.way', 'object2.way')}
            group by ${group_by.join(', ')}
            `;

            select_base.push(`object1.${my_alias} as "${my_alias}"`);
            group_by.push(`object1.${my_alias}`);
        }
    }

    let query = `
begin;

    drop table if exists my_points;
    create temp table my_points as
    ${last_query};
    
    if ${false} then
    
    select * from my_points;
    
    end if;
    
    select * from my_points;
       
commit;
    `

    console.log(query);

    // @ts-ignore
    let resp = await client.query(query) as pg.QueryResult<>[];

    console.log(resp);

    return resp[3].rows.map(row => {
        // z jakiegoś powodu baza zwraca tekst
        row.geo_json = JSON.parse(row.geo_json + "");
        return row;
    });
}