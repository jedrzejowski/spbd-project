import type QueryT from "../types/QueryT";
import {queryDatabase} from "../database";
import * as SQL from "./lib/sqlHelpers";
import isLngLatCriterion from "./lib/isLngLatCriterion";

function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// https://www.motofakty.pl/artykul/sprawdz-z-jaka-srednia-predkoscia-jezdzi-sie-po-polsce.html
const max_velocity = 30 * (1000 / (60 * 60)) * (/*offset*/1.1);

export default async function spbd_algorithm(args: {
    destination: QueryT.Destination
    criterions: QueryT.CriterionAny[]
}): Promise<QueryT.Result[]> {
    const {criterions, destination} = args;
    console.log(criterions, destination);

    const first_select: string[] = [], first_from: string[] = [], first_where: string[] = [];
    const second_select: string[] = [], second_from: string[] = [], second_where: string[] = [];


    const destination_predicate = predicateObjectType(destination.type);
    const dest_alias = destination_predicate.alias;
    first_from.push(destination_predicate.from);
    first_where.push(destination_predicate.where);

    first_select.push(`distinct on (${dest_alias}.osm_id) ${dest_alias}.osm_id as "osm_id"`);
    first_select.push(`ST_AsGeoJSON(${dest_alias}.way_4326) as "geo_json"`);
    first_select.push(`${dest_alias}.name as "name"`);
    first_select.push(`row_to_json(${dest_alias})   as "json"`)


    for (let criterion of criterions) {
        let way_alias: string;

        if (isLngLatCriterion(criterion)) {
            way_alias = SQL.planetPoint(criterion.lng, criterion.lat);
        } else {
            const criterion_predicate = predicateObjectType(criterion.type);
            way_alias = criterion_predicate.alias + ".way_4326";

            first_from.push(criterion_predicate.from);
            first_where.push(criterion_predicate.where);

            // aby wkluczyć porównywania tych samych wierszy
            first_where.push(`${dest_alias}.osm_id != ${criterion_predicate.alias}.osm_id`);

        }

        switch (criterion.distance.type) {
            case "car_distance": // odległość w samochodzie zawszę będzie mniejsza niż linii prostej
            case "straight_line": {
                first_where.push(
                    SQL.planetDistance(way_alias, `${dest_alias}.way_4326`) + ' < ' + criterion.distance.value
                );
                break;
            }

            case "car_time": {
                first_where.push(
                    SQL.planetDistance(way_alias, `${dest_alias}.way_4326`) +
                    ' < ' + criterion.distance.value / max_velocity
                );
                break;
            }

            default:
                throw new Error();
        }
    }


    let query = SQL.createSelect({
        select: first_select,
        from: first_from,
        where: SQL.and(first_where)
    });

    console.log(query);

    let resp = await queryDatabase<QueryT.Result>(query);

    console.log(resp);

    return resp.rows.map(row => {
        // z jakiegoś powodu baza zwraca tekst
        row.geo_json = JSON.parse(row.geo_json + "");
        return row;
    });
}


interface Predicate {
    from: string
    alias: string
    table: string
    where: string
}

function predicateObjectType(
    object_type: QueryT.KnownObjectTypes,
): Predicate {
    const alias = SQL.genName();

    switch (object_type) {
        case "hotel": {
            return {
                alias,
                table: "planet_osm_point",
                from: `planet_osm_point ${alias}`,
                where: `${alias}.tourism = 'hotel'`
            }
        }

        default:
            throw new Error(`predicateObjectType(): nie obsługiwany typ: ${object_type}`);
    }
}