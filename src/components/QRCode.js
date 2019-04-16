"use strict";

import { Image, View } from "react-native";
import React from "react";
import PropTypes from "prop-types";
import createReactClass from "create-react-class";
import qr from "qr.js";

import Canvas from "./Canvas.js";

function renderCanvas(canvas) {
    let ctx = canvas.getContext("2d");
    const size = this.size;
    const fgColor = this.fgColor;
    const bgColor = this.bgColor;
    canvas.width = size;
    canvas.height = size;
    canvas.style.left = (window.innerWidth - size) / 2 + "px";
    if (window.innerHeight > size) {
        canvas.style.top = (window.innerHeight - size) / 2 + "px";
    }
    ctx.fillRect(0, 0, size, size);
    const cells = this.cells;
    const cellWidth = this.size / cells.length;
    const cellHeight = this.size / cells.length;
    const nRoundedWidth = Math.round(cellWidth);
    const nRoundedHeight = Math.round(cellHeight);
    cells.forEach(function(row, rowIndex) {
        row.forEach(function(column, columnIndex) {
            const nLeft = columnIndex * cellWidth;
            const nTop = rowIndex * cellHeight;
            ctx.fillStyle = ctx.strokeStyle = column ? bgColor : fgColor;
            ctx.lineWidth = 1;
            ctx.fillRect(nLeft, nTop, cellWidth, cellHeight);
            ctx.strokeRect(Math.floor(nLeft) + 0.5, Math.floor(nTop) + 0.5, nRoundedWidth, nRoundedHeight);
            ctx.strokeRect(Math.ceil(nLeft) - 0.5, Math.ceil(nTop) - 0.5, nRoundedWidth, nRoundedHeight);
        });
    });
}

const QRCode = createReactClass({
    PropTypes: {
        value: PropTypes.string,
        size: PropTypes.number,
        bgColor: PropTypes.string,
        fgColor: PropTypes.string,
        onLoad: PropTypes.func,
        onLoadEnd: PropTypes.func,
    },

    getDefaultProps: function() {
        return {
            value: "",
            fgColor: "#FFF",
            bgColor: "#000",
            size: 128,
            onLoad: () => {},
            onLoadEnd: () => {},
        };
    },

    utf16to8: function(str) {
        var out, i, len, c;
        out = "";
        len = str.length;
        for (i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if (c >= 0x0001 && c <= 0x007f) {
                out += str.charAt(i);
            } else if (c > 0x07ff) {
                out += String.fromCharCode(0xe0 | ((c >> 12) & 0x0f));
                out += String.fromCharCode(0x80 | ((c >> 6) & 0x3f));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3f));
            } else {
                out += String.fromCharCode(0xc0 | ((c >> 6) & 0x1f));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3f));
            }
        }
        return out;
    },

    render: function() {
        const size = this.props.size;
        const value = this.utf16to8(this.props.value);
        return (
            <View
                ref={ref => (this.viewRef = ref)}
                style={{ backgroundColor: "#FFF", width: size + 10, height: size + 10 }}
            >
                <View
                    style={{
                        paddingLeft: 0,
                        paddingRight: 0,
                        paddingTop: 0,
                        paddingBottom: 0,
                        borderRadius: 15,
                        borderWidth: 5,
                        borderColor: "#ECF1FD",
                        overflow: "hidden",
                    }}
                >
                    <Canvas
                        context={{
                            size: size,
                            value: this.props.value,
                            bgColor: this.props.bgColor,
                            fgColor: this.props.fgColor,
                            cells: qr(value).modules,
                        }}
                        render={renderCanvas}
                        onLoad={this.props.onLoad}
                        onLoadEnd={this.props.onLoadEnd}
                        style={{ height: size, width: size }}
                    />
                </View>
            </View>
        );
    },
});

export default QRCode;
