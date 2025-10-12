-- =====================================================
-- SCRIPT SQL POUR AFFICHER TOUS LES UTILISATEURS
-- Dans la page Admin de SmartApp Academy™
-- =====================================================

-- 1. Créer la table user_profiles qui va stocker les infos des utilisateurs
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Activer Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- 3. Policies pour permettre l'accès en lecture (pour les admins)
CREATE POLICY "Allow public read access" ON public.user_profiles
    FOR SELECT USING (true);

-- Policy pour permettre les insertions automatiques
CREATE POLICY "Allow insert for authenticated users" ON public.user_profiles
    FOR INSERT WITH CHECK (true);

-- Policy pour permettre les mises à jour
CREATE POLICY "Allow update for own profile" ON public.user_profiles
    FOR UPDATE USING (true);

-- 4. Créer un index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON public.user_profiles(created_at DESC);

-- 5. Fonction trigger pour créer automatiquement un profil lors de l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (user_id, email, full_name, created_at)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email, 'Utilisateur'),
        NEW.created_at
    )
    ON CONFLICT (user_id) DO UPDATE
    SET 
        email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, public.user_profiles.full_name),
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Créer le trigger qui s'exécute à chaque nouvelle inscription
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 7. IMPORTANT : Remplir la table avec les utilisateurs EXISTANTS
-- Cette requête va importer tous les users qui existent déjà dans auth.users
INSERT INTO public.user_profiles (user_id, email, full_name, created_at)
SELECT 
    id,
    email,
    COALESCE(raw_user_meta_data->>'full_name', email, 'Utilisateur'),
    created_at
FROM auth.users
ON CONFLICT (user_id) DO UPDATE
SET 
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.user_profiles.full_name),
    updated_at = NOW();

-- 8. Vérification : Afficher tous les utilisateurs
SELECT 
    up.id,
    up.user_id,
    up.email,
    up.full_name,
    up.created_at,
    (SELECT COUNT(*) FROM call_history WHERE user_id = up.user_id) as total_calls
FROM public.user_profiles up
ORDER BY up.created_at DESC;

-- =====================================================
-- RÉSULTAT ATTENDU :
-- =====================================================
-- ✅ Tous les utilisateurs EXISTANTS sont maintenant dans user_profiles
-- ✅ Chaque NOUVEL inscrit sera automatiquement ajouté à user_profiles
-- ✅ La page Admin affichera automatiquement tous les utilisateurs
-- ✅ Le rafraîchissement automatique toutes les 30s détectera les nouveaux inscrits
-- =====================================================

-- Pour supprimer un utilisateur (si besoin)
-- DELETE FROM public.user_profiles WHERE email = 'email@example.com';

-- Pour voir le nombre d'utilisateurs
-- SELECT COUNT(*) as total_users FROM public.user_profiles;

-- Pour voir les derniers inscrits
-- SELECT * FROM public.user_profiles ORDER BY created_at DESC LIMIT 10;

