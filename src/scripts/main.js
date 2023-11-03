  let width = 800;
  let height = 400;
  let samples = 200;

  let container = d3.select("#backgroundSvg")
    .append("div")
    .classed("svg-container", true);

  let svg = container
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 " + width + " " + height)
    .classed("svg-content-responsive", true);

  let sites = d3.range(samples)
    .map(() => [Math.random() * width, Math.random() * height]);

  let voronoi = d3.Delaunay.from(sites).voronoi([-1, -1, width + 1, height + 1]);

  let polygons = svg.selectAll("path")
    .data(voronoi.cellPolygons())
    .enter().append("path")
    .call(redraw);

  function redraw(polygon) {
    polygon
      .attr("d", d => "M" + d.join("L") + "Z")
      .style("fill", d => color(d))
      .style("stroke", d => color(d));
  }

  function color(d) {
    var dx = d[0][0] - width / 2;
    var dy = d[0][1] - height / 2;
    return d3.lab(100 - (dx * dx + dy * dy) / 5000, dx / 10, dy / 10);
  }
