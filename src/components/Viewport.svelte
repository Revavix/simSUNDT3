<script lang="ts">
    import { T, useThrelte } from '@threlte/core'
    import { CSM, MeshLineGeometry, MeshLineMaterial, Sky, interactivity, Text } from '@threlte/extras'
    import { Color, Mesh, Vector2, Vector3 } from 'three';
    import { DEG2RAD } from 'three/src/math/MathUtils.js';
    import { ProjectSingleton } from '../lib/data/ProjectSingleton';
    import { onDestroy } from 'svelte';
    import { kernelProgress } from '../lib/data/Stores';
    import type { Progress } from '../lib/models/Kernel';
    import type { Project } from '../lib/models/Project';
    import type { TreeInput } from '../lib/models/tree/TreeInput';
    import type TreeNode from '../lib/models/tree/TreeNode';
    import type { TreeDropdown } from '../lib/models/tree/TreeDropdown';
    import YAxisIndicator from './viewport/meshes/YAxisIndicator.svelte';
    import XAxisIndicator from './viewport/meshes/XAxisIndicator.svelte';
    import Sdh from './viewport/meshes/defects/SDH.svelte';
    import ZAxisIndicator from './viewport/meshes/ZAxisIndicator.svelte';
    import Rectangular from './viewport/meshes/defects/Rectangular.svelte';
    import Slc from './viewport/meshes/defects/SLC.svelte';
    import type { TreeCheckbox } from '../lib/models/tree/TreeCheckbox';
    import Spheroidal from './viewport/meshes/defects/Spheroidal.svelte';
    import Circular from './viewport/meshes/defects/Circular.svelte';
    import Spherical from './viewport/meshes/defects/Spherical.svelte';
    import Esi from './viewport/meshes/defects/ESI.svelte';
    import Sbslc from './viewport/meshes/defects/SBSLC.svelte';
    import Camera from './viewport/Camera.svelte';
    import Subject from './viewport/Subject.svelte';

    let defectType: number | null = null
    let pointStart: Vector2 = new Vector2(0, 0)
    let pointEnd: Vector2 = new Vector2(0, 0)
    let transmitterPos: Vector2 = new Vector2(3, 3)
    let transmitterOffset: Vector2 = new Vector2(0, 0)
    let transmitterAngle: number = 0
    let transmitterSkew: number = 0
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
    let defectHeight: number = 0
    let defectTiltOfCrack: number = 0
    let backwallEnabled: boolean = false
    let backwallDepth: number = 0
    
    // Settings stored in project misc
    let showOrigin: boolean = true
    let showAxes: boolean = true

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
            transmitterAngle = (rootNode?.FindChildByPattern("Transmitter:BeamAngles:Angle") as TreeInput)?.value
            transmitterSkew = (rootNode?.FindChildByPattern("Transmitter:BeamAngles:SkewAngle") as TreeInput)?.value
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
            defectHeight = (rootNode?.FindChildByPattern("Defect:Specification:Measurement:Height") as TreeInput)?.value / 10
            defectTiltOfCrack = (rootNode?.FindChildByPattern("Defect:Specification:Angles:TiltCrack") as TreeInput)?.value
            backwallEnabled = (rootNode?.FindChildByPattern("Defect:Surfaces:Backwall:Enabled") as TreeCheckbox)?.value
            backwallDepth = (rootNode?.FindChildByPattern("Defect:Surfaces:Backwall:Depth") as TreeInput)?.value / 10
        }

        showOrigin = project.data.preprocessor.misc.viewport.showOrigin
        showAxes = project.data.preprocessor.misc.viewport.showAxes
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
    <Camera renderer={renderer}/>
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
        <!-- Origin marker Y/X -->
        <YAxisIndicator Start={pointStart} End={pointEnd}/>
        <XAxisIndicator Start={pointStart} End={pointEnd}/>

        <!-- Center marker -->
        {#if showOrigin}
            <ZAxisIndicator defectDepth={defectDepth} Start={pointStart} End={pointEnd}/>
        {/if}
    {/if}

    <!-- Test subject --> 
    <Subject bind:mesh/>

    <!-- Transmitter -->
    <T.Mesh>
        <MeshLineGeometry points={[
                new Vector3(
                    transmitterPos.x, 
                    ((defectDepth + 1) / 2) * 2, 
                    transmitterPos.y
                ), 
                new Vector3(
                    transmitterPos.x - (5 * Math.cos((-transmitterAngle + 90) * DEG2RAD) * Math.cos(transmitterSkew * DEG2RAD)), 
                    (((defectDepth + 1) / 2) * 2) - (5 * Math.sin((-transmitterAngle + 90) * DEG2RAD)), 
                    transmitterPos.y - (5 * Math.sin(transmitterSkew * DEG2RAD) * Math.cos((-transmitterAngle + 90) * DEG2RAD))
                )
            ]}  
        />
        <MeshLineMaterial
          width={0.015}
          color="lightgreen"
        />
    </T.Mesh>
    <T.Mesh>
        <MeshLineGeometry points={[new Vector3(transmitterPos.x, ((defectDepth + 1) / 2) * 2, transmitterPos.y), 
            new Vector3(transmitterPos.x, ((defectDepth + 1) / 2) * 2 + 0.5, transmitterPos.y)]} 
        />
        <MeshLineMaterial
          width={0.015}
          color="#fe3d00"
        />
    </T.Mesh>
    <Text text={"Transmitter"} position={[transmitterPos.x, ((defectDepth + 1) / 2) * 2 + 0.5 + 0.2, transmitterPos.y]} fontSize={0.2} textAlign={"center"} anchorX="center"/>

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
        {#if defectType === 1}
        <Spherical defectPos={defectPos} defectDepth={defectDepth} defectDiameter={defectDiameter}/>
        {:else if defectType === 2}
        <Esi defectPos={defectPos} defectDepth={defectDepth} defectDiameter={defectDiameter}/>
        {:else if defectType === 3}
        <Circular defectPos={defectPos} defectDepth={defectDepth} defectDiameter={defectDiameter}/>
        {:else if defectType === 4}
        <Spheroidal defectPos={defectPos} defectDepth={defectDepth} defectDiameterParallel={defectDiameterParallel} defectDiameterPerpendicular={defectDiameterPerpendicular}/>
        {:else if defectType === 5}
        <Rectangular defectPos={defectPos} defectDepth={defectDepth} defectLength={defectLength} defectHeight={defectHeight} defectTilt={defectTiltOfCrack}/>
        {:else if defectType === 7}
        <Slc defectPos={defectPos} defectDepth={defectDepth} defectHeight={defectHeight} pointStart={pointStart} pointEnd={pointEnd} tilt={defectTiltOfCrack}/>
        {:else if defectType === 8}
        <Sdh defectPos={defectPos} defectDepth={defectDepth} defectDiameter={defectDiameter} pointStart={pointStart} pointEnd={pointEnd}/>
        {:else if defectType === 19}
        <Sbslc/>
        {/if}
    {/if}
    {#if backwallEnabled}
    <!-- Backwall -->
    <T.Mesh position={[pointStart.x + (pointEnd.x - pointStart.x) / 2, 0.001, pointStart.y + (pointEnd.y - pointStart.y) / 2]} rotation={[90 * DEG2RAD, 0, 0]}>
        <T.PlaneGeometry args={[pointEnd.x - pointStart.x, pointEnd.y - pointStart.y]} />
        <T.MeshBasicMaterial color="lightgreen" side={2}/>
    </T.Mesh>
    {/if}
</CSM>

<style>

</style>