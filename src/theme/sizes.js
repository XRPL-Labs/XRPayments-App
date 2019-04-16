/**
 * App Theme - Sizes
 */
import { Dimensions, Platform } from "react-native";

const { width, height } = Dimensions.get("window");

export default {
    // Window Dimensions
    screen: {
        height: height,
        width: width,
    },
    navbarHeight: Platform.OS === "ios" ? 60 : 50,
    statusBarHeight: Platform.OS === "ios" ? 16 : 0,
    tabbarHeight: 50,

    padding: 20,
    paddingSml: 10,

    borderRadius: 8,
};
