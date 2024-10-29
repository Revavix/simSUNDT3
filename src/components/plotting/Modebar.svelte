<script lang="ts">
    import Plotly, { type Datum } from 'plotly.js-dist-min'

    export let plot: any
    let plotMode: "zoom" | "pan" = "zoom"


</script>

<div class="flex flex-col">
    <div class="flex flex-row rounded-full items-center">
        <div class="flex flex-col w-full mx-0.5 ">
            <button class="{plotMode === 'zoom' ? '' : 'opacity-60'}"
            on:click={() => {
                plotMode = 'zoom'
                Plotly.relayout(plot, {
                    dragmode: 'zoom'
                })
                plot = plot
            }}
            >
                <div class="flex flex-col text-md" style="font-family:'Material Icons';">
                search
                </div>
            </button>
        </div>
        <div class="flex flex-col w-full mx-0.5 ">
            <button class="{plotMode === 'pan' ? '' : 'opacity-60'}"
            on:click={() => {
                plotMode = 'pan'
                Plotly.relayout(plot, {
                    dragmode: 'pan'
                })
                plot = plot
            }}
            >
                <div class="flex flex-col text-md" style="font-family:'Material Icons';">
                pan_tool_alt
                </div>
            </button>
        </div>
    </div>
</div>
