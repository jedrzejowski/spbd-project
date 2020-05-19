import {PlanetOsmPointRow} from "./_planet_osm_point";
import {PlanetOsmTypedRow} from "./_planet_osm";
import {selectRow} from "../lib/selectRow";

// https://wiki.openstreetmap.org/wiki/Tag:highway%3Dbus_stop

export type PlanetOsmBusStopRow = PlanetOsmTypedRow<PlanetOsmPointRow, {
    highway: "bus_stop",
    name: string
    covered: "yes" | "no" | null
}>

export const BusStopDisplay = "Przystanek autobusowy";

export function isBusStop(row: PlanetOsmPointRow): row is PlanetOsmBusStopRow {
    return row.highway === "bus_stop"
}

export async function selectBusStop(msg?: string) {
    return selectRow(msg ?? "Wybierz przystanek autobusowy", `
    select 'bus-stop' as "type",
        'point' as "table",
        bus_stop.osm_id as osm_id,
        make_name_with_boundaries(bus_stop.name, bus_stop.way) as "name"
        from planet_osm_point bus_stop
        where bus_stop.highway = 'bus_stop' and
            bus_stop.name notnull and
            (
                    lower(bus_stop.name) like lower('%' || $1 || '%') or
                    to_tsvector(bus_stop.name) @@ plainto_tsquery($1)
                );
    `);
}