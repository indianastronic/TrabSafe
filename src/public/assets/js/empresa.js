const empresaId = localStorage.getItem("empresaId");

if (!empresaId) {
  window.location.href = "../login.html";
}

/* ================= UTIL ================= */

function formatarData(data) {
  if (!data) return "-";
  return new Date(data).toLocaleDateString("pt-BR");
}

/* ================= MODAL ================= */

function abrirModal() {
  document.getElementById("modalFuncionario").style.display = "flex";
}

function fecharModal() {
  document.getElementById("modalFuncionario").style.display = "none";
}

/* ================= DASHBOARD ================= */

let grafico;

async function carregarDashboard() {
  const res = await fetch(`/api/dashboard/empresa/${empresaId}`);
  const data = await res.json();

  const vencendo = Number(data.treinamentosVencendo) || 0;
  const aso = Number(data.asosVencendo) || 0;
  const validos = Number(data.treinamentosValidos) || 0;

  document.getElementById("treinamentosVencendo").innerText = vencendo;
  document.getElementById("asosVencendo").innerText = aso;
  document.getElementById("treinamentosValidos").innerText = validos;

  criarGrafico(vencendo, aso, validos);
}

function criarGrafico(vencendo, aso, validos) {
  const ctx = document.getElementById("grafico");

  if (grafico) grafico.destroy();

  grafico = new Chart(ctx, {
    type: "pie",
    data: {
      labels: [
        "Treinamentos vencendo",
        "ASOs vencendo",
        "Treinamentos válidos"
      ],
      datasets: [{
        data: [vencendo, aso, validos]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom" }
      }
    }
  });
}

/* ================= FUNCIONÁRIOS ================= */

let funcionariosCache = [];

async function carregarFuncionarios() {
  const res = await fetch(`/api/funcionarios/${empresaId}`);
  const lista = await res.json();

  funcionariosCache = lista;

  const tabela = document.getElementById("tabelaFuncionarios");
  tabela.innerHTML = "";

  lista.forEach(f => {
    tabela.innerHTML += `
      <tr>
        <td>${f.nome}</td>
        <td>${formatarData(f.aso_inicio)} / ${formatarData(f.aso_fim)}</td>
        <td>${formatarData(f.treino_inicio)} / ${formatarData(f.treino_fim)}</td>
        <td>${f.area || "-"}</td>
        <td>
          <button class="btn-icon" onclick="removerFuncionario(${f.id})">🗑️</button>
        </td>
      </tr>
    `;
  });
}

async function salvarFuncionario() {
  const body = {
    empresa_id: empresaId,
    nome: document.getElementById("nomeFunc").value,
    aso_inicio: document.getElementById("asoInicio").value || null,
    aso_fim: document.getElementById("asoFim").value || null,
    treino_inicio: document.getElementById("treinoInicio").value || null,
    treino_fim: document.getElementById("treinoFim").value || null,
    area: document.getElementById("areaFunc").value
  };

  if (!body.nome) {
    alert("Informe o nome do funcionário");
    return;
  }

  await fetch("/api/funcionarios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  fecharModal();
  carregarFuncionarios();
  carregarDashboard();
}

async function removerFuncionario(id) {
  if (!id) {
    alert("ID do funcionário não encontrado");
    return;
  }

  if (!confirm("Deseja remover este funcionário?")) return;

  const res = await fetch(`/api/funcionarios/${id}`, {
    method: "DELETE"
  });

  const data = await res.json();

  if (!data.success) {
    alert("Erro ao remover funcionário");
    return;
  }

  carregarFuncionarios();
  carregarDashboard();
}


/* ================= LOGOUT ================= */

function logout() {
  localStorage.clear();
  window.location.href = "../index.html";
}
function gerarPDF() {
  if (!funcionariosCache.length) {
    alert("Não há funcionários para gerar o relatório");
    return;
  }

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  pdf.setFontSize(16);
  pdf.text("Relatório de Funcionários - TrabSafe", 14, 20);

  let y = 35;

  funcionariosCache.forEach((f, i) => {
    pdf.setFontSize(11);

    pdf.text(`Nome: ${f.nome}`, 14, y); y += 6;
    pdf.text(`ASO: ${formatarData(f.aso_inicio)} até ${formatarData(f.aso_fim)}`, 14, y); y += 6;
    pdf.text(`Treinamento: ${formatarData(f.treino_inicio)} até ${formatarData(f.treino_fim)}`, 14, y); y += 6;
    pdf.text(`Área: ${f.area || "-"}`, 14, y); y += 10;

    if (y > 270) {
      pdf.addPage();
      y = 20;
    }
  });

  pdf.save("relatorio-funcionarios.pdf");
}


/* ================= INIT ================= */

carregarDashboard();
carregarFuncionarios();
