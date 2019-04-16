import * as ActionTypes from "./actionTypes";

// Initial state
const initialState = {
    channel: "",
    currency: "",
    name: "",
    xrpl: "",
    tipbot: "",
};

// Reducer
export default function appStateReducer(state = initialState, action = {}) {
    switch (action.type) {
        case ActionTypes.SAVE_SETTINGS:
            return { ...state, ...action.payload };
        case ActionTypes.RESET_SETTINGS:
            return initialState;
        default:
            return state;
    }
}
