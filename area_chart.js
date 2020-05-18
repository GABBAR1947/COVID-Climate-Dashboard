function createAREACHART(data) {
 d3.select("#div3").selectAll("*").remove();

var xFormat = "%d-%b";
var parseTime = d3.timeParse("%m/%d/%Y");
console.log("WEELOO")
console.log(data)
console.log(parseTime(data[1].Date))


var margin = {top: 10, right: 20, bottom: 40, left: 50},
    width = 750 - margin.left - margin.right,
    height = 170 - margin.top - margin.bottom;


var mindate = new Date(2020,0,22),
    maxdate = new Date(2020,3,1);

var x = d3.scaleTime()
    .domain([mindate, maxdate])
    .rangeRound([0,width]);

console.log(x)
var y = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return d.Confirmed; })])
    .rangeRound([height, 0]);

var xAxis = d3.axisBottom(x);

var yAxis = d3.axisLeft(y);



var area = d3.area()
    .x(function(d) { return x(parseTime(d.Date)); })
    .y0(height)
    .y1(function(d) { return y(d.Confirmed); });



var svg = d3.select("#div3").append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("path")
    .datum(data)
    .attr("class", "area")
    .attr("d", area);

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis.tickFormat(d3.timeFormat(xFormat)));

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

//---------------------------------------------------------------------------------
//---------------------------------------------------------------------------------
//BRUSHING

focusHeight = 100
  const svg2 = d3.create("svg")
      .attr("viewBox", [0, 0, width, focusHeight])
      .style("display", "block");

  const brush = d3.brushX()
      .extent([[margin.left, 0.5], [width - margin.right, focusHeight - margin.bottom + 0.5]])
      .on("brush", brushed)
      .on("end", brushended);

  const defaultSelection = [x(d3.utcYear.offset(x.domain()[1], -1)), x.range()[1]];

  svg2.append("g")
      .call(xAxis, x, focusHeight);

  svg2.append("path")
      .datum(data)
      .attr("fill", "steelblue")
      .attr("d", area(x, y.copy().range([focusHeight - margin.bottom, 4])));

  const gb = svg2.append("g")
      .call(brush)
      .call(brush.move, defaultSelection);

  function brushed() {
    if (d3.event.selection) {
      svg2.property("value", d3.event.selection.map(x.invert, x).map(d3.utcDay.round));
      svg2.dispatch("input");
    }
  }

  function brushended() {
    if (!d3.event.selection) {
      gb.call(brush.move, defaultSelection);
    }
  }



}