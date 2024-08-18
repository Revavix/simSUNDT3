<script lang="ts">
    import { T } from '@threlte/core'
    import { MeshLineGeometry, MeshLineMaterial } from '@threlte/extras'
    import { Vector2, Vector3 } from 'three';

    export let defectPos: Vector2;
    export let defectDepth: number;
    export let defectDiameter: number;
</script>

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