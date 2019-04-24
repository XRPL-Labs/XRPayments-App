/**
 * Receive Screen
 */
import React, { Component } from "react";
// import PropTypes from 'prop-types';

import { Navigation } from "react-native-navigation";

import * as Ably from "ably";

import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Image,
    Platform,
    TouchableOpacity,
    Dimensions,
    Animated,
} from "react-native";

import { QRCode, SegmentButton } from "@components";

import AppAPI from "@libs/api";

import { AppSizes, AppFonts } from "@theme";

import { Truncate, ScaleFont, Format, Px2Dp } from "@libs/utils";

import LinearGradient from "react-native-linear-gradient";

import LottieView from "lottie-react-native";

const sections = ["XRPL", "XRPTipBot"];

/* Component ==================================================================== */
class ReceiveView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            QRTypeIndex: 0,
            amounts: null,
            fetchingRate: true,
            paid: 0,
            paidList: [],
            fadeAnim: new Animated.Value(0),
        };
    }

    componentDidMount() {
        this.convertAmount();
        this.subscribe();
        this.fadeAnimation();
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    fadeAnimation = () => {
        const self = this;
        this.animated = Animated.sequence([
            Animated.timing(self.state.fadeAnim, {
                toValue: 1,
                duration: 600,
                seNativeDriver: true,
            }),
            Animated.timing(self.state.fadeAnim, {
                toValue: 0,
                duration: 600,
                seNativeDriver: true,
            }),
            Animated.timing(self.state.fadeAnim, {
                toValue: 1,
                duration: 600,
                seNativeDriver: true,
            }),
        ]).start();
    };

    componentDidUpdate(prevProps, prevState) {
        if (this.state.paid !== prevState.paid) {
            this.fadeAnimation();
        }
    }

    convertAmount = () => {
        const { amount, appState } = this.props;

        AppAPI.rate
            .get({ channel_id: appState.channel, amount, currency: appState.currency })
            .then(res => {
                const { amounts } = res;
                this.setState({
                    amounts,
                    fetchingRate: false,
                });
            })
            .catch(err => console.log(err));
    };

    subscribe = () => {
        const { appState } = this.props;
        const ably = new Ably.Realtime(`Ab-SMg.6tVyIg:tu5Fe7IHH5bpn5dQ`);
        const channel = ably.channels.get(appState.channel.toLowerCase());
        this.channelSubscription = channel.subscribe("payment", this.onPayment);
    };

    unsubscribe() {
        if (this.channelSubscription) {
            this.channelSubscription.unsubscribe();
        }
    }

    onPayment = message => {
        const { data } = message;
        const { amount, name } = JSON.parse(data);
        const { paid, paidList } = this.state;

        paidList.push({ name, amount });

        this.setState({
            paid: Math.round((parseFloat(paid) + parseFloat(amount)) * 1000000) / 1000000,
            paidList,
        });
    };

    updateQRType = index => {
        this.setState({ QRTypeIndex: index });
    };

    renderLeftPanel = () => {
        const { amounts, paid, paidList } = this.state;
        const { appState } = this.props;

        if (paid === 0) {
            return (
                <View style={{ width: "100%", height: "100%" }}>
                    <View
                        style={{
                            width: "100%",
                            position: "absolute",
                        }}
                    >
                        <Text
                            style={{
                                fontSize: ScaleFont(22),
                                fontWeight: "600",
                                color: "black",
                                paddingTop: 35,
                                textAlign: "center",
                            }}
                        >
                            Waiting for payment ...
                        </Text>
                    </View>

                    <View
                        style={{
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Text
                            style={{
                                fontSize: ScaleFont(60),
                                fontWeight: "600",
                                color: "grey",
                                textAlign: "center",
                            }}
                        >
                            {Format(amounts[appState.currency])}{" "}
                            <Text style={{ fontSize: ScaleFont(25) }}>{appState.currency}</Text>
                        </Text>

                        <Image
                            style={{
                                marginTop: Px2Dp(20),
                                marginBottom: Px2Dp(20),
                                width: Px2Dp(40),
                                height: Px2Dp(40),
                            }}
                            resizeMode={"contain"}
                            source={require("../../assets/images/arrow-down.png")}
                        />
                        <Animated.Text
                            style={{
                                fontSize: ScaleFont(60),
                                fontWeight: "600",
                                color: "#1FB566",
                                opacity: this.state.fadeAnim,
                                textAlign: "center",
                            }}
                        >
                            {Format(amounts["XRP"] - paid)} <Text style={{ fontSize: ScaleFont(25) }}>XRP</Text>
                        </Animated.Text>
                    </View>
                </View>
            );
        }

        if (paid < amounts["XRP"] && paid !== 0) {
            return (
                <View style={{ flex: 1, alignItems: "flex-start", justifyContent: "center" }}>
                    <Text style={{ fontSize: ScaleFont(40), marginBottom: 20, fontWeight: "600", color: "green" }}>
                        Received
                        <Text style={{ fontSize: ScaleFont(42), fontWeight: "600", color: "green" }}> {paid} </Text>
                        XRP
                    </Text>
                    {paidList.map(r => (
                        <Text
                            style={{
                                fontSize: ScaleFont(25),
                                marginTop: 20,
                                marginBottom: 10,
                                fontWeight: "600",
                                color: "black",
                            }}
                        >
                            • {Truncate(r.name, 30)} ({r.amount} XRP)
                        </Text>
                    ))}
                    <Text style={{ fontSize: ScaleFont(25), fontWeight: "600", marginTop: 30 }}>
                        Remaining
                        <Text style={{ fontSize: ScaleFont(28), fontWeight: "600", color: "#CA0000" }}>
                            {" "}
                            {(amounts["XRP"] - paid)
                                .toFixed(6)
                                .replace(/[0]+$/g, "")
                                .replace(/\.$/, "")}{" "}
                        </Text>
                        XRP
                    </Text>

                    <View style={styles.row}>
                        <Text
                            style={{
                                fontSize: ScaleFont(20),
                                marginTop: 10,
                                marginBottom: 10,
                                fontWeight: "600",
                                color: "grey",
                            }}
                        >
                            Waiting for payment ...
                        </Text>
                        <ActivityIndicator color="green" />
                    </View>
                </View>
            );
        }

        return null;
    };

    renderRightPanel = () => {
        const { QRTypeIndex } = this.state;
        const { appState } = this.props;

        let qrContent = "";
        switch (QRTypeIndex) {
            case 0:
                qrContent = appState.xrpl;
                break;
            case 1:
                qrContent = appState.tipbot;
                break;
        }

        return (
            <View>
                <View style={{ flex: 2, alignItems: "center", justifyContent: "center", padding: 20 }}>
                    <Text
                        style={{
                            fontSize: ScaleFont(22),
                            fontWeight: "600",
                            color: "black",
                            textAlign: "center",
                            paddingTop: 8,
                            flex: 1,
                        }}
                    >
                        Choose your payment method and scan QR
                    </Text>
                </View>

                <View style={{ flex: 9, justifyContent: "center", alignItems: "center" }}>
                    <QRCode
                        ref={ref => (this.qr = ref)}
                        value={qrContent}
                        size={AppSizes.screen.height * 0.28}
                        bgColor="black"
                        fgColor="white"
                    />
                    <Text style={{ fontSize: ScaleFont(15), marginTop: 10 }}>{qrContent}</Text>
                </View>

                <SegmentButton onPress={this.updateQRType} selectedIndex={QRTypeIndex} buttons={sections} />
            </View>
        );
    };

    renderSuccess = () => {
        const { paid, amounts } = this.state;

        Navigation.mergeOptions(this.props.componentId, {
            topBar: {
                visible: false,
            },
        });

        return (
            <LinearGradient
                style={styles.successContainer}
                colors={["#fdfbfb", "#ebedee"]}
                start={{ x: 0, y: 0.1 }}
                end={{ x: 0.1, y: 1 }}
            >
                <View style={{ flex: 2, justifyContent: "center", alignItems: "center" }}>
                    <LottieView
                        source={require("../../assets/animations/3795-success-animation.json")}
                        autoPlay
                        loop={false}
                        style={{ height: AppSizes.screen.height * 0.5 }}
                        resizeMode={"contain"}
                    />
                </View>
                <View style={{ flex: 2, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ fontSize: AppFonts.h4.size, fontWeight: "600", color: "green" }}>
                        Payment Recieved ({paid} XRP)
                    </Text>
                    {paid > amounts["XRP"] && (
                        <Text
                            style={{
                                fontSize: AppFonts.h5.size,
                                fontWeight: "600",
                                color: "green",
                                textAlign: "center",
                                marginTop: 30,
                            }}
                        >
                            Thanks for the tip ❤️
                        </Text>
                    )}
                </View>

                <View style={{ flex: 1 }}>
                    <TouchableOpacity
                        style={styles.buttonBack}
                        onPress={() => {
                            Navigation.pop(this.props.componentId);
                        }}
                    >
                        <Text style={[styles.buttonBackText]}>Back</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        );
    };

    render() {
        const { fetchingRate, amounts, paid } = this.state;

        if (fetchingRate) {
            return (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text style={{ marginTop: 20 }}>Converting the amount...</Text>
                </View>
            );
        }

        if (paid >= amounts["XRP"]) {
            return this.renderSuccess();
        }

        return (
            <LinearGradient
                style={styles.container}
                colors={["#fdfbfb", "#ebedee"]}
                start={{ x: 0, y: 0.1 }}
                end={{ x: 0.1, y: 1 }}
            >
                <View style={styles.leftPanel}>{this.renderLeftPanel()}</View>
                <View style={styles.rightPanel}>{this.renderRightPanel()}</View>
            </LinearGradient>
        );
    }
}

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "flex-start",
        flex: 1,
    },
    rightPanel: {
        width: "50%",
        height: "100%",
        borderWidth: 8,
        borderColor: "#AFBDD8",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFF",
    },
    leftPanel: {
        width: "50%",
        justifyContent: "center",
        alignItems: "center",
    },
    successContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
    },
    methodTitleText: {
        fontSize: AppFonts.subtext.size,
    },
    buttonBack: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#2E3542",
        height: AppSizes.screen.height * 0.09,
        width: AppSizes.screen.width * 0.3,
        zIndex: 1,
        marginBottom: 80,
        borderRadius: AppSizes.screen.width * 0.7 * AppSizes.screen.height * 0.1,
    },
    buttonBackText: {
        fontSize: ScaleFont(27),
        fontWeight: Platform.OS === "ios" ? "500" : "400",
        color: "#FFF",
        backgroundColor: "transparent",
    },
    row: {
        left: 0,
        right: 0,
        flexDirection: "row",
    },
});

/* Export Component ==================================================================== */
export default ReceiveView;
