import GeoJSON from "geojson";

export default function (geometry: GeoJSON.Geometry): string {
    switch (geometry.type) {
        case "Point": {
            const [lng, lat] = geometry.coordinates;
            return `Punkt[${lat > 0 ? "N" : "S"}${lat} ${lng > 0 ? "E" : "W"}${lng}]`
        }

        default:
            return "[unsupported geometry]"
    }
}