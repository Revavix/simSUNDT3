<script lang="ts">
  export let color: string = "#464343"
  export let opacity: number = 1.0
</script>

<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 485 183" style="width: 24px; height: 24px; opacity: {opacity}; --fill-color: {color}">
  <rect class="compressional-wave" x="40" width="60" height="183"/>
  <rect class="compressional-wave" x="120" width="80" height="183"/>
  <rect class="compressional-wave" x="220" width="100" height="183"/>
  <rect class="compressional-wave" x="340" width="60" height="183"/>
  <rect class="compressional-wave" x="420" width="40" height="183"/>
</svg>


<style>
  .compressional-wave {
    fill: var(--fill-color);
    stroke-width: 0px;
  }
</style>