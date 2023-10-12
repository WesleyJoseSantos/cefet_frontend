import env from "./env.js"

var host = env.API;
const parametros = new URLSearchParams(window.location.search);
const clientId = parametros.get('cliente');
const suplierId = parametros.get('fornecedor');

if (clientId != null) {
    axios.get(`${host}/cliente/${clientId}`).then((res) => {
        console.log(res.data[0])
        createClientCard(res.data[0])
    })
}

if (suplierId != null) {
    axios.get(`${host}/fornecedor/${suplierId}`).then((res) => {
        console.log(res.data[0])
        createSuplierCard(res.data[0])
    })
}

function createClientCard(data) {
    const cardDiv = document.getElementById('card');

    // Create html
    const card = document.createElement('div');
    card.className = 'card';

    const row = document.createElement('div');
    row.className = 'row no-gutters';

    const imgCol = document.createElement('div');
    imgCol.className = 'col-md-4';

    const img = document.createElement('img');
    img.className = 'card-img';
    img.src = 'http://localhost:4444/cefet.png';
    img.alt = 'Sample Image';

    const textCol = document.createElement('div');
    textCol.className = 'col-md-8';

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const cardTitle = document.createElement('h5');
    cardTitle.className = 'card-title';
    cardTitle.textContent = data.nome + ' ' + data.sobrenome;

    const cardEmail = document.createElement('p');
    cardEmail.className = 'card-text';
    cardEmail.textContent = 'Email: ' + data.email;

    const cardSalary = document.createElement('p');
    cardSalary.className = 'card-text';
    cardEmail.textContent = 'Salário: ' + Math.round(data.salario * 100) / 100 + ' R$'

    const backButton = document.createElement('a');
    backButton.className = 'btn btn-primary';
    backButton.href = 'index.html';
    backButton.textContent = 'Voltar';

    // Add elements to DOM
    card.appendChild(row);
    row.appendChild(imgCol);
    imgCol.appendChild(img);
    row.appendChild(textCol);
    textCol.appendChild(cardBody);
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardEmail);
    cardBody.appendChild(cardSalary);
    cardBody.appendChild(backButton);

    cardDiv.appendChild(card);
}

function createSuplierCard(data) {
    const cardDiv = document.getElementById('card');

    // Create html
    const card = document.createElement('div');
    card.className = 'card';

    const row = document.createElement('div');
    row.className = 'row no-gutters';

    const imgCol = document.createElement('div');
    imgCol.className = 'col-md-4';

    const img = document.createElement('img');
    img.className = 'card-img';
    img.src = `http://localhost:4444/images/fornecedor/${data.id_fornecedor}.png`;
    img.alt = 'Sample Image';

    const textCol = document.createElement('div');
    textCol.className = 'col-md-8';

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const cardTitle = document.createElement('h5');
    cardTitle.className = 'card-title';
    cardTitle.textContent = data.razao;

    const cardCpfCnpj = document.createElement('p');
    cardCpfCnpj.className = 'card-text';
    cardCpfCnpj.textContent = 'CPF/CNPJ: ' + data.cpf_cnpj;

    const cardContact = document.createElement('p');
    cardContact.className = 'card-text';
    cardContact.textContent = 'Contato: ' + data.contato;

    const cardAddress = document.createElement('p');
    cardAddress.className = 'card-text';
    cardAddress.textContent = 'Logradouro: ' + data.logradouro;

    const cardCity = document.createElement('p');
    cardCity.className = 'card-text';
    cardCity.textContent = 'Cidade: ' + data.cidade + ' - ' + data.uf;

    const backButton = document.createElement('a');
    backButton.className = 'btn btn-primary';
    backButton.href = 'fornecedores.html';
    backButton.textContent = 'Voltar';

    // Add elements to DOM
    card.appendChild(row);
    row.appendChild(imgCol);
    imgCol.appendChild(img);
    row.appendChild(textCol);
    textCol.appendChild(cardBody);
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardCpfCnpj);
    cardBody.appendChild(cardContact);
    cardBody.appendChild(cardAddress);
    cardBody.appendChild(cardCity);
    cardBody.appendChild(backButton);

    cardDiv.appendChild(card);
}