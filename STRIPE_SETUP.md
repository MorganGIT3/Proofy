# Configuration Stripe - Guide Complet

## 📋 Prérequis

- Compte Stripe avec les produits et prix créés
- Projet Supabase configuré
- Clés API Stripe (publique et secrète)

## 🔑 Variables d'Environnement

### Dans Supabase Dashboard (Secrets pour Edge Functions)

Allez dans **Project Settings > Edge Functions > Secrets** et ajoutez :

1. **STRIPE_SECRET_KEY**
   - Valeur : `sk_live_...` (votre clé secrète Stripe - à obtenir depuis Stripe Dashboard > Developers > API keys)

2. **STRIPE_WEBHOOK_SECRET**
   - Valeur : À obtenir après la création du webhook dans Stripe (voir section Webhook ci-dessous)

3. **SUPABASE_SERVICE_ROLE_KEY**
   - Valeur : Trouvable dans **Project Settings > API > service_role key** (⚠️ Ne jamais exposer cette clé côté client)

4. **SITE_URL**
   - Valeur : `https://votre-domaine.com` (ou `http://localhost:3000` pour le développement)

### Dans le fichier `.env` du client

Créez ou mettez à jour le fichier `.env` dans le dossier `client/` :

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_anon_key

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_... (votre clé publique Stripe)
```

**Note :** Le fichier `.env` est déjà dans `.gitignore` et ne sera pas commité. Vous pouvez y mettre vos vraies clés en toute sécurité.

## 🗄️ Configuration de la Base de Données

### Étape 1 : Exécuter le schéma SQL

1. Allez dans votre **Supabase Dashboard**
2. Ouvrez l'**éditeur SQL**
3. Copiez-collez le contenu de `supabase_schema.sql`
4. Exécutez la requête

Cela créera :
- La table `subscriptions` pour stocker les abonnements
- La table `stripe_prices` pour la configuration des prix
- Les politiques RLS (Row Level Security)
- Les index pour les performances

### Étape 2 : Initialiser les prix Stripe

1. Dans l'éditeur SQL de Supabase
2. Copiez-collez le contenu de `supabase_init_prices.sql`
3. Exécutez la requête

Cela insérera les IDs de prix Stripe dans la table `stripe_prices`.

## 🚀 Déploiement des Edge Functions

### Option 1 : Via Supabase CLI (Recommandé)

```bash
# Installer Supabase CLI si ce n'est pas déjà fait
npm install -g supabase

# Se connecter à votre projet
supabase login
supabase link --project-ref votre-project-ref

# Déployer les Edge Functions
supabase functions deploy create-checkout-session
supabase functions deploy stripe-webhook
```

### Option 2 : Via Supabase Dashboard

1. Allez dans **Edge Functions** dans votre dashboard
2. Cliquez sur **Create a new function**
3. Pour chaque fonction :
   - Nom : `create-checkout-session` puis `stripe-webhook`
   - Copiez le code depuis `supabase/functions/[nom-fonction]/index.ts`
   - Déployez

## 🔗 Configuration du Webhook Stripe

### Étape 1 : Créer le Webhook dans Stripe

1. Allez dans votre **Stripe Dashboard**
2. Naviguez vers **Developers > Webhooks**
3. Cliquez sur **Add endpoint**
4. **Endpoint URL** : 
   ```
   https://[VOTRE-PROJET-REF].supabase.co/functions/v1/stripe-webhook
   ```
   Remplacez `[VOTRE-PROJET-REF]` par votre référence de projet Supabase (ex: `bmjpnnjsokamnxhwfdjn`)

5. **Description** : `Proofy Stripe Webhook`

6. **Événements à écouter** : Sélectionnez les événements suivants :
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid` ⭐ (ajouté pour meilleure fiabilité)
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

7. Cliquez sur **Add endpoint**

### Étape 2 : Récupérer le Signing Secret

1. Après avoir créé le webhook, cliquez dessus
2. Dans la section **Signing secret**, cliquez sur **Reveal**
3. Copiez le secret (commence par `whsec_...`)
4. Ajoutez-le comme secret dans Supabase :
   - Allez dans **Project Settings > Edge Functions > Secrets**
   - Ajoutez `STRIPE_WEBHOOK_SECRET` avec la valeur copiée

## ✅ Vérification

### Tester le Checkout

1. Connectez-vous à votre application
2. Allez sur `/dashboard/billing`
3. Cliquez sur "Activer Basic" ou "Activer Live"
4. Vous devriez être redirigé vers Stripe Checkout

### Tester le Webhook

1. Dans Stripe Dashboard, allez sur votre webhook
2. Cliquez sur **Send test webhook**
3. Sélectionnez un événement (ex: `checkout.session.completed`)
4. Vérifiez que l'événement est bien reçu (statut 200)

### Vérifier les données

1. Dans Supabase, vérifiez que la table `subscriptions` contient bien les abonnements
2. Vérifiez que le statut est `active` après un paiement réussi

## 🔍 Dépannage

### Le checkout ne fonctionne pas

- Vérifiez que `VITE_SUPABASE_URL` est correct dans `.env`
- Vérifiez que l'utilisateur est bien connecté
- Vérifiez les logs de l'Edge Function dans Supabase Dashboard

### Le webhook ne fonctionne pas

- Vérifiez que l'URL du webhook est correcte
- Vérifiez que `STRIPE_WEBHOOK_SECRET` est bien configuré dans Supabase
- Vérifiez les logs de l'Edge Function `stripe-webhook`
- Vérifiez que les événements sont bien sélectionnés dans Stripe

### Les abonnements ne s'affichent pas

- Vérifiez que la table `subscriptions` contient des données
- Vérifiez que les politiques RLS permettent à l'utilisateur de voir ses abonnements
- Vérifiez les logs du hook `useSubscription`

## ✅ Vérifications Finales

### Checklist de déploiement

- [ ] Toutes les Edge Functions utilisent la même version Stripe API (`2024-06-20`)
- [ ] `stripe-webhook` utilise `constructEventAsync` avec `cryptoProvider` (corrigé)
- [ ] `upsertSubscription` utilise `onConflict: 'stripe_subscription_id'` (corrigé)
- [ ] La table `subscriptions` a les champs `stripe_price_id` et `canceled_at` (migration 002)
- [ ] Le hook `useSubscription` filtre par status actif (`active`, `trialing`, `past_due`)
- [ ] Les secrets sont configurés : `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- [ ] Le webhook Stripe Dashboard pointe vers la bonne URL
- [ ] Tous les événements webhook sont sélectionnés dans Stripe Dashboard

### Migrations SQL à exécuter

1. **Migration 002** : Ajouter les champs manquants
   - Exécuter `supabase/migrations/002_add_missing_subscription_fields.sql`
   - Ajoute `stripe_price_id` et `canceled_at` à la table `subscriptions`

2. **Migration 003** (Optionnel) : Installer Stripe Wrapper (FDW)
   - ⚠️ Nécessite d'abord d'ajouter la clé API dans Vault :
     ```sql
     INSERT INTO vault.secrets (name, secret) VALUES ('stripe_api_key', 'sk_live_xxx');
     ```
   - Exécuter `supabase/migrations/003_install_stripe_fdw.sql`
   - Permet de lire les données Stripe via SQL (lecture seule)

### Tests avec Stripe CLI

```bash
# Installer Stripe CLI
brew install stripe/stripe-cli/stripe  # macOS
# ou télécharger depuis https://stripe.com/docs/stripe-cli

# Se connecter
stripe login

# Écouter les webhooks vers Supabase
stripe listen --forward-to https://<project-ref>.supabase.co/functions/v1/stripe-webhook

# Déclencher des événements de test
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated
stripe trigger invoice.paid
```

### Améliorations apportées

1. **Webhook amélioré** :
   - Utilise `constructEventAsync` avec `cryptoProvider` pour meilleure performance
   - Gère l'événement `invoice.paid` en plus de `invoice.payment_succeeded`
   - Utilise `stripe_subscription_id` pour `onConflict` (plus sûr)
   - Ajoute `stripe_price_id` et `canceled_at` dans les données

2. **Hook useSubscription optimisé** :
   - Filtre uniquement les subscriptions actives (`active`, `trialing`, `past_due`)
   - Trie par `created_at` pour récupérer la plus récente
   - Utilise `maybeSingle()` sans `limit(1)` (optimisé)

3. **Schéma amélioré** :
   - Ajout de `stripe_price_id` pour tracker le price exact
   - Ajout de `canceled_at` pour tracker l'annulation

## 📝 Notes Importantes

- ⚠️ **Ne jamais** exposer `STRIPE_SECRET_KEY` ou `SUPABASE_SERVICE_ROLE_KEY` côté client
- 🔒 Les clés secrètes doivent être uniquement dans Supabase Secrets
- 🌐 L'URL du webhook doit être en HTTPS en production
- 🔄 Les webhooks peuvent prendre quelques secondes pour être traités
- 📊 Le Stripe Wrapper (FDW) est optionnel et peut ne pas être disponible sur tous les plans Supabase
- 🎯 Utiliser le FDW uniquement pour vérifications ponctuelles, pas pour la logique métier temps réel

## 🎯 Endpoint Webhook

**URL à utiliser dans Stripe :**
```
https://[VOTRE-PROJET-REF].supabase.co/functions/v1/stripe-webhook
```

Pour trouver votre `PROJET-REF` :
1. Allez dans Supabase Dashboard
2. **Project Settings > General**
3. Copiez le **Reference ID**
