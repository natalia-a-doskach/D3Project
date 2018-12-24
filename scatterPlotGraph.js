console.log("scatterPlot");

$.getJSON("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json",
function(data){createGraph(data)})

function createGraph(data){
data.map(d => {
let parseMyTime = d3.timeParse("%M:%S");
d.Time = parseMyTime(d.Time);
 return d})
console.log(data)
let body = d3.select("#scatterPlottDiv").append("svg");
let height=$("#scatterPlottDiv").height();
let width=$("#scatterPlottDiv").width();

let minYear = d3.min(data, d => d.Year);
let maxYear = d3.max(data, d => d.Year);
let minSec = d3.min(data, d => d.Time);
let maxSec = d3.max(data, d => d.Time);
console.log(minYear+" "+maxYear);

let scaleX = d3.scaleLinear().domain([minYear, maxYear]).range([width*0.1,width*0.9]);
let scaleY = d3.scaleTime()
.domain([minSec,maxSec])
.range([height*0.1,height*0.9]);


let  elems = body.selectAll("circle").data(data).enter().append("circle")
.attr("class","scatterPlot")
.attr("cx",d => scaleX(d.Year))
.attr("cy",d => scaleY(d.Time))
.attr("r","5")
.style("stroke", "black")
.style("opacity","0.7")
.attr("fill", (d) => {
if (d.Doping){return "purple"}
else { return "orange"}
})


body.append("g").attr("id","x-axis").attr("transform","translate("+0+","+height*0.9+")");
body.append("g").attr("id","y-axis").attr("transform","translate("+width*0.075+","+0+")");

let axisXgen = d3.axisBottom(scaleX).tickFormat(d3.format("d"));
let timeFormat = d3.timeFormat("%M:%S");
let axisYgen = d3.axisLeft(scaleY).tickFormat(timeFormat);

d3.select("#x-axis")
  .call(axisXgen);
  d3.select("#y-axis")
    .call(axisYgen);

console.log(scaleX.domain())

 body.append('line').attr('y1', height*0.9+0.5).attr('y2', height*0.9+0.5).attr('x1', width*0.075).attr('x2', width*0.9).style('stroke', '#000').attr("id", "conLine")


 // tooltip

 elems
.on("mouseenter", d=> {let text = d.Name+"("+d.Nationality+", "+d.Year+")"; showTooltip(text,[d3.event.pageX,d3.event.pageY])})
.on("mousemove", d=> {let text = d.Name+"("+d.Nationality+", "+d.Year+")"; showTooltip(text,[d3.event.pageX,d3.event.pageY])})
.on("mouseleave", d=> {d3.select("#tooltip").style("display","none")})

 function showTooltip(text,coords){
 d3.select("#tooltip1").style("display","block").text(text)
 .style("top",coords[1]+15+"px").style("left",coords[0]+"px")}


//legend
let legend = body.append("g").attr("id","legend").attr("transform","translate("+width*0.6+","+height*0.1+")");
legend.append('rect')
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", "orange")
legend.append('rect')
                        .attr("x", 0)
                        .attr("y", 20)
                        .attr("width", 10)
                        .attr("height", 10)
                        .style("fill", "purple")

legend.append("text").text("No doping allegations").attr("x", 15).attr("y", 10);
legend.append("text").text("Riders with doping allegations").attr("x", 15).attr("y", 30);


























};
