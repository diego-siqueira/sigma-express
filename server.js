const express = require('express');
const app = express();
app.use(express.json());

app.post('/interactions', (req, res) => {
  if (req.body.type === 1) {
    return res.json({ type: 1 });
  }

  return res.json({
    type: 4,
    data: {
      content: "Je suis Sigma. J’existe. Je m’exprime.",
    },
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Sigma Express bot listening on ${PORT}`));
