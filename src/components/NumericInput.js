import React, { PureComponent } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Animated, DeviceEventEmitter, Image } from "react-native";

import { AppSizes } from "@theme";

import { ScaleFont, Px2Dp, Format } from "@libs/utils";

const styles = StyleSheet.create({
    view: {
        backgroundColor: "#FFF",
        justifyContent: "center",
        width: AppSizes.screen.width * 0.5,
        height: AppSizes.screen.height * 0.1,
        textAlign: "center",
        borderWidth: 1,
        borderColor: "#c6c6c6",
        borderRadius: AppSizes.screen.width * 0.7 * AppSizes.screen.height * 0.1,
    },
    textInputWrap: {
        height: AppSizes.screen.height * 0.1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: Px2Dp(10),
    },
    cursorWrap: {
        height: AppSizes.screen.height * 0.1,
        flexDirection: "row",
        alignItems: "center",
    },
    cursor: {
        color: "#000",
        fontSize: ScaleFont(35),
        fontWeight: "300",
    },
    placeholder: {
        color: "#333",
        fontSize: ScaleFont(20),
        fontWeight: "700",
        position: "absolute",
        textAlign: "center",
        left: ScaleFont(25),
    },
    currency: {
        position: "absolute",
        tintColor: "#000",
        right: AppSizes.screen.width * 0.02,
        width: AppSizes.screen.width * 0.031,
        height: AppSizes.screen.width * 0.031,
    },
    value: {
        fontWeight: "700",
        fontSize: ScaleFont(35),
        color: "#21B466",
    },
});

class NumericInput extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            fadeAnim: new Animated.Value(0),
            valueArr: props.value || [],
        };
    }
    componentDidMount() {
        this.inputEvent();

        this.animation();
    }

    static getDerivedStateFromProps(props, state) {
        if (props.value.split("") !== state.valueArr) {
            return {
                valueArr: props.value.split(""),
            };
        }

        return null;
    }

    inputEvent() {
        const self = this;
        self.subscription = DeviceEventEmitter.addListener("numericKeyboardInput", data => {
            self.setState({
                valueArr: data,
            });
        });
    }

    animation() {
        let that = this;
        this.animated = Animated.loop(
            Animated.sequence([
                Animated.timing(that.state.fadeAnim, {
                    toValue: 1,
                    duration: 600,
                    seNativeDriver: true,
                }),
                Animated.timing(that.state.fadeAnim, {
                    toValue: 0,
                    duration: 600,
                    seNativeDriver: true,
                }),
            ]),
            {
                iterations: 400,
            },
        ).start();
    }

    componentWillUnmount() {
        this.subscription.remove();
    }

    renderValue() {
        const { valueArr } = this.state;

        if (valueArr.length > 0) {
            return <Text style={[styles.value, this.props.valueStyle]}>{Format(valueArr.join(""))}</Text>;
        } else {
            return null;
        }
    }

    render() {
        return (
            <View style={[styles.view]}>
                <TouchableOpacity style={styles.textInputWrap}>
                    {this.renderValue()}

                    <Text style={[styles.placeholder, this.props.valueStyle || {}]}>{this.props.placeholder}</Text>

                    <Image
                        style={[styles.currency]}
                        resizeMode={"contain"}
                        source={require("../assets/images/icon-pay.png")}
                    />

                    {!this.props.cursorLock && !this.props.caretHidden ? (
                        <Animated.View style={[styles.cursorWrap, { opacity: this.state.fadeAnim }]}>
                            <Text style={styles.cursor}>|</Text>
                        </Animated.View>
                    ) : null}
                </TouchableOpacity>
            </View>
        );
    }
}

export default NumericInput;
