import { Editor, Modal } from "obsidian";
import type { PlotInputs, rendererType } from "../common/types";
import type ObsidianFunctionPlot from "../main";
import PlotModal from "../components/PlotModal/PlotModal.svelte";
import { DEFAULT_PLOT_INPUTS } from "../common/defaults";
import { insertPlot } from "../common/utils";

export default class CreatePlotModal extends Modal {
  plugin: ObsidianFunctionPlot;
  editor: Editor;
  options: PlotInputs;
  onSubmit: (options: PlotInputs, renderer: rendererType) => void;

  constructor(
    plugin: ObsidianFunctionPlot,
    editor: Editor,
    options?: PlotInputs,
    onSubmit?: () => void
  ) {
    super(plugin.app);
    this.plugin = plugin;
    this.editor = editor;
    this.options =
      options ??
      (JSON.parse(JSON.stringify(DEFAULT_PLOT_INPUTS)) as PlotInputs);
    this.onSubmit =
      onSubmit ??
      ((options: PlotInputs, renderer: rendererType) => {
        insertPlot(this.plugin, this.editor, options, renderer);
        this.close();
      });
  }

  onOpen() {
    this.titleEl.setText("Create a Plot");
    this.modalEl.addClass("fplt-modal");
    this.contentEl.addClass("fplt-modal-content");
    // attach svelte PlotModal component
    new PlotModal({
      target: this.contentEl,
      props: {
        options: this.options,
        plugin: this.plugin,
        submit: this.onSubmit,
      },
    });
  }
}
