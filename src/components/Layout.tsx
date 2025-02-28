import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Cpu, Image, Palette, Grid, Calculator, Box, Clock, Layers, Info } from 'lucide-react';

const Layout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <nav className="w-64 bg-white shadow-lg">
        <div className="p-4">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Cpu className="w-6 h-6" />
            Atari ST Tools
          </h1>
        </div>
        <ul className="space-y-2 p-4">
          <li>
            <Link to="/generators" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded">
              <Calculator className="w-5 h-5" />
              Générateurs 2D
            </Link>
          </li>
          <li>
            <Link to="/3d" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded">
              <Box className="w-5 h-5" />
              Générateur 3D
            </Link>
          </li>
          <li>
            <Link to="/converter" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded">
              <Image className="w-5 h-5" />
              Convertisseur PI1
            </Link>
          </li>
          <li>
            <Link to="/sprite-editor" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded">
              <Grid className="w-5 h-5" />
              Éditeur de Sprites
            </Link>
          </li>
          <li>
            <Link to="/palette" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded">
              <Palette className="w-5 h-5" />
              Gestionnaire de Palettes
            </Link>
          </li>
          <li>
            <Link to="/cycles" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded">
              <Clock className="w-5 h-5" />
              Analyseur de Cycles
            </Link>
          </li>
          <li>
            <Link to="/copper" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded">
              <Layers className="w-5 h-5" />
              Générateur Copper
            </Link>
          </li>
          <li className="border-t mt-4 pt-4">
            <Link to="/about" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded">
              <Info className="w-5 h-5" />
              À propos
            </Link>
          </li>
        </ul>
      </nav>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;