<script lang="ts">
    import { ProjectCaching, ProjectHandler } from "./lib/project"
    import File from './tabs/File.svelte'
    import Help from './tabs/Help.svelte'
    import Preprocessor from './tabs/Preprocessor.svelte'
    import Results from './tabs/Results.svelte'
    import { onMount } from 'svelte';
    import Viewport from './components/Viewport.svelte'
    
    let tabs = ["File", "Preprocessor", "Results", "Help"]
    let activeTab = "File"

    let projectCaching = new ProjectCaching()
    let projectHandler = new ProjectHandler()

    let platform = 'darwin'
    let version = 'dev'

    onMount(async () => {
        platform = await window.electronAPI.getPlatform()
    })
</script>

<main class="flex flex-col main-container">
    {#if platform === 'darwin'}
    <div class="flex flex-row text-center justify-center mt-2 text-sm">
        <p>SimSUNDT [{version}] - {projectHandler.currentProject.name}</p>
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
        <Preprocessor bind:projectHandler={projectHandler}/>
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
</style>
