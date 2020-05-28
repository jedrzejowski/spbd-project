import type QueryT from "../../types/QueryT";
import type {LatLngTuple} from "leaflet";
import AppData from "./AppData";

export interface Actions {
    CRITERION_SET: { criterion_id: string, criterion: QueryT.CriterionAny | null }
    CRITERION_DELETE: { criterion_id: string }
    DESTINATION_SET: QueryT.Destination | null
    MAP_CENTER_SET: LatLngTuple
    QUERY_STATE_SET: AppData.QueryState
    RESULTS_SET: QueryT.Result[] | null
}

export interface Action<T extends keyof Actions = any> {
    type: T
    data: Actions[T]
}

export function makeAction<T extends keyof Actions>(name: T, data: Actions[T]): Action<T> {
    return {type: name, data};
}
