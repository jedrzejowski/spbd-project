namespace QueryT {


    export type DistanceType = "straight_line" | "car_distance" | "car_time";

    export type Distance = {
        operator: "less_than" | "more_than"
        distance: number
        distance_type: DistanceType
    };

    export type KnownObjectTypes = "lat_long" | "tree" | "hotel";

    export type Point = {
        type: KnownObjectTypes
        distances: Distance[]
    };
}

export default QueryT;