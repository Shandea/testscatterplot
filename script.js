// This is fetching data from json file
fetch('cyclist-data.json')
    .then(response => response.json())
    .then(data => {
        // // Mapping the data 
        const dataSet = data.map(function (item) {
        // Mapping if doping or no doping 
            if (item.Doping == "") {
                item.Doping = "no"
            } else {
                item.Doping = "yes"
            }
            return {
                year: Date.parse(item.Year),
                seconds: parseFloat((item.Seconds / 60).toFixed(2)),
                doping: item.Doping
            }
        }); 
        // This is getting the Min and Max years
        let yearMin = d3.min(dataSet, d => d.year);
        let yearMax = d3.max(dataSet, d => d.year);
        // This is max and min record
        let recMax = d3.max(dataSet, d => d.seconds);
        let recMin = d3.min(dataSet, d => d.seconds);
        // This is creating width, height and margins on graph
        const w = 1000;
        const h = 500;
        const margin = {
            top: 10,
            right: 10,
            bottom: 30,
            left: 200
        };

        const innerWidth = w - margin.left - margin.right;
        const innerHeight = h - margin.top - margin.bottom;
        // Creating svg
        const svg = d3.select("body")
            .append("svg")
            .attr('width', w)
            .attr('height', h)
        // X scale
        const xScale = d3.scaleTime()
            .domain([new Date(yearMin), new Date(yearMax)])
            .range([0, innerWidth]);
        // X axis
        const xAxis = d3.axisBottom(xScale);
        // Y scale
        const yScale = d3.scaleLinear()
            .domain([36.0, 40.])
            .range([innerHeight, margin.bottom]);
        // Y axis
        const yAxis = d3.axisLeft(yScale);
        // G variable
        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);
        // Display y axis
        const yAxisG =
            g.append('g').call(yAxis)
                .attr('id', 'yAxis');
        // Display x axis
        const xAxisG =
            g.append('g').call(xAxis)
                .attr('transform', `translate(0, ${innerHeight})`)
                .attr('id', 'xAxis');
        // Dots for chart
        svg.selectAll('circle')
            .data(dataSet)
            .enter()
            .append('circle')
            .attr('cx', d => xScale(d.year) + margin.left + 5)
            .attr('cy', d => yScale(d.seconds) + margin.bottom)
            .attr('r', 5)
            .attr("fill", function (d) {
                if (d.doping == "no") {
                    return "blue"
                } else {
                    return "aqua"
                }
            })
            .attr("class", "dot")
            .attr('id', 'tooltip')
            .append("title")
            .text((d, i) => d.seconds)
        // Legend squares for no doping
        svg.append('rect')
            .attr('x', 900)
            .attr('y', 300)
            .attr('height', 20)
            .attr('width', 20)
            .attr('fill', "blue")
        // Legend text saying no doping
        svg.append('text')
            .text("No doping allegations")
            .attr('x', 740)
            .attr('y', 320)
        // Legend square for doping
        svg.append('rect')
            .attr('x', 900)
            .attr('y', 320)
            .attr('height', 20)
            .attr('width', 20)
            .attr('fill', "aqua")
        // Legend text saying doping
        svg.append('text')
            .text("Rides with doping allegations")
            .attr('x', 690)
            .attr('y', 340)
    });
