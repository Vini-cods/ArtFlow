const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Servir tudo dentro de ArtFlow
app.use(express.static(path.join(__dirname)));

// Rota principal para drawing.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Telainicial', 'Drawing', 'drawing.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
