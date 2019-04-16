// @flow
import { Provider } from "react-redux";

import { Navigation } from "react-native-navigation";

import registerScreens from "@screens";

import { AppScreens } from "@constants";

import { ScaleFont } from "@libs/utils";

import store from "@redux/store/";

console.disableYellowBox = true;

export default class App {
    constructor() {
        Navigation.events().registerAppLaunchedListener(() => {
            registerScreens(store, Provider);
            Navigation.setDefaultOptions({
                layout: {
                    orientation: ["landscape"],
                },
            });

            this.root = "";
            this.unsubscribe = store.subscribe(this.onStoreUpdate.bind(this));
        });
    }

    onStoreUpdate() {
        const state = store.getState();
        const coreState = state.core;

        // Wait for the redux store to load before starting the app
        if (coreState.storeLoaded) {
            this.startApp(state);
        }
    }

    startApp(state) {
        //Do something with state
        //i.e. determine if the user has activated

        if (state.app.channel) {
            this.root = "default";
            this.startDefaultApp();
        } else if (this.root !== "activate") {
            this.root = "activate";
            this.startActivation();
        }
    }

    startDefaultApp() {
        Navigation.pop;
        Navigation.setRoot({
            root: {
                stack: {
                    id: "rootStack",
                    children: [
                        {
                            component: {
                                name: AppScreens.MAIN_SCREEN,
                                options: {
                                    topBar: {
                                        title: {
                                            component: {
                                                name: "app.NavBarScreen",
                                                passProps: {
                                                    title: "XRP Community Meetup (Register 1)",
                                                },
                                                alignment: "center",
                                            },
                                        },
                                        rightButtons: {
                                            id: "buttonSignout",
                                            icon: require("./assets/images/signout.png"),
                                        },
                                    },
                                },
                            },
                        },
                    ],
                },
            },
        });
    }

    startActivation() {
        Navigation.pop;
        Navigation.setRoot({
            root: {
                component: {
                    name: AppScreens.ACTIVATE_SCREEN,
                },
            },
        });
    }
}
