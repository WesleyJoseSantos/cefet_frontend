import env from "./env.js"

var host = env.API
var supliers = {}
var selectedSuplier = {}

axios.get(host).then((res) => {
    console.log(res.data)

    // var author = document.createElement('p')
    // var version = document.createElement('p')

    // author.textContent = `Autor: ${res.data.author}`
    // version.textContent = `Backend: v${res.data.version} | Frontend: v0.1.0`

    // document.body.appendChild(author)
    // document.body.appendChild(version)
})

document.querySelector('form').addEventListener('submit', registerSuplier);

axios.get(`${host}/fornecedor`).then((res) => {
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
    html += `<th>Razao</th>`;
    html += `<th>CPF/CNPJ</th>`;
    html += `<th>Contato</th>`;
    html += `<th></th>`; // Actions column
    html += "</tr>";
    html += "</thead>";
    html += "<tbody>";
    res.data.forEach(element => {
        html += `<tr id="row${element.id_fornecedor}">`;
        html += `<td>${element.razao}</td>`;
        html += `<td>${element.cpf_cnpj}</td>`;
        html += `<td>${element.contato}</td>`;
        html += `<td><a href="perfil.html?fornecedor=${element.id_fornecedor}">Perfil</a></td>`;
        html += `<td><a href="#" onclick="updateSuplier(${element.id_fornecedor}); return false;">Atualizar</a></td>`;
        html += `<td><a href="#" onclick="deleteSuplier(${element.id_fornecedor}); return false;">Apagar</a></td>`;
        html += "</tr>";
        element.logradouro = Math.round(element.logradouro * 100) / 100
        supliers[element.id_fornecedor] = element
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

function deleteSuplier(suplierId) {
    var confirmation = window.confirm("Tem certeza que deseja remover esse fornecedor?");
    if (confirmation) {
        console.log(suplierId)
        axios.delete(`${host}/fornecedor/${suplierId}`)
            .then(function (response) {
                var row = document.getElementById(`row${suplierId}`)
                if (row) row.remove()
            })
            .catch(function (error) {
                alert('Ocorreu um erro deletar o fornecedor.');
                console.error(error);
            });
    }
}

function registerSuplier(e) {
    e.preventDefault();

    const avatar = document.getElementById('avatar').files[0]
    const razao = document.getElementById('razao').value;
    const cpf_cnpj = document.getElementById('cpf_cnpj').value;
    const contato = document.getElementById('contato').value;
    const logradouro = document.getElementById('logradouro').value;
    const cidade = document.getElementById('cidade').value;
    const uf = document.getElementById('uf').value;

    const suplier = {
        razao,
        cpf_cnpj,
        contato,
        logradouro,
        cidade,
        uf,
    };

    formData = new FormData()
    formData.append('avatar', avatar)
    formData.append('razao', razao)
    formData.append('cpf_cnpj', cpf_cnpj)
    formData.append('contato', contato)
    formData.append('logradouro', logradouro)
    formData.append('cidade', cidade)
    formData.append('uf', uf)

    headers = {
        'Content-Type': 'multipart/form-data'
    }

    axios.post(`${host}/fornecedor`, formData, { headers: headers })
        .then(function (response) {
            addSupplierToTable(suplier)
            $('#avatar').val('')
            $("#razao").val('')
            $("#cpf_cnpj").val('')
            $("#contato").val('')
            $("#logradouro").val('')
            $("#cidade").val('')
            $("#uf").val('')
            window.scrollTo(0, document.body.scrollHeight);
            alert('Cadastro realizado com sucesso!');
        })
        .catch(function (error) {
            alert('Ocorreu um erro ao cadastrar o fornecedor.');
            console.error(error);
        });
}

function updateSuplier(suplierId) {
    document.documentElement.scrollTop = 0;
    selectedSuplier = supliers[suplierId];
    console.log(selectedSuplier)

    $("#razao").val(selectedSuplier.razao)
    $("#cpf_cnpj").val(selectedSuplier.cpf_cnpj)
    $("#contato").val(selectedSuplier.contato)
    $("#logradouro").val(selectedSuplier.logradouro)
    $("#cidade").val(selectedSuplier.cidade)
    $("#uf").val(selectedSuplier.uf)
    $("#btn").text("Atualizar")

    removeEventsFromElement('client-form')
    document.querySelector('form').addEventListener('submit', () => {
        const razao = document.getElementById('razao').value;
        const cpf_cnpj = document.getElementById('cpf_cnpj').value;
        const contato = document.getElementById('contato').value;
        const logradouro = document.getElementById('logradouro').value;
        const cidade = document.getElementById('cidade').value;
        const uf = document.getElementById('uf').value;

        const suplier = {
            razao,
            cpf_cnpj,
            contato,
            logradouro,
            cidade,
            uf
        };

        axios.patch(`${host}/fornecedor/${suplierId}`, suplier)
            .then(function (response) {
                $("#razao").val('')
                $("#cpf_cnpj").val('')
                $("#contato").val('')
                $("#logradouro").val('')
                $("#cidade").val('')
                $("uf").val('')
                window.scrollTo(0, document.body.scrollHeight);
                alert('Atualização realizada com sucesso!');
                location.reload()
            })
            .catch(function (error) {
                alert('Ocorreu um erro ao atualizar o fornecedor.');
                console.error(error);
            });
    });
}

function addSupplierToTable(suplierData) {
    // Encontre a tabela existente
    var table = document.getElementById('users-table').getElementsByTagName('tbody')[0];

    // Crie uma nova linha para o novo fornecedor
    var newRow = table.insertRow(table.rows.length);
    newRow.id = 'row' + suplierData.id_fornecedor;

    // Preencha as células da nova linha com os dados do fornecedor
    var cell1 = newRow.insertCell(0);
    cell1.innerHTML = suplierData.razao;

    var cell2 = newRow.insertCell(1);
    cell2.innerHTML = suplierData.cpf_cnpj;

    var cell3 = newRow.insertCell(2);
    cell3.innerHTML = suplierData.contato;

    var cell4 = newRow.insertCell(3);
    cell4.innerHTML = '<a href="perfil.html?fornecedor=' + suplierData.id_fornecedor + '">Perfil</a>';

    var cell5 = newRow.insertCell(4);
    cell5.innerHTML = '<a href="#" onclick="updateSuplier(' + suplierData.id_fornecedor + '); return false;">Atualizar</a>';

    var cell6 = newRow.insertCell(5);
    cell6.innerHTML = '<a href="#" onclick="deleteSuplier(' + suplierData.id_fornecedor + '); return false;">Apagar</a>';
}

function removeEventsFromElement(elementId) {
    var element = document.getElementById(elementId);

    if (element) {
        var clone = element.cloneNode(true);
        element.parentNode.replaceChild(clone, element);
    }
}

function previewImage() {
    var preview = document.getElementById("image-preview");
    var fileInput = document.getElementById("avatar");

    var file = fileInput.files[0];

    if (file) {
        var reader = new FileReader();

        reader.onload = function (e) {
            preview.src = e.target.result;
        }

        reader.readAsDataURL(file);
    } else {
        preview.src = "";
    }
}