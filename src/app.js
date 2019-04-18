// @flow

// navigation
import { Navigation } from "react-native-navigation";
import registerScreens from "@screens";

// constantst
import { AppScreens } from "@constants";
import { Px2Dp } from "@libs/utils";

// redux
import { Provider } from "react-redux";
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

        if (state.app.channel && this.root !== "default") {
            this.root = "default";
            this.startDefaultApp();
        } else if (!state.app.channel && this.root !== "activate") {
            this.root = "activate";
            this.startActivation();
        }
    }

    startDefaultApp() {
        Navigation.pop;
        Navigation.setRoot({
            root: {
                stack: {
                    children: [
                        {
                            component: {
                                name: AppScreens.MAIN_SCREEN,
                                options: {
                                    topBar: {
                                        title: {
                                            component: {
                                                name: "app.NavBarScreen",
                                                alignment: "center",
                                            },
                                            alignment: "center",
                                            largeTitle: {
                                                visible: true,
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
