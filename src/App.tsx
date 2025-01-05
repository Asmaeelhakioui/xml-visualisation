import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { Visualizer } from './components/Visualizer';
import { parseXMLString } from './utils/xmlParser';
import { XMLNode } from './types';
import { Icons } from './components/icons';

function App() {
  const [xmlData, setXmlData] = useState<XMLNode | null>(null);
  const [visualizationType, setVisualizationType] = useState<'tree' | 'sunburst' | 'list'>('tree');

  const handleFileLoad = (content: string) => {
    try {
      const parsed = parseXMLString(content);
      setXmlData(parsed);
    } catch (error) {
      alert('Error parsing XML file. Please ensure the file is valid XML.');
    }
  };

  const visualizationTypes = [
    { type: 'tree' as const, icon: Icons.Tree, label: 'Tree View' },
    { type: 'sunburst' as const, icon: Icons.Grid, label: 'Sunburst View' },
    { type: 'list' as const, icon: Icons.List, label: 'List View' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">XML Visualizer</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {!xmlData ? (
          <div className="max-w-xl mx-auto">
            <FileUpload onFileLoad={handleFileLoad} />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                {visualizationTypes.map(({ type, icon: Icon, label }) => (
                  <button
                    key={type}
                    onClick={() => setVisualizationType(type)}
                    className={`flex items-center px-4 py-2 rounded-lg ${
                      visualizationType === type
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-2" />
                    {label}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setXmlData(null)}
                className="text-gray-600 hover:text-gray-900"
              >
                Upload New File
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 min-h-[600px]">
              {xmlData && <Visualizer data={xmlData} type={visualizationType} />}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;