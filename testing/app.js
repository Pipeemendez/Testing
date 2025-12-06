const express = require('express');
const app = express();

app.use(express.json());

app.get('/api/saludo', (req, res) => {
    res.status(200).json({
        mensaje: 'Hola mundo',
        estado: 'exitoso'
    });
});

app.post('/api/suma', (req, res) => {
    const { numeroA, numeroB } = req.body;

    if (!numeroA || !numeroB) {
        return res.status(400).json({ error: 'Faltan numeros' });
    }

    const resultado = numeroA + numeroB;
    res.status(200).json({ resultado });
});

module.exports = app;