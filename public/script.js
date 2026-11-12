
const API_URL = '/produtos';

const formulario = document.getElementById('produtoForm');
const lista = document.getElementById('listaProdutos');
const pesquisa = document.getElementById('pesquisa');

let produtos = [];

// BUSCAR PRODUTOS
async function listarProdutos() {
    try {
        const resposta = await fetch(API_URL);

        if (!resposta.ok) {
            throw new Error('Erro ao buscar produtos.');
        }

        produtos = await resposta.json();
        mostrarProdutos(produtos);

    } catch (erro) {
        lista.textContent = 'Erro ao conectar com a API.';
        console.error(erro);
    }
}

// MOSTRAR PRODUTOS NA TELA
function mostrarProdutos(dados) {
    lista.innerHTML = '';

    if (dados.length === 0) {
        lista.textContent = 'Nenhum produto encontrado.';
        return;
    }

    dados.forEach(produto => {
        const elemento = document.createElement('div');
        elemento.className = 'produto';

        const informacoes = document.createElement('div');

        const titulo = document.createElement('h3');
        titulo.textContent = produto.nome;

        const descricao = document.createElement('p');
        descricao.textContent = produto.descricao || '';

        const detalhes = document.createElement('p');
        detalhes.textContent =
            `Preço: R$ ${produto.preco} | Estoque: ${produto.quantidade_estoque} | Categoria: ${produto.categoria}`;

        informacoes.append(titulo, descricao, detalhes);

        const acoes = document.createElement('div');
        acoes.className = 'acoes';

        const botaoEditar = document.createElement('button');
        botaoEditar.textContent = 'Editar (PUT)';
        botaoEditar.className = 'editar';
        botaoEditar.onclick = () => editarProduto(produto);

        const botaoAtualizar = document.createElement('button');
        botaoAtualizar.textContent = 'Estoque (PATCH)';
        botaoAtualizar.onclick = () => atualizarEstoque(produto);

        const botaoExcluir = document.createElement('button');
        botaoExcluir.textContent = 'Excluir';
        botaoExcluir.className = 'excluir';
        botaoExcluir.onclick = () => excluirProduto(produto.id);

        acoes.append(botaoEditar, botaoAtualizar, botaoExcluir);
        elemento.append(informacoes, acoes);
        lista.appendChild(elemento);
    });
}

// CADASTRAR (POST)
formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const produto = {
        nome: document.getElementById('nome').value,
        descricao: document.getElementById('descricao').value,
        preco: Number(document.getElementById('preco').value),
        quantidade_estoque: Number(document.getElementById('quantidade').value),
        categoria: document.getElementById('categoria').value
    };

    try {
        const resposta = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(produto)
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(resultado.mensagem || 'Erro ao cadastrar.');
        }

        alert('Produto cadastrado com sucesso!');
        formulario.reset();
        listarProdutos();

    } catch (erro) {
        alert(erro.message);
    }
});

// EDITAR COMPLETAMENTE (PUT)
async function editarProduto(produto) {
    const nome = prompt('Nome do produto:', produto.nome);
    if (nome === null) return;

    const descricao = prompt('Descrição:', produto.descricao || '');
    if (descricao === null) return;

    const preco = prompt('Preço:', produto.preco);
    if (preco === null) return;

    const quantidade = prompt('Quantidade em estoque:', produto.quantidade_estoque);
    if (quantidade === null) return;

    const categoria = prompt('Categoria:', produto.categoria);
    if (categoria === null) return;

    const dados = {
        nome: nome.trim(),
        descricao,
        preco: Number(preco),
        quantidade_estoque: Number(quantidade),
        categoria: categoria.trim()
    };

    if (
        !dados.nome ||
        !dados.categoria ||
        !Number.isFinite(dados.preco) ||
        dados.preco <= 0 ||
        !Number.isInteger(dados.quantidade_estoque) ||
        dados.quantidade_estoque < 0
    ) {
        alert('Confira os dados informados.');
        return;
    }

    try {
        const resposta = await fetch(`${API_URL}/${produto.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(resultado.mensagem || 'Erro ao editar.');
        }

        alert('Produto editado com sucesso!');
        listarProdutos();

    } catch (erro) {
        alert(erro.message);
    }
}

// ATUALIZAR PARCIALMENTE (PATCH)
async function atualizarEstoque(produto) {
    const quantidade = prompt(
        'Nova quantidade em estoque:',
        produto.quantidade_estoque
    );

    if (quantidade === null) return;

    const novaQuantidade = Number(quantidade);

    if (!Number.isInteger(novaQuantidade) || novaQuantidade < 0) {
        alert('Informe uma quantidade válida.');
        return;
    }

    try {
        const resposta = await fetch(`${API_URL}/${produto.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                quantidade_estoque: novaQuantidade
            })
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(resultado.mensagem || 'Erro ao atualizar.');
        }

        alert('Estoque atualizado com sucesso!');
        listarProdutos();

    } catch (erro) {
        alert(erro.message);
    }
}

// EXCLUIR (DELETE)
async function excluirProduto(id) {
    if (!confirm('Deseja realmente excluir este produto?')) {
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
        listarProdutos();

    } catch (erro) {
        alert(erro.message);
    }
}

// PESQUISAR PRODUTOS
pesquisa.addEventListener('input', () => {
    const termo = pesquisa.value.toLowerCase();

    const filtrados = produtos.filter(produto =>
        produto.nome.toLowerCase().includes(termo) ||
        produto.categoria.toLowerCase().includes(termo)
    );

    mostrarProdutos(filtrados);
});

// INICIAR
listarProdutos();
