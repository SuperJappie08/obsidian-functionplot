import type { FunctionPlotOptions } from "function-plot/dist/types";
import type { PlotInputs } from "./common/types";
import createStylingPlugin from "./plugins/styling";
import createLegendsPlugin from "./plugins/legends";
import { toFunctionPlotOptions } from "./common/utils";
import type ObsidianFunctionPlot from "./main";
import functionPlot, { Chart } from "function-plot";

export class FunctionPlot {
  plugin: ObsidianFunctionPlot;
  target_: HTMLElement;
  options_: PlotInputs;
  fnPlotOptions?: FunctionPlotOptions;
  chart?: Chart;

  constructor(plugin: ObsidianFunctionPlot) {
    this.plugin = plugin;
  }

  set target(target: HTMLElement) {
    this.target_ = target;
    this.render();
  }

  set options(options: PlotInputs) {
    this.options_ = options;
    this.render();
  }

  render(): void {
    if (!this.target_ || !this.options_) {
      return;
    }
    try {
      if (this.fnPlotOptions !== undefined) {
        Object.assign(
          this.fnPlotOptions,
          toFunctionPlotOptions(this.options_, this.target_)
        );
      } else {
        this.fnPlotOptions = Object.assign(
          {},
          toFunctionPlotOptions(this.options_, this.target_),
          {
            plugins: [
              createStylingPlugin(this.plugin),
              createLegendsPlugin(this.options_),
            ],
            width: 550,
            height: 350,
          }
        );
      }
      if (this.chart !== undefined) {
        this.chart.removeAllListeners("after:draw");
        this.chart.build();
      } else {
        this.chart = functionPlot(this.fnPlotOptions);
      }
    } catch (err) {
      console.error(`Error rendering plot: ${err}`);
    }
  }

  resetView(): void {
    this.fnPlotOptions = undefined;
    this.chart = undefined;
    this.render();
  }
}
