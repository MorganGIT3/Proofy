# Instructions pour créer les icônes optimisées

Les icônes actuelles sont trop grandes (7 MB chacune). Vous devez créer des icônes optimisées.

## Option 1 : Utiliser un outil en ligne (RECOMMANDÉ)

1. Allez sur https://www.iloveimg.com/resize-image ou https://tinypng.com/
2. Uploadez votre `favicon.png` depuis `client/public/favicon.png`
3. Créez 3 versions :
   - **16x16 pixels** → sauvegardez comme `icon16.png`
   - **48x48 pixels** → sauvegardez comme `icon48.png`
   - **128x128 pixels** → sauvegardez comme `icon128.png`
4. Remplacez les fichiers dans le dossier `icons/`

## Option 2 : Utiliser Photoshop/GIMP

1. Ouvrez `client/public/favicon.png`
2. Redimensionnez à 16x16, exportez comme `icon16.png`
3. Redimensionnez à 48x48, exportez comme `icon48.png`
4. Redimensionnez à 128x128, exportez comme `icon128.png`
5. Remplacez les fichiers dans le dossier `icons/`

## Option 3 : Utiliser PowerShell (si ImageMagick est installé)

```powershell
magick convert "..\client\public\favicon.png" -resize 16x16 icons\icon16.png
magick convert "..\client\public\favicon.png" -resize 48x48 icons\icon48.png
magick convert "..\client\public\favicon.png" -resize 128x128 icons\icon128.png
```

## Vérification

Après avoir créé les nouvelles icônes, vérifiez que chaque fichier fait moins de 50 KB :
- `icon16.png` : ~1-5 KB
- `icon48.png` : ~3-10 KB
- `icon128.png` : ~5-20 KB

## Ensuite

Une fois les icônes optimisées, recréez le ZIP :
```powershell
Remove-Item "proofy-extension.zip" -ErrorAction SilentlyContinue
Compress-Archive -Path "manifest.json","popup.html","popup.js","popup.css","content-script.js","background.js","inject.css","icons" -DestinationPath "proofy-extension.zip" -Force
```

Le ZIP devrait maintenant faire moins de 100 KB !







