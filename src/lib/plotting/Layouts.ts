import type { Layout } from "plotly.js-dist-min"
import { get } from "svelte/store"
import { theme } from "../data/Stores"

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
    yaxis: {
        showticksuffix: 'all',
        ticksuffix: 's',
        autorange: 'reversed'
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
    yaxis: {
        showticksuffix: 'all',
        ticksuffix: 's',
        autorange: 'reversed'
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
    shapes: [],
    annotations: []
}