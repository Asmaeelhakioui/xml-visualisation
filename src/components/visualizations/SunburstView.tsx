import React from 'react';
import * as d3 from 'd3';
import { useD3Visualization } from '../../hooks/useD3Visualization';
import { XMLNode } from '../../types';
import { transformXMLDataForVisualization } from '../../utils/transformXMLData';

export const SunburstView: React.FC<{ data: XMLNode }> = ({ data }) => {
  const renderSunburst = (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) => {
    const width = 960;
    const radius = width / 2;

    const transformedData = transformXMLDataForVisualization(data);
    const root = d3.hierarchy(transformedData)
      .sum(d => 1)
      .sort((a, b) => b.value! - a.value!);

    const partition = d3.partition()
      .size([2 * Math.PI, radius]);

    const arc = d3.arc<d3.HierarchyRectangularNode<XMLNode>>()
      .startAngle(d => d.x0)
      .endAngle(d => d.x1)
      .padAngle(1 / radius)
      .padRadius(radius)
      .innerRadius(d => d.y0)
      .outerRadius(d => d.y1 - 1);

    const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children?.length || 2));

    partition(root);

    svg.append("g")
      .selectAll("path")
      .data(root.descendants())
      .join("path")
      .attr("fill", d => {
        if (d.data.name === '#text') return "#4CAF50";
        while (d.depth > 1) d = d.parent!;
        return color(d.data.name);
      })
      .attr("fill-opacity", d => d.data.name === '#text' ? 0.8 : (1 - d.depth / 6))
      .attr("d", arc);

    const textGroups = svg.append("g")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .selectAll("g")
      .data(root.descendants().filter(d => d.x1 - d.x0 > 0.1))
      .join("g")
      .attr("transform", d => {
        const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
        const y = (d.y0 + d.y1) / 2;
        return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
      });

    textGroups.append("text")
      .attr("dy", "0.35em")
      .attr("fill", d => d.data.name === '#text' ? "#fff" : "#000")
      .text(d => d.data.name === '#text' ? d.data.value : d.data.name);
  };

  const { ref } = useD3Visualization(renderSunburst);

  return <svg ref={ref} className="w-full h-[600px]" />;
};