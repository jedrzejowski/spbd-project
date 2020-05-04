import {PlanetOsmTypedRow} from "./_planet_osm";
import {PlanetOsmPolygonRow} from "./_planet_osm_polygon";

type BoundaryType = "fence" | "military" | "national_park" | "protected_area" | "religious_administration" | "zone";


export type PlanetOsmBoundaryRow = PlanetOsmTypedRow<PlanetOsmPolygonRow, {
    boundary: BoundaryType,
}>;

