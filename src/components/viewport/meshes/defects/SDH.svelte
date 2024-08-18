<script lang="ts">
    import { T } from '@threlte/core'
    import { MeshLineGeometry, MeshLineMaterial, Text } from '@threlte/extras'
    import { Vector2, Vector3 } from 'three';

    export let defectPos: Vector2;
    export let defectDepth: number;
    export let defectDiameter: number;
    export let pointStart: Vector2;
    export let pointEnd: Vector2;
</script>

<!-- Cylinder tilted at 90 degrees parallel to the Y axis -->
<T.Mesh position={[defectPos.x, (((defectDepth + 1) / 2) * 2) - defectDepth, pointStart.y + (pointEnd.y - pointStart.y) / 2]} rotation={[-Math.PI / 2, 0, 0]}>
    <T.CylinderGeometry args={[defectDiameter/2, defectDiameter/2, Math.abs(pointEnd.y - pointStart.y), 32]} />
    <T.MeshStandardMaterial color="#b22929" side={2}/>
</T.Mesh>