# 🔧 FIX : Erreur "Database error saving new user"

## Problème identifié

L'erreur **"Database error saving new user"** vient du **trigger SQL** dans Supabase qui essaie de créer automatiquement le profil utilisateur lors de l'inscription. Ce trigger échoue et bloque toute l'inscription.

## Solution : Désactiver le trigger SQL

Le profil utilisateur sera créé manuellement dans le code (comme lors de la connexion), ce qui est plus fiable.

### Étape 1 : Aller dans Supabase Dashboard

1. Allez sur [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre projet
3. Allez dans **SQL Editor** (dans la barre latérale gauche)

### Étape 2 : Exécuter ce script SQL

Copiez et exécutez ce script dans le SQL Editor :

```sql
-- Désactiver le trigger qui cause l'erreur
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Vérifier que le trigger est bien supprimé
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
```

Si la requête ne retourne aucun résultat, le trigger est bien désactivé ✅

### Étape 3 : Vérifier les policies RLS

Assurez-vous que la policy permet l'insertion :

```sql
-- Vérifier les policies existantes
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'user_profiles';

-- Si la policy n'existe pas ou bloque l'insertion, créer/modifier :
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON public.user_profiles;
DROP POLICY IF EXISTS "Allow insert for new users" ON public.user_profiles;

CREATE POLICY "Allow insert for new users" ON public.user_profiles
    FOR INSERT WITH CHECK (true);
```

### Étape 4 : Tester l'inscription

1. Retournez dans votre app
2. Testez la création d'un compte avec `test515@gmail.com`
3. Le compte devrait être créé dans Supabase Auth
4. Le profil sera créé automatiquement dans le code

## Comment ça fonctionne maintenant

1. **Inscription** : Crée le compte dans Supabase Auth
2. **Profil** : Créé manuellement dans le code (dans `signUpUser` ou lors de la première connexion)
3. **Connexion** : Vérifie et crée le profil si nécessaire (comme avant)

## Vérification

Après avoir désactivé le trigger, vérifiez dans Supabase Dashboard :

1. **Authentication → Users** : Le compte devrait apparaître
2. **Table Editor → user_profiles** : Le profil devrait être créé (soit par le code, soit lors de la première connexion)

## Si ça ne marche toujours pas

Si l'erreur persiste après avoir désactivé le trigger :

1. Vérifiez les logs dans la console du navigateur
2. Vérifiez dans Supabase Dashboard si le compte est créé malgré l'erreur
3. Vérifiez les policies RLS dans **Authentication → Policies**

