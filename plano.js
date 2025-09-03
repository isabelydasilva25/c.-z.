// Array para armazenar os planos (simulando um banco de dados)
    let planosTreino = JSON.parse(localStorage.getItem('planosTreino')) || [];

    // Função para salvar os planos no localStorage
    function salvarPlanos() {
        localStorage.setItem('planosTreino', JSON.stringify(planosTreino));
    }

    // Função para incluir um novo plano
    async function incluirPlano(event) {
        event.preventDefault();

        const plano = {
            codigo: document.getElementById("codigoPlano").value,
            nome: document.getElementById("nomePlano").value,
            categoria: document.getElementById("categoria").value,
            duracao: document.getElementById("duracao").value,
            exercicios: document.getElementById("exercicios").value.split(',').map(e => e.trim()),
            observacoes: document.getElementById("observacoes").value
        };

        try {
            // Verifica se já existe um plano com o mesmo código
            const planoExistente = planosTreino.find(p => p.codigo === plano.codigo);
            if (planoExistente) {
                alert("Já existe um plano com este código!");
                return;
            }

            // Adiciona o plano ao array
            planosTreino.push(plano);
            salvarPlanos();

            alert("Plano cadastrado com sucesso!");
            document.getElementById("formPlanoTreino").reset();
            consultarPlanos(); // Atualiza a exibição dos planos
        } catch (err) {
            console.error("Erro ao cadastrar plano:", err);
            alert("Erro ao cadastrar plano.");
        }
    }

}

// Função para alterar um plano
async function alterarPlano() {
    const codigo = document.getElementById("codigoPlano").value;

    if (!codigo) {
        alert("Digite o código do plano que deseja alterar!");
        return;
    }

    try {
        const index = planosTreino.findIndex(p => p.codigo === codigo);
        if (index === -1) {
            alert("Plano não encontrado!");
            return;
        }

        const planoAtualizado = {
            codigo: codigo,
            nome: document.getElementById("nomePlano").value,
            categoria: document.getElementById("categoria").value,
            duracao: document.getElementById("duracao").value,
            exercicios: document.getElementById("exercicios").value.split(',').map(e => e.trim()),
            observacoes: document.getElementById("observacoes").value
        };

        planosTreino[index] = planoAtualizado;
        salvarPlanos();
        alert("Plano atualizado com sucesso!");
        consultarPlanos(); // Atualiza a exibição dos planos
    } catch (err) {
        console.error("Erro ao alterar plano:", err);
        alert("Erro ao alterar plano.");
    }
}

// Função para consultar e exibir os planos
async function consultarPlanos() {
    const container = document.getElementById("planos-container");
    container.innerHTML = '';

    if (planosTreino.length === 0) {
        container.innerHTML = '<p>Nenhum plano de treino cadastrado.</p>';
        return;
    }

    // Agrupar planos por categoria
    const planosPorCategoria = {};
    planosTreino.forEach(plano => {
        if (!planosPorCategoria[plano.categoria]) {
            planosPorCategoria[plano.categoria] = [];
        }
        planosPorCategoria[plano.categoria].push(plano);
    });

    // Exibir planos agrupados por categoria
    for (const categoria in planosPorCategoria) {
        const categoriaDiv = document.createElement('div');
        categoriaDiv.innerHTML = `<h3 class="categoria-title">${categoria}</h3>`;

        planosPorCategoria[categoria].forEach(plano => {
            const planoCard = document.createElement('div');
            planoCard.className = 'plano-card';

            planoCard.innerHTML = `
                <div class="plano-header">
                    <div class="plano-title">${plano.nome} (Código: ${plano.codigo}) - ${plano.duracao} semanas</div>
                    <div class="plano-actions">
                        <button onclick="carregarPlano('${plano.codigo}')">Editar</button>
                    </div>
                </div>
                <div class="plano-content">
                    <h4>Exercícios:</h4>
                    ${plano.exercicios.map(ex => `<div class="exercicio-item">${ex}</div>`).join('')}
                    ${plano.observacoes ? `<h4>Observações:</h4><p>${plano.observacoes}</p>` : ''}
                </div>
            `;

            categoriaDiv.appendChild(planoCard);
        });

        container.appendChild(categoriaDiv);
    }
}

// Função para carregar um plano no formulário para edição
function carregarPlano(codigo) {
    const plano = planosTreino.find(p => p.codigo === codigo);
    if (plano) {
        document.getElementById("codigoPlano").value = plano.codigo;
        document.getElementById("nomePlano").value = plano.nome;
        document.getElementById("categoria").value = plano.categoria;
        document.getElementById("duracao").value = plano.duracao;
        document.getElementById("exercicios").value = plano.exercicios.join(', ');
        document.getElementById("observacoes").value = plano.observacoes || '';
    }
}

// Função para limpar o formulário
function limpaFormulario() {
    document.getElementById("formPlanoTreino").reset();
}

// Carregar planos quando a página for carregada
document.addEventListener('DOMContentLoaded', function() {
    consultarPlanos();
});
