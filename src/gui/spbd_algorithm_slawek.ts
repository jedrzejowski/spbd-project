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
                distances.push(criterion.distance.value * 28); // 100 km/h ~ 28 m/s
            else
                distances.push(criterion.distance.value);
    let query = ``;//select st_x(way_4326) as x, st_y(way_4326) as y, name from planet_osm_point where tourism = $1 and name like 'Do%'`;
    let froms = `planet_osm_point p`;
    let wheres = `p.tourism = 'hotel' `;

    let index = 0;
    for (let criterion of criteria){
        if (criterion.type === 'lng_lat') {
            wheres += `and ST_DistanceSpheroid('SRID=4326;POINT(` + criterion.lng + ` ` + criterion.lat + `)'::geometry, p.way_4326, 'SPHEROID["WGS 84",6378137,298.257223563]') < ` + distances[index] + ` `;
        }
        else{
            froms += `, planet_osm_point p`+index;
            if (criterion.type === 'hotel')
                wheres +=  `and p` + index + `.tourism = 'hotel' `;
            else
                wheres +=  `and p` + index + `.natural = 'tree' `;
            wheres += `and ST_DistanceSpheroid(p.way_4326, p` + index + `.way_4326, 'SPHEROID["WGS 84",6378137,298.257223563]') < ` + distances[index] + ` `;
        }

        index++;
    }
    query = `select distinct p.osm_id,
                        p.way,
                        st_x(p.way_4326) as x ,
                        st_y(p.way_4326) as y ,
                        p.name
                         from ` + froms + ` where ` +  wheres;
    console.log(query);
    //let query = `select st_x(way_4326) as x, st_y(way_4326) as y, name from planet_osm_point where tourism = $1 and name like 'Do%'`;
    let resp = await queryDatabase(query, []);
    return resp.rows;

}


