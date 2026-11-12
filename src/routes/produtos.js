
const express = require('express');
const router = express.Router();

const conexao = require('../config/database');

// ======================================
// GET - LISTAR TODOS OS PRODUTOS
// ======================================

router.get('/', async (req, res) => {
    try {
        const [produtos] = await conexao.query(
            'SELECT * FROM produtos'
        );

        res.status(200).json(produtos);

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            mensagem: 'Erro ao consultar produtos.'
        });
    }
});

// ======================================
// GET - BUSCAR PRODUTO PELO ID
// ======================================

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
            return res.status(400).json({
                mensagem: 'ID inválido.'
            });
        }

        const [produtos] = await conexao.execute(
            'SELECT * FROM produtos WHERE id = ?',
            [Number(id)]
        );

        if (produtos.length === 0) {
            return res.status(404).json({
                mensagem: 'Produto não encontrado.'
            });
        }

        res.status(200).json(produtos[0]);

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            mensagem: 'Erro ao consultar produto.'
        });
    }
});

// ======================================
// POST - CADASTRAR PRODUTO
// ======================================

router.post('/', async (req, res) => {
    try {
        const {
            nome,
            descricao,
            preco,
            quantidade_estoque,
            categoria
        } = req.body;

        if (
            !nome ||
            preco === undefined ||
            quantidade_estoque === undefined ||
            !categoria
        ) {
            return res.status(400).json({
                mensagem: 'Preencha nome, preço, estoque e categoria.'
            });
        }

        if (
            typeof nome !== 'string' ||
            !nome.trim() ||
            typeof categoria !== 'string' ||
            !categoria.trim() ||
            typeof preco !== 'number' ||
            typeof quantidade_estoque !== 'number' ||
            !Number.isFinite(preco) ||
            !Number.isInteger(quantidade_estoque) ||
            preco < 0 ||
            quantidade_estoque < 0 ||
            (descricao !== undefined &&
                descricao !== null &&
                typeof descricao !== 'string')
        ) {
            return res.status(400).json({
                mensagem: 'Os dados informados são inválidos.'
            });
        }

        const [resultado] = await conexao.execute(
            `INSERT INTO produtos
            (nome, descricao, preco, quantidade_estoque, categoria)
            VALUES (?, ?, ?, ?, ?)`,
            [
                nome.trim(),
                descricao || null,
                preco,
                quantidade_estoque,
                categoria.trim()
            ]
        );

        res.status(201).json({
            mensagem: 'Produto cadastrado com sucesso!',
            id: resultado.insertId
        });

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            mensagem: 'Erro ao cadastrar produto.'
        });
    }
});

// ======================================
// PUT - ATUALIZAR PRODUTO
// ======================================

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
            return res.status(400).json({
                mensagem: 'ID inválido.'
            });
        }

        const {
            nome,
            descricao,
            preco,
            quantidade_estoque,
            categoria
        } = req.body;

        if (
            !nome ||
            preco === undefined ||
            quantidade_estoque === undefined ||
            !categoria
        ) {
            return res.status(400).json({
                mensagem: 'Preencha todos os campos obrigatórios.'
            });
        }

        if (
            typeof nome !== 'string' ||
            !nome.trim() ||
            typeof categoria !== 'string' ||
            !categoria.trim() ||
            typeof preco !== 'number' ||
            typeof quantidade_estoque !== 'number' ||
            !Number.isFinite(preco) ||
            !Number.isInteger(quantidade_estoque) ||
            preco < 0 ||
            quantidade_estoque < 0 ||
            (descricao !== undefined &&
                descricao !== null &&
                typeof descricao !== 'string')
        ) {
            return res.status(400).json({
                mensagem: 'Dados inválidos.'
            });
        }

        const [resultado] = await conexao.execute(
            `UPDATE produtos
            SET nome = ?, descricao = ?, preco = ?,
            quantidade_estoque = ?, categoria = ?
            WHERE id = ?`,
            [
                nome.trim(),
                descricao || null,
                preco,
                quantidade_estoque,
                categoria.trim(),
                Number(id)
            ]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: 'Produto não encontrado.'
            });
        }

        res.status(200).json({
            mensagem: 'Produto atualizado com sucesso!'
        });

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            mensagem: 'Erro ao atualizar produto.'
        });
    }
});

// ======================================
// DELETE - EXCLUIR PRODUTO
// ======================================

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
            return res.status(400).json({
                mensagem: 'ID inválido.'
            });
        }

        const [resultado] = await conexao.execute(
            'DELETE FROM produtos WHERE id = ?',
            [Number(id)]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: 'Produto não encontrado.'
            });
        }

        res.status(200).json({
            mensagem: 'Produto excluído com sucesso!'
        });

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            mensagem: 'Erro ao excluir produto.'
        });
    }
});

// ======================================
// EXPORTAR ROTAS
// ======================================

module.exports = router;
