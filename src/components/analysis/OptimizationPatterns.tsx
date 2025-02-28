import React from 'react';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { OptimizationPattern } from '../../lib/analysis/patterns/detector';

interface OptimizationPatternsProps {
  patterns: OptimizationPattern[];
}

const OptimizationPatterns: React.FC<OptimizationPatternsProps> = ({ patterns }) => {
  if (patterns.length === 0) {
    return (
      <div className="bg-green-50 p-4 rounded-lg">
        <div className="flex">
          <Info className="h-5 w-5 text-green-400" />
          <div className="ml-3">
            <p className="text-sm font-medium text-green-800">
              Aucun pattern d'optimisation détecté
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {patterns.map((pattern, index) => {
        let Icon = Info;
        let colorClass = 'text-blue-400';
        let bgClass = 'bg-blue-50';
        let textClass = 'text-blue-800';
        
        if (pattern.severity === 'warning') {
          Icon = AlertCircle;
          colorClass = 'text-yellow-400';
          bgClass = 'bg-yellow-50';
          textClass = 'text-yellow-800';
        } else if (pattern.severity === 'critical') {
          Icon = AlertTriangle;
          colorClass = 'text-red-400';
          bgClass = 'bg-red-50';
          textClass = 'text-red-800';
        }
        
        return (
          <div key={index} className={`${bgClass} p-4 rounded-lg`}>
            <div className="flex">
              <Icon className={`h-5 w-5 ${colorClass}`} />
              <div className="ml-3">
                <h3 className={`text-sm font-medium ${textClass}`}>
                  {pattern.name}
                </h3>
                <div className="mt-2 text-sm text-gray-700">
                  <p>{pattern.description}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OptimizationPatterns;