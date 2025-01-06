import React, { useState } from 'react';
import { Search, Loader2, ExternalLink, AlertCircle, Download } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

const VideoScraper = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [videos, setVideos] = useState([]);

  const extractVideoUrls = async (htmlContent) => {
    const videoUrls = [];
    
    // Busca etiquetas de video HTML5
    const videoTags = htmlContent.match(/<video[^>]*>.*?<\/video>/gs) || [];
    videoTags.forEach(tag => {
      const sources = tag.match(/src="([^"]+)"/g) || [];
      sources.forEach(src => {
        const url = src.match(/src="([^"]+)"/)[1];
        videoUrls.push({
          url,
          type: 'HTML5 Video',
          quality: 'Original',
          size: 'Unknown'
        });
      });
    });

    // Busca iframes de video (YouTube, Vimeo, etc.)
    const iframes = htmlContent.match(/<iframe[^>]*src="([^"]+)"[^>]*>/g) || [];
    iframes.forEach(iframe => {
      const src = iframe.match(/src="([^"]+)"/)[1];
      if (src.includes('youtube.com') || src.includes('youtu.be')) {
        const videoId = src.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
        if (videoId) {
          videoUrls.push({
            url: `https://www.youtube.com/watch?v=${videoId}`,
            type: 'YouTube',
            quality: 'Variable',
            size: 'Streaming'
          });
        }
      } else if (src.includes('vimeo.com')) {
        const videoId = src.match(/vimeo\.com\/(?:video\/)?(\d+)/)?.[1];
        if (videoId) {
          videoUrls.push({
            url: `https://vimeo.com/${videoId}`,
            type: 'Vimeo',
            quality: 'Variable',
            size: 'Streaming'
          });
        }
      }
    });

    // Busca enlaces de video directos
    const links = htmlContent.match(/href="([^"]+\.(?:mp4|webm|ogg))"/g) || [];
    links.forEach(link => {
      const url = link.match(/href="([^"]+)"/)[1];
      videoUrls.push({
        url,
        type: url.split('.').pop().toUpperCase(),
        quality: 'Original',
        size: 'Unknown'
      });
    });

    return videoUrls;
  };

  const scrapeVideos = async () => {
    setLoading(true);
    setError('');
    setVideos([]);

    try {
      // Intenta obtener el contenido de la página
      const response = await fetch(url);
      if (!response.ok) throw new Error('No se pudo acceder a la página');
      
      const htmlContent = await response.text();
      const foundVideos = await extractVideoUrls(htmlContent);

      if (foundVideos.length === 0) {
        setError('No se encontraron videos en esta página');
      } else {
        setVideos(foundVideos);
      }
    } catch (err) {
      setError(err.message || 'Error al analizar la página');
    } finally {
      setLoading(false);
    }
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Video Scraper</h1>
      
      <div className="space-y-6">
        {/* URL Input */}
        <div className="flex gap-4">
          <input
            type="url"
            className="flex-1 px-4 py-2 border rounded-lg"
            placeholder="Ingresa la URL del sitio web..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            onClick={scrapeVideos}
            disabled={loading || !isValidUrl(url)}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Buscando...
              </>
            ) : (
              <>
                <Search size={16} />
                Buscar Videos
              </>
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle size={16} />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Results */}
        {videos.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">
              Videos Encontrados ({videos.length})
            </h2>
            <div className="grid gap-4">
              {videos.map((video, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {video.type}
                        {video.type === 'YouTube' && (
                          <span className="text-red-500 text-sm">YouTube</span>
                        )}
                        {video.type === 'Vimeo' && (
                          <span className="text-blue-500 text-sm">Vimeo</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Calidad: {video.quality} • Tamaño: {video.size}
                      </div>
                      <div className="text-xs text-gray-400 mt-1 break-all">
                        {video.url}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-blue-500 hover:text-blue-600"
                      >
                        <ExternalLink size={16} />
                      </a>
                      {video.type !== 'YouTube' && video.type !== 'Vimeo' && (
                        <a
                          href={video.url}
                          download
                          className="p-2 text-green-500 hover:text-green-600"
                        >
                          <Download size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoScraper;
