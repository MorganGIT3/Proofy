# 🚀 Résumé : Publier l'extension Proofy

## ⚠️ ÉTAPE 1 : Activer la validation en deux étapes (OBLIGATOIRE)

**Google exige cette étape avant de pouvoir publier !**

1. Allez sur : https://myaccount.google.com/security
2. Cliquez sur "Validation en deux étapes"
3. Suivez les instructions pour l'activer
4. ⚠️ **Sans cette étape, vous ne pourrez PAS publier l'extension**

---

## 📦 ÉTAPE 2 : Optimiser les icônes (IMPORTANT)

**Problème actuel** : Les icônes font 7 MB chacune, le ZIP fait 21 MB (trop gros !)

**Solution** : Créez des icônes optimisées (voir `CREER_ICONES.md`)

**Taille cible** :
- `icon16.png` : ~1-5 KB
- `icon48.png` : ~3-10 KB  
- `icon128.png` : ~5-20 KB

**Total ZIP attendu** : < 100 KB

---

## 📦 ÉTAPE 3 : Créer le ZIP final

Une fois les icônes optimisées :

```powershell
cd "Nouveau dossier"
Remove-Item "proofy-extension.zip" -ErrorAction SilentlyContinue
Compress-Archive -Path "manifest.json","popup.html","popup.js","popup.css","content-script.js","background.js","inject.css","icons" -DestinationPath "proofy-extension.zip" -Force
```

**Vérifiez** que le ZIP fait moins de 100 KB.

---

## 🚀 ÉTAPE 4 : Publier sur Chrome Web Store

1. Allez sur : https://chromewebstore.google.com/
2. Cliquez sur **"Developer Dashboard"**
3. Cliquez sur **"Nouvel élément"**
4. **Uploadez** `proofy-extension.zip`
5. **Remplissez** les informations (voir `INSTRUCTIONS_PUBLICATION.md`)
6. **Soumettez** pour review

---

## ✅ Checklist avant publication

- [ ] Validation en deux étapes activée
- [ ] Icônes optimisées (< 50 KB chacune)
- [ ] ZIP créé et testé (< 100 KB)
- [ ] Tous les fichiers présents dans le ZIP
- [ ] Screenshots préparés (1280x800 ou 640x400)
- [ ] Description rédigée

---

## 📞 En cas de problème

**"Un problème est survenu lors de l'importation"** :
- ✅ Vérifiez que la validation en deux étapes est activée
- ✅ Vérifiez que le ZIP est valide (ouvrez-le pour vérifier)
- ✅ Vérifiez que `manifest.json` est à la racine du ZIP

**"Manifest invalide"** :
- ✅ Vérifiez la syntaxe JSON
- ✅ Vérifiez que tous les fichiers référencés existent

---

**Bon courage ! 🎉**







