const express = require('express');

const app = express();
const port = process.env.PORT || 3001;

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello world' });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
