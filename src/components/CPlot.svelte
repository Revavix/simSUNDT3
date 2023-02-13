<script lang="ts">
    import Plotly from 'plotly.js-dist-min'
    import PlotModebar from "./PlotModebar.svelte";
    import { densityAndSignalData, selectedSignalData, interpolationMode } from '../lib/stores'
    import { onMount } from 'svelte';

    let smoothing = false
    let clickHandler
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

    onMount(() => {
        densityAndSignalData.update(n => n)
    })


    densityAndSignalData.subscribe(v => {
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
                        selectedSignalData.set(coordData.r)

                        /*layout.shapes = [
                            {
                                type: 'circle',
                                xref: 'x',
                                yref: 'y',
                                x0: coordData.x - v.xi/2,
                                x1: coordData.x + v.xi/2,
                                y0: coordData.y - v.yi/2,
                                y1: coordData.y + v.yi/2,
                                opacity: 0.8,
                                fillcolor: 'none',
                                line: {
                                    width: (v.xi + v.yi) / 2.5,
                                    color: 'black'
                                }
                            }
                        ]*/

                        layout.annotations = [
                            {
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
                            },
                            /*{
                                x: coordData.x,
                                y: coordData.y,
                                xref: 'x',
                                yref: 'y',
                                text: 'A',
                                showarrow: false,
                                font: {
                                    size: 10,
                                    color: "black"
                                }
                            }*/
                        ]

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