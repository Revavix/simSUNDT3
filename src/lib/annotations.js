export function constructDotAnnotation(x, y, text, textOffset) {
    return {
        x: x,
        y: y,
        xref: 'x',
        yref: 'y',
        text: text,
        showarrow: true,
        arrowhead: 7,
        ax: 0,
        ay: textOffset,
        font: {
            size: 12,
            color: "black"
        }
    }
}

export function constructVerticalLineAnnotation(x, text) {
    return {
        align: "center",
        x: x,
        y: 0,
        xref: 'x',
        yref: 'paper',
        ayref: 'paper',
        text: text,
        arrowcolor: "#333333",
        xanchor: "left",
        showarrow: true,
        arrowhead: 0,
        ax: 0,
        ay: 1,
        font: {
            size: 12,
            color: "black"
        }
    }
}

export function constructHorizontalLineAnnotation(y, text) {
    return {
        align: "center",
        x: 0,
        y: y,
        xref: 'paper',
        yref: 'y',
        axref: 'paper',
        text: text,
        arrowcolor: "#333333",
        yanchor: "bottom",
        showarrow: true,
        arrowhead: 0,
        ax: 1,
        ay: 0,
        font: {
            size: 12,
            color: "black"
        }
    }
}