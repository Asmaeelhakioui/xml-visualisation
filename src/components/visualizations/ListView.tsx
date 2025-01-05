import React from 'react';
import { XMLNode } from '../../types';

interface ListViewProps {
  node: XMLNode;
  depth?: number;
}

export const ListView: React.FC<ListViewProps> = ({ node, depth = 0 }) => {
  const padding = depth * 20;
  const hasAttributes = node.attributes && Object.keys(node.attributes).length > 0;
  
  return (
    <div style={{ paddingLeft: padding }} className="my-1">
      <div className="flex items-start">
        <span className="text-blue-600 font-mono">
          &lt;{node.name}
          {hasAttributes && (
            <span className="text-purple-600">
              {Object.entries(node.attributes || {}).map(([key, value]) => (
                ` ${key}="${value}"`
              ))}
            </span>
          )}
          &gt;
        </span>
        {node.value && <span className="ml-2 text-gray-700">{node.value}</span>}
      </div>
      {node.children?.map((child, index) => (
        <ListView key={index} node={child} depth={depth + 1} />
      ))}
      {(!node.value || node.children?.length) && (
        <div style={{ paddingLeft: 0 }} className="text-blue-600 font-mono">
          &lt;/{node.name}&gt;
        </div>
      )}
    </div>
  );
};