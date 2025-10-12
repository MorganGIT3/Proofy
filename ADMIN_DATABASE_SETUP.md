# Configuration de la Base de Données Admin

## Script SQL pour Supabase

Copiez et exécutez ce script dans l'éditeur SQL de Supabase pour créer la table nécessaire au dashboard admin.

### 1. Créer la table admin_call_stats

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

-- Policy pour permettre à tout le monde de lire (les admins ont besoin de voir les stats)
CREATE POLICY "Allow public read access" ON public.admin_call_stats
    FOR SELECT USING (true);

-- Policy pour permettre les insertions
CREATE POLICY "Allow insert for authenticated users" ON public.admin_call_stats
    FOR INSERT WITH CHECK (true);

-- Policy pour permettre les mises à jour
CREATE POLICY "Allow update for authenticated users" ON public.admin_call_stats
    FOR UPDATE USING (true);

-- Créer un index pour les requêtes
CREATE INDEX IF NOT EXISTS idx_admin_call_stats_admin_name ON public.admin_call_stats(admin_name);

-- Insérer les données initiales pour Yohan et Morgan
INSERT INTO public.admin_call_stats (admin_name, call_count, weekly_count)
VALUES 
    ('Yohan', 0, 0),
    ('Morgan', 0, 0)
ON CONFLICT (admin_name) DO NOTHING;
```

### 2. Fonction pour réinitialiser les compteurs hebdomadaires (optionnel)

Cette fonction peut être appelée chaque lundi pour réinitialiser les compteurs de la semaine.

```sql
-- Fonction pour réinitialiser les compteurs hebdomadaires
CREATE OR REPLACE FUNCTION reset_weekly_call_counts()
RETURNS void AS $$
BEGIN
    UPDATE public.admin_call_stats
    SET weekly_count = 0,
        last_updated = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 3. Automatisation du reset hebdomadaire (optionnel avec pg_cron)

Si vous avez pg_cron activé dans Supabase, vous pouvez automatiser le reset :

```sql
-- Programmer le reset tous les lundis à 00:00
SELECT cron.schedule(
    'reset-weekly-calls',
    '0 0 * * 1',
    'SELECT reset_weekly_call_counts();'
);
```

## Comment utiliser

1. Connectez-vous à votre projet Supabase
2. Allez dans `SQL Editor`
3. Créez une nouvelle requête
4. Copiez-collez le script de la section 1
5. Cliquez sur `Run` pour exécuter
6. (Optionnel) Ajoutez les sections 2 et 3 pour l'automatisation

## Fonctionnalités du Dashboard Admin

✅ **Compteurs individuels** : Yohan et Morgan avec boutons +1 appel
✅ **Statistiques globales** : Total, cette semaine, utilisateurs, moyenne par coach
✅ **Graphiques** : Bar chart et pie chart pour visualiser la répartition
✅ **Liste utilisateurs** : Tous les comptes créés avec nombre d'appels réservés
✅ **Design moderne** : Animations Framer Motion, dégradés, cards esthétiques
✅ **Responsive** : Fonctionne sur desktop et mobile

## Reset manuel des compteurs hebdomadaires

Si vous voulez réinitialiser manuellement les compteurs de la semaine :

```sql
UPDATE public.admin_call_stats
SET weekly_count = 0,
    last_updated = NOW();
```

## Accès au Dashboard Admin

1. Allez sur votre app sur `http://localhost:3000`
2. Utilisez un des codes admin :
   - `admin123`
   - `smartapp2024`
   - `academy2024`
   - `master2024` (Super Admin)
   - `superadmin` (Super Admin)

## Notes importantes

- Les données sont sauvegardées en temps réel dans Supabase
- Le bouton "+1 Appel" met à jour immédiatement les compteurs
- Le reset hebdomadaire peut être fait manuellement ou automatiquement
- Les utilisateurs listés sont ceux inscrits via Supabase Auth
- Le nombre d'appels par utilisateur est compté depuis la table `call_history`

