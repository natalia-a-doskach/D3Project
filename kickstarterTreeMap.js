console.log("kickstarter");

$.getJSON("https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/kickstarter-funding-data.json",
function(data){createTreeMap(data)});


function createTreeMap(data){
console.log(data);
let body = d3.select("#TreeMapDiv").append("svg");
let height=$("#TreeMapDiv").height();
let width=$("#TreeMapDiv").width();
// create treemap
let treemap = d3.treemap().size([width*0.75,height*0.8])
let root = d3.hierarchy(data).sum( d=> d.value);
treemap(root);
// colorScale
let categArr =[]
data.children.map( d=> categArr.push(d.name));
console.log(categArr);
let scaleColor = d3.scaleOrdinal().domain(categArr).range(["#dc85b0",
"#55c25e",
"#b245aa",
"#91ba35",
"#6e5ec7",
"#b9a83f",
"#c27edd",
"#478933",
"#d8458f",
"#57c197",
"#d24459",
"#49b9d1",
"#d0542c",
"#6a86ca",
"#d6923c",
"#36815b",
"#9d4a6c",
"#9baf67",
"#c17356",
"#766d29"]);

let treemapG = body.append("g").attr("transform","translate("+width*0.05+","+height*0.1+")")
let cell = treemapG.selectAll("g").data(root.leaves()).enter().append("g")
.attr("transform", d => "translate("+d.x0+","+d.y0+")")

cell.append("rect").attr("width", d => d.x1 - d.x0)
.attr("height", d => d.y1 - d.y0)
.attr("fill", d => scaleColor(d.parent.data.name))
//cell labels
let regex1 = /^\w*?:?\s+\w+\b/;
let regex2 = /^\w*?\W/;
let label = cell.append("text").attr("class","treeMapText").text(d => {
let message = d.data.name.match(regex1);
if (!message){ message = d.data.name.match(regex2)}
return message+"..."
}).attr("alignment-baseline", "hanging").attr("fill", "white")

// tooltip
cell
.on("mousemove", d=> {let text =  d.data.name+"("+d.data.category+", "+Math.round(d.data.value/1000000)+"M pledhes)"; showTooltip(text,[d3.event.pageX,d3.event.pageY])})
.on("mouseleave", d=> {d3.select("#tooltip5").style("display","none")})

function showTooltip(text,coords){
d3.select("#tooltip5").style("display","block").text(text)
.style("top",coords[1]+15+"px").style("left",coords[0]+"px")}

// legend
let legend = body.append("g").attr("id","legend5").attr("transform","translate("+width*0.82+","+height*0.1+")");
legend.selectAll("rect").data(categArr).enter().append('rect')
            .attr("x", 0)
            .attr("y", (d,i) => i*15)
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", d => scaleColor(d))
            legend.selectAll("text").data(categArr).enter().append('text')
                        .attr("x", 15)
                        .attr("y", (d,i) => i*15+10)
                        .attr("fill","black")
                        .text(d => d)
// description
let description = body.append("text").attr("id","description5").text("Top 100 Most Pledged Kickstarter Campaigns Grouped By Category").attr("transform","translate("+width*0.05+","+height*0.075+")")

}
