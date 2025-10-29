# Secret Santa Matcher

Ein Expo-Projekt, mit dem du dein Wichteln organisieren kannst. Die Web-Version lässt sich mit GitHub Actions automatisch auf GitHub Pages ausrollen.

## Features

- Schritt-für-Schritt-Flow: Landing Page, Teilnehmer:innen erfassen, Zuordnungen aufdecken
- Ausschlussregeln je Person (Selbst, Partner:in sowie optionale weitere Namen)
- Automatisch generierte Reveal-Links unter `https://nilsbaumgartner1994.github.io/secret-santa-matcher/reveal/<hash>`
- Deployment-Workflow für GitHub Pages (`main`-Branch)

## Entwicklung

```bash
npm install
npm run web
```

Die App startet anschließend im Browser unter `http://localhost:8081`.

## Produktion / GitHub Pages

Der Workflow `.github/workflows/deploy.yml` erstellt bei jedem Push auf `main` ein statisches Web-Bundle und veröffentlicht es auf GitHub Pages. Lokal kannst du denselben Schritt mit

```bash
npm run build:web
```

ausführen. Das Ergebnis landet im Verzeichnis `dist/`.
