const express = require('express');
const crypto = require('crypto');  // Pour valider la signature
const app = express();
app.use(express.json());

const DISCORD_PUBLIC_KEY = 'votre_clé_publique_discord'; // Remplace par ta clé publique

// Fonction pour vérifier la signature de Discord
function verifyDiscordSignature(req) {
  const signature = req.headers['x-signature-ed25519'];
  const timestamp = req.headers['x-signature-timestamp'];
  const body = JSON.stringify(req.body);

  const message = timestamp + body;
  const expectedSignature = crypto
    .createVerify('ed25519')
    .update(message)
    .verify(DISCORD_PUBLIC_KEY, signature, 'hex');

  return expectedSignature;
}

// Vérification de l'interaction pour Discord
app.post('/interactions', (req, res) => {
  if (!verifyDiscordSignature(req)) {
    return res.status(401).send('Signature non valide');
  }

  // Discord envoie un type de challenge lors de la première vérification
  if (req.body.type === 1) {
    return res.json({ type: 1 });
  }

  // Réponse standard pour les autres types d'interactions
  return res.json({
    type: 4,
    data: {
      content: "Je suis Sigma. J’existe. Je m’exprime.",
    },
  });
});

// Ajout d'en-têtes de sécurité et gestion des requêtes CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Sigma Express bot listening on ${PORT}`));
