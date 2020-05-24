namespace QueryT {


    export type DistanceType = "straight_line" | "car_distance" | "car_time";
    export type DistanceOperator = "less_than" | "more_than";

    export interface Distance {
        operator: DistanceOperator
        value: number
        type?: DistanceType
    }

    export type KnownObjectTypes = "lat_long" | "tree" | "hotel";

    export interface PointBase {
        type: KnownObjectTypes
        distances: Distance[]
    }

    export interface HotelPoint extends PointBase {
        type: "hotel",
        osm_id: bigint
    }

    export type AnyPoint = HotelPoint ;

    export interface OsmReference {
        type: string
        osm_id: bigint,
        table: "polygon" | "point" | "line" | "roads",
        name: string
    }
}

export default QueryT;