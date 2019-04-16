/* eslint-disable no-void */
/**
 * Combine All Reducers
 */

import { combineReducers } from "redux";

import coreStateReducer from "@redux/modules/core/reducer";
import appStateReducer from "@redux/modules/app/reducer";

// Either like this or
const rootReducer = combineReducers({
    core: coreStateReducer,
    app: appStateReducer,
});

export default rootReducer;
