import type QueryT from "../../types/QueryT";
import type {LatLngTuple} from "leaflet";

export interface Actions {
    CRITERION_SET: { criterion_id: string, criterion: QueryT.CriterionAny | null }
    CRITERION_DELETE: { criterion_id: string }
    MAP_CENTER_SET: LatLngTuple
    NOW_QUERYING_SET: boolean
}

export interface Action<T extends keyof Actions = any> {
    type: T
    data: Actions[T]
}

export function makeAction<T extends keyof Actions>(name: T, data: Actions[T]): Action<T> {
    return {type: name, data};
}
