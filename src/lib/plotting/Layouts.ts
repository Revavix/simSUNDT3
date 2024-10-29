import type { Layout } from "plotly.js-dist-min"
import { get } from "svelte/store"
import { theme } from "../data/Stores"
import { range } from "lodash"
import { crosshairHorizontalLabel, crosshairVerticalLabel } from "./Annotations"

export const layoutAPlot: any = {
    annotations: [
        crosshairVerticalLabel(0)
    ],
    paper_bgcolor: 'rgba(0, 0, 0, 0)',
    plot_bgcolor: 'rgba(0, 0, 0, 0)',
    margin: {
        t: 20,
        l: 50,
        r: 30,
        b: 40
    },
    font: {
        size: 12,
        family: 'Inter',
        color: get(theme) === 'business' ? '#fff' : '#000'
    },
    xaxis: {
        showticksuffix: 'all' as const,
        ticksuffix: 's',
    },
    yaxis: {
        autorange: false,
        range: [-1, 1],
    }
}


export const layoutBPlot: any = {
    font: {
        color: get(theme) === 'business' ? '#fff' : '#000'
    },
    paper_bgcolor: 'rgba(0, 0, 0, 0)',
    plot_bgcolor: 'rgba(0, 0, 0, 0)',
    margin: {
        t: 20,
        l: 40,
        r: 20,
        b: 40
    },
    shapes: [],
    annotations: [
        crosshairVerticalLabel(0),
        crosshairHorizontalLabel(0)
    ],
    xaxis: {
        minor: {
            ticks: 'outside',
            ticklen: 5,
            tickcolor: get(theme) === 'business' ? '#fff' : '#000'
        }
    },
    yaxis: {
        showticksuffix: 'all',
        ticksuffix: 's',
        autorange: 'reversed',
        minor: {
            ticks: 'outside',
            ticklen: 5,
            tickcolor: get(theme) === 'business' ? '#fff' : '#000'
        }
    }
}

export const layoutDPlot: any = {
    font: {
        color: get(theme) === 'business' ? '#fff' : '#000'
    },
    paper_bgcolor: 'rgba(0, 0, 0, 0)',
    plot_bgcolor: 'rgba(0, 0, 0, 0)',
    margin: {
        t: 20,
        l: 40,
        r: 20,
        b: 40
    },
    shapes: [],
    annotations: [
        crosshairVerticalLabel(0),
        crosshairHorizontalLabel(0)
    ],
    xaxis: {
        minor: {
            ticks: 'outside',
            ticklen: 5,
            tickcolor: get(theme) === 'business' ? '#fff' : '#000'
        }
    },
    yaxis: {
        label: 'Time (s)',
        showticksuffix: 'all',
        ticksuffix: 's',
        autorange: 'reversed',
        minor: {
            ticks: 'outside',
            ticklen: 5,
            tickcolor: get(theme) === 'business' ? '#fff' : '#000'
        }
    }
}

export const clayout: any = {
    autosize: true,
    font: {
        color: get(theme) === 'business' ? '#fff' : '#000'
    },
    paper_bgcolor: 'rgba(0, 0, 0, 0)',
    plot_bgcolor: 'rgba(0, 0, 0, 0)',
    margin: {
        t: 20,
        l: 40,
        r: 20,
        b: 40
    },
    annotations: [],
    clickmode: 'event+select',
    xaxis: {
        minor: {
            ticks: 'outside',
            ticklen: 5,
            tickcolor: get(theme) === 'business' ? '#fff' : '#000'
        }
    },
    yaxis: {
        minor: {
            ticks: 'outside',
            ticklen: 5,
            tickcolor: get(theme) === 'business' ? '#fff' : '#000'
        }
    }
}