
const API_URL = 'http://localhost:3000/produtos';

// LISTAR PRODUTOS
async function listarProdutos() {
    try {
        const resposta = await fetch(API_URL);
        const produtos = await resposta.json();

        console.log('Produtos cadastrados:', produtos);

        return produtos;
    } catch (erro) {
        console.error('Erro ao listar produtos:', erro);
        alert('Não foi possível conectar com a API.');
        return [];
    }
}

// CADASTRAR PRODUTO (POST)
async function cadastrarProduto(produto) {
    try {
        const resposta = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(produto)
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(resultado.mensagem || 'Erro ao cadastrar.');
        }

        alert('Produto cadastrado com sucesso!');
        return resultado;
    } catch (erro) {
        alert(erro.message);
    }
}

// EDITAR PRODUTO COMPLETO (PUT)
async function editarProduto(id, produto) {
    try {
        const resposta = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(produto)
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(resultado.mensagem || 'Erro ao editar.');
        }

        alert('Produto atualizado com sucesso!');
        return resultado;
    } catch (erro) {
        alert(erro.message);
    }
}

// ATUALIZAR APENAS ALGUNS CAMPOS (PATCH)
async function atualizarParcialmente(id, dados) {
    try {
        const resposta = await fetch(`${API_URL}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(resultado.mensagem || 'Erro ao atualizar.');
        }

        alert('Atualização parcial realizada com sucesso!');
        return resultado;
    } catch (erro) {
        alert(erro.message);
    }
}

// EXCLUIR PRODUTO (DELETE)
async function excluirProduto(id) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) {
        return;
    }

    try {
        const resposta = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(resultado.mensagem || 'Erro ao excluir.');
        }

        alert('Produto excluído com sucesso!');
        return resultado;
    } catch (erro) {
        alert(erro.message);
    }
}

// TESTE DA API
listarProdutos();
