import React from 'react';
import { PenTool, Cpu, Image, Grid, Palette } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">À propos d'Atari ST Tools</h2>
        <p className="text-gray-600">
          Atari ST Tools est une suite d'outils modernes pour le développement sur Atari ST.
          Elle permet de créer et manipuler facilement des ressources graphiques et des assets
          pour vos projets de développement sur cette plateforme historique.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <PenTool className="w-6 h-6 text-indigo-600" />
            <h3 className="text-lg font-medium">Fonctionnalités</h3>
          </div>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <Cpu className="w-5 h-5 text-indigo-500 mt-1" />
              <div>
                <h4 className="font-medium">Générateurs 2D/3D</h4>
                <p className="text-sm text-gray-600">Création de graphiques vectoriels et modèles 3D optimisés pour l'Atari ST</p>
                <ul className="list-disc ml-4 mt-1 text-sm text-gray-500">
                  <li>Courbes paramétriques (sinusoïdes, spirales, etc.)</li>
                  <li>Primitives 3D (cube, sphère, cylindre)</li>
                  <li>Export en assembleur optimisé</li>
                </ul>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Image className="w-5 h-5 text-indigo-500 mt-1" />
              <div>
                <h4 className="font-medium">Convertisseur PI1</h4>
                <p className="text-sm text-gray-600">Conversion d'images au format Degas Elite (PI1)</p>
                <ul className="list-disc ml-4 mt-1 text-sm text-gray-500">
                  <li>Réduction de palette automatique</li>
                  <li>Dithering optimisé</li>
                  <li>Prévisualisation en temps réel</li>
                </ul>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Grid className="w-5 h-5 text-indigo-500 mt-1" />
              <div>
                <h4 className="font-medium">Éditeur de Sprites</h4>
                <p className="text-sm text-gray-600">Création et édition de sprites avec gestion des masques</p>
                <ul className="list-disc ml-4 mt-1 text-sm text-gray-500">
                  <li>Édition pixel par pixel</li>
                  <li>Gestion des masques de collision</li>
                  <li>Animation multi-frames</li>
                </ul>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Palette className="w-5 h-5 text-indigo-500 mt-1" />
              <div>
                <h4 className="font-medium">Gestionnaire de Palettes</h4>
                <p className="text-sm text-gray-600">Création et optimisation de palettes 16 couleurs</p>
                <ul className="list-disc ml-4 mt-1 text-sm text-gray-500">
                  <li>Génération de dégradés</li>
                  <li>Optimisation pour l'Atari ST</li>
                  <li>Import/export de palettes</li>
                </ul>
              </div>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4">Spécifications techniques</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-800">Format PI1</h4>
              <ul className="text-sm text-gray-600 list-disc ml-4">
                <li>Résolution : 320x200 pixels</li>
                <li>16 couleurs (4 bitplanes)</li>
                <li>Taille fixe : 32034 octets</li>
                <li>Compatible Degas Elite</li>
                <li>Structure du fichier :
                  <ul className="ml-4 mt-1">
                    <li>En-tête : 34 octets (résolution + palette)</li>
                    <li>Données : 32000 octets (4 bitplanes)</li>
                  </ul>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-800">Formats d'export</h4>
              <ul className="text-sm text-gray-600 list-disc ml-4">
                <li>Assembleur 68000 (optimisé)</li>
                <li>C (tables et structures)</li>
                <li>Binaire (raw data)</li>
                <li>GFA BASIC (DATA statements)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-800">Optimisations</h4>
              <ul className="text-sm text-gray-600 list-disc ml-4">
                <li>Conversion en point fixe (8.8 ou 4.12)</li>
                <li>Tables précalculées (sinus, etc.)</li>
                <li>Optimisation des palettes (réduction)</li>
                <li>Compression RLE/LZ77</li>
                <li>Alignement mémoire optimisé</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;