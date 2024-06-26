<script lang="ts">
    import { T, useThrelte } from '@threlte/core'
    import { CSM, Grid, MeshLineGeometry, MeshLineMaterial, OrbitControls, Sky, interactivity, Text } from '@threlte/extras'
    import { Color, Mesh, Vector2, Vector3 } from 'three';
    import { DEG2RAD } from 'three/src/math/MathUtils.js';
    import { ProjectSingleton } from '../lib/data/ProjectSingleton';
    import { afterUpdate, onDestroy } from 'svelte';
    import { kernelProgress } from '../lib/data/Stores';
    import type { Progress } from '../lib/models/Kernel';
    import type { Project } from '../lib/models/Project';
    import type { TreeInput } from '../lib/models/tree/TreeInput';
    import type TreeNode from '../lib/models/tree/TreeNode';
    import type { TreeDropdown } from '../lib/models/tree/TreeDropdown';

    let defectType: number | null = null
    let pointStart: Vector2 = new Vector2(0, 0)
    let pointEnd: Vector2 = new Vector2(0, 0)
    let transmitterPos: Vector2 = new Vector2(3, 3)
    let transmitterOffset: Vector2 = new Vector2(0, 0)
    let receiverSep: Vector2 = new Vector2(3, 0)
    let increment: Vector2 = new Vector2(6, 6)
    let projectSingleton: ProjectSingleton = ProjectSingleton.GetInstance()
    let isReceiverActive: boolean = false
    let defectPos: Vector2 = new Vector2(3, 3)
    let defectDepth: number = 0
    let defectDiameter: number = 0
    let defectDiameterParallel: number = 0
    let defectDiameterPerpendicular: number = 0
    let defectLength: number = 0
    let defectLengthParallel: number = 0
    let defectHeight: number = 0
    
    // Settings stored in project misc
    let showOrigin: boolean = true
    let showAxes: boolean = true
    let showGrid: boolean = true

    interactivity()

    let mesh: Mesh = new Mesh()

    const { renderer, invalidate } = useThrelte()

    $: {
        renderer.toneMappingExposure = 1.5
    }

    let unsubscribeProjectSingleton = projectSingleton.Subscribe((project: Project) => {
        let rootNode: TreeNode | null = project.data.preprocessor.tree

        if (rootNode !== null) {
            defectType = (rootNode?.FindChildByPattern("Defect:Specification:Variant") as TreeDropdown)?.value
            pointStart.x = (rootNode?.FindChildByPattern("Method:Mesh:Size:XStart") as TreeInput)?.value / 10
            pointStart.y = (rootNode?.FindChildByPattern("Method:Mesh:Size:YStart") as TreeInput)?.value / 10
            pointEnd.x = (rootNode?.FindChildByPattern("Method:Mesh:Size:XEnd") as TreeInput)?.value / 10
            pointEnd.y = (rootNode?.FindChildByPattern("Method:Mesh:Size:YEnd") as TreeInput)?.value / 10
            increment.x = (rootNode?.FindChildByPattern("Method:Mesh:Size:XIncrement") as TreeInput)?.value / 10
            increment.y = (rootNode?.FindChildByPattern("Method:Mesh:Size:YIncrement") as TreeInput)?.value / 10
            /*
            * TODO: Unsure how below is supposed to work, transmitter position is not being set correctly
            transmitterPos.x = -(rootNode?.FindChildByPattern("Transmitter:Position:X") as TreeInput)?.value / 10 + size.x / 2
            transmitterPos.y = -(rootNode?.FindChildByPattern("Transmitter:Position:Y") as TreeInput)?.value / 10 + size.y / 2
            */
            transmitterPos.x = pointStart.x
            transmitterPos.y = pointStart.y
            receiverSep.x = (rootNode?.FindChildByPattern("Transmitter:Position:X") as TreeInput)?.value + 
                (rootNode?.FindChildByPattern("Receiver:Separation:X") as TreeInput)?.value  / 10
            receiverSep.y = (rootNode?.FindChildByPattern("Transmitter:Position:Y") as TreeInput)?.value + 
                (rootNode?.FindChildByPattern("Receiver:Separation:Y") as TreeInput)?.value  / 10
            isReceiverActive = (rootNode?.FindChildByPattern("Method:UTTechnique:ProbeType") as TreeDropdown)?.value !== 1
            defectPos.x = (rootNode?.FindChildByPattern("Defect:Position:X") as TreeInput)?.value / 10
            defectPos.y = (rootNode?.FindChildByPattern("Defect:Position:Y") as TreeInput)?.value / 10
            defectDepth = (rootNode?.FindChildByPattern("Defect:Specification:Measurement:CentreDepth") as TreeInput)?.value / 10
            defectDiameter = (rootNode?.FindChildByPattern("Defect:Specification:Measurement:Diameter") as TreeInput)?.value / 10
            defectDiameterParallel = (rootNode?.FindChildByPattern("Defect:Specification:Measurement:DiameterParallel") as TreeInput)?.value / 10
            defectDiameterPerpendicular = (rootNode?.FindChildByPattern("Defect:Specification:Measurement:DiameterPerpendicular") as TreeInput)?.value / 10
            defectLength = (rootNode?.FindChildByPattern("Defect:Specification:Measurement:Length") as TreeInput)?.value / 10
            defectLengthParallel = (rootNode?.FindChildByPattern("Defect:Specification:Measurement:LengthParallel") as TreeInput)?.value / 10
            defectHeight = (rootNode?.FindChildByPattern("Defect:Specification:Measurement:Height") as TreeInput)?.value / 10
        }

        showOrigin = project.data.preprocessor.misc.viewport.showOrigin
        showAxes = project.data.preprocessor.misc.viewport.showAxes
        showGrid = project.data.preprocessor.misc.viewport.showGrid
    })

    let unsubscribeKernelProgress = kernelProgress.subscribe((value: Progress[]) => {
        if (value === undefined) return
        if (value.length < 1 || value[0] === undefined) return

        let positions: Array<Vector2> = []
        
        // Build Y positions
        for(let y = pointStart.y * 10; y != (pointEnd.y * 10); y += (increment.y * 10)) {
            for(let x = pointStart.x * 10; x != (pointEnd.x * 10); x += (increment.x * 10)) {
                positions.push(new Vector2(x / 10, y / 10))
            } 
        }

        let currentPosition: Vector2 = positions[Math.floor(value[0].progress * positions.length)]

        if (currentPosition != undefined) {
            transmitterPos = currentPosition
        }

        if (value[0].finished || value[0].raw.freq === value[0].raw.target) {
            transmitterPos.x = increment.x > 0 ? pointStart.x : pointEnd.x
            transmitterPos.y = increment.y > 0 ? pointStart.y : pointEnd.y
        }
    })

    onDestroy(() => {
        unsubscribeProjectSingleton()
        unsubscribeKernelProgress()
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

    {#if showAxes}
        <!-- Origin marker Z -->
        <T.Mesh>
            <MeshLineGeometry points={[new Vector3(0, 0, 0), new Vector3(0, 0, 5 + 0.5)]} />
            <MeshLineMaterial
                width={0.025}
                color="blue"
            />
        </T.Mesh>
        <Text text={"Y"} position={[0, 0.1, 5.7]} fontSize={0.2} textAlign={"center"} anchorX="center"/>

        <!-- Origin marker Y -->
        {#if showOrigin}
            <T.Mesh>
                <MeshLineGeometry points={[new Vector3(0, 0, 0), new Vector3(0, defectDepth + 2.5, 0)]} />
                <MeshLineMaterial
                width={0.025}
                color="green"
                />
            </T.Mesh>
            <Text text={"Origin [0, 0]"} position={[0, defectDepth + 2.7, 0]} fontSize={0.2} textAlign={"center"} anchorX="center"/>
        {/if}

        <!--  Origin marker X -->
        <T.Mesh>
            <MeshLineGeometry points={[new Vector3(0, 0, 0), new Vector3(5 + 0.5, 0, 0)]} />
            <MeshLineMaterial
            width={0.025}
            color="red"
            />
        </T.Mesh>
        <Text text={"X"} position={[5 + 0.7, 0.1, 0]} fontSize={0.2} textAlign={"center"} anchorX="center"/>
    {/if}

    <!-- Grid -->
    {#if showGrid}
    <Grid 
        position={[pointStart.x + (pointEnd.x - pointStart.x) / 2, ((defectDepth + 1) / 2) * 2 + 0.01, pointStart.y + (pointEnd.y - pointStart.y) / 2]} 
        sectionThickness={0} 
        cellSize={Math.abs(increment.x)} 
        gridSize={[Math.abs(pointStart.x - pointEnd.x), Math.abs(pointStart.y - pointEnd.y)]} 
        axis="x" 
        type="lines"
    />
    <Grid position={[pointStart.x + (pointEnd.x - pointStart.x) / 2, ((defectDepth + 1) / 2) * 2 + 0.01, pointStart.y + (pointEnd.y - pointStart.y) / 2]} 
        sectionThickness={0} 
        cellSize={Math.abs(increment.y)} 
        gridSize={[Math.abs(pointStart.x - pointEnd.x), Math.abs(pointStart.y - pointEnd.y)]} 
        axis="z" 
        type="lines"
    />
    {/if}


    <!-- Test subject --> 
    <T.Mesh receiveShadow castShadow position={[pointStart.x + (pointEnd.x - pointStart.x) / 2, (defectDepth + 1) / 2, pointStart.y + (pointEnd.y - pointStart.y) / 2]} bind:mesh on:click={() => {
            
        }}>
        <T.BoxGeometry args={[Math.abs(pointStart.x - pointEnd.x) + Math.abs(increment.x), defectDepth + 1, Math.abs(pointStart.y - pointEnd.y) + Math.abs(increment.y), 100, 100]}/>
        <T.MeshStandardMaterial color="gray" roughness={0.1} metalness={0.5} transparent opacity={0.5}/>
    </T.Mesh>

    <!-- Transmitter -->
    <T.Mesh>
        <MeshLineGeometry points={[new Vector3(transmitterPos.x, ((defectDepth + 1) / 2) * 2, transmitterPos.y), 
            new Vector3(transmitterPos.x, ((defectDepth + 1) / 2) * 2 + 0.5, transmitterPos.y)]} 
        />
        <MeshLineMaterial
          width={0.015}
          color="#fe3d00"
        />
    </T.Mesh>
    <Text text={"T"} position={[transmitterPos.x, ((defectDepth + 1) / 2) * 2 + 0.5 + 0.2, transmitterPos.y]} fontSize={0.2} textAlign={"center"} anchorX="center"/>

    <!-- Receiver -->
    {#if isReceiverActive}
    <T.Mesh>
        <MeshLineGeometry points={[new Vector3((transmitterPos.x) + receiverSep.x, ((defectDepth + 1) / 2) * 2, (transmitterPos.y) + receiverSep.y), 
            new Vector3((transmitterPos.x) + receiverSep.x, ((defectDepth + 1) / 2) * 2 + 0.5, (transmitterPos.y) + receiverSep.y)]} 
        />
        <MeshLineMaterial
          width={0.015}
          color="#419898"
        />
    </T.Mesh>
    <Text text={"R"} position={[(transmitterPos.x) + receiverSep.x, ((defectDepth + 1) / 2) * 2 + 0.5 + 0.2, (transmitterPos.y) + receiverSep.y]} fontSize={0.2} textAlign={"center"} anchorX="center"/>
    {/if}
    <!-- Defect -->
    {#if defectType !== null}
        {#if defectType === 1 || defectType === 2}
        <T.Mesh>
            <MeshLineGeometry points={[new Vector3(defectPos.x, (((defectDepth + 1) / 2) * 2) - defectDepth, defectPos.y), new Vector3(defectPos.x, ((defectDepth + 1) / 2) * 2, defectPos.y)]} />
            <MeshLineMaterial
            width={0.015}
            color="#b22929"
            />
        </T.Mesh>
        <T.Mesh position={[defectPos.x, (((defectDepth + 1) / 2) * 2) - defectDepth, defectPos.y]}>
            <T.SphereGeometry args={[defectDiameter/2]} />
            <MeshLineMaterial
                width={0.0025}
                color="#b22929"
            />
        </T.Mesh>
        {:else if defectType === 3}
        <T.Mesh>
            <MeshLineGeometry points={[new Vector3(defectPos.x, (((defectDepth + 1) / 2) * 2) - defectDepth, defectPos.y), new Vector3(defectPos.x, ((defectDepth + 1) / 2) * 2, defectPos.y)]} />
            <MeshLineMaterial
            width={0.015}
            color="#b22929"
            />
        </T.Mesh>
        <T.Mesh position={[defectPos.x, (((defectDepth + 1) / 2) * 2) - defectDepth, defectPos.y]} rotation={[-Math.PI / 2, 0, 0]}>
            <T.CircleGeometry args={[defectDiameter/2, 32]} />
            <T.MeshBasicMaterial color="#b22929" side={2}/>
        </T.Mesh>
        {:else if defectType === 4}
        <T.Mesh>
            <MeshLineGeometry points={[new Vector3(defectPos.x, (((defectDepth + 1) / 2) * 2) - defectDepth, defectPos.y), new Vector3(defectPos.x, ((defectDepth + 1) / 2) * 2, defectPos.y)]} />
            <MeshLineMaterial
            width={0.015}
            color="#b22929"
            />
        </T.Mesh>
        <T.Mesh position={[defectPos.x, (((defectDepth + 1) / 2) * 2) - defectDepth, defectPos.y]} scale={[defectDiameterParallel / 10, defectDiameterPerpendicular / 10, defectDiameterParallel / 10]}>
            <T.SphereGeometry args={[5]}/>
            <MeshLineMaterial
                width={0.0025}
                color="#b22929"
            />
        </T.Mesh>
        {:else if defectType === 5}
        <T.Mesh>
            <MeshLineGeometry points={[new Vector3(defectPos.x, (((defectDepth + 1) / 2) * 2) - defectDepth, defectPos.y), new Vector3(defectPos.x, ((defectDepth + 1) / 2) * 2, defectPos.y)]} />
            <MeshLineMaterial
            width={0.015}
            color="#b22929"
            />
        </T.Mesh>
        <T.Mesh position={[defectPos.x, (((defectDepth + 1) / 2) * 2) - defectDepth, defectPos.y]} rotation={[-Math.PI / 2, 0, 0]}>
            <T.PlaneGeometry args={[defectLength, defectLengthParallel]} />
            <T.MeshBasicMaterial color="#b22929" side={2}/>
        </T.Mesh>
        {:else if defectType === 7}
        <T.Mesh>
            <MeshLineGeometry points={[new Vector3(defectPos.x, (((defectDepth + 1) / 2) * 2) - defectDepth + defectHeight/2, defectPos.y), new Vector3(defectPos.x, ((defectDepth + 1) / 2) * 2, defectPos.y)]} />
            <MeshLineMaterial
            width={0.015}
            color="#b22929"
            />
        </T.Mesh>
        <T.Mesh position={[defectPos.x, (((defectDepth + 1) / 2) * 2) - defectDepth, defectPos.y]} rotation={[0, -Math.PI / 2, 0]}>
            <T.PlaneGeometry args={[pointEnd.y - pointStart.y, defectHeight]} />
            <T.MeshBasicMaterial color="#b22929" side={2}/>
        </T.Mesh>
        {:else if defectType === 8}
        <!-- Helper line which takes into account of the cylinder diameter -->
        <T.Mesh>
            <MeshLineGeometry points={[new Vector3(defectPos.x, (((defectDepth + 1) / 2) * 2) - defectDepth, defectPos.y), new Vector3(defectPos.x, ((defectDepth + 1) / 2) * 2, defectPos.y)]} />
            <MeshLineMaterial
            width={0.015}
            color="#b22929"
        />
        </T.Mesh>
        <!-- Cylinder tilted at 90 degrees parallel to the Y axis -->
        <T.Mesh position={[defectPos.x, (((defectDepth + 1) / 2) * 2) - defectDepth, defectPos.y]} rotation={[-Math.PI / 2, 0, 0]}>
            <T.CylinderGeometry args={[defectDiameter/2, defectDiameter/2, Math.abs(pointEnd.y - pointStart.y), 32]} />
            <T.MeshStandardMaterial color="#b22929" side={2}/>
        </T.Mesh>
        {:else if defectType === 19}
        <T.Mesh>
            <MeshLineGeometry points={[new Vector3(defectPos.x, (((defectDepth + 1) / 2) * 2) - defectDepth + defectHeight/2, defectPos.y), new Vector3(defectPos.x, ((defectDepth + 1) / 2) * 2, defectPos.y)]} />
            <MeshLineMaterial
            width={0.015}
            color="#b22929"
            />
        </T.Mesh>
        <T.Mesh position={[defectPos.x, (((defectDepth + 1) / 2) * 2) - defectDepth, defectPos.y]} rotation={[0, -Math.PI / 2, 0]}>
            <T.PlaneGeometry args={[pointEnd.y - pointStart.y, defectHeight]} />
            <T.MeshBasicMaterial color="#b22929" side={2}/>
        </T.Mesh>
        {/if}
    {/if}
</CSM>

<style>

</style>