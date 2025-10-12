# 🚀 Guide de Démarrage Rapide - Dashboard Admin

## 📋 Résumé des Changements

✅ **Page Admin transformée** en tableau de bord de suivi complet
✅ **Compteurs pour Yohan et Morgan** avec boutons +1 appel
✅ **Statistiques globales** (total, semaine, utilisateurs, moyenne)
✅ **Graphiques interactifs** (bar chart + pie chart)
✅ **Liste des utilisateurs** avec nombre d'appels
✅ **Design moderne** avec animations et gradients

## 🎯 Étapes à Suivre

### Étape 1 : Configuration de la Base de Données ⚙️

**Important** : Avant d'utiliser le dashboard, vous devez créer la table dans Supabase.

1. Connectez-vous à votre [Supabase Dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre projet : `kwzurhhbvfkrvhbcdhwi`
3. Allez dans **SQL Editor** (dans le menu à gauche)
4. Créez une nouvelle requête
5. Copiez-collez ce script SQL :

```sql
-- Table pour les statistiques d'appels des admins
CREATE TABLE IF NOT EXISTS public.admin_call_stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_name TEXT NOT NULL UNIQUE,
    call_count INTEGER DEFAULT 0,
    weekly_count INTEGER DEFAULT 0,
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activer Row Level Security
ALTER TABLE public.admin_call_stats ENABLE ROW LEVEL SECURITY;

-- Policies pour les accès
CREATE POLICY "Allow public read access" ON public.admin_call_stats
    FOR SELECT USING (true);

CREATE POLICY "Allow insert for authenticated users" ON public.admin_call_stats
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update for authenticated users" ON public.admin_call_stats
    FOR UPDATE USING (true);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_admin_call_stats_admin_name 
    ON public.admin_call_stats(admin_name);

-- Données initiales
INSERT INTO public.admin_call_stats (admin_name, call_count, weekly_count)
VALUES 
    ('Yohan', 0, 0),
    ('Morgan', 0, 0)
ON CONFLICT (admin_name) DO NOTHING;
```

6. Cliquez sur **Run** (ou Ctrl+Enter)
7. Vérifiez que la requête s'est exécutée avec succès ✅

### Étape 2 : Accéder au Dashboard 🖥️

1. **L'app est déjà lancée** sur `http://localhost:3000` 🎉

2. **Accéder à la page admin** :
   - Option 1 : Allez directement sur `http://localhost:3000/admin-dashboard`
   - Option 2 : Depuis l'app, trouvez le lien "Admin" dans la navigation

3. **Entrer un code admin** :
   ```
   Codes disponibles :
   - admin123
   - smartapp2024
   - academy2024
   - master2024 (Super Admin)
   - superadmin (Super Admin)
   ```

4. **Vous êtes dans le dashboard !** 🎊

### Étape 3 : Utiliser le Dashboard 📊

#### Gérer les appels

1. Trouvez la card de **Yohan** ou **Morgan**
2. **Pour ajouter un appel** : Cliquez sur le bouton bleu **"+1 Appel"**
3. **Pour retirer un appel** : Cliquez sur le bouton rouge **"-1 Appel"**
4. Le compteur se met à jour instantanément
5. Les graphiques se mettent à jour automatiquement

**Note** : Le bouton "-1 Appel" est désactivé quand les compteurs sont à 0 (impossible d'avoir des nombres négatifs)

#### Consulter les stats

- **4 cards en haut** : Vue d'ensemble rapide
  - Total des appels
  - Appels cette semaine
  - Nombre d'utilisateurs
  - Moyenne par coach

- **2 cards au milieu** : Compteurs individuels
  - Yohan et Morgan
  - Boutons d'incrémentation

- **2 graphiques** : Visualisation des données
  - Bar chart : Comparaison des performances
  - Pie chart : Distribution en pourcentage

- **Tableau en bas** : Liste des utilisateurs
  - Email, nom, date d'inscription
  - Nombre d'appels réservés par utilisateur

## 🎨 Ce que Vous Allez Voir

### Design
- **Fond** : Gradient sombre (gris → bleu → gris)
- **Cards** : Transparentes avec effet de flou
- **Couleurs** : Bleu, vert, violet, orange
- **Animations** : Entrées fluides et smooth

### Fonctionnalités Visuelles
- ✨ **Animations** au chargement des éléments
- 🎭 **Effet hover** sur les lignes du tableau
- 🔄 **Loading states** quand on clique sur +1 appel
- 📱 **Responsive** sur tous les écrans

## 🔧 Maintenance

### Reset Hebdomadaire (Chaque Lundi)

**Option 1 : Automatique** (si vous voulez l'automatiser)

Exécutez dans Supabase SQL Editor :

```sql
-- Créer la fonction
CREATE OR REPLACE FUNCTION reset_weekly_call_counts()
RETURNS void AS $$
BEGIN
    UPDATE public.admin_call_stats
    SET weekly_count = 0,
        last_updated = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Programmer le reset tous les lundis à 00:00
SELECT cron.schedule(
    'reset-weekly-calls',
    '0 0 * * 1',
    'SELECT reset_weekly_call_counts();'
);
```

**Option 2 : Manuel** (si vous préférez le faire vous-même)

Chaque lundi, exécutez :

```sql
UPDATE public.admin_call_stats
SET weekly_count = 0,
    last_updated = NOW();
```

### Ajouter un Nouveau Coach

Si vous voulez ajouter un 3ème coach :

```sql
INSERT INTO public.admin_call_stats (admin_name, call_count, weekly_count)
VALUES ('Nouveau_Coach', 0, 0);
```

## 📝 Rappels Importants

1. **Base de données requise** : La table `admin_call_stats` DOIT être créée dans Supabase
2. **Code admin requis** : Utiliser un des codes fournis pour accéder
3. **Session 24h** : La session admin expire après 24 heures
4. **Données persistantes** : Tous les compteurs sont sauvegardés en base de données

## 🆘 Dépannage

### Le dashboard ne charge pas
- Vérifiez que la table `admin_call_stats` existe dans Supabase
- Le dashboard fonctionnera quand même avec des données par défaut si la table n'existe pas

### Les compteurs ne s'incrémentent pas
- Vérifiez la connexion à Supabase
- Regardez la console du navigateur (F12) pour les erreurs
- Vérifiez que les policies Supabase sont bien configurées

### La liste des utilisateurs est vide
- C'est normal si aucun utilisateur ne s'est inscrit
- Les utilisateurs apparaîtront automatiquement après inscription

## 🎉 C'est Tout !

Vous avez maintenant un **dashboard admin professionnel** pour suivre :
- ✅ Les appels de Yohan et Morgan
- ✅ Les inscriptions d'utilisateurs
- ✅ Les performances de la semaine
- ✅ Les statistiques globales

**Bon suivi des appels !** 📞✨

