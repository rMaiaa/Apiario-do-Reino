require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Configuração do template engine (EJS)
app.set('view engine', 'ejs');

// Servir arquivos estáticos
app.use(express.static('public'));

// Rota principal
app.get('/', (req, res) => {
    res.render('index', { title: "Ápiario do Reino - Produtos do Apiário" });
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});