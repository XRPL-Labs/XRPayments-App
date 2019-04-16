// redux lib
import { applyMiddleware, createStore } from "redux";

// redux tools
import thunkMiddleware from "redux-thunk";
import promiseMiddleware from "redux-promise";
import { createLogger } from "redux-logger";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import rootReducer from "@redux/reducer/";

import { storeLoaded } from "@redux/modules/core/actions";

const persistConfig = {
    key: "root",
    storage: storage,
    whitelist: ["app"],
};

const persistedReducers = persistReducer(persistConfig, rootReducer);

// Load middleware
let middleware = [promiseMiddleware, thunkMiddleware];

if (__DEV__) {
    const loggerMiddleware = createLogger({ collapsed: true });
    middleware = [...middleware, loggerMiddleware];
}

// create the store
function configureStore() {
    const store = createStore(persistedReducers, applyMiddleware(...middleware));
    const persistor = persistStore(store, {}, storeRehydrated);
    return store;
}

function storeRehydrated() {
    store.dispatch(storeLoaded());
}

const store = configureStore();

export default store;
