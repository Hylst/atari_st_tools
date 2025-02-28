import React from 'react';
import CurveGenerator from '../components/generators/CurveGenerator';

const Generators: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Générateurs</h2>
      <div className="space-y-8">
        <section>
          <h3 className="text-lg font-semibold mb-4">Générateur de Courbes</h3>
          <CurveGenerator />
        </section>
      </div>
    </div>
  );
};

export default Generators;