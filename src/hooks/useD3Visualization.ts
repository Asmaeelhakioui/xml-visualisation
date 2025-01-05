import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

type RenderFunction = (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) => void;

export const useD3Visualization = (renderFn: RenderFunction) => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    // Clear previous visualization
    d3.select(ref.current).selectAll('*').remove();

    const svg = d3.select(ref.current)
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', [-960 / 2, -600 / 2, 960, 600])
      .style('max-width', '100%')
      .style('height', 'auto');

    renderFn(svg);
  }, [renderFn]);

  return { ref };
};