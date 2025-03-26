document.addEventListener("DOMContentLoaded", () => {
    const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

    fetch(url)
        .then(response => response.json())
        .then(data => drawChart(data.data));

    function drawChart(data) {
        const width = 800;
        const height = 400;
        const padding = 60;

        const svg = d3.select("#chart")
            .attr("width", width)
            .attr("height", height);

        const xScale = d3.scaleTime()
            .domain([new Date(d3.min(data, d => d[0])), new Date(d3.max(data, d => d[0]))])
            .range([padding, width - padding]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d[1])])
            .range([height - padding, padding]);

        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        svg.append("g")
            .attr("id", "x-axis")
            .attr("transform", `translate(0, ${height - padding})`)
            .call(xAxis);

        svg.append("g")
            .attr("id", "y-axis")
            .attr("transform", `translate(${padding}, 0)`)
            .call(yAxis);

        const tooltip = d3.select("#tooltip");

        svg.selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(new Date(d[0])))
            .attr("y", d => yScale(d[1]))
            .attr("width", (width - 2 * padding) / data.length)
            .attr("height", d => height - padding - yScale(d[1]))
            .attr("data-date", d => d[0])
            .attr("data-gdp", d => d[1])
            .on("mouseover", (event, d) => {
                tooltip.style("visibility", "visible")
                    .style("left", event.pageX + 10 + "px")
                    .style("top", event.pageY - 30 + "px")
                    .attr("data-date", d[0])
                    .text(`${d[0]} - $${d[1]} Billion`);
            })
            .on("mouseout", () => tooltip.style("visibility", "hidden"));
    }
});