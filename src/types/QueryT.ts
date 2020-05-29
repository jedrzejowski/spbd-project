import type GeoJSON from "geojson";

namespace QueryT {

    export type DistanceType = "straight_line" | "car_distance" | "car_time";

    export interface Distance {
        value: number
        type: DistanceType
    }

    export type KnownObjectTypes = "lng_lat" |
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
        type: "lng_lat",
        lat: number
        lng: number
    }

    export interface Destination {
        type: Exclude<KnownObjectTypes, "lng_lat">
    }

    export type CriterionAny = CriterionLatLng | CriterionPoint;

    export interface OsmRowReference {
        osm_id: bigint,
        table: "polygon" | "point" | "line",
        name: string
        way_txt: any
    }

    export interface Result {
        name: string | null
        osm_id: bigint
        way: GeoJSON.GeoJSON
        criterions: CriterionResult[]
    }

    type CriterionResult = {
        type: "straight_line"
        matches: CriterionLineMatch[]
    } | {
        type: "car_distance" | "car_time"
        matches: CriterionAstarMatch[]
    }

    interface CriterionLineMatch {
        distance: number
        name?: string
        osm_id?: number
        way: GeoJSON.GeoJsonObject
    }

    interface CriterionAstarMatch {
        nodes: [number, number][]
        sum: number
        vert_id: number
        way: GeoJSON.GeoJsonObject
        name?: string
        osm_id?: number
    }

}

export default QueryT;