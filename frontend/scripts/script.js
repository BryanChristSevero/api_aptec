//UrL base da API
const API_URL = "http://localhost:8080";

//Evento executado automaticamente assim que toda estrutura html for carregafa
document.addEventListener("DOMContentLoaded",()=>{
    getTask(); // chama a função para listar as tarefas de um usuario logado
})

//Função assincrona resposnsável por buscar e exibir as tarefas do usuario autenticado
async function getTask(){
    //Recupera a string do token JWT salva no local storrage durante o login
    const token = localStorage.getItem("Authorization");

    if(!token){
        alert("Acesso não autorizado! Faça login primeiro");
        window.location.href = "login.html"; //Redireciona imediatamete para a tela de login
        return; //Interrompe a execução 
    }

    //Exibe o spinner de carregamento na tela
    document.getElementById("Loading").style.display = "Block";

    try{
        //Envia requisição GET para o endpoint /task/user passando o token no cabeçalho Authorization
        const response = await fetch('${API_URL}/task/user',{
            method: "GET", // Método HTTP de busca
            headers:{
                "Authorization":token, //Envia o token 'bearer<token>' gravado no localstorage
                "Content-Type":"Application/json" //Tipo de requisição
            }
        });
    
    //Se o token for aceito pela API
    if(response.ok){
        // converte a reposta recebida (tasProjection) em um array javascript
        const tasks = await response.json();

        //Reinderiza as tarefas na página
        renderTasks(tasks);
    } else if (response.status === 403 || response.status === 401){
        //Se o token tiver expirado ou for invalido
        alert("Sessão expirada. Por favvor, faça login novamente.");
        logout(); // Executa o encerramento da sessão
    } else {
        alert("Erro ao buscar tarefas.");
         }
    } catch (error){
        console.error("Erro na busca de tarefas:", error);
        alert("Erro de conexão com o servidor");
    } finally {
        document.getElementById("Loading").style.display = "none";
    }
}

//função reponsavel por montar o HTML da lista de tarefas recebidas da API
function renderTasks(tasks){
    const taskList = document.getElementById("task-list"); //Seleciona o elemento <ul> no DOM
    taskList.innerHTML = ""; // limpa a lista antes de inserir novos itens

    //Se a lista retorna estiver vazia
    if(tasks.length === 0){
        taskList.innerHTML = '<li class="list-group-item text-center text-muted">Nenhuma tarefa encontrada.</li>';
        return;
    }

    //Percorre cada objeto do tipo TaskProjection(possuindo apenas o id e description)
    tasks.forEach(task => {
        //cria um elemto de lista <li> do bootstrap
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        
        //Define o texto da descrição da tarefa na lista
        li.innerHTML = '<span>${task.description}</span>';

        //adiciona o item a lista principal no html
        taskList.appendChild(li);
    });
}

//Função responsável por encerrar a sessão do usuario no navegador
function logout(){
    //Remove a chave 'Authorization' contendo o token do localStorage
    localStorage.removeItem("Authorization");

    //Redireciona o usuário para a página de login 
    window.location.href = "login.html";
}