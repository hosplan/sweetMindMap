const margin = 25;
export function renderGridLine(svg_obj){
    let svg = d3.select(`svg[id='${svg_obj.id}']`);
    renderXAxis(svg_obj, svg);
    renderYAxis(svg_obj, svg);
}

function renderXAxis(svg_obj, svg){
    let axisLength = svg_obj.w;
    let scale = d3.scaleLinear()
                    .domain([0, 100])
                    .range([0, axisLength]);
    let xAxis = d3.axisBottom(scale).ticks(100);

    svg.append('g')
        .attr('class','x-axis')
        .attr('transform', () => `translate(0, ${svg_obj.h - margin})`)
        .call(xAxis);

    d3.selectAll('g.x-axis g.tick')
        .append('line')
        .classed('grid-line', true)
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 0)
        .attr('y2', - (svg_obj.h - margin));
}

function renderYAxis(svg_obj, svg){
    let axisLength = svg_obj.h - 2 * margin;
    let scale = d3.scaleLinear()
                    .domain([100, 0])
                    .range([0, axisLength]);
    let yAxis = d3.axisLeft(scale).ticks(100);

    svg.append('g')
        .attr('class','y-axis')
        .attr('transform', () => `translate(${margin}, ${margin})`)
        .call(yAxis);

    d3.selectAll('g.y-axis g.tick')
        .append('line')
        .classed('grid-line', true)
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', axisLength)
        .attr('y2', 0);
}


