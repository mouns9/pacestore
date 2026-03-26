# PaceStore — E-commerce Running Expert

## Vision
PaceStore est une boutique en ligne dédiée aux coureurs sérieux. Chaque produit est sélectionné par des experts running pour répondre aux besoins des athlètes, du trail ultramarathon à la piste de compétition.

## Stack technique
- **Framework** : Next.js 14 (App Router)
- **Styling** : Tailwind CSS
- **Langage** : TypeScript
- **Données** : JSON statique (évolutif vers une API / CMS)

## Palette de couleurs
| Rôle       | Valeur    |
|------------|-----------|
| Background | `#0A0A0A` |
| Accent     | `#FF5C00` |
| Texte      | `#FFFFFF` |
| Secondaire | `#1A1A1A` |

## Ton éditorial
Expert, direct, technique. On parle de drop, de stack, de pronation, de VO2max. On ne vend pas des chaussures — on équipe des performances.

## Structure du projet
```
pacestore/
├── app/
│   ├── layout.tsx          # Layout global (fonts, metadata)
│   └── page.tsx            # Homepage : Hero + grille produits
├── components/
│   ├── Hero.tsx            # Bannière principale
│   └── ProductCard.tsx     # Carte produit réutilisable
├── data/
│   └── products.json       # Catalogue produits
├── public/                 # Assets statiques
└── CLAUDE.md               # Ce fichier
```

## Conventions
- Composants en PascalCase, fichiers en camelCase
- Pas de `any` TypeScript — typer explicitement
- Classes Tailwind uniquement, pas de CSS module sauf exception justifiée
- Chaque composant est autonome et ne dépend que de ses props
