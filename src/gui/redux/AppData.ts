import QueryT from "../../types/QueryT";
import Dictionary from "../../types/Dictionary";

declare namespace AppData {

    interface State {
        criterions: Criterions
    }

    type Criterions = Dictionary<QueryT.CriterionAny | null>;
}

export default AppData;