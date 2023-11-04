<script lang="ts">
    import Plotly from 'plotly.js-dist-min'
    import PlotModebar from "./PlotModebar.svelte";
    import { dot, horizontalLine, verticalLine } from '../lib/plotting/Annotations'
    import { UltraVision } from '../lib/plotting/Colorscales';
    import { interpolationMode, resultData, selectedPosEnd, selectedPosSide, selectedPosSignal } from '../lib/data/Stores';

    export let rectification

    let mode = "A"
    let smoothing = false
    let calibration: number = 0
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

    resultData.subscribe(async (v) => {
        await setTimeout(() => {}, 100)

        if (v === undefined) return

        if (div == undefined) {
            return
        }

        calibration = v.calibration

        let midPointX = Math.floor(((v.columns-1) * v.increment.x) / 2) + v.start.x
        let midPointY = Math.floor(((v.rows-1) * v.increment.y) / 2) + v.start.y

        layout.annotations = [
            dot(midPointX, midPointY, 'A [' + midPointX + ', ' + midPointY + ']', -v.increment.y * 10),
            verticalLine(midPointX, 'D'),
            horizontalLine(midPointY, 'B')
        ]

        v.data.find((cd) => {
            if (cd.x == midPointX && cd.y == midPointY) {
                selectedPosSignal.set({x: cd.x, y: cd.y})
                selectedPosEnd.set(cd.x)
                selectedPosSide.set(cd.y)
            }
        })

        let data = [
            {
                x: v.data.map(x => x.x),
                y: v.data.map(x => x.y),
                z: v.data.map(x => x.z),
                zsmooth: smoothing,
                type: 'heatmap',
                colorscale: UltraVision
            }
        ]

        plot = Plotly.newPlot(div, data, layout, cfg)

        div.on('plotly_click', function(d) {
            for(var i=0; i < d.points.length; i++){
                v.data.find((cd) => {
                    // Only update if the coordinate has data in it
                    if (cd.x === d.points[i].x && cd.y === d.points[i].y) {
                        // Update annotations according to chosen mode
                        if (mode == "A") {
                            layout.annotations[0] = dot(
                                cd.x, 
                                cd.y, 
                                'A [' + cd.x + ', ' + cd.y + ']',
                                -v.increment.y * 10
                            )
                            selectedPosSignal.set({x: cd.x, y: cd.y})
                        } else if (mode == "D") {
                            layout.annotations[1] = verticalLine(cd.x, 'D')
                            selectedPosEnd.set(cd.x)
                        } else if (mode == "B") {
                            layout.annotations[2] = horizontalLine(cd.y, 'B')
                            selectedPosSide.set(cd.y)
                        }

                        Plotly.relayout(div, layout)
                    }
                })
            }
        })
    })

    interpolationMode.subscribe(v => {
        if (v === undefined) return
        smoothing = v[0]
        resultData.update(n => n)
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
        <PlotModebar bind:plot={plot} info={{calibration: parseFloat(calibration.toFixed(4))}}/>
    </div>
</div>
<div class="flex flex-row h-full" style="max-height: calc(100% - 28px);">
    <div class="w-full h-full">
        <div class="w-full h-full" bind:this={div}/>
    </div>
</div>

<style>

</style>