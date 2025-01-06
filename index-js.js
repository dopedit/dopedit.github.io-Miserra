import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import DashboardLite from './App';
import VideoScraper from './VideoScraper';
import CodeAnalyzer from './CodeAnalyzer';
import VideoDownloader from './VideoDownloader';

// Componente para manejar rutas no encontradas
const NotFound = () => (
  <div className="p-4 text-center">
    <h1 className="text-2xl font-bold mb-4">404 - Página no encontrada</h1>
    <p className="text-gray-600">La página que buscas no existe.</p>
    <a href="/" className="text-blue-500 hover:underline mt-4 inline-block">
      Volver al inicio
    </a>
  </div>
);

// Configuración de rutas
const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardLite />,
    errorElement: <NotFound />
  },
  {
    path: '/video-scraper',
    element: <VideoScraper />
  },
  {
    path: '/code-analyzer',
    element: <CodeAnalyzer />
  },
  {
    path: '/video-downloader',
    element: <VideoDownloader />
  },
  {
    // URL Decoder - Placeholder para futura implementación
    path: '/url-decoder',
    element: (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">URL Decoder</h1>
        <p className="text-gray-600">Próximamente...</p>
      </div>
    )
  }
]);

// Elemento raíz de la aplicación
const container = document.getElementById('root');
const root = createRoot(container);

// Renderizar la aplicación
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// Manejo de service worker para PWA (opcional)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('SW registrado:', registration);
      })
      .catch(error => {
        console.log('SW error:', error);
      });
  });
}

// Exportar configuración de rutas para uso en otros archivos
export const routes = router.routes;