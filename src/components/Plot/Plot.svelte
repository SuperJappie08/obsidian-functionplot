<script lang="ts">
  import type { PlotInputs } from "../../common/types";
  import type ObsidianFunctionPlot from "../../main";
  import Constant from "./Constant.svelte";
  import { Menu } from "obsidian";

  import { FunctionPlot } from "../../fnplot";
  import { onMount } from "svelte";

  export let options: PlotInputs,
    plugin: ObsidianFunctionPlot,
    showConstantsSettings = false;

  let plotContainer: HTMLElement;
  let plot: FunctionPlot;
  let prevGraphType = new Array();

  onMount(() => {
    createNewPlot();
  });
  // $: {
  //   const scope = (
  //     Object.entries(options.constants) as [string, ConstantInputs][]
  //   ).reduce((scope_, [key, val]) => {
  //     scope_[key] = val.value;
  //     return scope_;
  //   }, {});
  //   options.data.forEach((datum) => {
  //     datum.scope = scope;
  //   });
  // }

  function createNewPlot() {
    // First destroy any existing plot completely
    if (plotContainer) {
      plotContainer.innerHTML = "";
    }

    // Create fresh plot instance
    plot = new FunctionPlot(plugin);
    plot.target = plotContainer;

    // Apply options and render
    plot.options = options;
    plot.resetView();
    plot.render();
  }

  $: {
    if (options?.data) {
      for (let i = 0; i < options.data.length; i++) {
        if (prevGraphType && prevGraphType[i] !== options.data[i].graphType) {
          createNewPlot();
        } else if (plot) {
          plot.options = options;
          plot.resetView();
          plot.render();
        }

        prevGraphType[i] = options.data[i].graphType;
      }
    }
  }

  function handleContextMenu(e: MouseEvent) {
    e.preventDefault();
    const menu = new Menu();
    if (!options.disableZoom) {
      menu.addItem((item) => {
        item.setTitle("Reset View");
        item.setIcon("box");
        item.onClick(() => {
          plot.resetView();
        });
      });
    }
    if (!options.disableZoom && !showConstantsSettings) menu.addSeparator();

    if (!showConstantsSettings) {
      menu.addItem((item) => {
        item.setTitle("Edit");
        item.setIcon("pencil");
        item.onClick(() => {
          console.log("to be implemented");
        });
      });
    }

    menu.showAtMouseEvent(e);
  }
</script>

<div on:contextmenu={handleContextMenu}>
  <div class="fplt-plot" bind:this={plotContainer} />
  <div class="fplt-plot-options">
    <div class="fplt-constants">
      {#each Object.keys(options.constants) as name}
        <Constant
          {name}
          bind:constant={options.constants[name]}
          showSettings={showConstantsSettings}
        />
      {/each}
    </div>
  </div>
</div>

<style lang="scss">
  .fplt-plot-options {
    display: grid;
    grid-template-columns: 1fr min-content;
    gap: 1em;
  }
  .fplt-constants {
    display: flex;
    margin-left: 2em;
    flex-direction: row;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
</style>
