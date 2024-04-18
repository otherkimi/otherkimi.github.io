//Define data
const crime = d3.csv("offense_by_race.csv");

// Once the data is loaded, proceed with plotting
crime.then(function(data) {
    // Convert string values to numbers
    data.forEach(function(d) {
        d.F = +d.F;
        d.M = +d.M;
        d.V = +d.V;
    });

    // Create SVG
    let 
      width = 1000,
      height = 500;

    let margin = {
      top: 30,
      bottom: 150,
      left: 85,
      right: 150
    };

    let svg = d3
      .select('body')
      .append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('background', '#e9f7f2');

    // List of subgroups = header of the csv files = type of crime
    var subgroups = data.columns.slice(2)
    var groups = d3.map(data, function(d){return(d.PERP_RACE)})
    
    // Define Scales
    let yScale = d3.scaleLinear()
      .domain([0, 80])
      .range([height - margin.bottom, margin.top]);

    let xScale = d3.scaleBand()
      .domain(groups)
      .range([margin.left, width-margin.right])
      .padding(0.1);
    
    // Draw axes
    let yAxis = svg.append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(d3.axisLeft().scale(yScale));

    let xAxis = svg.append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom().scale(xScale))
        .selectAll("text")
          .attr("transform", "translate(-10,0)rotate(-45)")
          .style("text-anchor", "end");



    svg.append('text')  // Append to xAxis selection, not xAxis itself
          .attr('x', width/2)
          .attr('y', height - margin.bottom /2)  // Adjust y-coordinate as needed
          .attr('dy', '1.5em')
          .style('text-anchor', 'middle')
          .style('stroke', 'black')
          .text('Race Category');
      



    // Add y-axis label
    yAxis
      .append('text')
          .attr('y', 20)
          .attr('x', 20)
          .style('stroke', 'black')
          .text('Percent of Crimes');

    var xSubgroup = d3.scaleBand()
      .domain(subgroups)
      .range([0, xScale.bandwidth()])
      .padding([0.05]);

    var color = d3.scaleOrdinal()
      .domain(subgroups)
      .range(['#e41a1c','#377eb8','#4daf4a'])
    
    // Show the bars
    svg.append("g")
      .selectAll("g")
      // Enter in data = loop group per group
      .data(data)
      .enter()
      .append("g")
        .attr("transform", function(d) { return "translate(" + xScale(d.PERP_RACE) + ",0)"; })
      .selectAll("rect")
      .data(function(d) { return subgroups.map(function(key) { return {key, value: d[key]}; }); })
      .enter().append("rect")
        .attr("x", d => xSubgroup(d.key))
        .attr("y", d => yScale(d.value))
        .attr("width", xSubgroup.bandwidth())
        .attr("height", d=> height - margin.bottom - yScale(d.value))
        .attr("fill", function(d) { return color(d.key); });

var keys = ['Felony', 'Misdemeanor', 'Violation']

// Add legend
var legend = svg.append("g")
.attr("transform", "translate(" + (width - margin.right) + "," + (margin.top) + ")");

legend.selectAll("rect")
.data(subgroups)
.enter().append("rect")
  .attr("x", 0)
  .attr("y", function(d, i) { return i * 20; })
  .attr("width", 15)
  .attr("height", 15)
  .style("fill", function(d) { return color(d); });

legend.selectAll("text")
  .data(keys)
  .enter().append("text")
    .attr("x", 20)
    .attr("y", function(d, i) { return i * 20 + 12; })
    .text(function(d){ return d})
    .attr("text-anchor", "start")
    .style("alignment-baseline", "middle");
});

