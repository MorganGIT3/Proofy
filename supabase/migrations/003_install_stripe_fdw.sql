-- ============================================
-- Migration : Installation Stripe Wrapper (FDW)
-- ============================================
-- Ce script installe le Foreign Data Wrapper pour Stripe
-- Permet de lire les données Stripe directement via SQL
-- 
-- IMPORTANT : 
-- 1. La clé API Stripe doit être dans Vault AVANT d'exécuter ce script
--    INSERT INTO vault.secrets (name, secret) VALUES ('stripe_api_key', 'sk_live_xxx');
-- 2. Le FDW peut ne pas être disponible sur tous les plans Supabase
-- 3. Utiliser uniquement pour vérifications ponctuelles, pas pour la logique métier temps réel

-- 1. Activer l'extension wrappers
CREATE EXTENSION IF NOT EXISTS wrappers WITH SCHEMA extensions;

-- 2. Créer le schéma pour les foreign tables
CREATE SCHEMA IF NOT EXISTS stripe_fdw;

-- 3. Créer le Foreign Data Wrapper
CREATE FOREIGN DATA WRAPPER IF NOT EXISTS stripe_wrapper
  HANDLER wrappers_handler
  VALIDATOR wrappers_validator;

-- 4. Créer le serveur avec référence à Vault
DO $$
DECLARE
  secret_id uuid;
BEGIN
  -- Récupérer l'ID du secret depuis Vault
  SELECT id INTO secret_id 
  FROM vault.secrets 
  WHERE name = 'stripe_api_key';
  
  IF secret_id IS NULL THEN
    RAISE EXCEPTION 'Secret stripe_api_key not found in Vault. Please add it first via Dashboard or SQL: INSERT INTO vault.secrets (name, secret) VALUES (''stripe_api_key'', ''sk_live_xxx'');';
  END IF;
  
  -- Créer le serveur
  EXECUTE format(
    'CREATE SERVER IF NOT EXISTS stripe_server FOREIGN DATA WRAPPER stripe_wrapper OPTIONS (api_key_id %L)',
    secret_id::text
  );
  
  RAISE NOTICE 'Stripe server created successfully with secret_id: %', secret_id;
END $$;

-- 5. Créer les foreign tables pour customers
CREATE FOREIGN TABLE IF NOT EXISTS stripe_fdw.customers (
  id text,
  email text,
  name text,
  created bigint,
  metadata jsonb
)
SERVER stripe_server
OPTIONS (object 'customers');

-- 6. Créer les foreign tables pour subscriptions
CREATE FOREIGN TABLE IF NOT EXISTS stripe_fdw.subscriptions (
  id text,
  customer text,
  status text,
  current_period_start bigint,
  current_period_end bigint,
  cancel_at_period_end boolean,
  canceled_at bigint,
  metadata jsonb
)
SERVER stripe_server
OPTIONS (object 'subscriptions');

-- 7. Créer les foreign tables pour invoices
CREATE FOREIGN TABLE IF NOT EXISTS stripe_fdw.invoices (
  id text,
  customer text,
  subscription text,
  status text,
  amount_paid bigint,
  created bigint,
  metadata jsonb
)
SERVER stripe_server
OPTIONS (object 'invoices');

-- 8. Accorder les permissions
GRANT USAGE ON SCHEMA stripe_fdw TO authenticated, service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA stripe_fdw TO authenticated, service_role;

-- 9. Commentaires pour documentation
COMMENT ON SCHEMA stripe_fdw IS 'Foreign Data Wrapper pour accéder aux données Stripe via SQL';
COMMENT ON FOREIGN TABLE stripe_fdw.customers IS 'Foreign table pour lire les customers Stripe (lecture seule)';
COMMENT ON FOREIGN TABLE stripe_fdw.subscriptions IS 'Foreign table pour lire les subscriptions Stripe (lecture seule)';
COMMENT ON FOREIGN TABLE stripe_fdw.invoices IS 'Foreign table pour lire les invoices Stripe (lecture seule)';

-- 10. Exemple d'utilisation (commenté)
-- SELECT id, email, metadata->>'supabase_user_id' as user_id 
-- FROM stripe_fdw.customers 
-- WHERE metadata->>'supabase_user_id' = 'user-uuid-here';
