const baseUrl = "https://projeto-pluto.vercel.app/";
const alunosEndpoint = "alunos";

const listaAlunosDiv = document.getElementById("listaAlunos");
const detalhesAlunoDiv = document.querySelector(".p-6.rounded-md.bg-gray-700.flex.flex-col.gap-4 > div");
const detalheNomeInput = document.getElementById("detalheNome");
const detalheCPFInput = document.getElementById("detalheCPF");
const detalheStatusDiv = document.getElementById("detalheStatus");
const cadastroAlunoDiv = document.getElementById("cadastroAluno");
const editarAlunoDiv = document.getElementById("editarAluno");

let alunoSelecionadoId = null;

// Função para carregar os detalhes de um aluno e armazenar o ID
async function mostrarDetalhesAluno(id) {
    alunoSelecionadoId = id;
    try {
        const response = await fetch(`${baseUrl}${alunosEndpoint}/${id}`);
        const alunoDetalhe = await response.json();

        detalheNomeInput.value = alunoDetalhe.nome;
        detalheCPFInput.value = alunoDetalhe.cpf;
        detalheStatusDiv.innerText = alunoDetalhe.status ? "Liberado" : "Bloqueado";
        detalheStatusDiv.className = alunoDetalhe.status ? "bg-green-500 text-white text-center font-bold py-2 rounded" : "bg-red-500 text-white text-center font-bold py-2 rounded";

        document.getElementById("btnEditarAluno").style.display = "inline-block";
        document.getElementById("btnExcluirAluno").style.display = "inline-block";
        detalhesAlunoDiv.style.display = "block";
        cadastroAlunoDiv.style.display = "none";
        editarAlunoDiv.style.display = "none";
    } catch (error) {
        console.error("Erro ao buscar detalhes do aluno:", error);
        alert("Erro ao buscar detalhes do aluno.");
    }
}

async function getAlunos() {
    try {
        const response = await fetch(baseUrl + alunosEndpoint);
        const alunosJson = await response.json();

        listaAlunosDiv.innerHTML = "";

        alunosJson.forEach(aluno => {
            const paragrafoAluno = document.createElement("p");
            paragrafoAluno.innerText = aluno.nome;
            paragrafoAluno.classList.add("cursor-pointer", "hover:text-yellow-300", "py-1");
            paragrafoAluno.addEventListener("click", () => mostrarDetalhesAluno(aluno.id));
            listaAlunosDiv.appendChild(paragrafoAluno);
        });
    } catch (error) {
        console.error("Erro ao buscar alunos:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    getAlunos();
    document.getElementById("btnEditarAluno").style.display = "none";
    document.getElementById("btnExcluirAluno").style.display = "none";
    detalhesAlunoDiv.style.display = "none";
    cadastroAlunoDiv.style.display = "none";
    editarAlunoDiv.style.display = "none";

    // Lógica para o botão "Cadastrar Novo Aluno"
    const btnCadastrarNovo = document.getElementById("btnCadastrarNovo");
    btnCadastrarNovo.addEventListener("click", () => {
        detalhesAlunoDiv.style.display = "none"; 
        cadastroAlunoDiv.style.display = "block"; 
        editarAlunoDiv.style.display = "none";
        document.getElementById("btnEditarAluno").style.display = "none";
        document.getElementById("btnExcluirAluno").style.display = "none";
    });

    const btnCancelarCadastro = document.getElementById("btnCancelarCadastro");
    btnCancelarCadastro.addEventListener("click", () => {
        cadastroAlunoDiv.style.display = "none";
        if (alunoSelecionadoId) {
            detalhesAlunoDiv.style.display = "block";
            document.getElementById("btnEditarAluno").style.display = "inline-block";
            document.getElementById("btnExcluirAluno").style.display = "inline-block";
        } else {
            detalhesAlunoDiv.style.display = "none";
        }
        document.getElementById("cadastroNome").value = "";
        document.getElementById("cadastroCPF").value = "";
    });

    const btnCadastrar = document.getElementById("btnCadastrar");
    btnCadastrar.addEventListener("click", async () => {
        const nome = document.getElementById("cadastroNome").value;
        const cpf = document.getElementById("cadastroCPF").value;

        if (!nome || !cpf) {
            alert("Por favor, preencha nome e CPF.");
            return;
        }

        try {
            const response = await fetch(baseUrl + alunosEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ nome: nome, cpf: cpf }),
            });

            if (response.ok) {
                alert("Aluno cadastrado com sucesso!");
                cadastroAlunoDiv.style.display = "none";
                getAlunos(); // Recarrega a lista de alunos
                detalhesAlunoDiv.style.display = "none";
                alunoSelecionadoId = null;
                document.getElementById("btnEditarAluno").style.display = "none";
                document.getElementById("btnExcluirAluno").style.display = "none";
                document.getElementById("cadastroNome").value = "";
                document.getElementById("cadastroCPF").value = "";
            } else {
                const errorData = await response.json();
                alert(`Erro ao cadastrar aluno: ${errorData.message || "Erro desconhecido"}`);
            }
        } catch (error) {
            console.error("Erro ao cadastrar aluno:", error);
            alert("Erro ao cadastrar aluno.");
        }
    });

    const btnExcluirAluno = document.getElementById("btnExcluirAluno");
    btnExcluirAluno.addEventListener("click", async () => {
        if (!alunoSelecionadoId) {
            alert("Selecione um aluno para excluir.");
            return;
        }

        if (confirm("Tem certeza que deseja excluir este aluno?")) {
            try {
                const response = await fetch(`${baseUrl}${alunosEndpoint}/${alunoSelecionadoId}`, {
                    method: "DELETE",
                });

                if (response.ok) {
                    alert("Aluno excluído com sucesso!");
                    detalheNomeInput.value = "";
                    detalheCPFInput.value = "";
                    detalheStatusDiv.innerText = "";
                    detalheStatusDiv.className = "text-center font-bold py-2 rounded";
                    document.getElementById("btnEditarAluno").style.display = "none";
                    document.getElementById("btnExcluirAluno").style.display = "none";
                    detalhesAlunoDiv.style.display = "none";
                    alunoSelecionadoId = null;
                    getAlunos();
                } else {
                    const errorData = await response.json();
                    alert(`Erro ao excluir aluno: ${errorData.message || "Erro desconhecido"}`);
                }
            } catch (error) {
                console.error("Erro ao excluir aluno:", error);
                alert("Erro ao excluir aluno.");
            }
        }
    });

    // Lógica para o botão "Editar"
    const btnEditarAluno = document.getElementById("btnEditarAluno");
    const editarNomeInput = document.getElementById("editarNome");
    const editarCPFInput = document.getElementById("editarCPF");
    const editarStatusSelect = document.getElementById("editarStatus");

    btnEditarAluno.addEventListener("click", () => {
        if (!alunoSelecionadoId) {
            alert("Selecione um aluno para editar.");
            return;
        }
        detalhesAlunoDiv.style.display = "none"; // Oculta os detalhes
        editarAlunoDiv.style.display = "block"; // Exibe o formulário de edição

        // Preenche o formulário de edição com os dados do aluno selecionado
        editarNomeInput.value = detalheNomeInput.value;
        editarCPFInput.value = detalheCPFInput.value;
        editarStatusSelect.value = detalheStatusDiv.innerText === "Liberado" ? "true" : "false";
    });

    const btnCancelarEdicao = document.getElementById("btnCancelarEdicao");
    btnCancelarEdicao.addEventListener("click", () => {
        editarAlunoDiv.style.display = "none";
        detalhesAlunoDiv.style.display = "block";
    });

    const btnSalvarEdicao = document.getElementById("btnSalvarEdicao");
    btnSalvarEdicao.addEventListener("click", async () => {
        if (!alunoSelecionadoId) {
            alert("Nenhum aluno selecionado para editar.");
            return;
        }

        const nome = editarNomeInput.value;
        const cpf = editarCPFInput.value;
        const status = editarStatusSelect.value === "true";

        if (!nome || !cpf) {
            alert("Por favor, preencha nome e CPF.");
            return;
        }

        try {
            const response = await fetch(`${baseUrl}${alunosEndpoint}/${alunoSelecionadoId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ nome: nome, cpf: cpf, status: status }),
            });

            if (response.ok) {
                alert("Aluno atualizado com sucesso!");
                editarAlunoDiv.style.display = "none";
                detalhesAlunoDiv.style.display = "block";
                mostrarDetalhesAluno(alunoSelecionadoId);
                getAlunos(); 
            } else {
                const errorData = await response.json();
                alert(`Erro ao atualizar aluno: ${errorData.message || "Erro desconhecido"}`);
            }
        } catch (error) {
            console.error("Erro ao atualizar aluno:", error);
            alert("Erro ao atualizar aluno.");
        }
    });
});