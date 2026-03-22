<div align="center">
  <img src="src-tauri/icons/smarthub.png" width="96" height="96" style="border-radius: 20px" />
  <h1>smarthub</h1>
  <p>Lanceur de services de streaming — propulsé par Tauri v2 + React</p>

  ![Version](https://img.shields.io/badge/version-0.1.0-red?style=flat-square)
  ![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows-black?style=flat-square)
  ![License](https://img.shields.io/badge/license-private-grey?style=flat-square)
  ![Build](https://img.shields.io/github/actions/workflow/status/Fitarozz/smarthub/build.yml?style=flat-square&label=build)
</div>

---

## Aperçu

**smarthub** est une application bureau conçue pour les écrans OLED. Elle centralise tes services de streaming sur une interface épurée, noire et animée — pensée pour être utilisée depuis le canapé.

Chaque service s'ouvre dans une webview native qui conserve tes sessions (cookies). Un bouton discret `← Menu` apparaît en mouvement dès que tu approches le coin supérieur gauche.

---

## Services inclus

| Service | URL |
|---|---|
| 🎬 Netflix | netflix.com |
| 🏰 Disney+ | disneyplus.com |
| 📦 Prime Video | primevideo.com |
| ▶️ YouTube | youtube.com |
| 🍥 Crunchyroll | crunchyroll.com |
| 🎭 Max (HBO) | max.com |

> Tu peux ajouter tes propres services via les **Paramètres** directement dans l'app.

---

## Fonctionnalités

- **OLED-first** — fond `#000000` pur, aucun gradient
- **Webview native** — chaque service dans son propre contexte, cookies conservés
- **Overlay animé** — bouton retour framer-motion, déclenché par le coin supérieur gauche
- **Barre de titre custom** — logo + nom dans la titlebar macOS nativement intégrée
- **Fullscreen** — la barre disparaît automatiquement en plein écran
- **Cartes animées** — entrée en stagger, hover scale+glow, tap feedback
- **Services personnalisés** — ajout/suppression via l'interface Paramètres

---

## Stack

| Technologie | Rôle |
|---|---|
| [Tauri v2](https://tauri.app) | Runtime natif macOS / Windows |
| [React 19](https://react.dev) | UI |
| [TypeScript](https://typescriptlang.org) | Typage |
| [Vite 7](https://vitejs.dev) | Bundler |
| [Framer Motion](https://www.framer.com/motion/) | Animations |
| [@tauri-apps/plugin-store](https://github.com/tauri-apps/plugins-workspace) | Persistance des services custom |

---

## Installation & développement

### Prérequis

- Node.js ≥ 20
- Rust (stable) — [rustup.rs](https://rustup.rs)
- Xcode Command Line Tools (macOS)

### Démarrage

```bash
git clone https://github.com/Fitarozz/smarthub.git
cd smarthub
npm install
npm run tauri dev
```

### Build de production

```bash
# macOS
npm run tauri build

# Windows (via GitHub Actions)
git tag v0.1.0 && git push origin v0.1.0
```

Le `.dmg` (macOS) et le `.msi` / `.exe` (Windows) sont générés dans `src-tauri/target/release/bundle/`.

---

## CI / CD

Le workflow [`.github/workflows/build.yml`](.github/workflows/build.yml) build automatiquement sur **macOS** et **Windows** à chaque push de tag `v*` ou via le bouton **Run workflow** sur GitHub Actions.

Les artefacts (`.dmg`, `.msi`, `.exe`) sont téléchargeables directement depuis l'onglet **Actions**.

---

## Structure du projet

```
src/
├── components/
│   ├── Home.tsx          # Écran principal avec la grille
│   ├── ServiceTile.tsx   # Carte de service animée
│   ├── OverlayEntry.tsx  # Bouton retour flottant
│   ├── PlayerOverlay.tsx
│   └── Settings.tsx
├── data/services.ts      # Catalogue de services
├── hooks/useWebviews.ts  # Gestion des webviews Tauri
└── App.tsx
src-tauri/
├── capabilities/         # Permissions Tauri
├── icons/                # Icônes app (icns, ico, png)
└── tauri.conf.json
```

---

<div align="center">
  <sub>Fait avec ❤️ pour les écrans noirs</sub>
</div>

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
