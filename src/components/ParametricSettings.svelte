<script lang="ts">
    import Button from "./Button.svelte";

    export let numProcesses: any
    export let isModalOpen: boolean
    
    let closeButton = {
        label: "",
        color: "#807a7a",
        icon: "close",
        action:  () => {isModalOpen = false},
        disabled: false
    }
</script>

{#if isModalOpen}
<div class="absolute-bg bg-stone-600 opacity-75"/>
<div class="absolute-above-center w-6/12 h-6/12">
    <div class="relative w-full h-full md:h-auto">
        <div class="relative rounded-lg shadow bg-base-100">
            <div class="flex flex-row items-start justify-between p-3 rounded-t">
                <div class="flex flex-col">
                    <h3 class="flex flex-row text-md font-semibold text-base-content">
                        Settings
                    </h3>
                    <h1 class="flex flex-row text-xs pl-0.5 text-base-content">
                        Parametric options
                    </h1>
                </div>
                <div class="bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
                    <Button data={closeButton}/>
                </div>
            </div>
            <div class="p-3 space-y-2">
                <div class="flex flex-col">
                    <div class="flex flex-row">
                        <label for="num_processes" class="block mb-2 text-sm font-medium text-base-content">Number of processes</label>
                    </div>
                    <div class="flex flex-row w-full" id="num_processes">
                        <div class="flex flex-col w-11">
                            <input bind:value={numProcesses} type="text" class="input input-sm text-sm bg-secondary rounded-xl text-center text-neutral" required/>
                        </div>
                        <div class="flex flex-col w-11/12 px-2">
                            <input bind:value={numProcesses} min=1 max=16 type="range" class="range range-sm rounded-lg" required/>
                            <div class="flex flex-row w-full justify-between pt-1 px-2 text-xs text-base-content">
                                {#each Array.from({length: 16}, (_, i) => i + 1) as n}
                                <span>|</span>
                                {/each}
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    </div>
</div>
{/if}

<style>
  .absolute-bg 
  {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 50;
  }
  .absolute-above-center
  {
    position: absolute;
    top: 35%;
    bottom: 65%;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    z-index: 50;
  }
</style>