-- =====================================================
-- FIX : DÉSACTIVER LE TRIGGER QUI CAUSE L'ERREUR
-- =====================================================
-- L'erreur "Database error saving new user" vient du trigger
-- qui essaie de créer automatiquement le profil utilisateur.
-- On va désactiver ce trigger et créer le profil manuellement dans le code.

-- 1. Désactiver le trigger qui cause l'erreur
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. Modifier la policy pour permettre l'insertion sans authentification
-- (pour permettre la création manuelle du profil après inscription)
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON public.user_profiles;
CREATE POLICY "Allow insert for new users" ON public.user_profiles
    FOR INSERT WITH CHECK (true);

-- 3. Vérifier que la table existe
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'user_profiles';

-- =====================================================
-- ✅ LE TRIGGER EST DÉSACTIVÉ
-- Le profil sera maintenant créé manuellement dans le code
-- après l'inscription, exactement comme lors de la connexion.
-- =====================================================

