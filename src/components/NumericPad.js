import React, { PureComponent } from "react";
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    DeviceEventEmitter,
    Image,
    Platform,
    TouchableHighlight,
} from "react-native";

import PropTypes from "prop-types";

import { ScaleFont, Px2Dp } from "@libs/utils";

import { AppSizes } from "@theme";

class NumericPad extends PureComponent {
    static propTypes = {
        onChangeText: PropTypes.func,
    };
    constructor(props) {
        super(props);
        this.state = {
            valueArr: [],
            numArr: [1, 2, 3, 4, 5, 6, 7, 8, 9, ".", 0, "X"],
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (props.value.split("") !== state.valueArr) {
            return {
                valueArr: props.value.split(""),
            };
        }
        return null;
    }

    inputEvent(value) {
        DeviceEventEmitter.emit("numericKeyboardInput", value);
        this.onChangeText(value);
    }

    clear() {
        this.removeAll();
    }

    isFocused() {
        if (this.state.cursorLock) {
            return false;
        } else {
            return true;
        }
    }

    onChangeText(value) {
        if (value == undefined || value == null) return false;
        this.props.onChangeText && this.props.onChangeText(value.join(""));
    }

    add(value) {
        let valueArr = this.state.valueArr;
        valueArr.push(value);
        if (valueArr == "" || valueArr == undefined || valueArr == null) {
            return;
        }

        let valueStr = valueArr.join("");
        if (valueStr.split(".").length > 2) {
            valueStr = valueStr.replace(/\.+$/, "");
        }
        valueArr = valueStr.split("");
        this.setState({
            valueArr: valueArr,
        });
        this.inputEvent(valueArr);
    }

    remove() {
        let valueArr = this.state.valueArr;
        if (valueArr.length == 0) {
            return;
        }
        valueArr.pop();
        this.setState({
            valueArr: valueArr,
        });
        this.inputEvent(valueArr);
    }

    removeAll() {
        let valueArr = this.state.valueArr;
        if (valueArr.length == 0) {
            return;
        }
        valueArr = [];
        this.setState({
            valueArr: valueArr,
        });
        this.inputEvent(valueArr);
    }

    renderNumText(flag) {
        return this.state.numArr.slice(flag, flag + 3).map((item, index) => {
            let styleLine = item == "X" || item == "." ? styles.toolLine : styles.line;
            let styleNumText = item == "X" || item == "." ? styles.specialNumText : styles.numText;
            if (item == "X") {
                return (
                    <TouchableHighlight
                        underlayColor={"#ECF1FD"}
                        style={styleLine}
                        valueStyle={this.props.valueStyle}
                        key={index}
                        onPress={this.remove.bind(this)}
                        onLongPress={this.removeAll.bind(this)}
                    >
                        <Image style={styles.removeIcon} source={require("../assets/images/icon-delete.png")} />
                    </TouchableHighlight>
                );
            }
            return (
                <TouchableHighlight
                    underlayColor={"#ECF1FD"}
                    style={styleLine}
                    activeOpacity={0.7}
                    key={index}
                    onPress={this.add.bind(this, item)}
                >
                    <Text style={styleNumText}>{item}</Text>
                </TouchableHighlight>
            );
        });
    }
    renderNum() {
        return this.state.numArr.map((item, index) => {
            if (index % 3 == 0) {
                return (
                    <View style={styles.numWrap} key={index}>
                        {this.renderNumText(index)}
                    </View>
                );
            }
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.keyboardWrap}>{this.renderNum()}</View>
                <TouchableOpacity style={styles.submitButton} onPress={this.props.onPayPress}>
                    <Text style={{ textAlign: "center", color: "white", fontWeight: "700", fontSize: ScaleFont(35) }}>
                        Pay
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    removeIcon: {
        width: Px2Dp(25),
        resizeMode: "contain",
    },
    container: {
        height: AppSizes.screen.height * 0.425,
        left: 0,
        right: 0,
        bottom: 0,
    },
    keyboardWrap: {
        position: "absolute",
        height: AppSizes.screen.height * 0.425,
        width: AppSizes.screen.width * 0.85,
        bottom: 0,
        left: 0,
        backgroundColor: "#ffffff",
        borderWidth: 0,
        borderTopWidth: 1,
        borderTopColor: "#cccccc",
    },
    submitButton: {
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        borderWidth: 0,
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: "#cccccc",
        height: AppSizes.screen.height * 0.428,
        backgroundColor: "#1FB566",
        width: AppSizes.screen.width * 0.149,
        right: 0,
    },
    numWrap: {
        flexDirection: "row",
        justifyContent: "space-around",
    },
    toolLine: {
        borderTopColor: "#cccccc",
        borderRightColor: "#cccccc",
        borderTopWidth: 1,
        borderRightWidth: 1,
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        height: AppSizes.screen.height * 0.11,
        backgroundColor: "#F5F8FC",
    },
    line: {
        borderTopColor: "#cccccc",
        borderRightColor: "#cccccc",
        borderTopWidth: 1,
        borderRightWidth: 1,
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        height: AppSizes.screen.height * 0.105,
    },
    specialNumText: {
        color: "#000000",
        fontSize: ScaleFont(35),
        marginBottom: 17,
        fontWeight: "900",
    },
    numText: {
        color: "#000000",
        fontSize: Platform.isPad ? ScaleFont(35) : ScaleFont(30),
        fontWeight: Platform.OS === "ios" ? "500" : "400",
    },
});

export default NumericPad;
