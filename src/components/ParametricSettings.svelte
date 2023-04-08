<script>
    import Button from "./Button.svelte";

    export let numProcesses
    export let isModalOpen
    
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
        <div class="relative rounded-lg shadow bg-stone-200">
            <div class="flex flex-row items-start justify-between p-3 rounded-t">
                <div class="flex flex-col">
                    <h3 class="flex flex-row text-md font-semibold text-gray-600">
                        Settings
                    </h3>
                    <h1 class="flex flex-row text-xs pl-0.5 text-gray-600">
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
                        <label for="num_processes" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" style="color:#4d4d4d;">Number of processes</label>
                    </div>
                    <div class="flex flex-row w-full" id="num_processes">
                        <div class="flex flex-col w-10">
                            <input bind:value={numProcesses} type="text" class="bg-stone-300 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required disabled/>
                        </div>
                        <div class="flex flex-col w-11/12 pl-2">
                            <input bind:value={numProcesses} min=1 max=16 type="range" class="bg-stone-300 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required/>
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