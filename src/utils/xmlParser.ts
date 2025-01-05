import { XMLParser } from 'fast-xml-parser';
import { XMLNode } from '../types';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  preserveOrder: true,
  parseTagValue: true,
  parseAttributeValue: true,
  trimValues: true,
  isArray: () => true
});

export const parseXMLString = (xmlString: string): XMLNode => {
  try {
    const parsed = parser.parse(xmlString);
    if (!parsed || !Array.isArray(parsed) || parsed.length === 0) {
      throw new Error('Invalid XML structure');
    }
    return transformToNodeStructure(parsed[0]);
  } catch (error) {
    console.error('Error parsing XML:', error);
    throw new Error('Invalid XML format');
  }
};

const transformToNodeStructure = (node: any): XMLNode => {
  if (!node || typeof node !== 'object') {
    throw new Error('Invalid node structure');
  }

  const nodeName = Object.keys(node)[0];
  if (!nodeName) {
    throw new Error('Node name not found');
  }

  const result: XMLNode = {
    name: nodeName,
    children: [],
    attributes: {}
  };

  const content = node[nodeName];
  if (!Array.isArray(content)) {
    return result;
  }

  let textContent: string[] = [];

  content.forEach(item => {
    if (typeof item === 'object') {
      if (Object.keys(item).some(key => key.startsWith('@_'))) {
        // Handle attributes
        result.attributes = Object.entries(item)
          .filter(([key]) => key.startsWith('@_'))
          .reduce((acc, [key, value]) => ({
            ...acc,
            [key.substring(2)]: String(value)
          }), {});
      } else if (item['#text']) {
        // Collect text content
        textContent.push(String(item['#text']).trim());
      } else {
        // Handle child nodes
        const childNode = transformToNodeStructure(item);
        if (childNode) {
          result.children?.push(childNode);
        }
      }
    } else if (typeof item === 'string' && item.trim()) {
      // Collect direct text content
      textContent.push(item.trim());
    }
  });

  // Combine all text content
  if (textContent.length > 0) {
    result.value = textContent.join(' ').trim();
  }

  // Remove empty children array if no children
  if (result.children?.length === 0) {
    delete result.children;
  }

  // Remove empty attributes object if no attributes
  if (Object.keys(result.attributes || {}).length === 0) {
    delete result.attributes;
  }

  return result;
};