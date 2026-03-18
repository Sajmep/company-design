// Editable configuration: data, colors, layout options

const masterFormatData = {
  name: "MasterFormat 2018",
  children: [
    { name: "Procurement and Contracting Requirements Group" },
    {
      name: "Specifications Group",
      children: [
        { name: "General Requirements Subgroup" },
        { name: "Facility Construction Subgroup" },
        {
          name: "Facility Services Subgroup",
          children: [
            { name: "Division 21 - Fire Suppression" },
            { name: "Division 22 - Plumbing" },
            { name: "Division 23 - HVAC" },
            { name: "Division 25 - Integrated Automation" },
            { name: "Division 26 - Electrical" },
            { name: "Division 27 - Communications" },
            { name: "Division 28 - Electronic Safety and Security" }
          ]
        },
        { name: "Site and Infrastructure Subgroup" },
        { name: "Process Equipment Subgroup" }
      ]
    }
  ]
};

const masterFormatPalette = {
  root: { fill: "#c7d2fe", stroke: "#a5b4fc", link: "#a5b4fc" },       // indigo
  level1: { fill: "#bfdbfe", stroke: "#93c5fd", link: "#93c5fd" },     // blue
  subgroup: { fill: "#99f6e4", stroke: "#5eead4", link: "#5eead4" },   // teal
  division: { fill: "#86efac", stroke: "#4ade80", link: "#4ade80" }    // green
};

TreeDiagram.initTree({
  svgSelector: "svg",
  data: masterFormatData,
  width: 800,
  height: 500,
  palette: masterFormatPalette,
  font: "12px sans-serif",
  siblingGap: 30,
  labelDx: 10,
  padX: 6,
  padY: 3,
  translate: { x: 50, y: 50 }
});

