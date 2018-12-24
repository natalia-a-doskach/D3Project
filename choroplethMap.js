

$.getJSON("https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json",
function(data1){
$.getJSON("https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json",
function(data2){
createChoroplethMap(data1,data2)
  });
});

function createChoroplethMap(data1,data2){
let dataSet = data1;
let mapData = data2;
console.log(mapData);

let body = d3.select("#choroplethMapDiv").append("svg");
let height=$("#choroplethMapDiv").height();
let width=$("#choroplethMapDiv").width();

let mapW= mapData.bbox[0] + mapData.bbox[2];
let scale = width / mapW*2;
mapData.transform.scale[0] *= 0.37*scale;
mapData.transform.scale[1] *= 0.37*scale;
mapData.transform.translate[0] +=width*0.1;
mapData.transform.translate[1] +=height*0.05;
console.log(mapData);

//colorScale
let minPer = d3.min(dataSet, d => d.bachelorsOrHigher);
let maxPer = d3.max(dataSet, d => d.bachelorsOrHigher);
let scaleColor = d3.scaleLinear().domain([minPer, maxPer]).range(["purple","orange"]);



let path = d3.geoPath();


let elems = body.append("g").selectAll("path")
.data(topojson.feature(mapData, mapData.objects.counties).features)
.enter().append("path")
.attr("d", path)
.attr("data-education", d => {
let result = dataSet.filter( obj => obj.fips == d.id);
if(result[0]){return result[0].bachelorsOrHigher}
else{return 0}})
.attr("fill", d => {
let result = dataSet.filter( obj => obj.fips == d.id);
if(result[0]){return scaleColor(result[0].bachelorsOrHigher)}
else{return "white"}})

// tooltip
elems
.on("mousemove", d=> {
let text;
let result = dataSet.filter( obj => obj.fips == d.id);
if(result[0]){text =result[0].area_name+", "+result[0].state+":" + result[0].bachelorsOrHigher+"%"}; showTooltip(text,[d3.event.pageX,d3.event.pageY])})
.on("mouseleave", d=> {d3.select("#tooltip3").style("display","none")})

function showTooltip(text,coords){
d3.select("#tooltip3").style("display","block").text(text)
.style("top",coords[1]+15+"px").style("left",coords[0]+"px")}

//legend
let step = (maxPer-minPer)/50;
let perArr =[];
for (let i=minPer;i<=maxPer;i+=step){
perArr.push(Math.round(i*10)/10)
};
let legend = body.append("g").attr("id","legend4").attr("transform", "translate("+width*0.5+","+0+")").selectAll("rect").data(perArr).enter()
.append("rect")
.attr("x",(d,i) => i*4)
.attr("y",10)
.attr("width", 4)
.attr("height", 20)
.attr("fill", d => scaleColor(d))

let scaleLegend = d3.scaleLinear().domain([minPer,maxPer]).range([0,200]);

d3.select("#legend4").append("g").attr("id","legend-axis4").attr("transform","translate("+0+","+30+")");
let axisLegend = d3.axisBottom(scaleLegend).tickFormat(d => d + "%");
d3.select("#legend-axis4").call(axisLegend);























}
