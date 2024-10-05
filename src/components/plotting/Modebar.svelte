<script lang="ts">
    import Plotly, { type Datum } from 'plotly.js-dist-min'
    import { onMount } from "svelte";
    import { get } from 'svelte/store';

    export let plot: Promise<object>
    let div: any
    let plotMode: "zoom" | "pan" = "zoom"

    $: plot, update()

    async function update() {
        if (plot === undefined) return
        plot.then((v: any) => {
            if (v.childNodes.length === 0) return
            div = v
        })
    }
</script>

<div class="flex flex-col">
    <div class="flex flex-row rounded-full items-center">
        <div class="flex flex-col w-full mx-0.5 ">
            <button class="{plotMode === 'zoom' ? '' : 'opacity-60'}"
            on:click={() => {
                plotMode = 'zoom'
                Plotly.relayout(div, {
                    dragmode: 'zoom'
                })
                div = div
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
                Plotly.relayout(div, {
                    dragmode: 'pan'
                })
                div = div
            }}
            >
                <div class="flex flex-col text-md" style="font-family:'Material Icons';">
                pan_tool_alt
                </div>
            </button>
        </div>
    </div>
</div>
