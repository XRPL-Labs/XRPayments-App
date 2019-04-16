import * as ActionTypes from "./actionTypes";

// Initial state
const initialState = {
    storeLoaded: false,
};

// Reducer
export default function coreStateReducer(state = initialState, action = {}) {
    switch (action.type) {
        case ActionTypes.STORE_LOADED:
            return { ...state, storeLoaded: true };
        default:
            return state;
    }
}
