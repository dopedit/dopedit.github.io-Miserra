import React, { useState } from 'react';
import { AlertCircle, Check, AlertTriangle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CodeAnalyzer = () => {
  const [activeTab, setActiveTab] = useState('html');
  const [input, setInput] = useState({
    html: '',
    css: '',
    js: ''
  });
  const [results, setResults] = useState({
    html: [],
    css: [],
    js: []
  });

  const analyzeHTML = (code) => {
    const issues = [];
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(code, 'text/html');

      // Verificar errores de parsing
      const parseErrors = doc.querySelectorAll('parsererror');
      if (parseErrors.length > 0) {
        parseErrors.forEach(error => {
          issues.push({ type: 'error', message: `Error de parsing: ${error.textContent}` });
        });
        return issues;
      }

      // Analizar elementos
      doc.querySelectorAll('*').forEach(el => {
        // Verificar atributos mal formateados
        Array.from(el.attributes).forEach(attr => {
          if (attr.name.includes('=')) {
            issues.push({
              type: 'error',
              message: `Atributo mal formateado: ${attr.name} en <${el.tagName.toLowerCase()}>`
            });
          }
        });

        // Verificar imágenes sin alt
        if (el.tagName === 'IMG' && !el.getAttribute('alt')) {
          issues.push({
            type: 'warning',
            message: `Imagen sin atributo alt: ${el.outerHTML}`
          });
        }

        // Verificar elementos vacíos
        if (!el.children.length && !el.textContent.trim()) {
          issues.push({
            type: 'warning',
            message: `Elemento vacío encontrado: <${el.tagName.toLowerCase()}>`
          });
        }
      });

      // Verificar estructura básica
      if (!doc.querySelector('title')) {
        issues.push({
          type: 'warning',
          message: 'No se encontró la etiqueta <title>'
        });
      }

      if (!doc.querySelector('meta[charset]')) {
        issues.push({
          type: 'warning',
          message: 'No se encontró la declaración de charset'
        });
      }
    } catch (error) {
      issues.push({
        type: 'error',
        message: `Error al analizar HTML: ${error.message}`
      });
    }

    return issues;
  };

  const analyzeCSS = (code) => {
    const issues = [];
    try {
      // Verificar selectores vacíos
      const emptySelectors = code.match(/[^}]*\{\s*\}/g);
      if (emptySelectors) {
        emptySelectors.forEach(selector => {
          issues.push({
            type: 'warning',
            message: `Selector vacío encontrado: ${selector.trim()}`
          });
        });
      }

      // Verificar propiedades inválidas
      const lines = code.split('\n');
      lines.forEach((line, index) => {
        if (line.includes(':')) {
          const [prop, value] = line.split(':');
          if (!value || !value.trim()) {
            issues.push({
              type: 'error',
              message: `Propiedad sin valor en línea ${index + 1}: ${prop.trim()}`
            });
          }
        }
      });

      // Verificar llaves no balanceadas
      const openBraces = (code.match(/\{/g) || []).length;
      const closeBraces = (code.match(/\}/g) || []).length;
      if (openBraces !== closeBraces) {
        issues.push({
          type: 'error',
          message: 'Llaves no balanceadas en el CSS'
        });
      }
    } catch (error) {
      issues.push({
        type: 'error',
        message: `Error al analizar CSS: ${error.message}`
      });
    }

    return issues;
  };

  const analyzeJS = (code) => {
    const issues = [];
    try {
      // Verificar sintaxis básica
      new Function(code);

      // Verificar console.log
      if (code.includes('console.log')) {
        issues.push({
          type: 'warning',
          message: 'Se encontraron console.log en el código'
        });
      }

      // Verificar variables no utilizadas
      const declarations = code.match(/(?:let|const|var)\s+([a-zA-Z_$][0-9a-zA-Z_$]*)/g);
      if (declarations) {
        declarations.forEach(declaration => {
          const varName = declaration.split(/\s+/)[1];
          const usage = new RegExp(`\\b${varName}\\b`, 'g');
          const count = (code.match(usage) || []).length;
          if (count === 1) {
            issues.push({
              type: 'warning',
              message: `Variable posiblemente no utilizada: ${varName}`
            });
          }
        });
      }

      // Verificar eval
      if (code.includes('eval(')) {
        issues.push({
          type: 'error',
          message: 'Uso de eval() detectado - considere alternativas más seguras'
        });
      }
    } catch (error) {
      issues.push({
        type: 'error',
        message: `Error de sintaxis JS: ${error.message}`
      });
    }

    return issues;
  };

  const handleAnalyze = () => {
    const newResults = { ...results };
    
    switch (activeTab) {
      case 'html':
        newResults.html = analyzeHTML(input.html);
        break;
      case 'css':
        newResults.css = analyzeCSS(input.css);
        break;
      case 'js':
        newResults.js = analyzeJS(input.js);
        break;
    }

    setResults(newResults);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Analizador de Código</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="html">HTML</TabsTrigger>
          <TabsTrigger value="css">CSS</TabsTrigger>
          <TabsTrigger value="js">JavaScript</TabsTrigger>
        </TabsList>

        {['html', 'css', 'js'].map((lang) => (
          <TabsContent key={lang} value={lang}>
            <div className="space-y-4">
              <textarea
                className="w-full h-64 p-4 font-mono text-sm border rounded-lg"
                placeholder={`Ingresa tu código ${lang.toUpperCase()}...`}
                value={input[lang]}
                onChange={(e) => setInput({ ...input, [lang]: e.target.value })}
              />
              
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleAnalyze}
              >
                Analizar
              </button>

              <div className="space-y-2">
                {results[lang].length === 0 ? (
                  <div className="flex items-center gap-2 text-green-500">
                    <Check size={16} />
                    <span>No se encontraron problemas</span>
                  </div>
                ) : (
                  results[lang].map((result, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-2 ${
                        result.type === 'error' ? 'text-red-500' : 'text-yellow-500'
                      }`}
                    >
                      {result.type === 'error' ? (
                        <AlertCircle size={16} />
                      ) : (
                        <AlertTriangle size={16} />
                      )}
                      <span>{result.message}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default CodeAnalyzer;