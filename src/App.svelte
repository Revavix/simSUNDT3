<script lang="ts">
    // TypeScript class definition imports
    import { Tabs, Tab } from './lib/tabDef'

    // TypeScript class data definition imports

    // Component imports
    import TabsComponent from './components/Tabs.svelte'

    // Tab imports
    import FileTab from './tabs/File.svelte'
    import HelpTab from './tabs/Help.svelte'
    import PreprocessorTab from './tabs/Preprocessor.svelte'
    import ResultsTab from './tabs/Results.svelte'
    import { onMount } from 'svelte';

    // Page imports
    import Viewport from './pages/Viewport.svelte'

    // Set up tabs
    let tabs = new Tabs(
        [
        new Tab("File", FileTab, {}),
        new Tab("Preprocessor", PreprocessorTab, {}),
        new Tab("Results", ResultsTab, {}),
        new Tab("Help", HelpTab, {})
        ]
    )
    tabs.activeIdx = 1

    let platform = 'darwin'
    let version = 'dev'
    let projectName = 'No project loaded'
    let viewportDisplay = "block"

    onMount(async () => {
        platform = await window.electronAPI.getPlatform()
    })

    // Dispatch handlers
    function handleFileMessage(ev) {
        switch (ev.detail.type) {
            case "ProjectUpdate":
                projectName = ev.detail.projectName
                tabs.activeIdx = 1
                break
            default:
                console.log("Unhandled type message from File tab " + ev.detail.type)
                return
        }
    }

    function handleMessages(ev) {
        switch(ev.detail.origin) {
            case "Generic":
                if (ev.detail.type == "HideViewport") {
                    viewportDisplay = "hidden"
                } else if (ev.detail.type == "UnhideViewport") {
                    viewportDisplay = "block"
                }
                break
            case "File":
                handleFileMessage(ev)
                break
            default:
                console.log("Unhandled message from tab component " + ev.detail.origin)
                return
        }
    }
</script>

<main class="flex flex-col main-container">
    {#if platform === 'darwin'}
    <div class="flex flex-row text-center justify-center mt-2 text-sm">
        <p>SimSUNDT [{version}] - {projectName}</p>
    </div>
    {/if}
    <div class="flex flex-row text-sm font-medium text-center text-gray-300 mt-1" style="z-index: 4;">
        <TabsComponent bind:tabs={tabs}></TabsComponent>
    </div>
    <svelte:component this={tabs.members[tabs.activeIdx].component} bind:properties={tabs.members[tabs.activeIdx].properties} on:message={handleMessages}></svelte:component>
    <div class="absolute-under {viewportDisplay}">
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
