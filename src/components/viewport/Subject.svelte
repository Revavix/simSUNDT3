<script lang="ts">
    import { T } from '@threlte/core'
    import type { Mesh } from 'three';
    import type { Project } from '../../lib/models/Project';
    import { ProjectSingleton } from '../../lib/data/ProjectSingleton';
    import { onDestroy } from 'svelte';
    import type { TreeInput } from '../../lib/models/tree/TreeInput';
    import type TreeNode from '../../lib/models/tree/TreeNode';
    import type { TreeDropdown } from '../../lib/models/tree/TreeDropdown';
    import { Grid } from '@threlte/extras';

    export let mesh: Mesh
    let pointStart = { x: 0, y: 0 }
    let pointEnd = { x: 0, y: 0 }
    let increment = { x: 0, y: 0 }
    let defectDepth = 0
    let backwallDepth = 0
    let isSurfaceBreakingStripLike = false
    let showGrid = false

    let unsubscribe = ProjectSingleton.GetInstance().Subscribe((project: Project) => {
        let rootNode: TreeNode | null = project.data.preprocessor.tree

        if (!rootNode) return
        
        isSurfaceBreakingStripLike = (rootNode?.FindChildByPattern("Defect:Specification:Variant") as TreeDropdown)?.value == 19 ? true : false
        pointStart.x = (rootNode?.FindChildByPattern("Method:Mesh:Size:XStart") as TreeInput)?.value / 10
        pointStart.y = (rootNode?.FindChildByPattern("Method:Mesh:Size:YStart") as TreeInput)?.value / 10
        pointEnd.x = (rootNode?.FindChildByPattern("Method:Mesh:Size:XEnd") as TreeInput)?.value / 10
        pointEnd.y = (rootNode?.FindChildByPattern("Method:Mesh:Size:YEnd") as TreeInput)?.value / 10
        increment.x = (rootNode?.FindChildByPattern("Method:Mesh:Size:XIncrement") as TreeInput)?.value / 10
        increment.y = (rootNode?.FindChildByPattern("Method:Mesh:Size:YIncrement") as TreeInput)?.value / 10
        defectDepth = (rootNode?.FindChildByPattern("Defect:Specification:Measurement:CentreDepth") as TreeInput)?.value / 10
        backwallDepth = (rootNode?.FindChildByPattern("Defect:Surfaces:Backwall:Depth") as TreeInput)?.value / 10
        showGrid = project.data.preprocessor.misc.viewport.showGrid
    })

    onDestroy(() => {
        unsubscribe()
    })
</script>

{#if showGrid}
<Grid 
    position={[
        pointStart.x + (pointEnd.x - pointStart.x) / 2, 
        isSurfaceBreakingStripLike ? ((backwallDepth) / 2) * 2 + 0.01 : ((defectDepth + 1) / 2) * 2 + 0.01, 
        pointStart.y + (pointEnd.y - pointStart.y) / 2
    ]} 
    sectionThickness={0} 
    cellSize={Math.abs(increment.x)} 
    gridSize={[Math.abs(pointStart.x - pointEnd.x), Math.abs(pointStart.y - pointEnd.y)]} 
    axis="x" 
    type="lines"
/>
<Grid position={[
        pointStart.x + (pointEnd.x - pointStart.x) / 2, 
        isSurfaceBreakingStripLike ? ((backwallDepth) / 2) * 2 + 0.01 : ((defectDepth + 1) / 2) * 2 + 0.01, 
        pointStart.y + (pointEnd.y - pointStart.y) / 2
    ]} 
    sectionThickness={0} 
    cellSize={Math.abs(increment.y)} 
    gridSize={[Math.abs(pointStart.x - pointEnd.x), Math.abs(pointStart.y - pointEnd.y)]} 
    axis="y" 
    type="lines"
/>
{/if}

<T.Mesh receiveShadow castShadow position={[
    pointStart.x + (pointEnd.x - pointStart.x) / 2, 
    isSurfaceBreakingStripLike ? ((backwallDepth) / 2) : ((defectDepth + 1) / 2), 
    pointStart.y + (pointEnd.y - pointStart.y) / 2
]} bind:mesh>
    <T.BoxGeometry args={[
        Math.abs(pointStart.x - pointEnd.x) + Math.abs(increment.x), 
        isSurfaceBreakingStripLike ? backwallDepth : defectDepth + 1, 
        Math.abs(pointStart.y - pointEnd.y) + Math.abs(increment.y), 100, 100]}
    />
    <T.MeshStandardMaterial color="gray" roughness={0.1} metalness={0.5} transparent opacity={0.5}/>
</T.Mesh>