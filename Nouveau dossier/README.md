# Proofy Dashboard Editor - Extension Chrome

Extension Chrome pour modifier et personnaliser vos dashboards Beacons directement dans votre navigateur.

## 🚀 Fonctionnalités

- **Mode Sélection** : Cliquez sur n'importe quel élément de la page pour le sélectionner
- **Mode Édition** : Modifiez les valeurs des éléments sélectionnés
- **Sauvegarde persistante** : Les modifications sont sauvegardées et restaurées automatiquement
- **Types de modifications** :
  - Texte
  - HTML
  - Valeur (input/textarea)
  - Nombre
  - Style CSS
- **Gestion des modifications** : Liste, chargement et suppression des modifications

## 📦 Installation

### Pour le développement (mode développeur)

1. Ouvrez Chrome et allez sur `chrome://extensions/`
2. Activez le "Mode développeur" (en haut à droite)
3. Cliquez sur "Charger l'extension non empaquetée"
4. Sélectionnez le dossier de l'extension

### Pour la publication sur Chrome Web Store

1. Créez un fichier ZIP avec tous les fichiers de l'extension
2. Allez sur [Chrome Web Store Developer Dashboard](https://chromewebstore.google.com/)
3. Cliquez sur "Nouvel élément"
4. Uploadez le fichier ZIP
5. Remplissez les informations requises
6. Soumettez pour review

## 🎯 Utilisation

1. **Ouvrir l'extension** : Cliquez sur l'icône Proofy dans la barre d'outils Chrome
2. **Sélectionner un élément** :
   - Cliquez sur le bouton "Sélectionner"
   - Cliquez sur l'élément de la page que vous voulez modifier
   - Le sélecteur CSS sera automatiquement rempli
3. **Modifier** :
   - Choisissez le type de modification
   - Entrez la nouvelle valeur
   - Cliquez sur "Appliquer"
4. **Gérer les modifications** :
   - Consultez la liste des modifications
   - Rechargez une modification précédente
   - Supprimez les modifications

## 📁 Structure des fichiers

```
Nouveau dossier/
├── manifest.json          # Configuration de l'extension
├── popup.html              # Interface de l'extension
├── popup.js                # Logique de l'interface
├── popup.css               # Styles de l'interface
├── content-script.js       # Script injecté dans les pages
├── background.js           # Service worker
├── inject.css              # Styles injectés
├── icons/                  # Icônes de l'extension
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md              # Ce fichier
```

## 🔧 Configuration

L'extension fonctionne sur toutes les pages web. Pour restreindre à certains domaines, modifiez `host_permissions` dans `manifest.json`.

## 📝 Notes

- Les modifications sont sauvegardées localement dans Chrome Storage
- Les modifications persistent même après un rafraîchissement de la page
- L'extension détecte automatiquement le type d'élément (input, texte, etc.)

## 🐛 Dépannage

Si l'extension ne fonctionne pas :
1. Vérifiez que le mode développeur est activé
2. Rechargez l'extension dans `chrome://extensions/`
3. Vérifiez la console pour les erreurs (F12)

## 📄 Licence

Propriétaire - Proofy







