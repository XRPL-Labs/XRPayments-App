import React from "react";
import { Navigation } from "react-native-navigation";

// Screens
import Main from "./Main";
import Activate from "./Activate";
import Receive from "./Receive";
import { NavBar } from "@components";

export default function registerScreens(store, Provider) {
    const screens = {
        Main,
        Activate,
        Receive,
        NavBar,
    };

    Object.keys(screens).map(key => {
        const SCREEN = screens[key];
        Navigation.registerComponent(`app.${key}Screen`, () => props => (
            <Provider store={store}>
                <SCREEN {...props} />
            </Provider>
        ));
    });
}
