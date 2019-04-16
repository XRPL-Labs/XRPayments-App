import { Platform, Dimensions } from "react-native";

const basePx = 750;
const guidelineBaseWidth = 1000;
const { height, width } = Dimensions.get("window");

const Truncate = (fullStr: string, string_length: number): string => {
    if (fullStr.length <= string_length) {
        return fullStr;
    }

    const separator = "...";

    const separator_length = separator.length;
    const charsToShow = string_length - separator_length;
    const frontChars = Math.ceil(charsToShow / 2);
    const backChars = Math.floor(charsToShow / 2);

    return fullStr.substr(0, frontChars) + separator + fullStr.substr(fullStr.length - backChars);
};

const Px2Dp = px => (px / basePx) * width;

const ScaleFont = size => (width / guidelineBaseWidth) * size;

const Format = nStr => {
    nStr += "";
    let x = nStr.split(".");
    let x1 = x[0];
    let x2 = x.length > 1 ? "." + x[1] : "";
    let rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, "$1" + "," + "$2");
    }
    return x1 + x2;
};

/* Export ==================================================================== */
export { Truncate, ScaleFont, Px2Dp, Format };
