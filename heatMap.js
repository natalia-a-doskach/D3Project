console.log("heatMap");

$.getJSON("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json",
function(data){createHeatMap(data)});

function createHeatMap(data){
console.log(data);
let dataSet = data.monthlyVariance;
let parseTime = d3.timeParse("%m");
let formatTime = d3.timeFormat("%B");
dataSet = dataSet.map (d => {d.month = formatTime(parseTime(d.month)); return d})
console.log(dataSet);
let body = d3.select("#heatMapDiv").append("svg");
let height=$("#heatMapDiv").height();
let width=$("#heatMapDiv").width();
// scales
let minYear = d3.min(dataSet, d => d.year);
let maxYear = d3.max(dataSet, d => d.year);
let months = dataSet.slice(0,12).map(d => d.month);
let minTemp = d3.min(dataSet, d => data.baseTemperature+d.variance);
let maxTemp = d3.max(dataSet, d => data.baseTemperature+d.variance);
let scaleX = d3.scaleLinear()
.domain([minYear, maxYear])
.range([width*0.1,width*0.95]);
let scaleY = d3.scaleBand()
.domain(months)
.range([height*0.2,height*0.8]);

let scaleColor = d3.scaleLinear().domain([minTemp, maxTemp]).range(["purple","orange"]);
// elements
let elWidth = width*0.9/(dataSet.length/12);
let elHeight = height*0.6/12;
let  elems = body.selectAll("rect").data(dataSet).enter().append("rect")
.attr("class","cell")
.attr("x",d => scaleX(d.year))
.attr("y",d => scaleY(d.month))
.attr("width", elWidth)
.attr("height", elHeight)
.attr("fill", d => scaleColor(data.baseTemperature+d.variance))
.style("opacity","0.7")



// axes
body.append("g").attr("id","x-axis").attr("transform","translate("+0+","+height*0.8+")");
body.append("g").attr("id","y-axis").attr("transform","translate("+width*0.1+","+0+")");

let axisXgen = d3.axisBottom(scaleX).tickFormat(d3.format("d"));

let axisYgen = d3.axisLeft(scaleY);

d3.select("#x-axis").call(axisXgen);
d3.select("#y-axis").call(axisYgen);

// tooltip
let celsius = '\u2103';

elems
.on("mouseenter", d=> {let text = d.year+": "+Math.round((data.baseTemperature+d.variance) * 10) / 10+celsius; showTooltip(text,[d3.event.pageX,d3.event.pageY])})
.on("mousemove", d=> {let text =  d.year+": "+ Math.round((data.baseTemperature+d.variance) * 10) / 10+celsius; showTooltip(text,[d3.event.pageX,d3.event.pageY])})
.on("mouseleave", d=> {d3.select("#tooltip2").style("display","none")})

function showTooltip(text,coords){
d3.select("#tooltip2").style("display","block").text(text)
.style("top",coords[1]+15+"px").style("left",coords[0]+"px")}
// description
d3.select("#description").select("p")
.text(minYear+"-"+maxYear+": base temp "+data.baseTemperature+celsius);

// legend
let step = (maxTemp-minTemp)/5;
let tempArr =[];
for (let i=minTemp;i<=maxTemp;i+=step){
tempArr.push(Math.round(i*10)/10)
};
let legend = body.append("g").attr("id","legend3").attr("transform", "translate("+width*0.1+","+0+")").selectAll("rect").data(tempArr).enter().append("rect")
.attr("x",(d,i) => i*40)
.attr("y",10)
.attr("width", 40)
.attr("height", 20)
.attr("fill", d => scaleColor(d))
.style("opacity","0.7")

let scaleLegend = d3.scaleBand().domain(tempArr).range([0,200]);


d3.select("#legend3").append("g").attr("id","legend-axis").attr("transform","translate("+0+","+30+")");
let axisLegend = d3.axisBottom(scaleLegend).tickFormat(d => d + celsius);
d3.select("#legend-axis").call(axisLegend);






};
