const express = require('express');
const cors = require('cors');
const path = require('path');
const cursoRoutes = require('./routes/cursoRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/api', cursoRoutes);
app.use('/api', usuarioRoutes);

app.get('/teste', (req, res) => {
  res.send('O servidor está a funcionar perfeitamente!');
});

module.exports = app;