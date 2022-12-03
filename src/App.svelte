<script lang="ts">
    import { MeshStandardMaterial, DoubleSide, BoxGeometry, CircleGeometry } from 'three'
    import { DEG2RAD } from 'three/src/math/MathUtils'
    import {
        AmbientLight,
        Canvas,
        DirectionalLight,
        Group,
        HemisphereLight,
        Mesh,
        OrbitControls,
        PerspectiveCamera
    } from '@threlte/core'
    import { spring } from 'svelte/motion'
    import Tree from './components/Tree.svelte'
    import { treeDef, treeTransmitter, treeReceiver, treeDefect } from './lib/treeDef'
    import { Button } from './lib/buttonData'
    import { Tabs, Tab } from './lib/tabDef'
    import ButtonComponent from './components/Button.svelte'
    import FileComponent from './tabs/File.svelte'
    import HelpComponent from './tabs/Help.svelte'
    import PreprocessorComponent from './tabs/Preprocessor.svelte'
    import ResultsComponent from './tabs/Results.svelte'
    import TabsComponent from './components/Tabs.svelte'

    treeDef.value[0].value[1].disabled = true;
    console.log(treeDef);

    const tabs = new Tabs(
      [
        new Tab("File", FileComponent),
        new Tab("Preprocessor", PreprocessorComponent),
        new Tab("Results", ResultsComponent),
        new Tab("Help", HelpComponent)
      ]
    )
    tabs.activeIdx = 1;

    const scale = spring(1)
</script>

<main style="height:100%; width:100%">
  <svelte:component this={tabs.members[tabs.activeIdx].component}></svelte:component>
  <div class="text-sm font-medium text-center text-gray-300 mt-8 mx-4" style="z-index: 4; position:relative;">
      <TabsComponent tabs={tabs}></TabsComponent>
  </div>
  <div class="flex flex-row shadow-lg rounded-lg w-stretch mx-4 px-2 mt-2 bg-stone-300" style="z-index: 4; position: relative">
      <div class="flex flex-col w-20 pt-1 -space-y-1">
        <ButtonComponent btn={new Button("Run", "play_arrow", () => {alert('test')})}></ButtonComponent>
        <ButtonComponent btn={new Button("Cloud Run", "cloud_sync", () => {alert('test')})}></ButtonComponent>
        <div class="flex flex-row w-full justify-center mt-auto pt-4">
          <div class="flex flex-row select-none" style="font-size:10px; color:#4d4d4d;">
            Simulate
          </div>
        </div>
      </div>
      <div class="flex flex-col line my-2 mx-2"/>
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
  <div class="flex flex-col shadow-lg rounded-lg mx-4 px-2 mt-2 bg-stone-300" style="z-index: 4; position: relative; min-height: 400px; min-width: 100px; max-width: 330px">
    <p class="pt-1" style="color:#4d4d4d">Parameterisation</p>
    <div style="padding-left: 0px; overflow: auto; max-height: 400px;">
      <Tree tree={treeDef}/>
      <Tree tree={treeTransmitter}/>
      <Tree tree={treeReceiver}/>
      <Tree tree={treeDefect}/>
    </div>
  </div>
  <div class="test">
    <Canvas>
        <PerspectiveCamera position={{ x: 10, y: 10, z: 10 }} fov={24}>
          <OrbitControls
            maxPolarAngle={DEG2RAD * 80}
            autoRotate={false}
            enableZoom={false}
            target={{ y: 0.5 }}
          />
        </PerspectiveCamera>
    
        <DirectionalLight shadow position={{ x: 3, y: 10, z: 10 }} />
        <DirectionalLight position={{ x: -3, y: 10, z: -10 }} intensity={0.2} />
        <AmbientLight intensity={0.2} />
    
        <!-- Cube -->
        <Group scale={$scale}>
          <Mesh
            interactive
            on:pointerenter={() => ($scale = 2)}
            on:pointerleave={() => ($scale = 1)}
            position={{ y: 0.5 }}
            castShadow
            geometry={new BoxGeometry(1, 1, 1)}
            material={new MeshStandardMaterial({ color: '#333333' })}
          />
        </Group>
    
        <!-- Floor -->
        <Mesh
          receiveShadow
          rotation={{ x: -90 * (Math.PI / 180) }}
          geometry={new CircleGeometry(3, 72)}
          material={new MeshStandardMaterial({ side: DoubleSide, color: 'white' })}
        />
    </Canvas>
  </div>
</main>

<style>
    .test {
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
    .line {
      border-left: 1px solid #7f7f7f;
    }
    div::-webkit-scrollbar {
      display: none;
    }
</style>
