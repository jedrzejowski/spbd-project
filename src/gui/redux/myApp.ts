import AppData from "./AppData";
import {Action, Actions} from "./actions";

const initial_state: AppData.State = {
    now_querying: false,
    criterions: {},
    map_center: [51.505, 22.09],
    results: null
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

        case "NOW_QUERYING_SET": {
            const now_querying = action.data as Actions["NOW_QUERYING_SET"];

            return {
                ...state,
                now_querying
            }
        }

        default:
            return state;
    }
}