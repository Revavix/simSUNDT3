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

    // Page imports

    let tabs = new Tabs(
      [
        new Tab("File", FileTab),
        new Tab("Preprocessor", PreprocessorTab),
        new Tab("Results", ResultsTab),
        new Tab("Help", HelpTab)
      ]
    )
    tabs.activeIdx = 1;
</script>

<main style="height:100%; width:100%">
  <div class="text-sm font-medium text-center text-gray-300 mt-8 mx-4" style="z-index: 4; position:relative;">
      <TabsComponent bind:tabs={tabs}></TabsComponent>
  </div>
  <svelte:component this={tabs.members[tabs.activeIdx].component}></svelte:component>
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
    .line-vert {
      border-left: 1px solid #7f7f7f;
    }
    div::-webkit-scrollbar {
      display: none;
    }
</style>
