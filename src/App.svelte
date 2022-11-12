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

    const scale = spring(1)
</script>

<main style="height:100%; width:100%">
    <div class="flex flex-row shadow-lg rounded-lg w-stretch mx-4 px-2 mt-8 bg-stone-300" style="z-index: 4; position: relative">
        <div class="flex flex-col w-20 pt-1 -space-y-1">
          <div class="flex flex-row w-full">
            <div class="flex flex-col" style="font-family:'Material Icons'; font-size:16px; color:#55b13c">
              play_circle
            </div>
            <div class="flex flex-col pl-2" style="font-size:11px; color:#4d4d4d;">
              Run
            </div>
          </div>
          <div class="flex flex-row w-full">
            <div class="flex flex-col" style="font-family:'Material Icons'; font-size:16px; color:#d49527">
              fact_check
            </div>
            <div class="flex flex-col pl-2" style="font-size:11px; color:#4d4d4d;">
              Validate
            </div>
          </div>
          <div class="flex flex-row w-full justify-center pt-6">
            <div class="flex flex-row" style="font-size:10px; color:#4d4d4d;">
              Simulate
            </div>
          </div>
        </div>
        <div class="flex flex-col line my-2"/>
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
</style>
