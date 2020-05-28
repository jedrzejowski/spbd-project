import type QueryT from "../../types/QueryT";

export default function (criterion: QueryT.CriterionBase): criterion is QueryT.CriterionLatLng {
    return criterion.type === "lng_lat";
}