import type { Layout } from "plotly.js-dist-min"
import { get } from "svelte/store"
import { theme } from "../data/Stores"
import { range } from "lodash"

export const blayout: any = {
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
    annotations: [],
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

export const dlayout: any = {
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
    annotations: [],
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