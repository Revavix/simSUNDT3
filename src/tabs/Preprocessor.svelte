<script lang="ts">
    // TypeScript class definition imports
    import { Button } from '../lib/buttonDef'
    import { OutputLog } from '../lib/outputLogDef'
    
    // TypeScript class data definition imports
    import { treeMethod, treeTransmitter, treeReceiver, treeDefect } from '../lib/treeData'

    // Component imports
    import TreeComponent from '../components/Tree.svelte'
    import ButtonComponent from '../components/Button.svelte'
    import HorizontalProgressbarComponent from '../components/HorizontalProgressbar.svelte'
    import OutputLogComponent from '../components/OutputLog.svelte'

    // Page imports
    import Viewport from '../pages/Viewport.svelte'

    // Set up output log
    let log = new OutputLog(false)
    log.AddMessage("cloud_sync", "Test", "#4d4d4d")
    log.AddMessage("cloud_sync", "Test", "#4d4d4d")
    log.AddMessage("cloud_sync", "Test", "#4d4d4d")
    log.AddMessage("cloud_sync", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", "#4d4d4d")
    log.AddMessage("cloud_sync", "Test", "#4d4d4d")
    log.AddMessage("cloud_sync", "Test", "#4d4d4d")
</script>

<div id="preprocessor-tab">
    <div class="flex flex-row shadow-lg rounded-lg w-stretch mx-4 px-2 mt-2 bg-stone-300" style="z-index: 4; position: relative">
        <div class="flex flex-col w-20 pt-1 -space-y-1">
            <ButtonComponent btn={new Button("Run", "#55b13c", "play_arrow", () => {alert('test')})}></ButtonComponent>
            <ButtonComponent btn={new Button("Cloud Run", "#55b13c", "cloud_sync", () => {alert('test')})}></ButtonComponent>
            <div class="flex flex-row w-full justify-center mt-auto pt-4">
                <div class="flex flex-row select-none" style="font-size:10px; color:#4d4d4d;">
                Simulate
                </div>
            </div>
        </div>
        <div class="flex flex-col line-vert my-2 mx-2"/>
            <div class="flex flex-col w-20 pt-1 -space-y-1">
            <select class="pl-1 mb-auto bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:opacity-75" required> 
                <option>Highest</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
                <option>Lowest</option>
            </select>
            <div class="flex flex-row w-full justify-center mt-auto pt-4">
                <div class="flex flex-row select-none" style="font-size:10px; color:#4d4d4d;">
                Accuracy
                </div>
            </div>
        </div>
    </div>
    <div class="flex flex-col shadow-lg rounded-lg mx-4 px-2 mt-2 bg-stone-300" style="z-index: 4; position: relative; min-height: 306px; max-height: 706px; min-width: 300px; max-width: 330px">
        <p class="pt-1" style="color:#4d4d4d">Parameterisation</p>
        <div style="padding-left: 0px; overflow: auto; max-height: 706px;">
            <TreeComponent tree={treeMethod}/>
            <TreeComponent tree={treeTransmitter}/>
            <TreeComponent tree={treeReceiver}/>
            <TreeComponent tree={treeDefect}/>
        </div>
    </div>
    <div class="absolute-bottom-above pb-4">
        <OutputLogComponent log={log}/>
        <div class="py-1"/>
        <HorizontalProgressbarComponent/>
    </div>
    <div class="absolute-under">
        <Viewport/>
    </div>
</div>

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
  .absolute-bottom-above
  {
    position: absolute;
    bottom: 0;
    width: 50%;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    z-index: 4;
  }
  .line-vert {
    border-left: 1px solid #7f7f7f;
  }
  div::-webkit-scrollbar {
    display: none;
  }
</style>
