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
      // Ordena os contatos ignorando o ano (apenas mês e dia)
      data.contatos.sort((a, b) => {
        const [dayA, monthA] = a.data_nascimento.split('-').slice(0, 2); // extrai o dia e mês
        const [dayB, monthB] = b.data_nascimento.split('-').slice(0, 2); // extrai o dia e mês

        // Compara primeiro os meses, depois os dias
        if (monthA === monthB) {
          return dayA - dayB; // Se os meses forem iguais, compara os dias
        } else {
          return monthA - monthB; // Se os meses forem diferentes, compara os meses
        }
      });

      // Exibe a lista ordenada com o formato 'DD-MM-AAAA' para o usuário
      data.contatos.forEach(item => {
        // Mantém o formato 'DD-MM-AAAA' para exibição
        const [year, month, day] = item.data_nascimento.split('-');
        const formattedDate = `${day}-${month}-${year}`;  // Formata para 'DD-MM-AAAA' (com o ano)

        // Chama a função para inserir o item na interface
        insertList(item.nome, item.celular, formattedDate);
      });
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
const postItem = async (inputContact, inputCell, inputBirthdate) => {
  const formData = new FormData();
  formData.append('nome', inputContact);
  formData.append('celular', inputCell);
  formData.append('data_nascimento', inputBirthdate);

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
  let inputContact = document.getElementById("newInput").value.trim(); // Remove espaços desnecessários
  let inputCell = document.getElementById("newCell").value.trim();
  let inputBirthdate = document.getElementById("newBirthdate").value;

  // Validação para garantir que todos os campos estão preenchidos
  if (inputContact === '') {
    alert("Informe o nome do contato");
    return;
  } else if (inputCell === '') {
    alert("Informe o whatsapp do contato");
    return;
  } else if (inputBirthdate === '') {
    alert("Informe a data de nascimento do contato");
    return;
  }

  // Verifica se o nome já existe na tabela do front-end
  let table = document.getElementById("myTable");
  let rows = table.getElementsByTagName("tr");

  for (let i = 0; i < rows.length; i++) {
    let cell = rows[i].getElementsByTagName("td")[0]; // Coluna do nome
    if (cell && cell.textContent.trim().toLowerCase() === inputContact.toLowerCase()) {
      alert("Este nome já foi cadastrado!");
      return;
    }
  }

  // Usa a data diretamente no formato 'YYYY-MM-DD' para postItem e insertList
  const formattedDate = inputBirthdate; // Mantém o formato original

  // Insere no front-end e envia para o banco de dados
  insertList(inputContact, inputCell, formattedDate); // Passa a data original
  postItem(inputContact, inputCell, formattedDate);   // Passa a data original

  alert("Item adicionado!");
}

/*
  --------------------------------------------------------------------------------------
  Função para buscar um contato na base 
  --------------------------------------------------------------------------------------
*/
const searchItem = () => {
  let nameContact = document.getElementById("newInputSearch").value;

  let url = 'http://127.0.0.1:5000/contato?nome=' + nameContact;
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      if (data && data.nome) {
        // Limpa os resultados anteriores
        const searchTableBody = document.getElementById("searchTableBody");
        searchTableBody.innerHTML = "";

        // Cria uma nova linha com os dados do contato
        const row = searchTableBody.insertRow();
        row.insertCell(0).textContent = data.nome;
        row.insertCell(1).textContent = data.celular;
        row.insertCell(2).textContent = data.data_nascimento;
      } else {
        alert("Contato não encontrado.");
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      alert("Erro ao buscar o contato.");
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/
const insertList = (nameContact, cell, birthdate) => {
  var item = [nameContact, cell, birthdate]
  var table = document.getElementById('myTable');
  var row = table.insertRow();

  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];
  }
  insertButton(row.insertCell(-1))
  document.getElementById("newInput").value = "";
  document.getElementById("newCell").value = "";
  document.getElementById("newBirthdate").value = "";

  removeElement()
}
