import PropTypes from "prop-types";
import React from "react";
import { View, Text, StyleSheet, ViewPropTypes, TouchableHighlight, Platform } from "react-native";

import { AppSizes } from "@theme";

import { ScaleFont } from "@libs/utils";

const ButtonGroup = props => {
    const {
        component,
        buttons,
        onPress,
        selectedIndex,
        containerStyle,
        innerBorderStyle,
        lastBorderStyle,
        buttonStyle,
        textStyle,
        selectedTextStyle,
        selectedBackgroundColor,
        underlayColor,
        activeOpacity,
        onHideUnderlay,
        onShowUnderlay,
        setOpacityTo,
        containerBorderRadius,
        ...attributes
    } = props;

    const Component = component || TouchableHighlight;
    return (
        <View style={[styles.container, containerStyle && containerStyle]} {...attributes}>
            {buttons.map((button, i) => (
                <Component
                    activeOpacity={activeOpacity}
                    setOpacityTo={setOpacityTo}
                    onHideUnderlay={onHideUnderlay}
                    onShowUnderlay={onShowUnderlay}
                    underlayColor={underlayColor || "#ffffff"}
                    onPress={onPress ? () => onPress(i) : () => {}}
                    key={i}
                    style={[
                        styles.button,
                        i < buttons.length - 1 && {
                            borderRightWidth: (innerBorderStyle && innerBorderStyle.width) || 1,
                            borderRightColor: (innerBorderStyle && innerBorderStyle.color) || "#b3c1c4",
                        },
                        i === buttons.length - 1 && {
                            ...lastBorderStyle,
                            borderTopRightRadius: containerBorderRadius || 3,
                            borderBottomRightRadius: containerBorderRadius || 3,
                        },
                        i === 0 && {
                            borderTopLeftRadius: containerBorderRadius || 3,
                            borderBottomLeftRadius: containerBorderRadius || 3,
                        },
                        selectedIndex === i && {
                            backgroundColor: selectedBackgroundColor || "#fff",
                        },
                    ]}
                >
                    <View style={[styles.textContainer, buttonStyle && buttonStyle]}>
                        {button.element ? (
                            <button.element />
                        ) : (
                            <Text
                                style={[
                                    styles.buttonText,
                                    textStyle && textStyle,
                                    selectedIndex === i && { color: "#1FB566" },
                                    selectedIndex === i && selectedTextStyle,
                                ]}
                            >
                                {button}
                            </Text>
                        )}
                    </View>
                </Component>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        flex: 1,
    },
    textContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        marginTop: 5,
        borderColor: "black",
        flexDirection: "row",
        overflow: "hidden",
        backgroundColor: "#dedfe3",
        height: AppSizes.screen.height * 0.08,
        width: "100%",
    },
    buttonText: {
        fontSize: ScaleFont(15),
        color: "#364150",
        ...Platform.select({
            ios: {
                fontWeight: "500",
            },
            android: {
                fontWeight: "600",
            },
        }),
    },
});

ButtonGroup.propTypes = {
    button: PropTypes.object,
    component: PropTypes.any,
    onPress: PropTypes.func,
    buttons: PropTypes.array,
    containerStyle: ViewPropTypes.style,
    textStyle: Text.propTypes.style,
    selectedTextStyle: Text.propTypes.style,
    underlayColor: PropTypes.string,
    selectedIndex: PropTypes.number,
    activeOpacity: PropTypes.number,
    onHideUnderlay: PropTypes.func,
    onShowUnderlay: PropTypes.func,
    setOpacityTo: PropTypes.any,
    innerBorderStyle: PropTypes.shape({
        color: PropTypes.string,
        width: PropTypes.number,
    }),
    lastBorderStyle: PropTypes.oneOfType([ViewPropTypes.style, Text.propTypes.style]),
    buttonStyle: ViewPropTypes.style,
    selectedBackgroundColor: PropTypes.string,
    containerBorderRadius: PropTypes.number,
};

export default ButtonGroup;
