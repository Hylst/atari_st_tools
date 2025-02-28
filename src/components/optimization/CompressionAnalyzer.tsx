import React, { useState, useCallback } from 'react';
import { encodeRLE } from '../../lib/optimization/compression/rle';
import { LZ77Compressor } from '../../lib/optimization/compression/lz77';

interface CompressionAnalyzerProps {
  data: Uint8Array;
}

const CompressionAnalyzer: React.FC<CompressionAnalyzerProps> = ({ data }) => {
  const [method, setMethod] = useState<'rle' | 'lz77'>('rle');
  
  const compress = useCallback(() => {
    if (method === 'rle') {
      return encodeRLE(data);
    } else {
      const compressor = new LZ77Compressor();
      return compressor.compress(data);
    }
  }, [data, method]);
  
  const compressed = compress();
  const ratio = ((compressed.length / data.length) * 100).toFixed(1);
  
  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Analyse de compression</h3>
        
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setMethod('rle')}
            className={`px-3 py-1 rounded ${
              method === 'rle' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'
            }`}
          >
            RLE
          </button>
          <button
            onClick={() => setMethod('lz77')}
            className={`px-3 py-1 rounded ${
              method === 'lz77' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'
            }`}
          >
            LZ77
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">{data.length}</div>
            <div className="text-sm text-gray-500">Taille originale</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{compressed.length}</div>
            <div className="text-sm text-gray-500">Taille compressée</div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="text-sm text-gray-500 mb-1">Taux de compression</div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-500"
              style={{ width: `${ratio}%` }}
            />
          </div>
          <div className="text-right text-sm text-gray-500 mt-1">{ratio}%</div>
        </div>
      </div>
    </div>
  );
};

export default CompressionAnalyzer;