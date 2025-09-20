import { Editor, parseYaml, stringifyYaml } from "obsidian";
import type ObsidianFunctionPlot from "../main";
import type {
  FunctionInputs,
  PlotInputs,
  rendererType,
  V1YAMLPlotInputs,
} from "./types";
import {
  DEFAULT_FUNCTION_INPUTS,
  DEFAULT_PLOT_INPUTS,
  DEFAULT_POINTS,
  FALLBACK_FUNCTION_INPUTS,
  FALLBACK_PLOT_DOMAIN_INPUTS,
} from "./defaults";
import { toPng } from "html-to-image";
import type {
  FunctionPlotDatum,
  FunctionPlotOptions,
  FunctionPlotTip,
} from "function-plot/dist/types";
import { FunctionPlot } from "../fnplot";

export function gcd(a: number, b: number): number {
  return !b ? a : gcd(b, a % b);
}

function parseLaTeX(
  latex: string | undefined,
  plugin: ObsidianFunctionPlot
): string | undefined {
  return latex === undefined
    ? latex
    : latex
        .replace(plugin.settings.decimalSeparator, ".")
        .replace(/\w+\(x\) *=/, "") // Replace any function name(x)= pattern
        .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "($1)/($2)")
        .replace(/\\cdot/g, "*")
        .replace(/\^{([^}]*)}/g, "^($1)")
        .replace(/\\sqrt{([^}]*)}/g, "sqrt($1)")
        .replace(/\\left\(/g, "(")
        .replace(/\\right\)/g, ")")
        .replace(/\\pi/g, "PI")
        .replace(/\^(\{([^{}]+)\}|(\d+))/g, "^($2$3)")
        .replace(/\\prime/g, "'")
        .replace(/\\sum_{([^}]*)}^{([^}]*)}/g, "sum($1, $2)")
        .replace(/\\int_{([^}]*)}\^{([^}]*)}/g, "integral($1, $2)")
        .replace(/\\lim_{([^}]*)\to([^}]*)}/g, "limit($1, $2)")
        .replace(/\\frac{d}{dx}/g, "d/dx")
        .replace(/\$/g, "")
        .replace(/\s+/g, " ")
        .trim();
}
// TODO make change to returned object reflect in input
export function toFunctionPlotOptions(
  options: PlotInputs,
  target: HTMLElement,
  plugin: ObsidianFunctionPlot
): FunctionPlotOptions {
  function functionInputsToFunctionPlotDatum(
    inputs: FunctionInputs,
    plugin: ObsidianFunctionPlot
  ): FunctionPlotDatum {
    const scope =
      Object.keys(options.constants).length > 0
        ? (Object.keys(options.constants).reduce((acc, key) => {
            acc[key] = options.constants[key].value;
            return acc;
          }, {}) as unknown as { [_: string]: number })
        : undefined;

    const output: FunctionPlotDatum = {
      fnType: inputs.fnType,
      graphType: inputs.graphType ?? undefined,
      fn:
        inputs.fnType === "linear"
          ? parseLaTeX(inputs.fn, plugin) ?? undefined
          : undefined,
      points:
        inputs.fnType === "points" && inputs.points !== DEFAULT_POINTS
          ? inputs.points
          : undefined,
      scope: scope,
      vector:
        inputs.fnType === "vector" &&
        typeof inputs.vector.x === "number" &&
        typeof inputs.vector.y === "number"
          ? [inputs.vector.x, inputs.vector.y]
          : undefined,
      offset:
        inputs.fnType === "vector" &&
        (inputs.offset.x !== null || inputs.offset.y !== null)
          ? [
              inputs.offset.x ?? FALLBACK_FUNCTION_INPUTS.offset.x,
              inputs.offset.y ?? FALLBACK_FUNCTION_INPUTS.offset.y,
            ]
          : undefined,
      r:
        inputs.fnType === "polar"
          ? parseLaTeX(inputs.r, plugin) ?? undefined
          : undefined,
      color: inputs.color ?? undefined,
      range:
        inputs.range?.min || inputs.range?.max
          ? [
              inputs.range?.min ?? FALLBACK_FUNCTION_INPUTS.range!.min,
              inputs.range?.max ?? FALLBACK_FUNCTION_INPUTS.range!.max,
            ]
          : undefined,
      nSamples: inputs.nSamples ? Math.min(inputs.nSamples, 999) : undefined,
      closed: inputs.closed ?? undefined,
      skipTip: inputs.skipTip ?? undefined,
      derivative:
        inputs.derivative?.fn === "" ||
        typeof inputs.derivative?.fn === "undefined"
          ? undefined
          : {
              fn: parseLaTeX(inputs.derivative?.fn, plugin),
              scope: scope,
              x0: inputs.derivative?.x0 ?? undefined,
              updateOnMouseMove: inputs.derivative?.updateOnMouseMove ?? true,
            },
    };

    Object.keys(output).forEach(
      (key) => output[key] === undefined && delete output[key]
    );

    return output;
  }

  function hasFunction(inputs: FunctionInputs): boolean {
    return Boolean(
      (inputs.fnType === "linear" && inputs.fn) ||
        (inputs.fnType === "vector" &&
          typeof inputs.vector.x === "number" &&
          typeof inputs.vector.y === "number") ||
        (inputs.fnType === "polar" && inputs.r) ||
        (inputs.fnType === "points" && inputs.points !== DEFAULT_POINTS)
    );
  }

  const output: FunctionPlotOptions = {
    //id: options.id, //used by functionplot to identify the plot for updating
    target: target,
    data: options.data
      .filter(hasFunction)
      .map((data) => functionInputsToFunctionPlotDatum(data, plugin)),
    title: options.title,
    xAxis: {
      label: options.xAxis?.label ?? undefined,
      type: options.xAxis?.type ?? undefined,
      invert: options.xAxis?.invert ?? undefined,
      domain: [
        (options.xAxis ?? { domain: FALLBACK_PLOT_DOMAIN_INPUTS }).domain
          ?.min ?? (FALLBACK_PLOT_DOMAIN_INPUTS.min as number),
        (options.xAxis ?? { domain: FALLBACK_PLOT_DOMAIN_INPUTS }).domain
          ?.max ?? (FALLBACK_PLOT_DOMAIN_INPUTS.max as number),
      ],
    },
    yAxis: {
      label: options.yAxis?.label ?? undefined,
      type: options.yAxis?.type ?? undefined,
      invert: options.yAxis?.invert ?? undefined,
      domain: [
        (options.yAxis ?? { domain: FALLBACK_PLOT_DOMAIN_INPUTS }).domain
          ?.min ?? (FALLBACK_PLOT_DOMAIN_INPUTS.min as number),
        (options.yAxis ?? { domain: FALLBACK_PLOT_DOMAIN_INPUTS }).domain
          ?.max ?? (FALLBACK_PLOT_DOMAIN_INPUTS.max as number),
      ],
    },
    grid: options.grid ?? undefined,
    disableZoom: options.disableZoom ?? undefined,
    tip: {
      renderer: (x: number, y: number) => {
        return options.tip.renderer === undefined || options.tip.renderer === ""
          ? "(" + x.toFixed(2).toString() + "," + y.toFixed(2).toString() + ")"
          : options.tip.renderer
              .replace("x", x.toFixed(2).toString())
              .replace("y", y.toFixed(2).toString());
      },
      xLine: options.tip.xLine ?? undefined,
      yLine: options.tip.yLine ?? undefined,
    } as FunctionPlotTip,
  };

  Object.keys(output).forEach(
    (key) => output[key] === undefined && delete output[key]
  );

  return output;
}

export function hueToHexRGB(hue: number): string {
  const f = (n: number, k = (n + hue / 60) % 6) =>
    1 - Math.max(Math.min(k, 4 - k, 1), 0);
  return (
    "#" +
    [
      Math.round(f(5) * 255)
        .toString(16)
        .padStart(2, "0"),
      Math.round(f(3) * 255)
        .toString(16)
        .padStart(2, "0"),
      Math.round(f(1) * 255)
        .toString(16)
        .padStart(2, "0"),
    ].join("")
  );
}

/**
 * Insert the text as a new paragraph (newline before and after), and place the active cursor below.
 * @param editor The editor element
 * @param value The text to place
 */
export function insertParagraphAtCursor(
  plugin: ObsidianFunctionPlot,
  editor: Editor,
  value: string
) {
  editor.replaceRange(`\n${value}\n`, editor.getCursor());
}

/**
 * Insert an interactive plot at the current cursor position.
 * @param plugin A reference to the plugin
 * @param editor A reference to the active editor
 * @param options The options for the plot
 */
export function insertPlotAsInteractive(
  plugin: ObsidianFunctionPlot,
  editor: Editor,
  options: PlotInputs
): void {
  const text = `\`\`\`functionplot\n${stringifyYaml(
    // JSON.stringify(
    Object.assign({}, options, { target: null })
    // null,
    // 2
  )}\n\`\`\``;
  insertParagraphAtCursor(plugin, editor, text);
}

/**
 * Render the plot as an image element using a data url.
 * @param plugin A reference to the plugin
 * @param editor A reference to the active editor
 * @param options The options for the plot
 */
export function insertPlotAsImage(
  plugin: ObsidianFunctionPlot,
  editor: Editor,
  options: PlotInputs
) {
  const target = document.createElement("div");
  const plot = new FunctionPlot(plugin);
  plot.target = target;
  plot.options = options;
  toPng(target)
    .then((dataURL) => {
      if (dataURL === "data:,") {
        new Error("Data URL is empty");
      }
      const text = `<img data-functionplot="${JSON.stringify(
        options
      )}" src="${dataURL}">`;
      target.remove();
      insertParagraphAtCursor(plugin, editor, text);
    })
    .catch((err) => {
      console.error(`Error converting to PNG: ${err}`);
    });
}

export function insertPlot(
  plugin: ObsidianFunctionPlot,
  editor: Editor,
  options: PlotInputs,
  renderer: rendererType
) {
  switch (renderer) {
    case "interactive":
      insertPlotAsInteractive(plugin, editor, options);
      break;
    case "image":
      insertPlotAsImage(plugin, editor, options);
      break;
  }
}

export function parseYAMLCodeBlockV2(content: string): PlotInputs {
  return Object.assign(
    {},
    DEFAULT_PLOT_INPUTS,
    // TODO: Make indent configurable?
    parseYaml(content.replaceAll("\t", " ".repeat(4)))
  ) as PlotInputs;
}

export function parseYAMLCodeBlock(content: string): PlotInputs {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let header: V1YAMLPlotInputs = {},
    offset = 0;
  const headerMatch = content.match(/-{3}([^]*?)-{3}/)?.[1];
  if (headerMatch) {
    offset = headerMatch.length + 6;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    header = parseYaml(headerMatch);
  }
  const functions = content
    .slice(offset)
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  return {
    constants: {},
    title: header.title ?? DEFAULT_PLOT_INPUTS.title,
    legends: false,
    xAxis: {
      label: header.xLabel,
      domain: header.bounds
        ? { min: header.bounds[0], max: header.bounds[1] }
        : FALLBACK_PLOT_DOMAIN_INPUTS,
    },
    yAxis: {
      label: header.yLabel,
      domain: header.bounds
        ? { min: header.bounds[2], max: header.bounds[3] }
        : FALLBACK_PLOT_DOMAIN_INPUTS,
    },
    disableZoom: header.disableZoom ?? DEFAULT_PLOT_INPUTS.disableZoom,
    grid: header.grid ?? DEFAULT_PLOT_INPUTS.grid,
    data: functions.map((f) => {
      const fn = /^[A-z]\([A-z]\) *= *(?=[0-z])([^]+?)$/.exec(f)?.[1] ?? f;

      return Object.assign({}, DEFAULT_FUNCTION_INPUTS, {
        fnType: "linear",
        graphType: "polyline",
        fn, // return as FunctionInputs since fn is specified here
      }) as FunctionInputs;
    }),
    tip: {},
  };
}

export function parseCodeBlock(content: string): PlotInputs {
  try {
    return parseYAMLCodeBlockV2(content);
  } catch (err) {
    console.error(`Errow hile parsing code block in YAML V2 mode: ${err}`);
  }
  try {
    return Object.assign(
      {},
      DEFAULT_PLOT_INPUTS,
      JSON.parse(content)
    ) as PlotInputs;
  } catch (err) {
    console.error(`Error while parsing code block in JSON mode: ${err}`);
    return parseYAMLCodeBlock(content);
  }
}
