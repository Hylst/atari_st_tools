# Changelog

## [Non Publié]

### État Actuel du Projet

#### Fonctionnalités Implémentées

##### Générateur 3D
- ✓ Interface de base avec sélection des primitives (cube, sphère, cylindre)
- ✓ Paramètres de génération configurables
- ⚠️ Rendu WebGL partiellement fonctionnel
- ⚠️ Export en assembleur 68000 non finalisé

##### Convertisseur PI1
- ✓ Interface de chargement d'images
- ✓ Conversion basique vers le format PI1
- ✓ Gestion des bitplanes
- ✓ Prévisualisation de l'image convertie
- ⚠️ Optimisation de la palette non implémentée
- ⚠️ Dithering non implémenté

##### Éditeur de Sprites
- ✓ Interface de base
- ✓ Outils de dessin basiques
- ⚠️ Gestion des masques non implémentée
- ⚠️ Animation multi-frames non implémentée

##### Gestionnaire de Palettes
- ✓ Interface de sélection des couleurs
- ✓ Génération de dégradés
- ✓ Export de palettes
- ⚠️ Import de palettes non implémenté
- ⚠️ Optimisation pour l'Atari ST basique

##### Analyseur de Cycles CPU
- ✓ Analyse des cycles d'exécution du code assembleur
- ✓ Identification des instructions coûteuses
- ✓ Visualisation du timing par rapport au balayage écran
- ✓ Détection des patterns d'optimisation
- ✓ Export des résultats en TXT et HTML

##### Générateur de Copper List
- ✓ Interface pour créer des barres de couleur
- ✓ Génération de dégradés verticaux
- ✓ Synchronisation avec le balayage écran
- ✓ Export en assembleur
- ✓ Prévisualisation en temps réel

### Problèmes Connus
1. Générateur 3D : Problèmes de rendu et de perspective
2. Convertisseur PI1 : Qualité de conversion à améliorer
3. Éditeur de Sprites : Fonctionnalités avancées manquantes
4. Gestionnaire de Palettes : Optimisation limitée

### Prochaines Étapes Prioritaires
1. Amélioration du convertisseur PI1 :
   - Implémentation du dithering
   - Optimisation de la palette
   - Support du chargement des fichiers PI1 existants

2. Finalisation du générateur 3D :
   - Correction des problèmes de rendu
   - Amélioration de la gestion de la caméra
   - Finalisation de l'export en assembleur

3. Développement de l'éditeur de sprites :
   - Implémentation des masques de collision
   - Support de l'animation
   - Outils de manipulation avancés

4. Enrichissement du gestionnaire de palettes :
   - Import de palettes existantes
   - Algorithmes d'optimisation avancés
   - Prévisualisation en contexte