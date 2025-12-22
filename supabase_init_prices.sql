-- Script d'initialisation des prix Stripe
-- À exécuter après avoir créé la table stripe_prices

-- Insérer les prix pour le plan BASIC
INSERT INTO stripe_prices (plan_name, monthly_price_id, yearly_price_id)
VALUES (
  'BASIC',
  'price_1SgTSeKyD3XymMgUIEVUKACt',  -- BASIC mensuel
  'price_1SgygLKyD3XymMgU8U6YaYvx'   -- BASIC annuel
)
ON CONFLICT (plan_name) 
DO UPDATE SET
  monthly_price_id = EXCLUDED.monthly_price_id,
  yearly_price_id = EXCLUDED.yearly_price_id,
  updated_at = NOW();

-- Insérer les prix pour le plan LIVE
INSERT INTO stripe_prices (plan_name, monthly_price_id, yearly_price_id)
VALUES (
  'LIVE',
  'price_1SgTTxKyD3XymMgU2foMS1Y5',  -- LIVE mensuel
  'price_1SgyfkKyD3XymMgUwIGfd7aV'   -- LIVE annuel
)
ON CONFLICT (plan_name) 
DO UPDATE SET
  monthly_price_id = EXCLUDED.monthly_price_id,
  yearly_price_id = EXCLUDED.yearly_price_id,
  updated_at = NOW();
