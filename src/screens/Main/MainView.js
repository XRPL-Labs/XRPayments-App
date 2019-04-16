/**
 * Main Screen
 */
import React, { Component } from "react";
// import PropTypes from 'prop-types';

import { Navigation } from "react-native-navigation";

import { View, Text, StyleSheet, Alert } from "react-native";

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

    componentDidMount() {
        const { appState, componentId } = this.props;
        Navigation.mergeOptions(componentId, {
            topBar: {
                title: {
                    component: {
                        name: "app.NavBarScreen",
                        alignment: "center",
                        passProps: {
                            title: appState.name,
                        },
                    },
                },
            },
        });
    }

    componentDidUpdate(prevProps) {
        const { appState, componentId } = this.props;
        if (this.props.appState.name !== prevProps.appState.name) {
            Navigation.mergeOptions(componentId, {
                topBar: {
                    title: {
                        component: {
                            name: "app.NavBarScreen",
                            alignment: "center",
                            passProps: {
                                title: appState.name,
                            },
                        },
                    },
                },
            });
        }
    }

    showReceiveScreen = () => {
        const { amount } = this.state;

        if (!amount || !parseFloat(amount)) {
            return;
        }

        this.setState({
            amount: "",
        });

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
