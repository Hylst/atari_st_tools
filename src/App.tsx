import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Generators from './pages/Generators';
import Generator3D from './pages/Generator3D';
import Converter from './pages/Converter';
import SpriteEditor from './pages/SpriteEditor';
import PaletteManager from './pages/PaletteManager';
import CycleAnalyzer from './pages/CycleAnalyzer';
import CopperGenerator from './pages/CopperGenerator';
import About from './pages/About';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/generators" replace />} />
          <Route path="generators" element={<Generators />} />
          <Route path="3d" element={<Generator3D />} />
          <Route path="converter" element={<Converter />} />
          <Route path="sprite-editor" element={<SpriteEditor />} />
          <Route path="palette" element={<PaletteManager />} />
          <Route path="cycles" element={<CycleAnalyzer />} />
          <Route path="copper" element={<CopperGenerator />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App