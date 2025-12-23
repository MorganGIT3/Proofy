-- ============================================
-- Migration : Ajouter les champs manquants à la table subscriptions
-- ============================================

-- Ajouter stripe_price_id pour tracker le price_id exact utilisé
ALTER TABLE subscriptions 
ADD COLUMN IF NOT EXISTS stripe_price_id TEXT;

-- Ajouter canceled_at pour tracker la date d'annulation effective
ALTER TABLE subscriptions 
ADD COLUMN IF NOT EXISTS canceled_at TIMESTAMPTZ;

-- Ajouter index sur stripe_price_id pour les recherches
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_price_id 
ON subscriptions(stripe_price_id);

-- Commentaire pour documentation
COMMENT ON COLUMN subscriptions.stripe_price_id IS 'Price ID Stripe utilisé pour cet abonnement';
COMMENT ON COLUMN subscriptions.canceled_at IS 'Date effective d''annulation de l''abonnement';
