# 🎯 Dashboard Admin SmartApp Academy™

## ✨ Fonctionnalités Implémentées

### 📊 Statistiques Globales (4 Cards Premium)

1. **Total des appels** 📞
   - Compteur du nombre total d'appels réalisés
   - Design : Gradient bleu
   - Icône : Phone

2. **Cette semaine** 📅
   - Nombre d'appels de la semaine en cours
   - Reset automatique tous les lundis
   - Design : Gradient vert
   - Icône : Calendar

3. **Utilisateurs** 👥
   - Total des comptes créés dans l'app
   - Design : Gradient violet
   - Icône : Users

4. **Moyenne** 📈
   - Moyenne d'appels par coach
   - Design : Gradient orange
   - Icône : TrendingUp

### 👨‍💼 Compteurs Individuels (Yohan & Morgan)

Chaque coach dispose de :
- **Card personnalisée** avec son prénom
- **Bouton "+1 Appel"** (bleu/violet) pour incrémenter le compteur
- **Bouton "-1 Appel"** (rouge) pour décrémenter le compteur
- **Total d'appels** tous temps
- **Appels de la semaine** en vert
- **Dernière mise à jour** (timestamp)
- **Animation au clic** avec état de chargement
- **Protection contre les négatifs** : le bouton "-1" se désactive à 0

### 📈 Graphiques Interactifs

#### 1. Bar Chart (Répartition des appels)
- Compare les performances de Yohan et Morgan
- 2 barres par coach : Total vs Cette semaine
- Tooltip interactif au survol
- Couleurs : Bleu et vert

#### 2. Pie Chart (Distribution totale)
- Pourcentage des appels par coach
- Labels avec noms et pourcentages
- Tooltip interactif
- Couleurs : Palette de 5 couleurs

### 📋 Liste des Utilisateurs

Tableau complet avec :
- **Email** de l'utilisateur
- **Nom complet** (ou "Sans nom")
- **Date d'inscription** formatée en français
- **Nombre d'appels réservés** avec badge coloré
- **Animation d'entrée** pour chaque ligne
- **Hover effect** pour une meilleure UX

### 🎨 Design & UX

#### Palette de Couleurs
- Fond : Gradient dark (gray-900 → blue-900 → gray-900)
- Cards : Gray-800 avec transparence et backdrop-blur
- Accents : Bleu, vert, violet, orange
- Bordures : Gray-700

#### Animations (Framer Motion)
- Fade-in au chargement
- Slide-in pour les éléments
- Stagger pour les listes
- Smooth transitions

#### Typographie
- Titre : Text-4xl avec gradient text
- Cards : Hiérarchie claire
- Mono pour les codes
- Font weights variés

#### Responsive
- Grid adaptatif (1 col mobile → 4 cols desktop)
- Tableau scrollable sur mobile
- Boutons adaptés
- Spacing cohérent

### 🔒 Sécurité

- **Authentification requise** : Code admin obligatoire
- **Session timeout** : 24h
- **Row Level Security** sur Supabase
- **Permissions vérifiées** avant actions

### ⚡ Performance

- **Chargement optimisé** avec états de loading
- **Requêtes parallèles** pour les données
- **Mise à jour en temps réel** des compteurs
- **Gestion d'erreur** robuste avec fallbacks
- **Indicateurs visuels** pendant les mises à jour

## 🚀 Utilisation

### 1. Configuration de la Base de Données

Suivez les instructions dans `ADMIN_DATABASE_SETUP.md` pour :
- Créer la table `admin_call_stats`
- Configurer les permissions
- Initialiser les données de Yohan et Morgan

### 2. Accès au Dashboard

1. Lancer l'app : `npm run dev -- --port 3000`
2. Aller sur `http://localhost:3000`
3. Cliquer sur "Admin" ou accéder à `/admin`
4. Entrer un code admin :
   - `admin123`
   - `smartapp2024`
   - `academy2024`
   - `master2024`
   - `superadmin`

### 3. Utilisation des Fonctionnalités

#### Gérer les appels
1. Localisez la card du coach (Yohan ou Morgan)
2. **Ajouter un appel** : Cliquez sur le bouton bleu "**+1 Appel**"
3. **Retirer un appel** : Cliquez sur le bouton rouge "**-1 Appel**"
4. Le compteur se met à jour immédiatement
5. Les graphiques se mettent à jour automatiquement

💡 **Astuce** : Le bouton "-1 Appel" se désactive automatiquement quand les compteurs atteignent 0 pour éviter les valeurs négatives

#### Consulter les statistiques
- Les 4 cards en haut affichent les stats globales
- Les graphiques visualisent la répartition
- Le tableau liste tous les utilisateurs

#### Reset hebdomadaire
- Automatique si pg_cron est configuré (chaque lundi 00:00)
- Manuel via requête SQL (voir `ADMIN_DATABASE_SETUP.md`)

## 📱 Responsive Design

### Desktop (> 1024px)
- 4 colonnes pour les stats globales
- 2 colonnes pour les compteurs individuels
- 2 colonnes pour les graphiques
- Tableau pleine largeur

### Tablet (768px - 1024px)
- 2 colonnes pour les stats globales
- 2 colonnes pour les compteurs
- 2 colonnes pour les graphiques

### Mobile (< 768px)
- 1 colonne pour tout
- Tableau scrollable horizontalement
- Boutons pleine largeur

## 🔄 Flux de Données

1. **Chargement initial**
   ```
   AdminDashboard mount
   → getCurrentAdminSession() (vérif auth)
   → loadData()
     → loadAdminStats() (stats Yohan & Morgan)
     → loadUsers() (liste utilisateurs)
   → Affichage avec animations
   ```

2. **Clic sur "+1 Appel"**
   ```
   Clic bouton
   → incrementCallCount(adminName)
   → supabase.update() (BDD)
   → loadAdminStats() (refresh)
   → UI update automatique
   ```

3. **Gestion des erreurs**
   ```
   Si table n'existe pas
   → Utiliser données par défaut
   → Afficher quand même le dashboard
   → Logger les erreurs en console
   ```

## 🎯 Points Clés

✅ **Design moderne et premium** comme le reste de l'app
✅ **Animations fluides** avec Framer Motion
✅ **Données en temps réel** via Supabase
✅ **Gestion d'erreur robuste** avec fallbacks
✅ **Expérience utilisateur optimale** avec feedback visuel
✅ **Code propre et maintenable** avec TypeScript
✅ **Responsive** sur tous les devices
✅ **Sécurisé** avec authentification et RLS

## 🔮 Améliorations Futures Possibles

- [ ] Export des stats en CSV/PDF
- [ ] Filtres par période (semaine, mois, année)
- [ ] Notifications push lors de nouveaux appels
- [ ] Historique détaillé avec timeline
- [ ] Comparaison année N vs N-1
- [ ] Dashboard en temps réel avec WebSockets
- [ ] Rapports automatiques par email
- [ ] Objectifs et gamification

