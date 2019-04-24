import React, { PureComponent } from "react";
import { StyleSheet, Platform, View, Image, Text, Alert } from "react-native";

import { Navigation } from "react-native-navigation";

import { AppSizes } from "@theme";

import { ScaleFont } from "@libs/utils";

export default class NavBar extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            topBarHeight: props.topBarHeight || null,
        };
    }

    componentDidMount() {
        const { topBarHeight } = this.state;
        if (!topBarHeight) {
            Navigation.constants().then(constants => {
                this.setState({
                    topBarHeight: constants.topBarHeight,
                });
            });
        }
    }

    render() {
        const { topBarHeight } = this.state;

        if (!topBarHeight) {
            return null;
        }
        return (
            <View style={[styles.container, { height: topBarHeight }]}>
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
        backgroundColor: "transparent",
    },
    logo: {
        width: AppSizes.screen.width * 0.15,
        marginLeft: AppSizes.screen.width * 0.4,
    },
    title: {
        position: "absolute",
        textAlign: "center",
        left: 0,
        color: "#000",
        fontSize: ScaleFont(14),
        fontWeight: Platform.OS === "ios" ? "500" : "400",
    },
});
