# 🚀 Guide de Déploiement Vercel - RizeAppHub™

## 📋 Prérequis

- Compte Vercel (gratuit)
- Projet GitHub connecté
- Variables d'environnement Supabase

## 🔧 Configuration Vercel

### 1. Connexion GitHub
1. Allez sur [vercel.com](https://vercel.com)
2. Connectez-vous avec votre compte GitHub
3. Importez le projet `RizeLabApp-`

### 2. Configuration du Projet
- **Framework Preset**: Vite
- **Root Directory**: `RizeApp™ V1 MVP`
- **Build Command**: `npm run vercel-build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3. Variables d'Environnement
Dans les paramètres du projet Vercel, ajoutez :

```
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## 🎯 Déploiement Automatique

Une fois configuré, chaque push sur la branche `main` déclenchera automatiquement un nouveau déploiement.

## 📱 URLs de Déploiement

- **Production**: `https://rizeapphub.vercel.app` (ou votre domaine personnalisé)
- **Preview**: Chaque PR génère une URL de prévisualisation unique

## 🛠️ Commandes Utiles

```bash
# Test local avant déploiement
npm run build
npm run preview

# Vérification du build
npm run check
```

## 🐛 Dépannage

### Build Failed
- Vérifiez les variables d'environnement
- Assurez-vous que toutes les dépendances sont installées
- Consultez les logs de build dans Vercel

### Variables d'Environnement
- Utilisez le préfixe `VITE_` pour les variables client
- Redéployez après modification des variables

## ✨ Fonctionnalités Déployées

- ✅ Dashboard avec barre iOS
- ✅ Navigation responsive
- ✅ Authentification Supabase
- ✅ Réservation d'appels
- ✅ Interface moderne

---

**🎉 Votre RizeAppHub™ sera accessible en ligne en quelques minutes !**
