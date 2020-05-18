var format = d3.format(",");

// Set tooltips
var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
              return "<strong>Country: </strong><span class='details'>" + d.properties.name + "<br></span>" + "<strong>Population: </strong><span class='details'>" + format(d.population) +"</span>";
            })

var margin = {top: 0, right: 0, bottom: 0, left: 0},
            width = 860 - margin.left - margin.right,
            height = 600 - margin.top - margin.bottom;

var color = d3.scaleThreshold()
    .domain([10000,100000,500000,1000000,5000000,10000000,50000000,100000000,500000000,1500000000])
    .range(["rgb(245, 236, 220)", "rgb(245, 228, 198)", "rgb(242, 212, 157)", "rgb(242, 197, 114)", "rgb(242, 183, 73)", "rgb(247, 176, 42)","rgb(245, 165, 15)","rgb(191, 127, 8)","rgb(166, 109, 7)","rgb(115, 74, 2)"]);

var path = d3.geoPath();

var svg = d3.select("#div1")
            .append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("position", "fixed")
            .attr("viewBox" , "0 0 590 500")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .append('g')
            .attr('class', 'map');
 //           .attr("transform", "translate(200,30)");
 //viewBox="0 0 250 75"
 //    preserveAspectRatio="xMinYMin meet

var projection = d3.geoMercator()
                   .scale(110)
                  .translate( [width / 2.3, height / 1.7]);

var path = d3.geoPath().projection(projection);

svg.call(tip);

queue()
    .defer(d3.json, "static/world_countries.json")
    .defer(d3.tsv, "static/world_population.tsv")
    .await(ready);

function ready(error, data, population) {
  var populationById = {};

  population.forEach(function(d) { populationById[d.id] = +d.population; });
  data.features.forEach(function(d) { d.population = populationById[d.id] });


  svg.append("g")
      .attr("class", "countries")
    .selectAll("path")
      .data(data.features)
    .enter().append("path")
      .attr("d", path)
      .attr("width", "100%")
            .attr("height", "100%")
            .attr("position", "fixed")
            .attr("viewBox" , "0 0 590 500")
            .attr("preserveAspectRatio", "xMinYMin meet")
      .style("fill", function(d) { return color(populationById[d.id]); })
      .style('stroke', 'white')
      .style('stroke-width', 1.5)
      .style("opacity",0.8)
      // tooltips
        .style("stroke","white")
        .style('stroke-width', 0.3)
        .on('mouseover',function(d){
          tip.show(d);

          d3.select(this)
            .style("opacity", 1)
            .style("stroke","white")
            .style("stroke-width",3);
        })
        .on('mouseout', function(d){
          tip.hide(d);

          d3.select(this)
            .style("opacity", 0.8)
            .style("stroke","white")
            .style("stroke-width",0.3);
        })
        .on('click', function(d,i){
          var iden = d.properties.name;
          clicked_country(iden);
        });


function clicked_country( Countryname){

  // EVENT HANDLER FOR ON CLICK
  console.log(Countryname);

  //Function for Area Chart
  AREA_CHART(Countryname);
}






function AREA_CHART( CNAM ) {

      $.post("/AREA_CHART", {'data': 'received'}, function(data_infunc){
      data2 = JSON.parse(data_infunc.chart_data);
      
 //     console.log("YOLO");    

      var FILTER_data2 = [];
      data2.forEach(function(d) {

        var date = d.Date;
        var datearray = date.split("/");
        if(datearray[1].length == 1)
          datearray[1] = '0' + datearray[1]
        var newdate = '0' + datearray[0] + '/' + datearray[1] + '/' + datearray[2]+'20';
        

        if( (d.Country).localeCompare(CNAM) == 0) {
          FILTER_data2.push({ Date : newdate , Deaths : d.Deaths, Confirmed : d.Confirmed})
        }
      });

      FILTER_data2.sort((a, b) => (a.Date > b.Date) ? 1 : -1)

      var holder = {};
      var bolder = {};

      
      FILTER_data2.forEach(function(d) {
        if (holder.hasOwnProperty(d.Date)) {
          holder[d.Date] = holder[d.Date] + d.Deaths;
          bolder[d.Date] = bolder[d.Date] + d.Confirmed;
        } else {
          holder[d.Date] = d.Deaths;
          bolder[d.Date] = d.Confirmed;
        }
      });

      var obj2 = [];
      var temp1=0
      var temp2=0

      for (var prop in holder) {
        obj2.push({ Date: prop, Deaths: holder[prop]-temp1, Confirmed : bolder[prop]-temp2  });
        //temp1 = holder[prop]
        //temp2 = bolder[prop]
      }

      FILTER_data2 = obj2.slice(0,71);
//      console.log(FILTER_data2);

      createAREACHART(FILTER_data2);

      })
}


  svg.append("path")
      .datum(topojson.mesh(data.features, function(a, b) { return a.id !== b.id; }))
       // .datum(topojson.mesh(data.features, function(a, b) { return a !== b; }))
      .attr("class", "names")
      .attr("d", path);
}






