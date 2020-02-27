const m = {
    width: 800,
    height: 600
}

const svg = d3.select("body").append('svg')
    .attr('width', m.width)
    .attr('height', m.height)

const g = svg.append('g')

// neighborhoods.json taken from rat map example
d3.json('nygeo.json').then(function(data) {
  d3.csv('data.csv').then(function(pointData) {
    // scales coordinates to svg (pixels)
    const albersProj = d3.geoAlbers()
        .scale(70000)
        .rotate([74.0060, 0])
        .center([0, 40.7128])
        .translate([m.width/2, m.height/2]);

    // drawing the map
    const geoPath = d3.geoPath()
    .projection(albersProj)

    g.selectAll('path')
    .data(data.features)
    .enter()
    .append('path')
        .attr('fill', 'pink')
        .attr('d', geoPath)

    //plots circles on the map
    g.selectAll('.circle')
        .data(pointData)
        .enter()
        .append('circle')
            .attr('cx', function(d) {
                let scaledPoints = albersProj([d['longitude'], d['latitude']])
                return scaledPoints[0]
            })
            .attr('cy', function(d) {
                let scaledPoints = albersProj([d['longitude'], d['latitude']])
                return scaledPoints[1]
            })
            .attr('r', 5)
            .attr('fill', 'steelblue')
            .on( "click", function(){
              d3.select(this)
                .attr("opacity",1)
                .transition()
                .duration( 1000 )
                .attr( "cx", 0 )
                .attr( "cy", 0 )
                .attr( "opacity", 0 )
                .on("end",function(){
                  d3.select(this).remove();
                })
            })
  })
})
