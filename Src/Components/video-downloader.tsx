import React, { useState, useEffect } from 'react';
import { Download, Loader2, Check, AlertCircle, Settings2, Link, FileType, RefreshCcw } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

const VideoDownloader = () => {
  const [url, setUrl] = useState('');
  const [videoInfo, setVideoInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [selectedFormat, setSelectedFormat] = useState('');
  const [selectedQuality, setSelectedQuality] = useState('');

  // Función para analizar la URL del video
  const analyzeVideo = async () => {
    setAnalyzing(true);
    setError('');
    setVideoInfo(null);
    
    try {
      // Detectar el tipo de URL
      const videoType = getVideoType(url);
      if (!videoType) {
        throw new Error('URL de video no soportada');
      }

      // Simular obtención de información del video
      const info = await getVideoInfo(url, videoType);
      setVideoInfo(info);
      
      // Establecer valores por defecto
      setSelectedFormat(info.formats[0].id);
      setSelectedQuality(info.qualities[0].id);
    } catch (err) {
      setError(err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  // Función para detectar el tipo de video
  const getVideoType = (url) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('vimeo.com')) return 'vimeo';
    if (url.match(/\.(mp4|webm|ogg)$/i)) return 'direct';
    return null;
  };

  // Función para obtener información del video
  const getVideoInfo = async (url, type) => {
    // Simular llamada a API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Información simulada basada en el tipo de video
    switch (type) {
      case 'youtube':
        return {
          title: 'Video de YouTube',
          duration: '10:30',
          thumbnail: '/api/placeholder/320/180',
          formats: [
            { id: 'mp4', label: 'MP4' },
            { id: 'webm', label: 'WebM' }
          ],
          qualities: [
            { id: '720p', label: '720p HD' },
            { id: '1080p', label: '1080p Full HD' },
            { id: '1440p', label: '1440p 2K' }
          ]
        };
      case 'vimeo':
        return {
          title: 'Video de Vimeo',
          duration: '5:45',
          thumbnail: '/api/placeholder/320/180',
          formats: [
            { id: 'mp4', label: 'MP4' },
            { id: 'webm', label: 'WebM' }
          ],
          qualities: [
            { id: '720p', label: '720p HD' },
            { id: '1080p', label: '1080p Full HD' }
          ]
        };
      case 'direct':
        return {
          title: 'Video Directo',
          duration: 'Desconocido',
          thumbnail: null,
          formats: [
            { id: 'original', label: 'Original' }
          ],
          qualities: [
            { id: 'original', label: 'Calidad Original' }
          ]
        };
      default:
        throw new Error('Tipo de video no soportado');
    }
  };

  // Función para iniciar la descarga
  const startDownload = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);
    setDownloadProgress(0);

    try {
      // Simular proceso de descarga
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setDownloadProgress(i);
      }

      setSuccess(true);
    } catch (err) {
      setError('Error durante la descarga: ' + err.message);
    } finally {
      setLoading(false);
      setDownloadProgress(0);
    }
  };

  // Validar URL cuando cambia
  useEffect(() => {
    if (url) {
      const timer = setTimeout(() => {
        analyzeVideo();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [url]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Video Downloader</h1>
      
      <div className="space-y-6">
        {/* URL Input */}
        <div>
          <label className="block text-sm font-medium mb-2">
            URL del Video
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              className="flex-1 px-4 py-2 border rounded-lg"
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button
              onClick={analyzeVideo}
              disabled={analyzing || !url}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              <RefreshCcw size={20} className={analyzing ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Video Information */}
        {videoInfo && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start gap-4">
              {videoInfo.thumbnail && (
                <img
                  src={videoInfo.thumbnail}
                  alt="Video thumbnail"
                  className="w-40 h-24 object-cover rounded"
                />
              )}
              <div>
                <h3 className="font-semibold">{videoInfo.title}</h3>
                <p className="text-sm text-gray-500">Duración: {videoInfo.duration}</p>
              </div>
            </div>

            {/* Format and Quality Selection */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Formato
                </label>
                <select
                  className="w-full px-4 py-2 border rounded-lg"
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                >
                  {videoInfo.formats.map(format => (
                    <option key={format.id} value={format.id}>
                      {format.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Calidad
                </label>
                <select
                  className="w-full px-4 py-2 border rounded-lg"
                  value={selectedQuality}
                  onChange={(e) => setSelectedQuality(e.target.value)}
                >
                  {videoInfo.qualities.map(quality => (
                    <option key={quality.id} value={quality.id}>
                      {quality.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Download Button */}
        <button
          onClick={startDownload}
          disabled={loading || !videoInfo}
          className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Procesando... {downloadProgress}%
            </>
          ) : (
            <>
              <Download size={20} />
              Descargar Video
            </>
          )}
        </button>

        {/* Status Messages */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle size={16} />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-green-50 border-green-200">
            <Check size={16} className="text-green-500" />
            <AlertDescription className="text-green-700">
              ¡Video descargado con éxito!
            </AlertDescription>
          </Alert>
        )}

        {/* Advanced Settings */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Settings2 size={20} />
            Configuración Avanzada
          </h2>
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium mb-2">
                Códec de Audio
              </label>
              <select className="w-full px-4 py-2 border rounded-lg bg-white">
                <option>AAC</option>
                <option>MP3</option>
                <option>Opus</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Velocidad de Bits
              </label>
              <select className="w-full px-4 py-2 border rounded-lg bg-white">
                <option>Alta (256 kbps)</option>
                <option>Media (128 kbps)</option>
                <option>Baja (96 kbps)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-sm text-gray-500">
          <h3 className="font-medium mb-2">Formatos Soportados:</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Videos de YouTube (720p, 1080p, 1440p)</li>
            <li>Videos de Vimeo (hasta 1080p)</li>
            <li>Enlaces directos (.mp4, .webm, .ogg)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VideoDownloader;