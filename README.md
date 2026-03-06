# 🌿 L'Encyclopédie des Oiseaux

> Application web full-stack de référence scientifique sur la biodiversité aviaire — identification, catalogue et détection par IA.

---

## 📋 Table des matières

- [Présentation](#présentation)
- [Fonctionnalités](#fonctionnalités)
- [Stack technique](#stack-technique)
- [Structure du projet](#structure-du-projet)
- [Installation](#installation)
- [Lancement](#lancement)
- [Routes API](#routes-api)
- [Pages de l'application](#pages-de-lapplication)
- [Base de données](#base-de-données)

---

## Présentation

L'Encyclopédie des Oiseaux est un projet académique (TP Web) qui permet d'explorer, comparer et identifier des espèces d'oiseaux à travers une interface moderne.

Elle repose sur deux parties :
- Un **backend Flask** (Python) qui expose une API REST connectée à une base de données
- Un **frontend React** (Vite) qui consomme cette API et affiche les données

---

## Fonctionnalités

| Fonctionnalité | Description |
|---|---|
| 🔍 Catalogue | Liste et recherche de toutes les espèces avec filtres et tri |
| 📄 Fiche détail | Informations complètes par espèce (taille, poids, habitat, taxonomie…) |
| 📊 Tableau comparatif | Vue synthétique triable par taille, poids, envergure, longévité |
| 🤖 Détection IA | Upload d'une photo → identification automatique de l'espèce |
| ➕ Ajout d'espèce | Formulaire pour ajouter une nouvelle espèce en base |
| 🖼️ Ajout d'image | Association d'une photo à une espèce existante |
| ℹ️ À propos | Présentation du projet et de la stack technique |

---

## Stack technique

### Backend
- **Python 3.x**
- **Flask** — framework web léger
- **Flask-CORS** — gestion des requêtes cross-origin
- **Base de données** — SQLite ou PostgreSQL (selon configuration)

### Frontend
- **React 18** avec **Vite**
- **React Router v6** — navigation SPA
- **CSS custom** — design system avec variables CSS (pas de framework UI)
- Fonts : **Playfair Display** + **DM Sans** (Google Fonts)

---

## Structure du projet

```
bird-app/
│
├── src/                          # Frontend React
│   ├── App.jsx                   # Router principal
│   ├── App.css                   # Styles globaux (design system)
│   ├── main.jsx                  # Point d'entrée React
│   │
│   ├── components/
│   │   └── Navbar.jsx            # Barre de navigation fixe
│   │
│   ├── pages/
│   │   ├── Home.jsx              # Page d'accueil (hero + recherche)
│   │   ├── BirdsList.jsx         # Grille des espèces
│   │   ├── BirdDetail.jsx        # Fiche détaillée d'une espèce
│   │   ├── Tableau.jsx           # Vue tableau comparatif
│   │   ├── Detect.jsx            # Détection par IA
│   │   ├── AddBird.jsx           # Formulaire ajout espèce
│   │   ├── AddImage.jsx          # Formulaire ajout image
│   │   └── APropos.jsx           # Page à propos
│   │
│   └── services/
│       └── api.jsx               # Couche d'appels HTTP vers le backend
│
└── src/api_oiseaux/
    └── api.py                    # Backend Flask — API REST
```

---

## Installation

### Prérequis

- **Python 3.8+** et **pip**
- **Node.js 18+** et **pnpm** (ou npm)

### 1. Cloner le projet

```bash
git clone <url-du-repo>
cd bird-app
```

### 2. Installer les dépendances backend

```bash
cd src/api_oiseaux
python -m venv .venv
.venv\Scripts\activate       # Windows
# source .venv/bin/activate  # macOS/Linux

pip install flask flask-cors
```

### 3. Installer les dépendances frontend

```bash
cd bird-app   # revenir à la racine
pnpm install
```

---

## Lancement

> ⚠️ Les deux serveurs doivent tourner **en même temps** dans deux terminaux séparés.

### Terminal 1 — Backend Flask

```bash
cd bird-app
python src\api_oiseaux\api.py
```

✅ Le serveur démarre sur : `http://127.0.0.1:5000`

### Terminal 2 — Frontend React

```bash
cd bird-app
pnpm dev
```

✅ L'application est accessible sur : `http://localhost:5173`

---

## Routes API

Base URL : `http://localhost:5000/api`

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/oiseaux` | Récupère toutes les espèces |
| `GET` | `/oiseaux?sort_by=nom_commun` | Espèces triées |
| `GET` | `/oiseaux/:id` | Détail d'une espèce |
| `POST` | `/oiseaux` | Créer une nouvelle espèce |
| `POST` | `/images` | Ajouter une image à une espèce |
| `POST` | `/detect` | Identifier une espèce depuis une photo |

### Exemple de réponse `GET /oiseaux`

```json
{
  "data": [
    {
      "id_espece": 1,
      "nom_commun": "Aigle royal",
      "nom_scientifique": "Aquila chrysaetos",
      "taille_cm": 90,
      "poids_g": 4500,
      "envergure_cm": 210,
      "longevite_ans": 25,
      "statut_conservation": "LC",
      "habitat": "Montagnes",
      "description": "...",
      "image_url": null
    }
  ]
}
```

---

## Pages de l'application

| URL | Composant | Description |
|---|---|---|
| `/` | `Home` | Hero avec photo d'oiseau et barre de recherche |
| `/oiseaux` | `BirdsList` | Grille filtrée et triable de toutes les espèces |
| `/oiseaux/:id` | `BirdDetail` | Fiche complète avec stats, taxonomie, espèces similaires |
| `/tableau` | `Tableau` | Cartes horizontales avec stats comparatives |
| `/detect` | `Detect` | Upload d'image + résultat de détection IA |
| `/ajouter` | `AddBird` | Formulaire de saisie d'une nouvelle espèce |
| `/ajouter-image` | `AddImage` | Formulaire d'ajout d'une image à une espèce |
| `/apropos` | `APropos` | Présentation du projet |

---

## Base de données

### Table `especes`

| Champ | Type | Description |
|---|---|---|
| `id_espece` | INT (PK) | Identifiant unique |
| `nom_commun` | VARCHAR | Nom en français |
| `nom_scientifique` | VARCHAR | Nom latin |
| `taille_cm` | INT | Taille en centimètres |
| `poids_g` | INT | Poids en grammes |
| `envergure_cm` | INT | Envergure en centimètres |
| `longevite_ans` | INT | Espérance de vie |
| `statut_conservation` | VARCHAR | Code UICN (LC / NT / VU / EN / CR / EX) |
| `habitat` | VARCHAR | Milieu de vie |
| `description` | TEXT | Description de l'espèce |
| `id_taxonomie` | INT (FK) | Référence taxonomique |

### Statuts de conservation UICN

| Code | Signification | Couleur |
|---|---|---|
| LC | Préoccupation mineure | 🟢 Vert |
| NT | Quasi menacé | 🟡 Jaune |
| VU | Vulnérable | 🟠 Orange |
| EN | En danger | 🔴 Rouge |
| CR | En danger critique | 🟣 Violet |
| EX | Éteint | 🟤 Marron |

---

*Projet académique — TP Web · 2025*