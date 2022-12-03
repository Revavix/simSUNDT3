<script lang="ts">
    import Viewport from "../pages/Viewport.svelte";
</script>

<div id="postprocessor-tab">
    WORK IN PROGRESS

    <div class="absolute-under">
        <Viewport/>
    </div>
</div>

<style>
  .absolute-under {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      height: 100%;
      width: 100%;
      overflow: hidden;
      z-index: 1;
  }
</style>