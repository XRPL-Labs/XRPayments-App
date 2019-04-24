/**
 * Main Screen
 */
import React, { Component } from "react";
// import PropTypes from 'prop-types';

import { Navigation } from "react-native-navigation";

import { View, Text, StyleSheet, Alert, Platform, Dimensions, PixelRatio } from "react-native";

import { NumericPad, NumericInput } from "@components";

import { AppScreens } from "@constants";

import { ScaleFont } from "@libs/utils";

import LinearGradient from "react-native-linear-gradient";

/* Component ==================================================================== */
class MainView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            amount: "",
            store_name: props.appState.name,
        };

        Navigation.events().bindComponent(this);
    }

    componentDidMount() {
        this.updateTitle();
        this.checkDeviceType();
    }

    componentDidUpdate(prevProps) {
        if (this.props.appState.name !== prevProps.appState.name) {
            this.updateTitle();
        }
    }

    navigationButtonPressed({ buttonId }) {
        const { reset_settings } = this.props;
        if (buttonId === "buttonSignout") {
            Alert.alert(
                "Disconnect",
                "Are you sure you want to disconnect from the XRPayments (you will need to activate the app again)?",
                [
                    { text: "No", onPress: () => null, style: "cancel" },
                    {
                        text: "Yes",
                        onPress: () => {
                            reset_settings();
                        },
                    },
                ],
                { cancelable: false },
            );
        }
    }

    updateTitle = () => {
        const { appState, componentId } = this.props;
        Navigation.mergeOptions(componentId, {
            topBar: {
                title: {
                    component: {
                        name: "app.NavBarScreen",
                        alignment: "left",
                        passProps: {
                            title: appState.name,
                        },
                    },
                },
            },
        });
    };

    checkDeviceType = () => {
        const { save_settings, appState } = this.props;

        let isTablet = false;

        const { height, width } = Dimensions.get("window");
        const pixelDensity = PixelRatio.get();
        const adjustedWidth = width * pixelDensity;
        const adjustedHeight = height * pixelDensity;
        if (pixelDensity < 2 && (adjustedWidth >= 1000 || adjustedHeight >= 1000)) {
            isTablet = true;
        } else if (pixelDensity === 2 && (adjustedWidth >= 1920 || adjustedHeight >= 1920)) {
            isTablet = true;
        } else {
            isTablet = false;
        }

        if (!isTablet && appState.showAlert) {
            Alert.alert(
                "Notice",
                "For a better user experience we recommend to use tablets (eg. iPad) for using this app.",
                [
                    {
                        text: "Ok",
                        onPress: () => {},
                        style: "default",
                    },
                    {
                        text: "Don't remind me",
                        onPress: () => save_settings({ showAlert: false }),
                        style: "destructive",
                    },
                ],
            );
        }
    };

    showReceiveScreen = () => {
        const { amount } = this.state;

        if (!amount || !parseFloat(amount)) {
            return;
        }
        this.setState({ amount: "" });

        Navigation.push(this.props.componentId, {
            component: {
                name: AppScreens.RECEIVE_SCREEN,
                passProps: {
                    amount,
                },
                options: {
                    layout: {
                        backgroundColor: "#FFF",
                    },
                    topBar: {
                        noBorder: true,
                        drawBehind: true,
                        elevation: 0,
                        background: {
                            color: "transparent",
                        },
                    },
                },
            },
        });
    };

    render() {
        const { amount } = this.state;
        const { appState } = this.props;
        return (
            <LinearGradient
                style={{ flex: 1 }}
                colors={["#fdfbfb", "#ebedee"]}
                start={{ x: 0, y: 0.1 }}
                end={{ x: 0.1, y: 1 }}
            >
                <View style={styles.container}>
                    <View style={[styles.containerCentered, { flex: 1 }]}>
                        <Text style={{ paddingBottom: 20, color: "#000", fontSize: ScaleFont(25), fontWeight: "600" }}>
                            Amount to pay:
                        </Text>
                        <NumericInput
                            value={amount}
                            placeholder={appState.currency.toUpperCase()}
                            symbol={appState.currency === "EUR" ? "€" : ""}
                        />
                    </View>
                </View>

                <NumericPad
                    value={amount}
                    onChangeText={e => this.setState({ amount: e })}
                    onPayPress={this.showReceiveScreen}
                />
            </LinearGradient>
        );
    }
}

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    container: {
        position: "relative",
        flex: 1,
        flexDirection: "column",
    },
    containerCentered: {
        justifyContent: "center",
        alignItems: "center",
    },
});

/* Export Component ==================================================================== */
export default MainView;
