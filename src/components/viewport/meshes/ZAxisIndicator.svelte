<script lang="ts">
    import { T } from '@threlte/core'
    import { MeshLineGeometry, MeshLineMaterial, Text } from '@threlte/extras'
    import { Vector2, Vector3 } from 'three';

    export let defectDepth: number;
    export let Start: Vector2;
    export let End: Vector2;
</script>

<T.Mesh>
    <MeshLineGeometry points={[
        new Vector3(
            Start.x + (End.x - Start.x) / 2, 
            ((defectDepth + 1) / 2) * 2 + 0.01, 
            Start.y + (End.y - Start.y) / 2), 
        new Vector3(
            Start.x + (End.x - Start.x) / 2, 
            defectDepth + 2.5, 
            Start.y + (End.y - Start.y) / 2)
        ]} />
    <MeshLineMaterial
    width={0.025}
    color="green"
    />
</T.Mesh>
<Text text={`Origin [${Math.round((Start.x + (End.x - Start.x) / 2) * 100) / 10}mm, ${Math.round((Start.y + (End.y - Start.y) / 2) * 100) / 10}mm]`} 
      position={[
        Start.x + (End.x - Start.x) / 2, 
        defectDepth + 2.7, 
        Start.y + (End.y - Start.y) / 2
      ]} 
      fontSize={0.2} 
      textAlign={"center"} 
      anchorX="center"
/>