// Obtendo referências aos elementos do DOM
const createForm = document.getElementById('createForm'); // Formulário para criar um novo item
const nameInput = document.getElementById('name'); // Campo de entrada para o nome do item
const descriptionInput = document.getElementById('description'); // Campo de entrada para a descrição do item
const itemsTable = document.getElementById('itemsTable').getElementsByTagName('tbody')[0]; // Corpo da tabela onde os itens serão exibidos

// Função para listar os itens na tabela
function listItems() {
    // Fazendo uma requisição GET para buscar os itens cadastrados no servidor
    fetch('http://localhost:5000/items')
        .then(response => response.json()) // Converte a resposta para formato JSON
        .then(items => {
            itemsTable.innerHTML = ''; // Limpa a tabela antes de inserir os novos itens
            // Para cada item, cria uma nova linha na tabela
            items.forEach(item => {
                const row = itemsTable.insertRow(); // Insere uma nova linha na tabela
                // Preenche as células da linha com os dados do item
                row.innerHTML = `
                    <td>${item._id}</td> <!-- Exibe o ID do item -->
                    <td>${item.name}</td> <!-- Exibe o nome do item -->
                    <td>${item.description}</td> <!-- Exibe a descrição do item -->
                    <td class="action-buttons">
                        <!-- Botão para deletar o item -->
                        <button onclick="deleteItem('${item._id}')">Deletar</button>
                    </td>
                `;
            });
        })
        .catch(error => console.error('Erro ao buscar itens:', error)); // Exibe erro no console caso algo dê errado
}

// Função para criar um novo item
createForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário (que seria recarregar a página)
    // Cria um objeto com os dados do novo item
    const newItem = {
        name: nameInput.value,
        description: descriptionInput.value
    };

    // Fazendo uma requisição POST para enviar os dados do novo item ao servidor
    fetch('http://localhost:5000/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, // Define o tipo de conteúdo como JSON
        body: JSON.stringify(newItem) // Converte o objeto newItem em uma string JSON
    })
    .then(response => response.json()) // Converte a resposta para formato JSON
    .then(() => {
        // Limpa os campos de entrada após adicionar o item
        nameInput.value = '';
        descriptionInput.value = '';
        listItems(); // Atualiza a lista de itens na tabela
    })
    .catch(error => console.error('Erro ao criar item:', error)); // Exibe erro no console caso algo dê errado
});

// Função para deletar um item
function deleteItem(id) {
    // Fazendo uma requisição DELETE para remover o item com o ID fornecido
    fetch(`http://localhost:5000/items/${id}`, { method: 'DELETE' })
        .then(() => listItems()) // Após a exclusão, atualiza a lista de itens
        .catch(error => console.error('Erro ao deletar item:', error)); // Exibe erro no console caso algo dê errado
}

// Função que é chamada quando o conteúdo da página é completamente carregado
document.addEventListener('DOMContentLoaded', listItems); 
// A função listItems é chamada para preencher a tabela com os itens do servidor assim que a página for carregada
