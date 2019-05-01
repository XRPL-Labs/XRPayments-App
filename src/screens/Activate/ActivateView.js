/**
 * Settings Screen
 */
import React, { Component } from "react";
// import PropTypes from 'prop-types';

import LinearGradient from "react-native-linear-gradient";

import {
    Text,
    StyleSheet,
    TextInput,
    Platform,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Linking,
    Alert,
    View,
    Image,
} from "react-native";

import { AppSizes } from "@theme";

import { ScaleFont, Px2Dp } from "@libs/utils";

/* Component ==================================================================== */
class ActivateView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            channel_id: "",
            isChecking: false,
            error: false,
        };
    }

    checkChannelId = () => {
        const { get_settings } = this.props;
        const { channel_id } = this.state;

        if (!channel_id) {
            return;
        }

        this.setState({
            isChecking: true,
            error: false,
        });

        get_settings(channel_id)
            .then(() => {
                this.setState({
                    isChecking: false,
                });
            })
            .catch(e => {
                this.setState({
                    isChecking: false,
                    error: true,
                });

                Alert.alert(
                    "Invalid",
                    "Please enter a valid XRPayments Channel ID.",
                    [{ text: "OK", onPress: () => {} }],
                    { cancelable: false },
                );
            });
    };

    render() {
        const { isChecking, error } = this.state;
        return (
            <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }} enabled={Platform.OS === "ios" ? true : false}>
                <LinearGradient
                    style={styles.container}
                    colors={["#fdfbfb", "#ebedee"]}
                    start={{ x: 0, y: 0.1 }}
                    end={{ x: 0.1, y: 1 }}
                >
                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <Image
                            resizeMode={"contain"}
                            style={styles.logo}
                            source={require("../../assets/images/logo.png")}
                        />
                    </View>

                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <Text style={styles.headerText}>
                            Please visit{" "}
                            <Text
                                onPress={() => Linking.openURL("https://setup.xrpay.com")}
                                style={{ textDecorationLine: "underline" }}
                            >
                                https://setup.xrpay.com
                            </Text>{" "}
                            and follow instruction to get your channel id
                        </Text>
                    </View>

                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <TextInput
                            ref={r => (this.input = r)}
                            placeholder="Enter Channel ID"
                            underlineColorAndroid="transparent"
                            onSubmitEditing={this.checkChannelId}
                            returnKeyType="done"
                            style={[
                                styles.textInputStyle,
                                {
                                    borderColor: error ? "red" : "#c6c6c6",
                                },
                            ]}
                            onChangeText={channel_id => this.setState({ channel_id })}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <TouchableOpacity style={styles.buttonActivate} onPress={this.checkChannelId}>
                            {isChecking ? (
                                <ActivityIndicator size="large" color="#FFF" />
                            ) : (
                                <Text style={[styles.buttonActivateText]}>Activate</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </KeyboardAvoidingView>
        );
    }
}

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
    },
    headerText: {
        fontSize: ScaleFont(30),
        lineHeight: ScaleFont(40),
        textAlign: "center",
        color: "#000",
        paddingRight: 60,
        paddingLeft: 60,
    },
    textInputStyle: {
        backgroundColor: "#FFF",
        justifyContent: "center",
        width: Px2Dp(450),
        height: Px2Dp(60),
        color: "#5a5a5a",
        textAlign: "center",
        borderWidth: 1,
        borderColor: "#c6c6c6",
        fontSize: ScaleFont(30),
        fontWeight: Platform.OS === "ios" ? "500" : "400",
        borderRadius: AppSizes.screen.width * 0.7 * AppSizes.screen.height * 0.1,
    },
    buttonActivate: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#41E196",
        height: Px2Dp(60),
        width: Px2Dp(450),
        zIndex: 1,
        borderRadius: AppSizes.screen.width * 0.7 * AppSizes.screen.height * 0.1,
    },
    buttonActivateText: {
        fontSize: ScaleFont(30),
        fontWeight: Platform.OS === "ios" ? "500" : "400",
        color: "white",
        backgroundColor: "transparent",
    },
    logo: {
        width: AppSizes.screen.width * 0.3,
        height: AppSizes.screen.height * 0.3,
    },
});

/* Export Component ==================================================================== */
export default ActivateView;
