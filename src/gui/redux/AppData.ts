import type QueryT from "../../types/QueryT";
import type Dictionary from "../../types/Dictionary";
import type {LatLngTuple} from "leaflet";

declare namespace AppData {

    interface State {
        query_state: QueryState
        destination: QueryT.Destination | null
        criterions: Criterions
        map_center: LatLngTuple
        results: QueryT.Result[] | null
        result_expanded_index: number
    }

    type QueryState = "picker" | "querying" | "result" | "error" ;
    type Criterions = Dictionary<QueryT.CriterionAny | null>;

}

export default AppData;