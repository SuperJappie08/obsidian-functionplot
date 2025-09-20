> [!NOTE]
> Based on [leonhma/obsidian-functionplot](https://github.com/leonhma/obsidian-functionplot) V2 and [HerrChaos/obsidian-functionplot](https://github.com/HerrChaos/obsidian-functionplot) V2 Work.

# obsidian-functionplot

A plugin for displaying mathematical graphs in obsidian.md.

> ⭐ _Remember to star this plugin on [Github](https://github.com/leonhma/obsidian-functionplot) if you like it!_

_This file only contains basic instructions to get you to using this plugin quickly. If you want a more detailed documentation, take a look at the [wiki](https://github.com/leonhma/obsidian-functionplot/wiki)._

---

## 🔮 How to use

Since version `2.0.0` a new description format is used (YAML or JSON based):

````yaml
```functionplot
title: "A cool Title" # Optional (Default: '')
constants: # Can be ommited
    C0:
        min: -1
        max: 10
        step: 1
        value: 2
    C2: { min: -1.0, max: 1.0, step: 0.1, value: 0 }
legends: True # Optional (Default: False)
grid: False # Optional (Default: True)
disableZoom: True # Optional (Default: False)
xAxis: # Can be ommited
    label: "x label" # Optional (Default: '')
    type: "log" # Optional (Default: 'linear', one of: ['linear', 'log'])
    invert: True  # Optional (Default: False)
    domain: # Optional can be ommited
        min: 0 # Optional (Default: -10)
        max: 3 # Optional (Default: 10)
yAxis: # Can be ommited
    label: "y label" # Optional (Default: '')
    type: "log" # Optional (Default: 'linear', one of: ['linear', 'log'])
    invert: True  # Optional (Default: False)
    domain: # Optional can be ommited
        min: 0 # Optional (Default: -10)
        max: 3 # Optional (Default: 10)
tip: # Can be ommited
    renderer: "???" # Optional (Default: Some function)
    xLine: True # Display X-line, Optional (Default: False)
    yLine: True # Display Y-line, Optional (Default: False)
data: # Plottypes go here
    -   fnType: linear # Required, type of Function
        graphType: interval  # Optional (Default: interval, valid: [interval, polyline, scatter])
        fn: (x^2)+x  # Required, some X depended function
        nSamples: 10 # Optional (Default: Enough?)
        range:  # Optional, Range of x
            min: -1  # Optional (Default: -INF)
            max: 2  # Optional (Default: INF)
        derivative: # Can be omitted
            fn: 2*x  # Optional, ommit to disable
            x0: 1.0  # point to calulae the derivative off. Optional
            updateOnMouseMove: False  # If true use mouse position as x0, Optional (Default: True)

    -   fnType: polar  # Required, type of Function
        graphType: polyline  # Required, valid: [polyline, scatter]
        r: theta+PI
        nSamples: 10 # Optional (Default: Enough?)
        range:  # Optional, Range of theta
            min: -1  # Optional (Default: -PI)
            max: 2  # Optional (Default: PI)

    -   fnType: vector # Required, type of Function
        graphType: polyline  # Required, valid: [polyline, scatter]
        vector:  # Required, The direction of the vector
            x: 2
            y: 2
        offset:  # Required, The start point of the vector
            x: 1
            y: 2

    -   fnType: points # Required, type of Function
        graphType: polyline  # Required, valid: [polyline, scatter]
        points:
            -   [0, 0]
            -   [1, 0]
            -   [0, 2]

        # Common parameters
        id: some-id # Optional
        name: Name for Legend # Optional (Default: '')
        color: '#ff0000;'  # Optional, some hex color (Required for propper legend)
        closed: True  # Render the region (until y=0 for functions), Optional (Default: False)
        skipTip: True  # Disable hover tip Optional (Default: False)
        scope:  # BROKEN # Optional, variables able to be used in functions
            some_var: 2
            other_var: 2
```
````

### With Command

Since version `1.1.0` you can create plots via a handy GUI with live-preview functionality.

1. Open the command palette and select `Obsidian Functionplot: Plot a Function`

2. Adjust the plot to your liking.

    ![Create plot modal](./images/create-modal/light.png#gh-light-mode-only)
    ![Create plot modal](./images/create-modal//dark.png#gh-dark-mode-only)

3. This will create a coordinate system with bounds `-10 < x < 10, -10 < y < 10` and plot the functions f and g. If you haven't disabled it, you can even drag and zoom the graph.

<!--     ![Graph image](./images/plot/light.png#gh-light-mode-only)
    ![Graph image](./images/plot/dark.png#gh-dark-mode-only) -->

### With `functionplot` Block

````
```functionplot
---
title: string
xLabel: string
yLabel: string
bounds: array[min x, max x, min y, max y]
disableZoom: boolean
grid: boolean
---
<name>(variable)=<expression>
```
````

Example:

````
```functionplot
---
title: The random graph
xLabel: Time
yLabel: Cost
bounds: [0, 10, 0, 50]
disableZoom: 1
grid: true
---
g(x)=x^PI
f(x)=E+log(x)*2
```
````

## 🧮 Supported Math

To see the complete list of supported math functions, please check the [wiki](https://github.com/leonhma/obsidian-functionplot/wiki).

## ⚙ Plugin Settings

Since version `1.2.0` there's a dedicated settings page for this plugin. Here you can adjust things like font sizes for the text elements of the plot, line widths and various colors. To access this page, head to the obsidian settings and scroll down the list to 'Community Plugins > Obsidian Functionplot'.

![Settings Page](https://github.com/leonhma/obsidian-functionplot/blob/master/images/settings/dark.png)

> **Note**  
> For changes to be applied, Obsidian needs to "re-render" the chart. You can either restart Obsidian, or switch between view modes (eg. Reading mode > Edit mode > Reading mode).

---

## ❓ Questions

If you have any questions about the usage of the plugin, take a look at the [wiki](https://github.com/leonhma/obsidian-functionplot/wiki) or post a question in the [discussions](https://github.com/leonhma/obsidian-functionplot/discussions).

## 🐞 Bugs and Errors

If you encounter any errors while using this plugin, please report them to us. To do so, click [this link](https://github.com/leonhma/obsidian-functionplot/issues/new?assignees=leonhma&labels=bug&template=BUG_REPORT.yml), fill out the form as best as you can and click `Submit new issue`. These issues are publicly viewable, so please don't submit any personal information.

## 🤝 Contributing

Contributions are always welcome! Be it submitting issues, editing the wiki or creating a pull request, contributions by people like you help keep the project evolving. Please adhere to the [contributing guidelines](CONTRIBUTING.md).

> **Note**  
> Just a heads-up: This project uses `pnpm` as it's package manager, which you might have to download in order to make use of existing lockfiles. See: [Installation | pnpm](https://pnpm.io/installation)

## ©️ Attribution

This plugin is based on / uses:

-   [function-plot](https://github.com/mauriciopoppe/function-plot): MIT License, Copyright (c) 2015 Mauricio Poppe
