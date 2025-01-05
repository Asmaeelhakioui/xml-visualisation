export interface XMLNode {
  name: string;
  attributes?: Record<string, string>;
  children?: XMLNode[];
  value?: string;
}

export interface VisualizationConfig {
  type: 'tree' | 'sunburst' | 'list';
  data: XMLNode;
}