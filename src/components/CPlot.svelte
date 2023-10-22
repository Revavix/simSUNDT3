<script lang="ts">
    import Plotly from 'plotly.js-dist-min'
    import PlotModebar from "./PlotModebar.svelte";
    import { densityAndSignalData, selectedSignalData, selectedSideData, selectedEndData, interpolationMode } from '../lib/stores'
    import { constructDotAnnotation, constructHorizontalLineAnnotation, constructVerticalLineAnnotation } from '../lib/annotations'
    import { ultravision } from '../lib/colorscales';

    export let rectification

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

    function constructSideData(data, yp, points) {
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

    function constructEndData(data, xp, points) {
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

    densityAndSignalData.subscribe(async (v) => {
        await setTimeout(() => {}, 100)

        if (div == undefined) {
            return
        }

        let midPointX = Math.floor(((v.columns-1) * v.xi) / 2) + v.xs
        let midPointY = Math.floor(((v.rows-1) * v.yi) / 2) + v.ys

        layout.annotations = [
            constructDotAnnotation(midPointX, midPointY, 'A [' + midPointX + ', ' + midPointY + ']', -v.yi * 10),
            constructVerticalLineAnnotation(midPointX, 'D'),
            constructHorizontalLineAnnotation(midPointY, 'B')
        ]

        v.data.find((coordData) => {
            if (coordData.x == midPointX && coordData.y == midPointY) {
                selectedSignalData.set({data: coordData.r, amplitude: v.amplitudeMax})
                selectedEndData.set({
                    data: constructEndData(v.data, coordData.x, v.numberOfSignalPoints),
                    amplitude: v.amplitudeMax
                })
                selectedSideData.set({
                    data: constructSideData(v.data, coordData.y, v.numberOfSignalPoints),
                    amplitude: v.amplitudeMax
                })
            }
        })

        let data = [
            {
                x: v.data.map(x => x.x),
                y: v.data.map(x => x.y),
                z: v.data.map(x => x.z),
                zsmooth: smoothing,
                type: 'heatmap',
                colorscale: ultravision
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
                            layout.annotations[0] = constructDotAnnotation(
                                coordData.x, 
                                coordData.y, 
                                'A [' + coordData.x + ', ' + coordData.y + ']',
                                -v.yi * 10
                            )
                            
                            // Set A-scan
                            selectedSignalData.set({data: coordData.r, amplitude: v.amplitudeMax})
                        } else if (mode == "D") {
                            layout.annotations[1] = constructVerticalLineAnnotation(coordData.x, 'D')

                            selectedEndData.set({
                                data: constructEndData(v.data, coordData.x, v.numberOfSignalPoints),
                                amplitude: v.amplitudeMax
                            })
                        } else if (mode == "B") {
                            layout.annotations[2] = constructHorizontalLineAnnotation(coordData.y, 'B')

                            selectedSideData.set({
                                data: constructSideData(v.data, coordData.y, v.numberOfSignalPoints),
                                amplitude: v.amplitudeMax
                            })
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