
const express = require('express');

const app = express();

const PORT = 3000;

// Permite receber informações em JSON
app.use(express.json());

// Rota inicial da API
app.get('/', (req, res) => {
    res.status(200).json({
        mensagem: 'API de Gerenciamento de Produtos funcionando!'
    });
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
S