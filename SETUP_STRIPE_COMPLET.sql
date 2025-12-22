-- ============================================
-- SCHÉMA COMPLET SYSTÈME D'ABONNEMENT STRIPE
-- Exécuter ce fichier dans Supabase SQL Editor
-- ============================================

-- Supprimer les tables si elles existent (pour réinitialisation propre)
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS stripe_prices CASCADE;

-- ============================================
-- TABLE : subscriptions
-- Stocke les abonnements des utilisateurs
-- IMPORTANT : Pas d'entrée = utilisateur FREE
-- ============================================

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT UNIQUE,
  stripe_product_id TEXT,
  plan_name TEXT CHECK (plan_name IN ('BASIC', 'LIVE')),
  billing_period TEXT CHECK (billing_period IN ('monthly', 'yearly')),
  status TEXT NOT NULL DEFAULT 'inactive' CHECK (status IN (
    'active', 
    'trialing', 
    'canceled', 
    'past_due', 
    'unpaid', 
    'incomplete', 
    'incomplete_expired',
    'inactive'
  )),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Un seul abonnement par utilisateur
  UNIQUE(user_id)
);

-- Index pour performance
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);

-- ============================================
-- TABLE : stripe_prices
-- Configuration des prix Stripe
-- ============================================

CREATE TABLE stripe_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_name TEXT NOT NULL UNIQUE CHECK (plan_name IN ('BASIC', 'LIVE')),
  stripe_product_id TEXT NOT NULL,
  monthly_price_id TEXT NOT NULL,
  yearly_price_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TRIGGER : Mise à jour automatique de updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_prices ENABLE ROW LEVEL SECURITY;

-- Politique subscriptions : utilisateur voit UNIQUEMENT son abonnement
DROP POLICY IF EXISTS "Users can view own subscription" ON subscriptions;
CREATE POLICY "Users can view own subscription" ON subscriptions
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = user_id);

-- Politique subscriptions : service role peut tout faire (pour webhooks)
DROP POLICY IF EXISTS "Service role can manage all subscriptions" ON subscriptions;
CREATE POLICY "Service role can manage all subscriptions" ON subscriptions
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Politique stripe_prices : tout le monde peut lire (pas de données sensibles)
DROP POLICY IF EXISTS "Anyone can read stripe prices" ON stripe_prices;
CREATE POLICY "Anyone can read stripe prices" ON stripe_prices
  FOR SELECT 
  TO authenticated, anon
  USING (true);

-- ============================================
-- INSERTION DES PRIX STRIPE
-- ============================================

INSERT INTO stripe_prices (plan_name, stripe_product_id, monthly_price_id, yearly_price_id)
VALUES 
  ('BASIC', 'prod_TdkyrPJG2Ufql5', 'price_1SgTSeKyD3XymMgUIEVUKACt', 'price_1SgygLKyD3XymMgU8U6YaYvx'),
  ('LIVE', 'prod_Tdkz62nKBiBCRj', 'price_1SgTTxKyD3XymMgU2foMS1Y5', 'price_1SgyfkKyD3XymMgUwIGfd7aV')
ON CONFLICT (plan_name) DO UPDATE SET
  stripe_product_id = EXCLUDED.stripe_product_id,
  monthly_price_id = EXCLUDED.monthly_price_id,
  yearly_price_id = EXCLUDED.yearly_price_id;

-- ============================================
-- VÉRIFICATION
-- ============================================

-- Afficher les tables créées
SELECT 'Tables créées avec succès!' AS status;
SELECT * FROM stripe_prices;
