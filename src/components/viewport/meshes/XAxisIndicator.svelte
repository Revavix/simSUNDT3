<script lang="ts">
    import { T } from '@threlte/core'
    import { MeshLineGeometry, MeshLineMaterial, Text } from '@threlte/extras'
    import { Vector2, Vector3 } from 'three';

    export let Start: Vector2;
    export let End: Vector2;
    let isXAxisPositive: boolean;

    $: {
        isXAxisPositive = (End.x - Start.x < 0) ? false : true
    }
</script>

<T.Mesh>
    <MeshLineGeometry points={[
        new Vector3(
            End.x, 
            0, 
            Start.y + (End.y - Start.y) / 2), 
        new Vector3(
            End.x + (isXAxisPositive == true ? 2 : -2), 
            0,
            Start.y + (End.y - Start.y) / 2)
        ]} 
    />
    <MeshLineMaterial
        width={0.025}
        color="red"
    />
</T.Mesh>
<Text text={isXAxisPositive == true ? "X+" : "X-"} 
    position={[
        End.x + (isXAxisPositive == true ? 2.2 : -2.2), 
        0.1, 
        (Start.y + (End.y - Start.y) / 2)
    ]} 
    fontSize={0.2} 
    textAlign={"center"} 
    anchorX="center"
/>