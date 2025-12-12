# Instructions pour publier l'extension sur Chrome Web Store

## ⚠️ ÉTAPE 1 : Activer la validation en deux étapes (OBLIGATOIRE)

Google exige que vous activiez la validation en deux étapes sur votre compte Google avant de pouvoir publier une extension.

### Comment activer la validation en deux étapes :

1. **Allez sur votre compte Google** : https://myaccount.google.com/
2. **Sécurité** → Cliquez sur "Validation en deux étapes"
3. **Suivez les instructions** pour configurer :
   - Téléphone (SMS ou appel)
   - Application d'authentification (Google Authenticator, etc.)
4. **Activez la validation en deux étapes**

⚠️ **Important** : Sans cette étape, vous ne pourrez PAS publier l'extension.

---

## 📦 ÉTAPE 2 : Créer le fichier ZIP

### Option A : Automatique (déjà fait)
Un fichier `proofy-extension.zip` a été créé à la racine du projet.

### Option B : Manuel
1. Sélectionnez tous les fichiers dans le dossier "Nouveau dossier"
2. Clic droit → "Envoyer vers" → "Dossier compressé"
3. Renommez le fichier en `proofy-extension.zip`

### ⚠️ IMPORTANT : Ne PAS inclure
- Le dossier `.git` (si présent)
- Le fichier `README.md` (optionnel, mais pas nécessaire)
- Les fichiers de développement (`.vscode`, etc.)

### ✅ Fichiers à inclure OBLIGATOIREMENT :
- ✅ `manifest.json`
- ✅ `popup.html`
- ✅ `popup.js`
- ✅ `popup.css`
- ✅ `content-script.js`
- ✅ `background.js`
- ✅ `inject.css`
- ✅ `icons/` (dossier avec les 3 icônes)

---

## 🚀 ÉTAPE 3 : Publier sur Chrome Web Store

1. **Allez sur** : https://chromewebstore.google.com/
2. **Cliquez sur "Developer Dashboard"** (en haut à droite)
3. **Assurez-vous d'être connecté** avec votre compte Google
4. **Cliquez sur "Nouvel élément"**
5. **Acceptez les conditions** du développeur
6. **Uploadez le fichier ZIP** `proofy-extension.zip`
7. **Remplissez les informations** :

### Informations requises :

**Nom** : `Proofy Dashboard Editor`

**Description courte** (132 caractères max) :
```
Modifiez et personnalisez vos dashboards Beacons directement dans votre navigateur
```

**Description détaillée** :
```
Proofy Dashboard Editor est une extension Chrome qui vous permet de modifier et personnaliser vos dashboards Beacons en temps réel.

🎯 FONCTIONNALITÉS :
• Mode sélection : Cliquez sur n'importe quel élément pour le sélectionner
• Mode édition : Modifiez les valeurs des éléments sélectionnés
• Sauvegarde persistante : Les modifications sont sauvegardées automatiquement
• Types de modifications : Texte, HTML, Valeur, Nombre, Style CSS
• Gestion des modifications : Liste, chargement et suppression

💾 PERSISTANCE :
Les modifications sont sauvegardées localement et restaurées automatiquement même après un rafraîchissement de la page.

🔧 UTILISATION :
1. Cliquez sur l'icône Proofy dans la barre d'outils
2. Sélectionnez un élément sur la page
3. Modifiez sa valeur
4. Les modifications sont automatiquement sauvegardées

Cette extension est conçue pour les utilisateurs de Proofy qui souhaitent personnaliser leurs dashboards Beacons.
```

**Catégorie** : `Productivity` ou `Tools`

**Langue** : Français (France)

**Screenshots** (obligatoires) :
- Minimum 1 screenshot (1280x800 ou 640x400)
- Recommandé : 3-5 screenshots montrant :
  1. L'interface de l'extension
  2. Le mode sélection en action
  3. Une modification appliquée
  4. La liste des modifications

**Icônes** : Déjà incluses dans le ZIP

8. **Soumettez pour review**

---

## ⏱️ Délai de review

- **Première soumission** : 1-3 jours
- **Mises à jour** : Généralement plus rapide

---

## ❌ Erreurs courantes

### "Un problème est survenu lors de l'importation"
- ✅ Vérifiez que la validation en deux étapes est activée
- ✅ Vérifiez que le ZIP contient bien `manifest.json` à la racine
- ✅ Vérifiez que toutes les icônes sont présentes
- ✅ Vérifiez que le `manifest.json` est valide (pas d'erreurs JSON)

### "Manifest invalide"
- ✅ Vérifiez la syntaxe JSON du `manifest.json`
- ✅ Vérifiez que tous les fichiers référencés existent
- ✅ Vérifiez que les permissions sont correctes

---

## 📞 Support

Si vous rencontrez des problèmes, vérifiez :
1. La console Chrome (F12) pour les erreurs
2. La page `chrome://extensions/` pour les erreurs de chargement
3. Les logs du Developer Dashboard

---

**Bon courage pour la publication ! 🚀**







