namespace QueryT {

    export type DistanceType = "straight_line" | "car_distance" | "car_time";

    export interface Distance {
        value: number
        type?: DistanceType
    }

    export type KnownObjectTypes = "lat_lng" |
        "tree" | //naturals
        "hotel" | //tourism
        "zoo" | //tourism
        "museum" | //tourism
        "hostel" | //tourism
        "motel" | //tourism
        "supermarket" | //shop
        "alcohol" | //shop
        "bakery" | //shop
        "atm" | //amenity
        "fast_food" |//amenity
        "post_office" |// amenity
        "bank" | //amenity
        "pharmacy" | //amenity
        "library" | //amenity
        "bench" //amenity
        ;

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
        x: number
        y: number
    }
}

export default QueryT;