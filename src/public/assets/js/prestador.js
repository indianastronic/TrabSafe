/* -----------------------------
   PRESTADOR LOGADO
----------------------------- */
const prestadorId = localStorage.getItem("prestadorId");
if (!prestadorId) location.href = "/login.html";

/* -----------------------------
   CARREGAR SOLICITAÇÕES
----------------------------- */
async function carregarSolicitacoes() {
  try {
    const res = await fetch(`/api/solicitacoes/todas`);
    const solicitacoes = await res.json();

    const tbody = document.getElementById("listaSolicitacoes");
    tbody.innerHTML = "";

    let pendentes = 0;
    let andamento = 0;
    let concluidas = 0;

    solicitacoes.forEach(s => {
      // Atualiza contadores
      if (s.status === "pendente") pendentes++;
      else if (s.status === "andamento") andamento++;
      else if (s.status === "concluida") concluidas++;

      // Cria linha da tabela
      const tr = document.createElement("tr");
      tr.setAttribute("data-id", s.id);
      tr.setAttribute("data-status", s.status);

      const btn = s.status === "pendente"
        ? `<button onclick="alterarStatus(this)">Aceitar</button>`
        : s.status === "andamento"
          ? `<button onclick="alterarStatus(this)">Concluir</button>`
          : "-";

      tr.innerHTML = `
        <td>${s.empresa}</td>
        <td>${s.tipo_servico}</td>
        <td class="status">${s.status}</td>
        <td>${btn}</td>
      `;
      tbody.appendChild(tr);
    });

    atualizarContadores(pendentes, andamento, concluidas);

  } catch (err) {
    console.error("Erro ao carregar solicitações:", err);
  }
}

/* -----------------------------
   ALTERAR STATUS
   Aceitar -> Andamento
   Concluir -> apenas incrementa card Concluídas
----------------------------- */
function alterarStatus(btn) {
  const tr = btn.closest("tr");
  const statusCell = tr.querySelector(".status");
  const currentStatus = tr.getAttribute("data-status");

  if (currentStatus === "pendente") {
    // Pendente -> Andamento
    statusCell.innerText = "andamento";
    tr.setAttribute("data-status", "andamento");
    btn.innerText = "Concluir";
  } else if (currentStatus === "andamento") {
    // Andamento -> Concluída (incrementa card)
    tr.setAttribute("data-status", "concluida");
    statusCell.innerText = "concluida";
    btn.style.display = "none"; // esconde botão
  }

  // Atualiza os cards
  recarregarCards();
}

/* -----------------------------
   ATUALIZA OS CARDS
----------------------------- */
function recarregarCards() {
  const rows = document.querySelectorAll("#listaSolicitacoes tr");
  let pendentes = 0, andamento = 0, concluidas = 0;

  rows.forEach(tr => {
    const status = tr.getAttribute("data-status");
    if (status === "pendente") pendentes++;
    else if (status === "andamento") andamento++;
    else if (status === "concluida") concluidas++;
  });

  atualizarContadores(pendentes, andamento, concluidas);
}

function atualizarContadores(pendentes, andamento, concluidas) {
  document.getElementById("pendentes").innerText = pendentes;
  document.getElementById("andamento").innerText = andamento;
  document.getElementById("concluidas").innerText = concluidas;
}

/* -----------------------------
   INICIALIZAÇÃO
----------------------------- */
carregarSolicitacoes();
