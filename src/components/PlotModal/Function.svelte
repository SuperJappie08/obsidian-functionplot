<script lang="ts">
  import type { FunctionInputs } from "../../common/types";

  import Dropdown from "../Primitives/Dropdown.svelte";
  import TextInput from "../Primitives/TextInput.svelte";
  import NumberInput from "../Primitives/NumberInput.svelte";
  import IconWrapper from "../Primitives/IconWrapper.svelte";
  import OptionsFloater from "../Primitives/OptionsFloater.svelte";
  import Switch from "../Primitives/Switch.svelte";
  import Plus from "svelte-material-icons/Plus.svelte";
  import MenuDown from "svelte-material-icons/MenuDown.svelte";
  import Delete from "svelte-material-icons/Delete.svelte";
  import Button from "../Primitives/Button.svelte";

  export let datum: FunctionInputs, unmount: () => void, legends: boolean;

  let showFloater = false;
  let mousePos = { x: 0, y: 0 };

  let points = 1;

  function handleClick(e: MouseEvent) {
    showFloater = true;
    const target = (e.target as HTMLElement).closest("div");
    if (!target) return;
    const rect = target.getBoundingClientRect();
    mousePos = { x: rect.right, y: rect.bottom };
  }

  function handlePointsChange(e: MouseEvent) {
    points += 1;
    datum.points.push([0, 0]);
  }

  function removePoint(i: number) {
    points -= 1;
    datum.points.remove(datum.points[i]);
  }
</script>

<div class="functionplot-item-data">
  <Dropdown bind:value={datum.fnType}>
    <option value="linear">linear</option>
    <option value="polar">polar</option>
    <option value="points">points</option>
    <option value="vector">vector</option>
  </Dropdown>

  {#if legends}
    <TextInput placeholder="Name" bind:value={datum.name} />
  {/if}

  {#if datum.fnType === "linear"}
    <TextInput placeholder="f(x)=" bind:value={datum.fn} />
  {/if}

  {#if datum.fnType === "polar"}
    <TextInput placeholder="r(theta)=" bind:value={datum.r} />
  {/if}

  {#if datum.fnType === "vector"}
    <div class="functionplot-nums-inputs">
      <NumberInput placeholder="Δx" bind:value={datum.vector.x} />
      <NumberInput placeholder="Δy" bind:value={datum.vector.y} />
    </div>
  {/if}
  {#if datum.fnType === "points"}
    <div style="display: flex; flex-direction: column; gap: 0.5em;">
      {#each Array(points) as _, i}
        <div class="functionplot-nums-inputs" style="align-items: center;">
          <NumberInput placeholder="x" bind:value={datum.points[i][0]} />
          <NumberInput placeholder="y" bind:value={datum.points[i][1]} />

          <IconWrapper
            style="align-self: center; transform: translateY(0.2em);"
            on:click={(e) => removePoint(i)}
          >
            <Delete size="1.1em" />
          </IconWrapper>
        </div>
      {/each}
      <div class="fplt-fns-add">
        <Button style="width: 100%;" on:click={handlePointsChange}>
          <IconWrapper style="padding: 0.1em; width: 100%;">
            <Plus />
          </IconWrapper>
          Add Point
        </Button>
      </div>
    </div>
  {/if}

  <div>
    <IconWrapper on:click={handleClick}>
      <MenuDown size="1.4em" />
    </IconWrapper>
    {#if showFloater}
      <OptionsFloater bind:show={showFloater} {mousePos} color={datum.color}>
        {#if datum.fnType === "vector"}
          <label for="vector-initial">Start point</label>
          <div id="vector-initial" class="functionplot-nums-inputs">
            <NumberInput placeholder="x" bind:value={datum.offset.x} />
            <NumberInput placeholder="y" bind:value={datum.offset.y} />
          </div>
        {/if}
        {#if datum.fnType !== "vector"}
          <label for="graph-type">Sampler</label>
          <Dropdown id="graph-type" bind:value={datum.graphType}>
            <option value="polyline">polyline</option>
            <option value="scatter">scatter</option>
            {#if !["polar", "vector", "points"].includes(datum.fnType)}
              <option value="interval">interval</option>
            {/if} -->
          </Dropdown>
        {/if}
        {#if datum.fnType !== "vector"}
          <label for="range">Range</label>
          <div class="functionplot-nums-inputs" id="range">
            <NumberInput
              placeholder={datum.fnType === "polar" ? "r1" : "x1"}
              bind:value={datum.range.min}
            />
            <NumberInput
              placeholder={datum.fnType === "polar" ? "r2" : "x2"}
              bind:value={datum.range.max}
            />
          </div>
          {#if datum.graphType && ["polyline", "interval"].includes(datum.graphType)}
            <label for="closed">Closed</label>
            <Switch id="closed" bind:checked={datum.closed} />
          {/if}
        {/if}
        {#if datum.graphType && datum.fnType !== "vector"}
          <label for="n-samples">Samples</label>
          <NumberInput id="n-samples" min={0} bind:value={datum.nSamples} />
        {/if}
        {#if datum.fnType !== "vector"}
          <label for="skip-tip">Skip tip</label>
          <Switch id="skip-tip" bind:checked={datum.skipTip} />
        {/if}
      </OptionsFloater>
    {/if}
  </div>

  <input type="color" bind:value={datum.color} />

  <IconWrapper
    style="align-self: center; transform: translateY(0.2em);"
    on:click={unmount}
  >
    <Delete size="1.1em" />
  </IconWrapper>
</div>

<style lang="scss">
  .functionplot-item-data {
    display: inline-grid;
    grid-template-columns: min-content 1fr repeat(3, min-content);
    column-gap: 0.5em;
    place-items: center start;
    width: 100%;
    padding: 0.5em;
    &:not(:first-child) {
      border-top: 1px solid var(--background-modifier-border);
    }
  }

  .functionplot-item-data:has(input[placeholder="Name"]) {
    grid-template-columns: min-content 1fr 2fr repeat(4, min-content);
  }

  .functionplot-item-data:has(input[placeholder="Δx"]) {
    grid-template-columns: min-content auto repeat(3, min-content);
  }

  .functionplot-item-data:has(input[placeholder="Name"]):has(
      input[placeholder="Δx"]
    ) {
    grid-template-columns: min-content max-content auto repeat(4, min-content);
  }

  .functionplot-nums-inputs {
    display: flex;
    flex-direction: row;
    column-gap: 0.5em;
    width: min-content;
  }
</style>
