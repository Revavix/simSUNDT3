export function crosshairHorizontalLabel(y: any) {
    return {
        x: 1,
        y: y,
        xref: 'paper',
        yref: 'y',
        xanchor: 'left',
        text: y,
        width: 36,
        showarrow: true,
        arrowhead: 0,
        axref: 'paper',
        ax: 0,
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

export function crosshairVerticalLabel(x: any) {
    return {
        x: x,
        y: 1,
        xref: 'x',
        yref: 'paper',
        yanchor: 'bottom',
        text: x,
        width: 36,
        showarrow: true,
        arrowhead: 0,
        ayref: 'paper',
        ax: 0,
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