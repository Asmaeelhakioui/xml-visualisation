import React from 'react';
import * as d3 from 'd3';
import { useD3Visualization } from '../../hooks/useD3Visualization';
import { XMLNode } from '../../types';
import { transformXMLDataForVisualization } from '../../utils/transformXMLData';

export const TreeView: React.FC<{ data: XMLNode }> = ({ data }) => {
  const renderTree = (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) => {
    const transformedData = transformXMLDataForVisualization(data);
    const root = d3.hierarchy(transformedData);
    
    const treeLayout = d3.tree<XMLNode>()
      .size([2 * Math.PI, 280])
      .separation((a, b) => (a.parent === b.parent ? 1 : 2) / a.depth);

    const root2 = treeLayout(root);

    // Draw links
    svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5)
      .selectAll("path")
      .data(root2.links())
      .join("path")
      .attr("d", d3.linkRadial()
        .angle(d => d.x)
        .radius(d => d.y));

    // Draw nodes
    svg.append("g")
      .selectAll("g")
      .data(root2.descendants())
      .join("g")
      .attr("transform", d => `
        rotate(${d.x * 180 / Math.PI - 90})
        translate(${d.y},0)
      `)
      .each(function(d) {
        const g = d3.select(this);
        
        // Add circle for node
        g.append("circle")
          .attr("fill", d.data.name === '#text' ? "#4CAF50" : (d.children ? "#555" : "#999"))
          .attr("r", d.data.name === '#text' ? 3 : 2.5);
        
        // Add text label
        const text = g.append("text")
          .attr("dy", "0.31em")
          .attr("x", d.x < Math.PI === !d.children ? 6 : -6)
          .attr("text-anchor", d.x < Math.PI === !d.children ? "start" : "end")
          .attr("transform", d.x >= Math.PI ? "rotate(180)" : null)
          .attr("fill", d.data.name === '#text' ? "#4CAF50" : "#000")
          .text(d.data.name === '#text' ? d.data.value || '' : d.data.name);

        // Add white background for text
        text.clone(true)
          .lower()
          .attr("stroke", "white")
          .attr("stroke-width", 3);
      });
  };

  const { ref } = useD3Visualization(renderTree);

  return <svg ref={ref} className="w-full h-[600px]" />;
};