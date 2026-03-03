// src/js/chart.js
// D3 charting for Gradebook Explorer

function buildGraphData(selectedData) {
    const total = selectedData.length;
    if (total === 0) return {A:0, B:0, C:0, D:0, F:0};

    let counts = {A: 0, B: 0, C: 0, D: 0, F: 0};

    for (grade of selectedData) {
        if (grade >= 90) counts.A++;
        else if (grade >= 80) counts.B++;
        else if (grade >= 70) counts.C++;
        else if (grade >= 60) counts.D++;
        else counts.F++;
    }
    console.log(counts);

    return {
        A: counts.A / total,
        B: counts.B / total,
        C: counts.C / total,
        D: counts.D / total,
        F: counts.F / total
    }
}

function buildNewGraph(xLab, yLab, data) {
    d3.select("#chart").selectAll("*").remove();

    const letterGrades = buildGraphData(data);
    const chartData = Object.entries(letterGrades).map(([grade, freq]) => ({ grade, freq }));

    const container = $("#chart")[0];
    const width = container.clientWidth;
    const height = 350;
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", "100%")
        .attr("height", height)
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet");

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // X scale
    const xScale = d3.scaleBand()
        .domain(chartData.map(d => d.grade))
        .range([0, innerWidth])
        .padding(0.2);

    // Y scale
    const yScale = d3.scaleLinear()
        .domain([0, 1])
        .range([innerHeight, 0]);

    // X axis
    g.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale));

    // Y axis
    g.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(yScale).tickFormat(d3.format(".0%")));

    // Bars
    g.selectAll(".bar")
        .data(chartData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.grade))
        .attr("y", d => yScale(d.freq))
        .attr("width", xScale.bandwidth())
        .attr("height", d => innerHeight - yScale(d.freq));

    // X axis label
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height - 5)
        .attr("text-anchor", "middle")
        .text(xLab);

    // Y axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .text(yLab);
}