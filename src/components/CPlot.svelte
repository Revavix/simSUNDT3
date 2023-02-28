<script lang="ts">
    import Plotly from 'plotly.js-dist-min'
    import PlotModebar from "./PlotModebar.svelte";
    import { densityAndSignalData, selectedSignalData, selectedSideData, selectedEndData, interpolationMode } from '../lib/stores'

    let mode = "A"
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

    function constructSideData(data, xp, points) {
        let ret = []

        data.forEach(element => {
            if (element.x == xp) {
                for(let i = 0; i < points; i++) {
                    ret.push({x: element.y, y: i, z: element.r[i].y})
                }
            }
        });

        return ret
    }

    function constructEndData(data, yp, points) {
        let ret = []

        data.forEach(element => {
            if (element.y == yp) {
                for(let i = 0; i < points; i++) {
                    ret.push({x: element.x, y: i, z: element.r[i].y})
                }
            }
        });

        return ret
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
                    // Only update if the coordinate has data in it
                    if (coordData.x == d.points[i].x && coordData.y == d.points[i].y) {
                        // Update annotations according to chosen mode
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
                            
                            // Set A-scan
                            selectedSignalData.set({data: coordData.r, amplitude: v.amplitudeMax})
                        } else if (mode == "B") {
                            layout.annotations[1] = {
                                align: "center",
                                x: coordData.x,
                                y: 0,
                                xref: 'x',
                                yref: 'paper',
                                ayref: 'paper',
                                text: 'B',
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

                            selectedSideData.set(constructSideData(v.data, coordData.x, v.numberOfSignalPoints))
                        } else if (mode == "D") {
                            layout.annotations[2] = {
                                align: "center",
                                x: 0,
                                y: coordData.y,
                                xref: 'paper',
                                yref: 'y',
                                axref: 'paper',
                                text: 'D',
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

                            selectedEndData.set(constructEndData(v.data, coordData.y, v.numberOfSignalPoints))
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
        <p class="pt-1 px-2" style="color:#4d4d4d">Top View (C)</p>
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