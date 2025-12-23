# Checklist de Déploiement Stripe - Corrections Finales

## ✅ Modifications Code Effectuées

Toutes les corrections du code ont été appliquées :

- [x] Versions Stripe API uniformisées à `2024-06-20` dans les 3 Edge Functions
- [x] Webhook utilise `constructEventAsync` avec `cryptoProvider`
- [x] Événement `invoice.paid` ajouté au webhook
- [x] `upsertSubscription` utilise `onConflict: 'stripe_subscription_id'`
- [x] `stripe_price_id` et `canceled_at` ajoutés dans `upsertSubscription`
- [x] `markSubscriptionCanceled` inclut `canceled_at`
- [x] `useSubscription` filtre par status actif (`active`, `trialing`, `past_due`)

## 📋 Étapes de Déploiement

### Étape 1 : Exécuter la Migration SQL (OBLIGATOIRE)

1. Ouvrir Supabase Dashboard > SQL Editor
2. Exécuter le contenu de `supabase/migrations/002_add_missing_subscription_fields.sql`

```sql
-- Cette migration ajoute stripe_price_id et canceled_at à la table subscriptions
ALTER TABLE subscriptions 
ADD COLUMN IF NOT EXISTS stripe_price_id TEXT;

ALTER TABLE subscriptions 
ADD COLUMN IF NOT EXISTS canceled_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_price_id 
ON subscriptions(stripe_price_id);
```

### Étape 2 : Redéployer les Edge Functions

Les Edge Functions ont été modifiées et doivent être redéployées :

```bash
# Via Supabase CLI
supabase functions deploy stripe-webhook
supabase functions deploy create-checkout-session
supabase functions deploy create-portal-session
```

**OU** via Supabase Dashboard :
1. Aller dans Edge Functions
2. Pour chaque fonction modifiée, cliquer sur "Redeploy" ou copier le nouveau code

### Étape 3 : Vérifier les Secrets Supabase

Dans Supabase Dashboard > Project Settings > Edge Functions > Secrets :

- [ ] `STRIPE_SECRET_KEY` = `sk_live_...`
- [ ] `STRIPE_WEBHOOK_SECRET` = `whsec_...`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` = (depuis Project Settings > API)
- [ ] `SITE_URL` = `https://ton-domaine.com` (ou `http://localhost:5173` pour dev)

### Étape 4 : Mettre à jour le Webhook Stripe

Dans Stripe Dashboard > Webhooks :

1. Sélectionner votre webhook existant
2. Vérifier que l'URL est correcte : `https://<project-ref>.supabase.co/functions/v1/stripe-webhook`
3. **Ajouter l'événement** `invoice.paid` si pas déjà présent
4. Vérifier que tous ces événements sont sélectionnés :
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid` ⭐ (nouveau)
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

### Étape 5 : Optionnel - Installer Stripe Wrapper (FDW)

Si tu veux installer le FDW pour les lectures SQL ponctuelles :

1. **D'abord**, ajouter la clé API dans Vault :
   ```sql
   INSERT INTO vault.secrets (name, secret) 
   VALUES ('stripe_api_key', 'sk_live_xxx');
   ```

2. **Ensuite**, exécuter `supabase/migrations/003_install_stripe_fdw.sql` dans SQL Editor

**Note** : Le FDW peut ne pas être disponible sur tous les plans Supabase. Si l'installation échoue, ignorer cette étape - les webhooks suffisent.

## 🧪 Tests

### Test avec Stripe CLI

```bash
# Installer Stripe CLI si pas fait
brew install stripe/stripe-cli/stripe  # macOS
# ou télécharger depuis https://stripe.com/docs/stripe-cli

# Se connecter
stripe login

# Écouter les webhooks vers Supabase
stripe listen --forward-to https://<project-ref>.supabase.co/functions/v1/stripe-webhook

# Dans un autre terminal, déclencher des événements de test
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated
stripe trigger invoice.paid
```

### Vérifications dans Supabase

1. **Vérifier la table subscriptions** :
   ```sql
   SELECT 
     user_id, 
     stripe_subscription_id, 
     plan_name, 
     status, 
     stripe_price_id, 
     canceled_at,
     created_at 
   FROM subscriptions 
   ORDER BY created_at DESC 
   LIMIT 10;
   ```

2. **Vérifier que les nouveaux champs sont présents** :
   ```sql
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'subscriptions' 
   AND column_name IN ('stripe_price_id', 'canceled_at');
   ```

### Test dans l'Application

1. Se connecter à l'application
2. Aller sur `/dashboard/billing`
3. Cliquer sur "Activer Basic" ou "Activer Live"
4. Compléter le paiement test dans Stripe
5. Vérifier que :
   - La redirection vers `/dashboard/billing?success=true` fonctionne
   - L'abonnement apparaît dans la page billing
   - Le statut est `active`
   - `stripe_price_id` est rempli dans la base de données

## 🔍 Dépannage

### Le webhook ne fonctionne pas

- Vérifier que `STRIPE_WEBHOOK_SECRET` est correct dans Supabase Secrets
- Vérifier que l'URL du webhook dans Stripe Dashboard est correcte
- Vérifier les logs de l'Edge Function `stripe-webhook` dans Supabase Dashboard
- Tester avec Stripe CLI pour voir les erreurs détaillées

### Les nouveaux champs ne sont pas remplis

- Vérifier que la migration 002 a bien été exécutée
- Vérifier que les Edge Functions ont bien été redéployées
- Vérifier que les webhooks Stripe sont bien configurés
- Vérifier les logs de l'Edge Function pour voir si `stripe_price_id` est bien extrait

### useSubscription retourne null alors qu'il y a une subscription

- Vérifier que la subscription a un status `active`, `trialing` ou `past_due`
- Vérifier les logs du hook dans la console du navigateur
- Vérifier que la politique RLS permet à l'utilisateur de voir sa subscription

## 📝 Notes Finales

- Toutes les modifications de code sont terminées
- Les migrations SQL sont prêtes à être exécutées
- Le webhook Stripe doit être mis à jour pour inclure `invoice.paid`
- Les Edge Functions doivent être redéployées après les modifications
- Le FDW est optionnel et peut être installé plus tard si nécessaire

## ✅ Checklist Complète

- [ ] Migration 002 exécutée dans Supabase SQL Editor
- [ ] Edge Functions redéployées (stripe-webhook, create-checkout-session, create-portal-session)
- [ ] Secrets Supabase vérifiés (STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, etc.)
- [ ] Webhook Stripe mis à jour avec événement `invoice.paid`
- [ ] Tests effectués avec Stripe CLI
- [ ] Vérification dans Supabase que les nouveaux champs sont présents
- [ ] Test de paiement effectué dans l'application
- [ ] Optionnel : Migration 003 exécutée pour installer le FDW
