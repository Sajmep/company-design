// Core, non-editable tree rendering logic
(function (global) {
  /**
   * Generates a hierarchical tree data structure
   * @param {number} levels
   * @param {number} childrenPerNode
   * @returns {Object}
   */
  function generateTree(levels, childrenPerNode) {
    function createNode(level) {
      if (level > levels) return null;
      return {
        name: "Level " + level,
        children: Array.from({ length: childrenPerNode }, () =>
          createNode(level + 1)
        ).filter(Boolean)
      };
    }
    return createNode(1);
  }

  /**
   * Initialize a D3 tree diagram.
   * This file is intended to be stable/non-editable.
   * Customize data & visual options in a separate config file.
   *
   * @param {Object} options
   * @param {string} options.svgSelector - CSS selector for the SVG element
   * @param {Object} options.data - Root node for the hierarchy
   * @param {number} [options.width]
   * @param {number} [options.height]
   * @param {Object} [options.palette]
   * @param {string} [options.font]
   * @param {number} [options.siblingGap]
   * @param {number} [options.labelDx]
   * @param {number} [options.padX]
   * @param {number} [options.padY]
   * @param {{x:number,y:number}} [options.translate]
   */
  function initTree(options) {
    const {
      svgSelector = "svg",
      data,
      width = 800,
      height = 500,
      palette = {
        root: { fill: "#c7d2fe", stroke: "#a5b4fc", link: "#a5b4fc" },
        level1: { fill: "#bfdbfe", stroke: "#93c5fd", link: "#93c5fd" },
        subgroup: { fill: "#99f6e4", stroke: "#5eead4", link: "#5eead4" },
        division: { fill: "#86efac", stroke: "#4ade80", link: "#4ade80" }
      },
      font = "12px sans-serif",
      siblingGap = 30,
      labelDx = 10,
      padX = 6,
      padY = 3,
      translate = { x: 50, y: 50 }
    } = options || {};

    const svg = d3.select(svgSelector)
      .append("g")
      .attr("transform", `translate(${translate.x},${translate.y})`);

    const treeLayout = d3.tree().size([height, width]);
    const root = d3.hierarchy(data);

    const getColors = (d) => {
      const depth = d.depth ?? 0;
      if (depth === 0) return palette.root;
      if (depth === 1) return palette.level1;
      if (depth === 2) return palette.subgroup;
      return palette.division;
    };

    function update() {
      // Base layout
      treeLayout(root);

      // Measure label widths so children can start after parent text
      const measureCtx = document.createElement("canvas").getContext("2d");
      measureCtx.font = font;

      root.each(d => {
        const name = (d.data && d.data.name) ? String(d.data.name) : "";
        d.data._labelWidth = measureCtx.measureText(name).width;
      });

      root.y = 0;
      root.each(d => {
        if (!d.parent) return;
        const parentLabelWidth = (d.parent.data && d.parent.data._labelWidth) ? d.parent.data._labelWidth : 0;
        const parentAdvance = labelDx + (padX * 2) + parentLabelWidth + siblingGap;
        d.y = d.parent.y + parentAdvance;
      });

      // Links
      const links = svg.selectAll(".link")
        .data(root.links(), d => d.target.data.name);

      links.join("path")
        .attr("class", "link")
        .attr("fill", "none")
        .attr("stroke", d => getColors(d.source).link)
        .attr("stroke-width", 2)
        .attr("d", d3.linkHorizontal()
          .x(d => d.y)
          .y(d => d.x)
        );

      // Nodes
      const nodes = svg.selectAll(".node")
        .data(root.descendants(), d => d.data.name);

      const nodeEnter = nodes.join(
        enter => {
          const g = enter.append("g")
            .attr("class", "node")
            .on("click", toggle);

          g.append("circle").attr("r", 5);

          g.append("rect")
            .attr("class", "label-bg")
            .attr("rx", 6)
            .attr("ry", 6)
            .attr("fill", "#ffffff")
            .attr("stroke", "#cbd5e1")
            .attr("stroke-width", 1)
            .attr("pointer-events", "none");

          g.append("text")
            .attr("dx", labelDx)
            .style("font", font);

          return g;
        }
      );

      nodeEnter
        .attr("transform", d => `translate(${d.y},${d.x})`);

      nodeEnter.select("text")
        .text(d => d.data.name);

      nodeEnter.each(function () {
        const g = d3.select(this);
        const text = g.select("text");
        const rect = g.select("rect.label-bg");

        const bbox = text.node().getBBox();

        rect
          .attr("x", bbox.x - padX)
          .attr("y", bbox.y - padY)
          .attr("width", bbox.width + padX * 2)
          .attr("height", bbox.height + padY * 2);
      });

      nodeEnter.select("rect.label-bg")
        .attr("fill", d => getColors(d).fill)
        .attr("stroke", d => getColors(d).stroke);

      nodeEnter.select("circle")
        .attr("fill", d => getColors(d).stroke)
        .attr("stroke", "#ffffff")
        .attr("stroke-width", 1.5);
    }

    function toggle(event, d) {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      update();
    }

    // Initial render
    update();

    return { root, update };
  }

  global.TreeDiagram = {
    initTree,
    generateTree
  };
})(window);

