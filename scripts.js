/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getList = async () => {
  let url = 'http://127.0.0.1:5000/contatos';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.produtos.forEach(item => insertList(item.nome, item.quantidade, item.valor))
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/
getList()


/*
  --------------------------------------------------------------------------------------
  Função para colocar um item na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const postItem = async (inputProduct, inputQuantity, inputPrice) => {
  const formData = new FormData();
  formData.append('nome', inputProduct);
  formData.append('quantidade', inputQuantity);
  formData.append('valor', inputPrice);

  let url = 'http://127.0.0.1:5000/contato';
  fetch(url, {
    method: 'post',
    body: formData
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}


/*
  --------------------------------------------------------------------------------------
  Função para criar um botão close para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertButton = (parent) => {
  let span = document.createElement("span");
  let txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  parent.appendChild(span);
}


/*
  --------------------------------------------------------------------------------------
  Função para remover um item da lista de acordo com o click no botão close
  --------------------------------------------------------------------------------------
*/
const removeElement = () => {
  let close = document.getElementsByClassName("close");
  // var table = document.getElementById('myTable');
  let i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const nomeItem = div.getElementsByTagName('td')[0].innerHTML
      if (confirm("Você tem certeza?")) {
        div.remove()
        deleteItem(nomeItem)
        alert("Removido!")
      }
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para deletar um item da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = (item) => {
  console.log(item)
  let url = 'http://127.0.0.1:5000/contato?nome=' + item;
  fetch(url, {
    method: 'delete'
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo item com nome, quantidade e valor 
  --------------------------------------------------------------------------------------
*/
const newItem = () => {
  let inputProduct = document.getElementById("newInput").value;
  let inputQuantity = document.getElementById("newQuantity").value;
  let inputPrice = document.getElementById("newPrice").value;

  // Validação para o nome do produto
  if (inputProduct === '') {
    alert("Escreva o nome de um item!");
  } 
  // Validação para a quantidade ser um número
  else if (isNaN(inputQuantity)) {
    alert("Quantidade precisa ser um número!");
  } 
  // Validação para o preço ser uma data no formato DD-MM-AAAA
  else if (!validateDate(inputPrice)) {
    alert("O preço precisa ser uma data no formato DD-MM-AAAA!");
  } 
  else {
    insertList(inputProduct, inputQuantity, inputPrice);
    postItem(inputProduct, inputQuantity, inputPrice);
    alert("Item adicionado!");
  }
}

// Função para validar o formato de data DD-MM-AAAA
const validateDate = (date) => {
  const regex = /^([0-2][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;
  return regex.test(date);
}

/*
  --------------------------------------------------------------------------------------
  Função para buscar um contato na base 
  --------------------------------------------------------------------------------------
*/
const searchItem = () => {
  let nameProduct = document.getElementById("newInputSearch").value;

  let url = 'http://127.0.0.1:5000/contato?nome=' + nameProduct;
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => 
      {console.log(data)})
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/
const insertList = (nameProduct, quantity, price) => {
  var item = [nameProduct, quantity, price]
  var table = document.getElementById('myTable');
  var row = table.insertRow();

  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];
  }
  insertButton(row.insertCell(-1))
  document.getElementById("newInput").value = "";
  document.getElementById("newQuantity").value = "";
  document.getElementById("newPrice").value = "";

  removeElement()
}
