<script lang="ts">
  export let cta = false,
    disabled = false;
  export let style = "";
</script>

<button {style} on:click class:mod-cta={cta} {disabled}>
  <slot />
</button>
