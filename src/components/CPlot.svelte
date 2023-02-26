<script lang="ts">
    import Plotly from 'plotly.js-dist-min'
    import PlotModebar from "./PlotModebar.svelte";
    import { densityAndSignalData, selectedSignalData, interpolationMode } from '../lib/stores'

    let mode = "A"
    let lastModePositions = {
        a: [0, 0],
        b: [0, 0],
        d: [0, 0]
    }
    let smoothing = false
    let plot
    let div
    let layout = {
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
    let cfg = {
        responsive: true,
        displayModeBar: false,
        dragmode: 'pan'
    }

    densityAndSignalData.subscribe(async (v) => {
        await setTimeout(() => {}, 100)

        if (div == undefined) {
            return
        }

        let data = [
            {
                x: v.data.map(x => x.x),
                y: v.data.map(x => x.y),
                z: v.data.map(x => x.z),
                zsmooth: smoothing,
                type: 'heatmap'
            }
        ]

        plot = Plotly.newPlot(div, data, layout, cfg)

        div.on('plotly_click', function(d) {
            for(var i=0; i < d.points.length; i++){
                v.data.find((coordData) => {
                    if (coordData.x == d.points[i].x && coordData.y == d.points[i].y) {

                        if (mode == "A") {
                            layout.annotations[0] = {
                                x: coordData.x,
                                y: coordData.y,
                                xref: 'x',
                                yref: 'y',
                                text: 'A [' + coordData.x + ', ' + coordData.y + ']',
                                showarrow: true,
                                arrowhead: 7,
                                ax: 0,
                                ay: -v.yi * 10,
                                font: {
                                    size: 12,
                                    color: "black"
                                }
                            }
                            
                            selectedSignalData.set({data: coordData.r, amplitude: v.amplitudeMax})
                        } else if (mode == "B") {
                            layout.annotations[1] = {
                                align: "center",
                                x: 0,
                                y: coordData.y,
                                xref: 'paper',
                                axref: 'paper',
                                yref: 'y',
                                text: 'B',
                                arrowcolor: "#333333",
                                xanchor: "left",
                                showarrow: true,
                                arrowhead: 0,
                                ax: 1,
                                ay: 0,
                                font: {
                                    size: 12,
                                    color: "black"
                                }
                            }
                        } else if (mode == "D") {
                            layout.annotations[2] = {
                                align: "center",
                                x: coordData.x,
                                y: 0,
                                xref: 'x',
                                yref: 'paper',
                                ayref: 'paper',
                                text: 'D',
                                arrowcolor: "#333333",
                                yanchor: "bottom",
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

                        Plotly.relayout(div, layout)
                    }
                })
            }
        })
    })

    interpolationMode.subscribe(v => {
        smoothing = v[0]
        densityAndSignalData.update(n => n)
    })
</script>

<div class="flex flex-row">
    <div class="flex flex-col">
        <p class="pt-1 px-2" style="color:#4d4d4d">C-Scan</p>
    </div>
    <div class="flex flex-row pt-1">
        <button class="flex flex-col pr-1.5 {mode == "A" ? "opacity-100" : "opacity-40"}" style="font-size:12px; color:#4d4d4d;" on:click={() => mode = "A"}>
            A
        </button>
        <button class="flex flex-col pr-1.5 {mode == "B" ? "opacity-100" : "opacity-40"}" style="font-size:12px; color:#4d4d4d;" on:click={() => mode = "B"}>
            B
        </button>
        <button class="flex flex-col {mode == "D" ? "opacity-100" : "opacity-40"}" style="font-size:12px; color:#4d4d4d;" on:click={() => mode = "D"}>
            D
        </button>
    </div>
    <div class="flex flex-col ml-auto mr-2">
        <PlotModebar bind:plot={plot}/>
    </div>
</div>
<div class="flex flex-row h-full" style="max-height: calc(100% - 28px);">
    <div class="w-full h-full">
        <div class="w-full h-full" bind:this={div}/>
    </div>
</div>

<style>

</style>