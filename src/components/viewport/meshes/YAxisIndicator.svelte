<script lang="ts">
    import { T } from '@threlte/core'
    import { MeshLineGeometry, MeshLineMaterial, Text } from '@threlte/extras'
    import { Vector2, Vector3 } from 'three';

    export let Start: Vector2;
    export let End: Vector2;
    let isYAxisPositive: boolean;

    $: {
        isYAxisPositive = (End.y - Start.y < 0) ? false : true
    }
</script>

<T.Mesh>
    <MeshLineGeometry points={[
        new Vector3(
            (Start.x + (End.x - Start.x) / 2), 
            0, 
            End.y), 
        new Vector3(
            (Start.x + (End.x - Start.x) / 2), 
            0, 
            End.y + (isYAxisPositive == true ? 2 : -2))
        ]} 
    />
    <MeshLineMaterial
        width={0.025}
        color="blue"
    />
</T.Mesh>
<Text text={isYAxisPositive == true ? "Y+" : "Y-"} 
    position={[
        (Start.x + (End.x - Start.x) / 2), 
        0.1, 
        End.y + (isYAxisPositive == true ? 2.2 : -2.2)
    ]} 
    fontSize={0.2} 
    textAlign={"center"} 
    anchorX="center"
/>