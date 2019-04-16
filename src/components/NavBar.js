import React, { PureComponent } from "react";
import { StyleSheet, Platform, View, Image, Text } from "react-native";

import { AppSizes } from "@theme";

import { ScaleFont } from "@libs/utils";

export default class NavBar extends PureComponent {
    render() {
        return (
            <View style={styles.container}>
                <Image style={[styles.logo]} resizeMode={"contain"} source={require("../assets/images/logo.png")} />
                <Text style={styles.title}>{this.props.title}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        marginLeft: Platform.OS === "android" ? 20 : 0,
        width: AppSizes.screen.width * 0.95,
        backgroundColor: "transparent",
    },
    logo: {
        width: AppSizes.screen.width * 0.15,
        marginLeft: AppSizes.screen.width * 0.025,
    },
    title: {
        position: "absolute",
        left: 0,
        color: "#000",
        fontSize: ScaleFont(14),
        fontWeight: Platform.OS === "ios" ? "500" : "400",
    },
});
