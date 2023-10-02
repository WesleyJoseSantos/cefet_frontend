var host = 'http://localhost:4444'

var clients = {}
var selectedClient = {}

axios.get(host).then((res) => {
    console.log(res.data)

    // var author = document.createElement('p')
    // var version = document.createElement('p')

    // author.textContent = `Autor: ${res.data.author}`
    // version.textContent = `Backend: v${res.data.version} | Frontend: v0.1.0`

    // document.body.appendChild(author)
    // document.body.appendChild(version)
})

document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const sobrenome = document.getElementById('sobrenome').value;
    const email = document.getElementById('email').value;
    const salario = document.getElementById('salario').value;

    const user = {
        nome,
        sobrenome,
        email,
        salario
    };

    axios.post(`${host}/cliente`, user)
        .then(function (response) {
            alert('Cadastro realizado com sucesso!');
        })
        .catch(function (error) {
            alert('Ocorreu um erro ao cadastrar o usuário.');
            console.error(error);
        });
});

axios.get(`${host}/cliente`).then((res) => {
    // Crie um div que conterá a tabela
    var tableContainer = document.createElement('div');

    // Adicione margem ao div (por exemplo, 20px)
    tableContainer.style.marginRight = '50px';
    tableContainer.style.marginLeft = '50px';

    // Crie a tabela e aplique as classes Bootstrap
    var table = document.createElement('table');
    table.classList.add('table', 'table-striped');

    var html = '<table>';
    html += "<thead>";
    html += "<tr>";
    html += `<th>Nome</th>`;
    html += `<th>Sobrenome</th>`;
    html += `<th>Email</th>`;
    html += `<th></th>`; // Actions column
    html += "</tr>";
    html += "</thead>";
    html += "<tbody>";
    res.data.forEach(element => {
        html += `<tr id="row${element.id_cliente}">`;
        html += `<td>${element.nome}</td>`;
        html += `<td>${element.sobrenome}</td>`;
        html += `<td>${element.email}</td>`;
        html += `<td><a href="perfil.html?cliente=${element.id_cliente}">Perfil</a></td>`;
        html += `<td><a href="#" onclick="updateClient(${element.id_cliente}); return false;">Atualizar</a></td>`;
        html += `<td><a href="#" onclick="deleteClient(${element.id_cliente}); return false;">Apagar</a></td>`;
        html += "</tr>";
        element.salario = Math.round(element.salario * 100) / 100
        clients[element.id_cliente] = element
    });
    html += "</tbody>";
    html += "</table>";
    table.innerHTML = html;

    // Adicione a tabela ao div contêiner
    tableContainer.appendChild(table);

    // Adicione o div contêiner à página HTML (por exemplo, ao corpo do documento)
    document.body.appendChild(tableContainer);
});

function deleteClient(clientId) {
    var confirmation = window.confirm("Tem certeza que deseja remover esse cliente?");
    if (confirmation) {
        console.log(clientId)
        axios.delete(`${host}/cliente/${clientId}`)
            .then(function (response) {
                var row = document.getElementById(`row${clientId}`)
                if (row) row.remove()
                alert('Cliente deletado com sucesso!');
            })
            .catch(function (error) {
                alert('Ocorreu um erro deletar o cliente.');
                console.error(error);
            });
    }
}

function updateClient(clientId) {
    document.documentElement.scrollTop = 0;
    selectedClient = clients[clientId];
    console.log(selectedClient)

    // TODO: voltar para cadastrar após atualizar usuário

    $("#nome").val(selectedClient.nome)
    $("#sobrenome").val(selectedClient.sobrenome)
    $("#email").val(selectedClient.email)
    $("#salario").val(selectedClient.salario)

    $(document).ready(function() {
        const formulario = $("#client-form");
        formulario.attr("method", "PATCH");
        formulario.attr("action", "http://localhost:4444/cliente/" + clientId);
    });

    $("#btn").text("Atualizar")
}
