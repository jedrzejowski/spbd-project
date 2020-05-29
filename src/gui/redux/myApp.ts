import AppData from "./AppData";
import {Action, Actions} from "./actions";

const initial_state: AppData.State = {
    query_state: "picker",
    destination: null,
    criterions: {},
    map_center: [52.230032086031315, 21.01194262504578],
    results: null,
    result_expanded_index: -1
};

export default function myApp<T extends keyof Actions>(
    state: AppData.State = initial_state,
    action: Action<T>
): AppData.State {

    let type: T = action.type;
    switch (type) {

        case "CRITERION_SET": {
            const {criterion_id, criterion} = action.data as Actions["CRITERION_SET"];

            return {
                ...state,
                criterions: {
                    ...state.criterions,
                    [criterion_id]: criterion
                }
            }
        }

        case "CRITERION_DELETE": {
            const {criterion_id} = action.data as Actions["CRITERION_DELETE"];

            let new_criterions = {...state.criterions};
            delete new_criterions[criterion_id];

            return {
                ...state,
                criterions: new_criterions
            }
        }

        case "MAP_CENTER_SET": {
            const map_center = action.data as Actions["MAP_CENTER_SET"];

            return {
                ...state,
                map_center
            }
        }

        case "QUERY_STATE_SET": {
            const query_state = action.data as Actions["QUERY_STATE_SET"];

            return {
                ...state,
                query_state
            }
        }

        case "RESULTS_SET": {
            const results = action.data as Actions["RESULTS_SET"];

            return {
                ...state,
                results
            }
        }

        case "DESTINATION_SET": {
            const destination = action.data as Actions["DESTINATION_SET"];

            return {
                ...state,
                destination
            }
        }

        case "RESULT_EXPANDED_INDEX_SET":{
            const result_expanded_index = action.data as Actions["RESULT_EXPANDED_INDEX_SET"];

            return {
                ...state,
                result_expanded_index
            }
        }

        default:
            return state;
    }
}