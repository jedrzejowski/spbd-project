import {PlanetOsmRowReference, PlanetOsmTypedRow} from "./_planet_osm";
import {PlanetOsmPolygonRow} from "./_planet_osm_polygon";
import {selectRow} from "../lib/selectRow";

type WaterType = "fountain" | "natural" | "wastewater" | "basin" |
    "resesrvoir" | "oxbow" | "pool" | "reservoir" |
    "re" | "river" | "canal" | "lake" | "pond";

export type PlanetOsmWaterPolygonRow = PlanetOsmTypedRow<PlanetOsmPolygonRow, {
    natural: "water",
    water: WaterType,
}>

export const WaterPolygonDisplay = "Zbiornik wodny";

export function selectWaterObject(msg?: string) {
    return selectRow(msg ?? "Wybierz przystanek autobusowy", `
    select 'water-object' as "type",
        'polygon' as "table",
        polygon.osm_id as osm_id,
        make_name_with_boundaries(polygon.name, polygon.way) as "name"
        from planet_osm_polygon polygon
        where polygon.natural = 'water' and
            polygon.water notnull and
            polygon.name notnull and
            (
                    lower(name) like lower('%' || $1::text || '%') or
                    to_tsvector(polygon.name) @@ plainto_tsquery($1::text)
                ) limit 10;
    `);
}