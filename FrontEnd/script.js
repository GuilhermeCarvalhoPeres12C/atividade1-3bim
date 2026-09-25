const API_URL = "http://localhost:3067";

const form = document.getElementById("filme-form");
const inputId = document.getElementById("filme-id");
const inputTitle = document.getElementById("title");
const inputGender = document.getElementById("gender");
const inputDuration = document.getElementById("duration");
const inputAgeRating = document.getElementById("ageRating");

const btnSalvar = document.getElementById("btn-salvar");
const btnCancelar = document.getElementById("btn-cancelar");
const btnAtualizarLista = document.getElementById("btn-atualizar-lista");
const fichaModo = document.getElementById("ficha-modo");
const formStatus = document.getElementById("form-status");
const listaFilmes = document.getElementById("lista-filmes");
const toast = document.getElementById("toast");

let modoEdicao = false;

document.addEventListener("DOMContentLoaded", carregarFilmes);
form.addEventListener("submit", salvarFilme);
btnCancelar.addEventListener("click", sairDoModoEdicao);
btnAtualizarLista.addEventListener("click", carregarFilmes);

async function carregarFilmes() {
  listaFilmes.innerHTML = `<p class="vazio">Carregando filmes...</p>`;

  try {
    const resposta = await fetch(`${API_URL}/`);
    if (!resposta.ok) throw new Error("Falha ao buscar os filmes.");

    const filmes = await resposta.json();
    renderizarFilmes(filmes);
  } catch (erro) {
    listaFilmes.innerHTML = `<p class="vazio">Não foi possível carregar os filmes. Confira se o servidor está rodando em ${API_URL}.</p>`;
    console.error(erro);
  }
}

function renderizarFilmes(filmes) {
  if (!filmes || filmes.length === 0) {
    listaFilmes.innerHTML = `<p class="vazio">Nenhum filme cadastrado ainda.</p>`;
    return;
  }

  listaFilmes.innerHTML = filmes.map(filmeParaHtml).join("");

  listaFilmes.querySelectorAll("[data-editar]").forEach((botao) => {
    botao.addEventListener("click", () => entrarNoModoEdicao(botao.dataset));
  });

  listaFilmes.querySelectorAll("[data-remover]").forEach((botao) => {
    botao.addEventListener("click", () => removerFilme(botao.dataset.remover, botao.dataset.title));
  });
}

function filmeParaHtml(filme) {
  const genero = filme.gender ?? filme.genre ?? "";
  const classificacao = filme.ageRating ?? filme.age_rating ?? "";

  return `
    <article class="ingresso">
      <h3>${escapeHtml(filme.title)}</h3>
      <span class="genero">${escapeHtml(genero)}</span>
      <div class="meta">
        <span><strong>${escapeHtml(String(filme.duration))}</strong> min</span>
        <span>Classificação <strong>${escapeHtml(String(classificacao))}</strong></span>
      </div>
      <div class="ingresso-acoes">
        <button
          type="button"
          class="btn-editar"
          data-editar
          data-id="${filme.id}"
          data-title="${escapeAttr(filme.title)}"
          data-gender="${escapeAttr(genero)}"
          data-duration="${filme.duration}"
          data-agerating="${escapeAttr(classificacao)}"
        >Editar</button>
        <button type="button" class="btn-remover" data-remover="${filme.id}" data-title="${escapeAttr(filme.title)}">Remover</button>
      </div>
    </article>
  `;
}

async function salvarFilme(evento) {
  evento.preventDefault();

  const filme = {
    title: inputTitle.value.trim(),
    gender: inputGender.value.trim(),
    duration: Number(inputDuration.value),
    ageRating: inputAgeRating.value.trim(),
  };

  if (!filme.title || !filme.gender || !filme.duration || !filme.ageRating) {
    mostrarStatus("Preencha todos os campos antes de salvar.", true);
    return;
  }

  btnSalvar.disabled = true;

  try {
    if (modoEdicao) {
      await atualizarFilme(inputId.value, filme);
      mostrarToast("Filme atualizado com sucesso!");
    } else {
      await criarFilme(filme);
      mostrarToast("Filme cadastrado com sucesso!");
    }

    form.reset();
    sairDoModoEdicao();
    carregarFilmes();
  } catch (erro) {
    mostrarStatus("Não foi possível salvar o filme. Tente novamente.", true);
    console.error(erro);
  } finally {
    btnSalvar.disabled = false;
  }
}

async function criarFilme(filme) {
  const resposta = await fetch(`${API_URL}/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(filme),
  });

  if (!resposta.ok) throw new Error("Falha ao criar filme.");
}

async function atualizarFilme(id, filme) {
  const resposta = await fetch(`${API_URL}/update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(filme),
  });

  if (!resposta.ok) throw new Error("Falha ao atualizar filme.");
}

async function removerFilme(id, titulo) {
  const confirmou = confirm(`Remover "${titulo}" do catálogo?`);
  if (!confirmou) return;

  try {
    const resposta = await fetch(`${API_URL}/delete/${id}`, { method: "DELETE" });
    if (!resposta.ok) throw new Error("Falha ao remover filme.");

    mostrarToast("Filme removido.");
    carregarFilmes();
  } catch (erro) {
    mostrarToast("Não foi possível remover o filme.", true);
    console.error(erro);
  }
}

function entrarNoModoEdicao(dados) {
  modoEdicao = true;

  inputId.value = dados.id;
  inputTitle.value = dados.title;
  inputGender.value = dados.gender;
  inputDuration.value = dados.duration;
  inputAgeRating.value = dados.agerating;

  fichaModo.textContent = `Editando: ${dados.title}`;
  btnSalvar.textContent = "Atualizar filme";
  btnCancelar.hidden = false;

  inputTitle.scrollIntoView({ behavior: "smooth", block: "center" });
  inputTitle.focus();
}

function sairDoModoEdicao() {
  modoEdicao = false;
  inputId.value = "";
  fichaModo.textContent = "Novo ingresso";
  btnSalvar.textContent = "Cadastrar filme";
  btnCancelar.hidden = true;
  form.reset();
  formStatus.textContent = "";
}

function mostrarStatus(mensagem, erro = false) {
  formStatus.textContent = mensagem;
  formStatus.classList.toggle("erro", erro);
}

let toastTimeout;
function mostrarToast(mensagem, erro = false) {
  clearTimeout(toastTimeout);
  toast.textContent = mensagem;
  toast.classList.toggle("erro", erro);
  toast.classList.add("mostrar");

  toastTimeout = setTimeout(() => {
    toast.classList.remove("mostrar");
  }, 2800);
}

function escapeHtml(valor) {
  return String(valor ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));
}

function escapeAttr(valor) {
  return escapeHtml(valor);
}
