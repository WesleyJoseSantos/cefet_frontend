import env from "./env.js"

var host = env.API
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

document.querySelector('form').addEventListener('submit', registerClient);

axios.get(`${host}/cliente`).then((res) => {
    // Crie um div que conterá a tabela
    var tableContainer = document.createElement('div');

    // Adicione margem ao div (por exemplo, 20px)
    tableContainer.style.marginRight = '50px';
    tableContainer.style.marginLeft = '50px';

    // Crie a tabela e aplique as classes Bootstrap
    var table = document.createElement('table');
    table.classList.add('table', 'table-striped');
    table.id = 'users-table'

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
    html += "<br>";
    html += "<br>";
    table.innerHTML = html;

    // Adicione a tabela ao div contêiner
    tableContainer.appendChild(table);

    // Adicione o div contêiner à página HTML (por exemplo, ao corpo do documento)
    document.body.appendChild(tableContainer);

    // Criar um botão "Voltar ao Início" com Bootstrap
    var backButton = document.createElement('button');
    backButton.classList.add('btn', 'btn-primary', 'fixed-bottom');
    backButton.textContent = 'Voltar ao Início';

    // Adicionar um evento de clique para rolar a página para o topo
    backButton.addEventListener('click', function () {
        window.scrollTo(0, 0); // Rolar para o topo
    });

    // Adicionar o botão à página
    document.body.appendChild(backButton);
});

function deleteClient(clientId) {
    var confirmation = window.confirm("Tem certeza que deseja remover esse cliente?");
    if (confirmation) {
        console.log(clientId)
        axios.delete(`${host}/cliente/${clientId}`)
            .then(function (response) {
                var row = document.getElementById(`row${clientId}`)
                if (row) row.remove()
            })
            .catch(function (error) {
                alert('Ocorreu um erro deletar o cliente.');
                console.error(error);
            });
    }
}

function registerClient(e) {
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
            addClientToTable(user)
            $("#nome").val('')
            $("#sobrenome").val('')
            $("#email").val('')
            $("#salario").val('')
            window.scrollTo(0, document.body.scrollHeight);
            alert('Cadastro realizado com sucesso!');
        })
        .catch(function (error) {
            alert('Ocorreu um erro ao cadastrar o usuário.');
            console.error(error);
        });
}

function updateClient(clientId) {
    document.documentElement.scrollTop = 0;
    selectedClient = clients[clientId];
    console.log(selectedClient)

    $("#nome").val(selectedClient.nome)
    $("#sobrenome").val(selectedClient.sobrenome)
    $("#email").val(selectedClient.email)
    $("#salario").val(selectedClient.salario)
    $("#btn").text("Atualizar")

    removeEventsFromElement('client-form')
    document.querySelector('form').addEventListener('submit', () => {
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

        axios.patch(`${host}/cliente/${clientId}`, user)
            .then(function (response) {
                $("#nome").val('')
                $("#sobrenome").val('')
                $("#email").val('')
                $("#salario").val('')
                window.scrollTo(0, document.body.scrollHeight);
                alert('Atualização realizada com sucesso!');
                location.reload()
            })
            .catch(function (error) {
                alert('Ocorreu um erro ao atualizar o usuário.');
                console.error(error);
            });
    });
}

function addClientToTable(clientData) {
    // Encontre a tabela existente
    var table = document.getElementById('users-table').getElementsByTagName('tbody')[0];

    // Crie uma nova linha para o novo cliente
    var newRow = table.insertRow(table.rows.length);
    newRow.id = 'row' + clientData.id_cliente;

    // Preencha as células da nova linha com os dados do cliente
    var cell1 = newRow.insertCell(0);
    cell1.innerHTML = clientData.nome;

    var cell2 = newRow.insertCell(1);
    cell2.innerHTML = clientData.sobrenome;

    var cell3 = newRow.insertCell(2);
    cell3.innerHTML = clientData.email;

    var cell4 = newRow.insertCell(3);
    cell4.innerHTML = '<a href="perfil.html?cliente=' + clientData.id_cliente + '">Perfil</a>';

    var cell5 = newRow.insertCell(4);
    cell5.innerHTML = '<a href="#" onclick="updateClient(' + clientData.id_cliente + '); return false;">Atualizar</a>';

    var cell6 = newRow.insertCell(5);
    cell6.innerHTML = '<a href="#" onclick="deleteClient(' + clientData.id_cliente + '); return false;">Apagar</a>';
}

function removeEventsFromElement(elementId) {
    var element = document.getElementById(elementId);

    if (element) {
        var clone = element.cloneNode(true);
        element.parentNode.replaceChild(clone, element);
    }
}
