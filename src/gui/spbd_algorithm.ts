import type QueryT from "../types/QueryT";
import {queryDatabase} from "../database";


function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default async function spbd_algorithm(args: {
    criterions: QueryT.CriterionAny[]
}): Promise<QueryT.Result[]> {
    let criteria = args.criterions;
    let distances = [];
    if (criteria)
        for (let criterion of criteria)
            if (criterion.distance.type === 'car_time')
                distances.push(criterion.distance.value / 28); // 100 km/h ~ 28 m/s
            else
                distances.push(criterion.distance.value);
    let query = `select st_x(way_4326) as x, st_y(way_4326) as y, name from planet_osm_point where tourism = $1 and name like 'Do%'`;
    let resp = await queryDatabase(query, ['hotel']);
    return resp.rows;

}