<script lang="ts">
  export let min: number | null = -10,
    max: number | null = 10,
    step: number | null = 1,
    value: number;
</script>

<input
  class="slider"
  style="touch-action: none"
  type="range"
  {min}
  {max}
  {step}
  bind:value
/>

<style>
  .slider {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 0.5em;
    background: #d3d3d3;
    outline: none;
    opacity: 0.7;
    -webkit-transition: 0.2s;
    transition: opacity 0.2s;
    border-radius: 0.25em;
  }

  .slider:hover {
    opacity: 1;
  }

  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 1em;
    height: 1em;
    cursor: pointer;
    border-radius: 50%;
    margin-top: 0.2em; /* Position the thumb on the track */
  }

  .slider::-moz-range-thumb {
    width: 1em;
    height: 1em;
    cursor: pointer;
    border-radius: 50%;
  }
</style>
