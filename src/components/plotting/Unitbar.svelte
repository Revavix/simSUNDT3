<script lang="ts">
    import { loadedMetadata } from "../../lib/data/Stores";

    export let u1: "dB" | "Percentage" = "dB"
    export let u2: "Time" | "Distance" = "Time"
    export let wave: "Shear" | "Longitudinal" = "Shear"
    export let length: "Half" | "Full" = "Half"
    export let path: "Soundpath" | "True" = "Soundpath"
</script>

<div class="flex flex-row w-full items-center">
    <div class="flex flex-col w-2 mx-1.5 items-center">
        <button class="flex flex-col text-md" on:click={() => u1 === 'dB' ? u1 = 'Percentage' : u1 = 'dB'}>
            {#if u1 === "dB"}
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
                <path fill="currentColor" d="m22 12l-2 1l-1 1l-1-1l-1 3l-1-3l-1 8l-1-8l-1 2l-1-2l-1 4l-1-4l-1 9l-1-9l-1 6l-1-6l-1 1l-1-1l-2-1l2-1l1-1l1 1l1-6l1 6l1-9l1 9l1-4l1 4l1-2l1 2l1-8l1 8l1-3l1 3l1-1l1 1z"/>
            </svg>
            {:else}
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
                <path fill="currentColor" d="m18.501 3.5l-15 15.001l1.996 1.996l15-15zM7.002 5a2 2 0 1 0-.004 4a2 2 0 0 0 .004-4m10 10a2 2 0 1 0-.004 4a2 2 0 0 0 .004-4"/>
            </svg>
            {/if}
        </button>
    </div>
    <div class="flex flex-col w-2 mx-1.5 items-center">
        <button class="flex flex-col text-md" on:click={() => u2 === 'Time' ? u2 = 'Distance' : u2 = 'Time'}>
            {#if u2 === "Time"}
            <p style="font-family: 'Fira Mono'; font-size: 12px">μs</p>
            {:else}
            <p style="font-family: 'Fira Mono'; font-size: 12px">Mm</p>
            {/if}
        </button>
    </div>
    <div class="flex flex-col w-2 mx-1 items-center">
        <button class="flex flex-col" on:click={() => wave === 'Shear' ? wave = 'Longitudinal' : wave = 'Shear'}>
            {#if wave === "Shear"}
                <p style="font-family: 'Fira Mono'; font-size: 12px;">S</p>
            {:else}
                <p style="font-family: 'Fira Mono'; font-size: 12px;">L</p>
            {/if}
        </button>
    </div>
    <div class="flex flex-col w-2 mx-1 items-center">
        <button class="flex flex-col" on:click={() => length === 'Half' ? length = 'Full' : length = 'Half'}>
            {#if length === "Half"}
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
                <path fill="currentColor" d="m5.79 21.61l-1.58-1.22l14-18l1.58 1.22zM4 2v2h2v8h2V2zm11 10v2h4v2h-2c-1.1 0-2 .9-2 2v4h6v-2h-4v-2h2c1.11 0 2-.89 2-2v-2a2 2 0 0 0-2-2z"/>
            </svg>
            {:else}
            <p class="text-center" style="font-family: 'Fira Mono'; font-size: 12px">F</p>
            {/if}
        </button>
    </div>
    <div class="flex flex-col w-3 ml-1 mr-1">
        <button class="flex flex-col" on:click={() => path === 'Soundpath' ? path = 'True' : path = 'Soundpath'}>
            {#if path === "True"}
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
                <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="currentColor">
                    <path d="M3 5c.393-.405 1.44-2 2-2s1.607 1.595 2 2m12 12c.405.393 2 1.44 2 2s-1.595 1.607-2 2M5 12h1c2.828 0 4.243 0 5.121.879C12 13.757 12 15.172 12 18v1"/>
                    <path d="M21 19H11c-2.828 0-4.243 0-5.121-.879C5 17.243 5 15.828 5 13V3"/>
                </g>
            </svg>
            {:else}
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
                <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="currentColor">
                    <path d="M21 20H6.473c-2.106 0-3.16 0-3.421-.617c-.262-.618.482-1.344 1.972-2.797L17.924 4"/>
                    <path d="M11 20c0-2.648-1.226-4.934-3-6"/>
                </g>
            </svg>
            {/if}
        </button>
    </div>
</div>