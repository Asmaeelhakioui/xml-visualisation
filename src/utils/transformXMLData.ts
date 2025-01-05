import { XMLNode } from '../types';

export const transformXMLDataForVisualization = (node: XMLNode): XMLNode => {
  // Create base node with attributes
  const result: XMLNode = {
    name: node.name,
    ...(node.attributes && { attributes: { ...node.attributes } })
  };
  
  // Transform children recursively
  const children: XMLNode[] = (node.children || []).map(child => 
    transformXMLDataForVisualization(child)
  );
  
  // Add text node if there's a value
  if (node.value) {
    children.push({
      name: '#text',
      value: node.value
    });
  }
  
  // Only add children if there are any
  if (children.length > 0) {
    result.children = children;
  }
  
  return result;
};