# Configuration de l'authentification Supabase

## Étapes de configuration

### 1. Créer un projet Supabase

1. Allez sur [https://app.supabase.com](https://app.supabase.com)
2. Créez un nouveau projet ou utilisez un projet existant
3. Notez votre **Project URL** et votre **anon/public key**

### 2. Configurer les variables d'environnement

Créez un fichier `.env` à la racine du projet `client/` avec :

```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_cle_anon
```

### 3. Activer les providers OAuth dans Supabase

#### Pour Google :
1. Allez dans **Authentication** > **Providers** dans votre dashboard Supabase
2. Activez le provider **Google**
3. Configurez les credentials OAuth Google :
   - Créez un projet dans [Google Cloud Console](https://console.cloud.google.com/)
   - Activez l'API Google+ 
   - Créez des identifiants OAuth 2.0
   - Ajoutez l'URL de redirection autorisée : `https://votre-projet.supabase.co/auth/v1/callback`
   - Copiez le **Client ID** et le **Client Secret** dans Supabase

#### Pour Apple :
1. Allez dans **Authentication** > **Providers** dans votre dashboard Supabase
2. Activez le provider **Apple**
3. Configurez les credentials Apple :
   - Créez un identifiant de service dans [Apple Developer](https://developer.apple.com/)
   - Configurez Sign in with Apple
   - Créez une clé de service
   - Ajoutez l'URL de redirection autorisée : `https://votre-projet.supabase.co/auth/v1/callback`
   - Copiez les informations dans Supabase

### 4. Configurer les URLs de redirection

Dans votre projet Supabase, allez dans **Authentication** > **URL Configuration** et ajoutez :

- **Site URL** : `http://localhost:5173` (pour le développement)
- **Redirect URLs** : 
  - `http://localhost:5173/**`
  - `https://votre-domaine.com/**` (pour la production)

### 5. Redémarrer le serveur de développement

Après avoir configuré les variables d'environnement, redémarrez votre serveur :

```bash
npm run dev
```

## Utilisation

Une fois configuré, les utilisateurs peuvent se connecter avec :
- **Google** : Cliquez sur "Continuer avec Google"
- **Apple** : Cliquez sur "Continuer avec Apple"

Les sessions sont automatiquement gérées par Supabase et persistent entre les rafraîchissements de page.

## Dépannage

- Vérifiez que les variables d'environnement sont bien définies
- Vérifiez que les providers sont activés dans Supabase
- Vérifiez que les URLs de redirection sont correctement configurées
- Consultez la console du navigateur pour les erreurs

