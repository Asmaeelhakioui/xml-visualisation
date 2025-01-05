import React from 'react';
import { XMLNode } from '../types';
import { TreeView } from './visualizations/TreeView';
import { SunburstView } from './visualizations/SunburstView';
import { ListView } from './visualizations/ListView';

interface VisualizerProps {
  data: XMLNode;
  type: 'tree' | 'sunburst' | 'list';
}

export const Visualizer: React.FC<VisualizerProps> = ({ data, type }) => {
  if (!data) return null;

  switch (type) {
    case 'tree':
      return <TreeView data={data} />;
    case 'sunburst':
      return <SunburstView data={data} />;
    case 'list':
      return (
        <div className="p-4 overflow-auto max-h-[600px]">
          <ListView node={data} />
        </div>
      );
    default:
      return null;
  }
};