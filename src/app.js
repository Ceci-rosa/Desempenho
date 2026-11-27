
const express = require('express');
const cors = require('cors');
const path = require('path');

const cursoRoutes = require('./routes/cursoRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const alunoRoutes = require('./routes/alunoRoutes');
const turmaRoutes = require('./routes/turmaRoutes');
const avaliacaoRoutes = require('./routes/avaliacaoRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../public')));

app.use('/api', cursoRoutes);
app.use('/api', usuarioRoutes);
app.use('/api', alunoRoutes);
app.use('/api', turmaRoutes);
app.use('/api', avaliacaoRoutes);

app.get('/teste', (req, res) => {
  res.send('O servidor está a funcionar perfeitamente!');
});

module.exports = app;
