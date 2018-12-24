console.log("GDP");

$.getJSON("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json",
function(data){createBarChart(data)})

function createBarChart(data){
let dataSet=data.data;
console.log(dataSet);
let body = d3.select("#barChartDiv").append("svg");
let elems = body.selectAll("rect").data(dataSet).enter().append("rect").attr("class","bar");
let height=$("#barChartDiv").height();
let width=$("#barChartDiv").width();
/*scales*/
let maxGDP = d3.max(dataSet, d=> d[1]);
let minYear = d3.min(dataSet, d => parseInt(d[0].split("-")[0]));
let maxYear = d3.max(dataSet, d => parseInt(d[0].split("-")[0]));
console.log(minYear);

let scaleY = d3.scaleLinear().domain([0,maxGDP]).range([height/2,0]);
let scaleX = d3.scaleLinear()
.domain([minYear,maxYear])
.range([0,width*0.8]);
// elements
elems.attr("width", width*0.8/dataSet.length)
.attr("height", (d) => scaleY(0)-scaleY(d[1]))
.attr("x", (d,i) => width*0.1+i* width*0.8/dataSet.length)
.attr("y",(d) => height*0.75-scaleY(0)+scaleY(d[1]))
/*axes*/
body.append("g").attr("id","axisX1").attr("transform","translate("+width*0.1+","+height*0.75+")");
body.append("g").attr("id","axisY1").attr("transform","translate("+width*0.1+","+height*0.25+")");;

let axisXgen = d3.axisBottom(scaleX).tickFormat(d3.format("d"))
let axisYgen = d3.axisLeft(scaleY);

d3.select("#axisX1")
  .call(axisXgen);
  d3.select("#axisY1")
    .call(axisYgen);

// tooltip
 elems
.on("mouseenter", d=> {let text = d[0].split("-")[0]+" Q"+parseInt(d[0].split("-")[1]/3)+", $"+d[1]+" Billion";
showTooltip(text,[d3.event.pageX,d3.event.pageY])})
.on("mousemove", d=> {let text = d[0].split("-")[0]+" Q"+parseInt(d[0].split("-")[1]/3+1)+", $"+d[1]+" Billion";
 showTooltip(text,[d3.event.pageX,d3.event.pageY])})
.on("mouseleave", d=> {d3.select("#tooltip").style("display","none")})

 function showTooltip(text,coords){
 d3.select("#tooltip").style("display","block").text(text)
 .style("top",coords[1]+15+"px").style("left",coords[0]+"px")}








};
