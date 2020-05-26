namespace QueryT {

    export type DistanceType = "straight_line" | "car_distance" | "car_time";

    export interface Distance {
        value: number
        type?: DistanceType
    }

    export type KnownObjectTypes = "lat_lng" | "tree" | "hotel";

    export interface CriterionBase {
        type: KnownObjectTypes
        distance: Distance
    }

    export interface CriterionPoint extends CriterionBase {
        type: Exclude<KnownObjectTypes, "lat_long">
        osm_row: OsmRowReference | null
    }

    export interface CriterionLatLng extends CriterionBase {
        type: "lat_lng",
        lat: number
        lng: number
    }

    export type CriterionAny = CriterionLatLng | CriterionPoint;

    export interface OsmRowReference {
        osm_id: bigint,
        table: "polygon" | "point" | "line",
        name: string
        way_txt: string
    }

    export interface Result {
        name: string
    }
}

export default QueryT;