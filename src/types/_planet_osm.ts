export type PlanetOsmTypedRow<Base, Ex> = Omit<Base, keyof Ex> & Ex;

export type PlanetOsmRow = {
    osm_id: bigint
    z_order: number
    way: any
}

//"bus-stop" | "water-object"
export type PlanetOsmRowReference = {
    type: string
    osm_id: bigint,
    table: "polygon" | "point" | "line" | "roads",
    name: string
}