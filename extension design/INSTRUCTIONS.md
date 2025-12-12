# Instructions d'utilisation

## Installation

1. Copiez le fichier `favicon.png` depuis `client/public/favicon.png` vers le dossier `extension design/`
   ```bash
   cp ../client/public/favicon.png ./favicon.png
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

## Développement

Pour lancer le serveur de développement :
```bash
npm run dev
```

## Structure des fichiers

- `Popup.tsx` - Composant principal qui gère la navigation
- `WelcomePage.tsx` - Page d'accueil avec logo et bouton "Fake it"
- `LoginPage.tsx` - Page de connexion
- `SettingsPage.tsx` - Page de paramètres avec checkboxes

## Pages

### 1. Welcome Page
- Logo Proofy
- Texte principal avec soulignement animé orange
- Bouton "Fake it" avec effet shimmer

### 2. Login Page
- Options de connexion : Google, Apple, Email
- Bouton retour vers la page d'accueil
- Design cohérent avec la landing page

### 3. Settings Page
- Liste de paramètres avec checkboxes stylisées
- Options : Editor Mode, Auto-save, Notifications, etc.
- Bouton "Enregistrer les paramètres"

## Export pour un autre projet

Pour exporter ce code dans un autre projet :

1. Copiez tout le dossier `extension design/`
2. Assurez-vous d'avoir le fichier `favicon.png` dans le dossier
3. Installez les dépendances dans le nouveau projet
4. Adaptez les chemins si nécessaire

## Notes

- Le design utilise Framer Motion pour les animations
- Tailwind CSS pour le styling
- Le style est cohérent avec la landing page Proofy
- Les couleurs principales sont le noir et l'orange (#ff6b35)

