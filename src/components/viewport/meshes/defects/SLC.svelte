<script lang="ts">
    import { T } from '@threlte/core'
    import { MeshLineGeometry, MeshLineMaterial } from '@threlte/extras'
    import { Euler, Vector2, Vector3 } from 'three';
    import { DEG2RAD } from 'three/src/math/MathUtils.js';

    export let pointStart: Vector2;
    export let pointEnd: Vector2;
    export let defectPos: Vector2;
    export let defectDepth: number;
    export let defectHeight: number;
    export let tilt: number;
</script>

<T.Mesh position={[defectPos.x, (((defectDepth + 1) / 2) * 2) - defectDepth, defectPos.y]} rotation={[tilt * DEG2RAD, 90 * DEG2RAD, 0, 'YXZ']}>
    <T.PlaneGeometry args={[pointEnd.y - pointStart.y, defectHeight]} />
    <T.MeshBasicMaterial color="#b22929" side={2}/>
</T.Mesh>