import "react-native";
import React from "react";
import renderer from "react-test-renderer";

import NumericInput from "@components/NumericInput";

it("renders correctly", () => {
    const tree = renderer.create(<NumericInput />).toJSON();
    expect(tree).toMatchSnapshot();
});
