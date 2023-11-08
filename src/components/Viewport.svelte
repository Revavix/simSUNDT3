<script lang="ts">
    import { T, useThrelte } from '@threlte/core'
    import { CSM, Grid, MeshLineGeometry, MeshLineMaterial, OrbitControls, Sky, interactivity, Text } from '@threlte/extras'
    import { Color, Mesh, Vector2, Vector3 } from 'three';
    import { DEG2RAD } from 'three/src/math/MathUtils.js';
    import { ProjectSingleton } from '../lib/data/ProjectSingleton';
    import { afterUpdate } from 'svelte';
    import { kernelProgress } from '../lib/data/Stores';
    import type { Progress } from '../lib/models/Kernel';

    let size: Vector2 = new Vector2(6, 6)
    let transmitterPos: Vector2 = new Vector2(3, 3)
    let transmitterOffset: Vector2 = new Vector2(0, 0)
    let receiverPos: Vector2 = new Vector2(3, 0)
    let increment: Vector2 = new Vector2(6, 6)
    let projectSingleton: ProjectSingleton = ProjectSingleton.GetInstance()
    let isReceiverActive: boolean = false

    interactivity()

    let mesh: Mesh = new Mesh()

    const { renderer, invalidate } = useThrelte()

    $: {
        renderer.toneMappingExposure = 1.5
    }

    projectSingleton.SubscribeTreeData((tree: any) => {
        console.log( tree.method.utTechnique.method)

        if (tree !== undefined) {
            size = new Vector2(
                Math.abs(tree.method.mesh.size.xs.value - tree.method.mesh.size.xe.value) / 10,
                Math.abs(tree.method.mesh.size.ys.value - tree.method.mesh.size.ye.value) / 10,
            )
            increment.x = tree.method.mesh.size.xi.value / 10
            increment.y = tree.method.mesh.size.yi.value / 10
            transmitterPos.x = tree.transmitter.position.x.value  / 10 + size.x / 2
            transmitterPos.y = tree.transmitter.position.y.value / 10 + size.y / 2
            receiverPos.x = tree.transmitter.position.x.value + tree.receiver.separation.x.value  / 10
            receiverPos.y = tree.transmitter.position.y.value + tree.receiver.separation.y.value / 10
            isReceiverActive = tree.method.utTechnique.method.value !== 1
        }
    })

    kernelProgress.subscribe((value: Progress[]) => {
        if (value === undefined) return
        if (value.length < 1 || value[0] === undefined) return

        let positions: Array<Vector2> = []

        for(let y = 0; y <= (size.y * 10); y += (increment.y * 10)) {
            for(let x = 0; x < (size.x * 10); x += (increment.x * 10)) {
                positions.push(new Vector2(x / 10, y / 10))
            }  
        }

        console.log("Total positions: " + positions.length + " increment x " + increment.x )

        let currentPosition: Vector2 = positions[Math.floor(value[0].progress * positions.length)]

        if (currentPosition != undefined) {
            transmitterOffset.x = currentPosition.x
            transmitterOffset.y = currentPosition.y
        }

        if (value[0].finished || value[0].raw.freq === value[0].raw.target) {
            transmitterOffset.x = 0
            transmitterOffset.y = 0
        }
    })
</script>

<CSM
    enabled
    args={{
        lightDirection: new Vector3(1, -1, 1).normalize()
    }}
    lightIntensity={0.1}
    >
    <T.PerspectiveCamera
    makeDefault
    position={[12, 12, 12]}
    >
        <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI * 0.5}/>
    </T.PerspectiveCamera>
    <Sky 
        turbidity={20}
        rayleigh={0.57}
        azimuth={180}
        elevation={-5}
        mieCoefficient={0.038}
        mieDirectionalG={0}
    />
    <T.AmbientLight intensity={1} />
    <T.SpotLight position={[0, mesh.position.y + 10, 0]} scale={[5, 5, 5]} power={125} intensity={125} target={mesh}/>

    <T.Mesh receiveShadow rotation.x={DEG2RAD * -90} position.y={-0.1}>
        <T.PlaneGeometry args={[1000, 1000, 100, 100]}/>
        <T.MeshStandardMaterial color={new Color(Color.NAMES.dimgray)} roughness={0.9} metalness={0.2}/>
    </T.Mesh>

    <!-- Test subject --> 
    <Grid position.y={4.01} sectionThickness={0} cellSize={increment.x} gridSize={[size.x, size.y]} axis="x" type="lines"/>
    <Grid position.y={4.01} sectionThickness={0} cellSize={increment.y} gridSize={[size.x, size.y]} axis="z" type="lines"/>
    <T.Mesh receiveShadow castShadow position={[0, 2, 0]} bind:mesh on:click={() => {
            console.log('clicked')
        }}>
        <T.BoxGeometry args={[size.x + increment.x, 4, size.y + increment.y, 100, 100]}/>
        <T.MeshStandardMaterial color="gray" roughness={0.1} metalness={0.5} transparent opacity={0.5}/>
    </T.Mesh>

    <!-- Transmitter -->
    <T.Mesh>
        <MeshLineGeometry points={[new Vector3(transmitterPos.x - transmitterOffset.x, 4, transmitterPos.y - transmitterOffset.y), new Vector3(transmitterPos.x - transmitterOffset.x, 4.5, transmitterPos.y - transmitterOffset.y)]} />
        <MeshLineMaterial
          width={0.015}
          color="#fe3d00"
        />
    </T.Mesh>
    <Text text={"T"} position={[transmitterPos.x - transmitterOffset.x, 4.7, transmitterPos.y - transmitterOffset.y]} fontSize={0.2} textAlign={"center"} anchorX="center"/>

    <!-- Receiver -->
    {#if isReceiverActive}
    <T.Mesh>
        <MeshLineGeometry points={[new Vector3(receiverPos.x, 4, receiverPos.y), new Vector3(receiverPos.x, 4.5, receiverPos.y)]} />
        <MeshLineMaterial
          width={0.015}
          color="#419898"
        />
    </T.Mesh>
    <Text text={"R"} position={[receiverPos.x, 4.7, receiverPos.y]} fontSize={0.2} textAlign={"center"} anchorX="center"/>
    {/if}
    <!-- Defect -->
    <T.Mesh>
        <MeshLineGeometry points={[new Vector3(1.5, 4 - 3, 1), new Vector3(1.5, 4, 1)]} />
        <MeshLineMaterial
          width={0.015}
          color="#b22929"
        />
    </T.Mesh>
    <T.Mesh position={[1.5, 4 - 3, 1]}>
        <T.SphereGeometry args={[0.05]} />
        <MeshLineMaterial
            width={0.0025}
            color="#b22929"
        />
    </T.Mesh>
</CSM>

<style>

</style>