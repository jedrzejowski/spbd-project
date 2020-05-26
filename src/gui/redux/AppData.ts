import type QueryT from "../../types/QueryT";
import type Dictionary from "../../types/Dictionary";
import type {LatLngTuple} from "leaflet";

declare namespace AppData {

    interface State {
        now_querying: boolean
        criterions: Criterions
        map_center: LatLngTuple
        results: QueryT.Result[] | null
    }

    type Criterions = Dictionary<QueryT.CriterionAny | null>;
}

export default AppData;