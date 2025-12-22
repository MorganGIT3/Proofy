import React from 'react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div
      style={{
        fontFamily: "'Poppins', sans-serif",
        lineHeight: 1.6,
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        color: '#333',
        backgroundColor: '#fff',
        minHeight: '100vh',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        
        * {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>

      <h1
        style={{
          color: '#2848F0',
          borderBottom: '3px solid #2848F0',
          paddingBottom: '10px',
        }}
      >
        Politique de Confidentialité
      </h1>
      
      <h2
        style={{
          color: '#2848F0',
          marginTop: '30px',
        }}
      >
        Proofy Beacons Modifier - Extension Chrome
      </h2>
      
      <p
        style={{
          color: '#666',
          fontStyle: 'italic',
        }}
      >
        <strong>Dernière mise à jour :</strong> 15 janvier 2025
      </p>
      
      <p>
        Cette politique de confidentialité décrit comment l'extension Chrome "Proofy Beacons Modifier" collecte, utilise et protège vos informations personnelles.
      </p>
      
      <h2
        style={{
          color: '#2848F0',
          marginTop: '30px',
        }}
      >
        1. Informations Collectées
      </h2>
      
      <h3>1.1 Informations d'Identification Personnelle</h3>
      <ul style={{ margin: '10px 0' }}>
        <li style={{ margin: '5px 0' }}>
          <strong>Adresse email :</strong> Collectée via l'authentification OAuth Google/Supabase lorsque vous vous connectez à l'extension
        </li>
        <li style={{ margin: '5px 0' }}>
          <strong>Identifiant utilisateur :</strong> UUID généré par Supabase pour identifier votre compte
        </li>
      </ul>
      
      <h3>1.2 Informations d'Authentification</h3>
      <ul style={{ margin: '10px 0' }}>
        <li style={{ margin: '5px 0' }}>
          <strong>Tokens d'accès :</strong> Tokens OAuth (access_token, refresh_token) stockés localement dans chrome.storage.local pour maintenir votre session
        </li>
        <li style={{ margin: '5px 0' }}>
          <strong>Session Supabase :</strong> Informations de session stockées localement pour l'authentification
        </li>
      </ul>
      
      <h3>1.3 Informations de Localisation</h3>
      <ul style={{ margin: '10px 0' }}>
        <li style={{ margin: '5px 0' }}>
          <strong>Adresse IP :</strong> Collectée via notre Edge Function Supabase ou des services tiers (api.ipify.org) pour identifier la localisation géographique approximative de votre connexion
        </li>
        <li style={{ margin: '5px 0' }}>
          L'adresse IP est utilisée uniquement pour le tracking des connexions de l'extension et la sécurité
        </li>
      </ul>
      
      <h3>1.4 Informations Techniques</h3>
      <ul style={{ margin: '10px 0' }}>
        <li style={{ margin: '5px 0' }}>
          <strong>Type de navigateur :</strong> Nom du navigateur (Chrome, Firefox, Edge, etc.)
        </li>
        <li style={{ margin: '5px 0' }}>
          <strong>Version du navigateur :</strong> Numéro de version extrait depuis navigator.userAgent
        </li>
        <li style={{ margin: '5px 0' }}>
          <strong>Système d'exploitation :</strong> OS détecté (Windows, macOS, Linux, etc.)
        </li>
        <li style={{ margin: '5px 0' }}>
          <strong>Identifiant d'appareil :</strong> UUID unique généré et stocké localement pour identifier cette installation spécifique de l'extension
        </li>
      </ul>
      
      <h3>1.5 Informations sur l'Activité</h3>
      <ul style={{ margin: '10px 0' }}>
        <li style={{ margin: '5px 0' }}>
          <strong>Heure de connexion :</strong> Timestamp de votre première connexion
        </li>
        <li style={{ margin: '5px 0' }}>
          <strong>Dernière utilisation :</strong> Timestamp de votre dernière utilisation de l'extension
        </li>
        <li style={{ margin: '5px 0' }}>
          <strong>Pages visitées :</strong> Détection des pages Beacons.ai visitées pour activer les fonctionnalités de l'extension
        </li>
      </ul>
      
      <h2
        style={{
          color: '#2848F0',
          marginTop: '30px',
        }}
      >
        2. Utilisation des Informations
      </h2>
      
      <p>Les informations collectées sont utilisées pour :</p>
      <ul style={{ margin: '10px 0' }}>
        <li style={{ margin: '5px 0' }}>
          <strong>Authentification :</strong> Permettre la connexion sécurisée via OAuth Google et Supabase
        </li>
        <li style={{ margin: '5px 0' }}>
          <strong>Synchronisation :</strong> Synchroniser vos informations de connexion avec notre base de données Supabase pour le suivi des sessions
        </li>
        <li style={{ margin: '5px 0' }}>
          <strong>Fonctionnalités de l'extension :</strong> Activer et personnaliser les modifications de contenu sur Beacons.ai
        </li>
        <li style={{ margin: '5px 0' }}>
          <strong>Sécurité :</strong> Détecter et prévenir les accès non autorisés, suivre les connexions pour des raisons de sécurité
        </li>
        <li style={{ margin: '5px 0' }}>
          <strong>Amélioration du service :</strong> Comprendre comment l'extension est utilisée pour améliorer l'expérience utilisateur
        </li>
      </ul>
      
      <h2
        style={{
          color: '#2848F0',
          marginTop: '30px',
        }}
      >
        3. Stockage des Données
      </h2>
      
      <h3>3.1 Stockage Local</h3>
      <p>Les données suivantes sont stockées localement dans votre navigateur via chrome.storage.local :</p>
      <ul style={{ margin: '10px 0' }}>
        <li style={{ margin: '5px 0' }}>Tokens d'authentification (access_token, refresh_token)</li>
        <li style={{ margin: '5px 0' }}>État de connexion (isProofyLoggedIn, proofyUserEmail)</li>
        <li style={{ margin: '5px 0' }}>Identifiant d'appareil unique (proofy_device_id)</li>
        <li style={{ margin: '5px 0' }}>Préférences utilisateur et produits configurés</li>
      </ul>
      <p><strong>Ces données sont stockées uniquement sur votre appareil et ne sont pas accessibles par d'autres parties.</strong></p>
      
      <h3>3.2 Stockage Cloud (Supabase)</h3>
      <p>Les données suivantes sont synchronisées avec notre base de données Supabase :</p>
      <ul style={{ margin: '10px 0' }}>
        <li style={{ margin: '5px 0' }}>Email utilisateur (pour l'identification)</li>
        <li style={{ margin: '5px 0' }}>Informations de connexion (browser, OS, version, device_id)</li>
        <li style={{ margin: '5px 0' }}>Adresse IP (pour le tracking des connexions)</li>
        <li style={{ margin: '5px 0' }}>Timestamps de connexion (connected_at, last_used_at)</li>
      </ul>
      <p><strong>Ces données sont stockées de manière sécurisée sur les serveurs Supabase avec chiffrement et protection par Row Level Security (RLS).</strong></p>
      
      <h2
        style={{
          color: '#2848F0',
          marginTop: '30px',
        }}
      >
        4. Partage des Données
      </h2>
      
      <p><strong>Nous ne vendons, ne louons, ni ne partageons vos données personnelles avec des tiers, sauf dans les cas suivants :</strong></p>
      <ul style={{ margin: '10px 0' }}>
        <li style={{ margin: '5px 0' }}>
          <strong>Fournisseurs de services :</strong> Nous utilisons Supabase pour l'hébergement de la base de données et l'authentification. Supabase est conforme au RGPD et aux standards de sécurité.
        </li>
        <li style={{ margin: '5px 0' }}>
          <strong>Services d'authentification :</strong> Lors de la connexion OAuth, vos informations sont partagées avec Google et Supabase selon leurs politiques de confidentialité respectives.
        </li>
        <li style={{ margin: '5px 0' }}>
          <strong>Obligations légales :</strong> Nous pouvons divulguer vos informations si la loi l'exige ou en réponse à une demande légale valide.
        </li>
      </ul>
      
      <h2
        style={{
          color: '#2848F0',
          marginTop: '30px',
        }}
      >
        5. Sécurité des Données
      </h2>
      
      <p>Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données :</p>
      <ul style={{ margin: '10px 0' }}>
        <li style={{ margin: '5px 0' }}>
          <strong>Chiffrement :</strong> Toutes les communications avec Supabase sont chiffrées via HTTPS
        </li>
        <li style={{ margin: '5px 0' }}>
          <strong>Authentification sécurisée :</strong> Utilisation d'OAuth 2.0 pour l'authentification
        </li>
        <li style={{ margin: '5px 0' }}>
          <strong>Stockage sécurisé :</strong> Données stockées dans Supabase avec Row Level Security (RLS) activée
        </li>
        <li style={{ margin: '5px 0' }}>
          <strong>Tokens sécurisés :</strong> Tokens d'authentification stockés localement avec accès restreint
        </li>
        <li style={{ margin: '5px 0' }}>
          <strong>Pas de données sensibles :</strong> Nous ne collectons pas de mots de passe, informations bancaires ou autres données financières
        </li>
      </ul>
      
      <h2
        style={{
          color: '#2848F0',
          marginTop: '30px',
        }}
      >
        6. Vos Droits
      </h2>
      
      <p>Conformément au RGPD et aux lois sur la protection des données, vous avez les droits suivants :</p>
      <ul style={{ margin: '10px 0' }}>
        <li style={{ margin: '5px 0' }}>
          <strong>Droit d'accès :</strong> Vous pouvez demander une copie de toutes les données personnelles que nous détenons sur vous
        </li>
        <li style={{ margin: '5px 0' }}>
          <strong>Droit de rectification :</strong> Vous pouvez corriger ou mettre à jour vos informations personnelles
        </li>
        <li style={{ margin: '5px 0' }}>
          <strong>Droit à l'effacement :</strong> Vous pouvez demander la suppression de vos données personnelles
        </li>
        <li style={{ margin: '5px 0' }}>
          <strong>Droit à la portabilité :</strong> Vous pouvez demander le transfert de vos données dans un format structuré
        </li>
        <li style={{ margin: '5px 0' }}>
          <strong>Droit d'opposition :</strong> Vous pouvez vous opposer au traitement de vos données personnelles
        </li>
      </ul>
      
      <p><strong>Pour exercer ces droits :</strong></p>
      <ul style={{ margin: '10px 0' }}>
        <li style={{ margin: '5px 0' }}>Vous pouvez vous déconnecter de l'extension à tout moment depuis les paramètres</li>
        <li style={{ margin: '5px 0' }}>Vous pouvez supprimer l'extension, ce qui supprimera toutes les données stockées localement</li>
        <li style={{ margin: '5px 0' }}>Pour supprimer vos données de Supabase, contactez-nous à l'adresse indiquée ci-dessous</li>
      </ul>
      
      <h2
        style={{
          color: '#2848F0',
          marginTop: '30px',
        }}
      >
        7. Conservation des Données
      </h2>
      
      <p>Nous conservons vos données personnelles :</p>
      <ul style={{ margin: '10px 0' }}>
        <li style={{ margin: '5px 0' }}>
          <strong>Données locales :</strong> Jusqu'à ce que vous supprimiez l'extension ou effaciez les données du navigateur
        </li>
        <li style={{ margin: '5px 0' }}>
          <strong>Données cloud :</strong> Jusqu'à ce que vous demandiez leur suppression ou que votre compte soit inactif pendant plus de 2 ans
        </li>
        <li style={{ margin: '5px 0' }}>
          <strong>Données de connexion :</strong> Conservées pour des raisons de sécurité et peuvent être conservées plus longtemps si requis par la loi
        </li>
      </ul>
      
      <h2
        style={{
          color: '#2848F0',
          marginTop: '30px',
        }}
      >
        8. Cookies et Technologies Similaires
      </h2>
      
      <p>L'extension utilise chrome.storage.local pour stocker des données localement. Cette technologie est similaire aux cookies mais spécifique aux extensions Chrome. Nous n'utilisons pas de cookies web traditionnels.</p>
      
      <h2
        style={{
          color: '#2848F0',
          marginTop: '30px',
        }}
      >
        9. Modifications de cette Politique
      </h2>
      
      <p>Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. Toute modification sera publiée sur cette page avec une date de mise à jour révisée. Nous vous encourageons à consulter régulièrement cette page pour rester informé de la façon dont nous protégeons vos informations.</p>
      
      <h2
        style={{
          color: '#2848F0',
          marginTop: '30px',
        }}
      >
        10. Conformité
      </h2>
      
      <p>Cette extension est conforme aux réglementations suivantes :</p>
      <ul style={{ margin: '10px 0' }}>
        <li style={{ margin: '5px 0' }}>
          <strong>RGPD (Règlement Général sur la Protection des Données) :</strong> Pour les utilisateurs de l'Union Européenne
        </li>
        <li style={{ margin: '5px 0' }}>
          <strong>CCPA (California Consumer Privacy Act) :</strong> Pour les utilisateurs de Californie
        </li>
        <li style={{ margin: '5px 0' }}>
          <strong>Politiques du Chrome Web Store :</strong> Conformité avec les exigences de Google
        </li>
      </ul>
      
      <h2
        style={{
          color: '#2848F0',
          marginTop: '30px',
        }}
      >
        11. Contact
      </h2>
      
      <div
        style={{
          backgroundColor: '#f5f5f5',
          padding: '15px',
          borderRadius: '5px',
          marginTop: '20px',
        }}
      >
        <p>Pour toute question, préoccupation ou demande concernant cette politique de confidentialité ou vos données personnelles, veuillez nous contacter :</p>
        <p><strong>Email :</strong> morgan.julienpro1@gmail.com</p>
        <p><strong>Extension :</strong> Proofy Beacons Modifier</p>
        <p><strong>Version :</strong> 1.1.0</p>
      </div>
      
      <h2
        style={{
          color: '#2848F0',
          marginTop: '30px',
        }}
      >
        12. Consentement
      </h2>
      
      <p>En utilisant l'extension Proofy Beacons Modifier, vous consentez à cette politique de confidentialité. Si vous n'acceptez pas cette politique, veuillez ne pas utiliser l'extension.</p>
      
      <hr style={{ margin: '30px 0' }} />
      <p style={{ textAlign: 'center', color: '#666', fontSize: '0.9em' }}>
        © 2025 Proofy Beacons Modifier. Tous droits réservés.
      </p>
    </div>
  );
};
