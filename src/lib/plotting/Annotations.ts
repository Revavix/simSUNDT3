export function crosshairHorizontalLabel(y: any, alignment: 'left' | 'right' = 'left', pow: number = 0, rounding: number = 0) {
    return {
        x: alignment === 'left' ? 1 : 0,
        y: y,
        xref: 'paper',
        yref: 'y',
        xanchor: alignment,
        text: (y * Math.pow(10, pow)).toFixed(rounding),
        width: 36,
        showarrow: true,
        arrowhead: 0,
        axref: 'paper',
        ax: alignment === 'left' ? 0 : 1,
        ay: 0,
        font: {
            family: 'Courier New, monospace',
            size: 10,
            color: '#ffffff'
        },
        align: 'center',
        bgcolor: 'rgb(34, 34, 34)',
        opacity: 0.8
    }
}

export function crosshairVerticalLabel(x: any, alignment: 'top' | 'bottom' = 'bottom', pow: number = 0, rounding: number = 0) {
    return {
        x: x,
        y: alignment === 'top' ? 0 : 1,
        xref: 'x',
        yref: 'paper',
        yanchor: alignment,
        text: (x * Math.pow(10, pow)).toFixed(rounding),
        width: 36,
        showarrow: true,
        arrowhead: 0,
        ayref: 'paper',
        ax: 0,
        ay: alignment === 'top' ? 1 : 0,
        font: {
            family: 'Courier New, monospace',
            size: 10,
            color: '#ffffff'
        },
        align: 'center',
        bgcolor: 'rgb(34, 34, 34)',
        opacity: 0.8
    }
}