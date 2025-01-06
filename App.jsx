import React from 'react';

const DashboardLite = () => {
  const tools = [
    {
      id: 'video-scraper',
      name: 'Video Scraper',
      description: 'Extrae URLs de video de cualquier página web',
      difficulty: 'Pro',
      icon: '🎥'
    },
    {
      id: 'code-analyzer',
      name: 'Analizador de Código',
      description: 'Analiza y mejora tu código HTML, CSS y JavaScript',
      difficulty: 'Intermedio',
      icon: '⚡'
    },
    {
      id: 'url-decoder',
      name: 'Decodificador URL',
      description: 'Limpia y decodifica URLs complejas',
      difficulty: 'Básico',
      icon: '🔗'
    },
    {
      id: 'video-downloader',
      name: 'Video Downloader',
      description: 'Descarga videos en múltiples formatos y calidades',
      difficulty: 'Pro',
      icon: '⬇️'
    }
  ];

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">ClaudAlxTools</h1>
        <p className="text-gray-600 text-sm">
          Selecciona una herramienta para comenzar
        </p>
      </div>

      <div className="grid gap-4">
        {tools.map((tool) => (
          <a 
            key={tool.id} 
            href={`/${tool.id}`}
            className="block bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{tool.icon}</span>
              <div>
                <h3 className="font-semibold mb-1">{tool.name}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  {tool.description}
                </p>
                <span className="inline-block text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                  {tool.difficulty}
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default DashboardLite;