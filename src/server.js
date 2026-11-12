
require('dotenv').config();

const express = require('express');
const conexao = require('./config/database');
const produtosRoutes = require('./routes/produtos');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({
        mensagem: 'API de Gerenciamento de Produtos funcionando!'
    });
});

app.get('/teste-banco', async (req, res) => {
    try {
        const [resultado] = await conexao.query(
            'SELECT 1 AS conectado'
        );

        res.status(200).json({
            mensagem: 'Conexão com MariaDB realizada com sucesso!',
            banco: resultado
        });

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            mensagem: 'Erro ao conectar com o banco de dados.'
        });
    }
});

app.use('/produtos', produtosRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
