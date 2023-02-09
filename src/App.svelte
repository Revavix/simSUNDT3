<script lang="ts">
    import { ProjectCaching, ProjectHandler } from "./lib/project"
    import { UTDefectRunner } from './lib/utDefRunner';
    import File from './tabs/File.svelte'
    import Help from './tabs/Help.svelte'
    import Preprocessor from './tabs/Preprocessor.svelte'
    import Results from './tabs/Results.svelte'
    import { onMount } from 'svelte';
    import Viewport from './components/Viewport.svelte'
    import Button from "./components/Button.svelte"
    
    let tabs = ["File", "Preprocessor", "Results", "Help"]
    let activeTab = "File"

    let projectCaching = new ProjectCaching()
    let projectHandler = new ProjectHandler()
    let utDefRunner = new UTDefectRunner()

    let platform = 'darwin'
    let version = '3'

    let maximized = false

    onMount(async () => {
        platform = await window.electronAPI.getPlatform()
        maximized = await window.electronAPI.isMaximized()
    })

    const minimizeButton = {
        label: "",
        color: "#d6d3d1",
        icon: "minimize",
        action: () => { window.electronAPI.minimize() },
        disabled: false
    }

    const maximizeButton = {
        label: "",
        color: "#d6d3d1",
        icon: "crop_square",
        action: async () => { 
            window.electronAPI.maximize() 
            maximized = await window.electronAPI.isMaximized()
        },
        disabled: false
    }

    const unmaximizeButton = {
        label: "",
        color: "#d6d3d1",
        icon: "close_fullscreen",
        action: async () => { 
            window.electronAPI.unmaximize()
            maximized = await window.electronAPI.isMaximized()
        },
        disabled: false
    }

    const closeButton = {
        label: "",
        color: "#d6d3d1",
        icon: "close",
        action: () => { window.electronAPI.close() },
        disabled: false
    }
</script>

<main class="flex flex-col main-container">
    <!-- Drag bar -->
    <div class="draggable"/>
    <!-- OS specific top bar -->
    {#if platform === 'darwin'}
    <div class="flex flex-row text-center justify-center mt-2 text-sm">
        <p>SimSUNDT [{version}] - {projectHandler.currentProject.name}</p>
    </div>
    {:else if platform == 'win32'}
    <div class="flex flex-row">
        <div class="flex flex-row mr-auto mt-2 text-xs items-center">
            <!-- Image -->
            <div class="flex flex-col w-4 mr-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <defs>
                        <style>
                        .cls-1 {
                            fill: #f39200;
                        }
                        </style>
                    </defs>
                    <rect class="cls-1" width="24" height="24" rx="4" ry="4"/>
                    <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-size="0.9em" text-rendering="optimizeLegibility" font-family="Helvetica, sans-serif">NDT</text>   
                </svg>
            </div>
            <!-- App name -->
            <div class="flex flex-col">
                <p>SimSUNDT {version}</p>
            </div>
        </div>
        <div class="flex flex-row ml-auto -mr-3" style="z-index: 99">
            <!-- Minimize -->
            <div class="flex flex-col px-1 rounded-b hover:bg-stone-400">
                <Button data={minimizeButton}></Button>
            </div>
            <!-- Maximize -->
            {#if !maximized}
            <div class="flex flex-col px-1 rounded-b hover:bg-stone-400">
                <Button data={maximizeButton}></Button>
            </div>
            {:else}
            <div class="flex flex-col px-1 rounded-b hover:bg-stone-400">
                <Button data={unmaximizeButton}></Button>
            </div>
            {/if}
            <!-- Close -->
            <div class="flex flex-col px-1 rounded-b hover:bg-stone-400">
                <Button data={closeButton}></Button>
            </div>
        </div>
    </div>
    {/if}
    <div class="flex flex-row text-sm font-medium text-center text-gray-300 mt-1" style="z-index: 99;">
        <ul class="flex flex-row">
            {#each tabs as tab}
                <li class="mr-2">
                    {#if activeTab == tab}
                        <button class="inline-block text-gray-200 rounded-t-lg border-b-2 border-yellow-600 active">{tab}</button>
                    {:else}
                        <button class="inline-block rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300" on:click={() => activeTab = tab}>{tab}</button>
                    {/if}
                </li>
            {/each}
        </ul>
    </div>
    {#if activeTab == "File"}
        <File bind:projectCaching={projectCaching} bind:projectHandler={projectHandler} bind:currentTab={activeTab}/>
    {:else if activeTab == "Preprocessor"}
        <Preprocessor bind:projectHandler={projectHandler} bind:utDefRunner={utDefRunner}/>
    {:else if activeTab == "Results"}
        <Results/>
    {:else if activeTab == "Help"}
        <Help/>
    {/if}
    <div class="absolute-under" class:visible={activeTab === "Preprocessor" || activeTab === "Results"} class:invisible={activeTab === "File" || activeTab === "Help"}>
        <Viewport/>
    </div>

</main>

<style>
    .absolute-under {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      height: 100%;
      width: 100%;
      overflow: hidden;
      z-index: 1;
    }
    div::-webkit-scrollbar {
        display: none;
    }
    .main-container
    {
        width: calc(100% - 32px);
        margin-right: 16px;
        margin-left: 16px;
    }
    .draggable
    {
        -webkit-app-region: drag;
        position: absolute;
        height: 32px;
        left: 0;
        width: calc(100% - 80px);
        z-index: 1;
        pointer-events: all;
    }
</style>
