let etapa = 0;
let dados = {};

const chat = document.getElementById("chat");
const input = document.getElementById("mensagem");

function adicionarMensagem(texto, tipo = "ia") {
  const div = document.createElement("div");
  div.className = `chat-message ${tipo}`;
  div.innerText = texto;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}


/* Mensagem inicial */
adicionarMensagem("Olá! Qual o nome da sua empresa?");

async function enviarMensagem() {
  const texto = input.value.trim();
  if (!texto) return;

  adicionarMensagem(texto, "user");
  input.value = "";

  const resposta = texto.toLowerCase();

  /* 1️⃣ Nome da empresa */
  if (etapa === 0) {
    dados.empresa = texto;
    adicionarMensagem("Qual o ramo de atuação da empresa?");
    etapa = 1;
    return;
  }

  /* 2️⃣ Ramo */
  if (etapa === 1) {
    dados.ramo = texto;

    // Mostra os documentos necessários
    adicionarMensagem(
      `Empresas do ramo de ${texto} normalmente precisam de:\n• PGR\n• PCMSO\n• ASO\n• NR-17\n• Avaliação Psicossocial\n• LTCAT`
    );

    adicionarMensagem("Deseja que eu encontre profissionais capacitados na sua região? (sim/não)");
    etapa = 2;
    return;
  }

  /* 3️⃣ Buscar prestadores */
  if (etapa === 2) {
    if (resposta !== "sim") {
      adicionarMensagem("Tudo bem! Se precisar, estou por aqui 😊");
      etapa = 999;
      return;
    }

    adicionarMensagem("🔎 Buscando prestadores disponíveis na sua região...");

    let lista = [];

    try {
      const res = await fetch("/api/ia/buscar-prestadores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ empresa: dados.empresa })
      });

      const result = await res.json();
      lista = result.prestadores || [];
      dados.regiao = result.regiao;
    } catch (err) {
      console.error(err);
      lista = [];
    }

    if (lista.length === 0) {
      adicionarMensagem(
        "Não encontrei prestadores na mesma região da sua empresa. Deseja enviar para prestadores de regiões próximas? (sim/não)"
      );
      etapa = 3;
      return;
    }

    // Mostra prestadores encontrados
    mostrarPrestadores(lista);
    adicionarMensagem("Deseja solicitar um orçamento para esses prestadores? (sim/não)");
    etapa = 4;
    return;
  }

  /* 4️⃣ Solicitação prestadores da mesma região */
  if (etapa === 4) {
    if (resposta === "sim") {
      await criarSolicitacao(false); // envia para prestadores da mesma região
      adicionarMensagem("✅ Solicitação enviada!");
    } else {
      adicionarMensagem("Tudo bem! Fico à disposição.");
    }
    etapa = 999;
    return;
  }

  /* 5️⃣ Solicitação prestadores de regiões próximas */
  if (etapa === 3) {
    if (resposta === "sim") {
      await criarSolicitacao(true); // envia para todos prestadores
      adicionarMensagem("✅ Solicitação enviada para prestadores de regiões próximas!");
    } else {
      adicionarMensagem("Tudo bem! Fico à disposição.");
    }
    etapa = 999;
    return;
  }
}

/* Função para exibir prestadores no chat */
function mostrarPrestadores(lista) {
  lista.forEach(p => {
    adicionarMensagem(
      `👷 ${p.nome}\n📍 ${p.regiao || "Região não informada"}\n⭐ ${p.experiencia || "Sem experiências"}\n📞 ${p.contato || "Não informado"}`
    );
  });
}

/* Função para criar solicitação via backend */
async function criarSolicitacao(enviarParaTodos) {
  try {
    const tipo_servico = "PGR, PCMSO, ASO, NR-17, Avaliação Psicossocial, LTCAT";

    await fetch("/api/solicitacoes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        empresa: dados.empresa,
        tipo_servico
      })
    });
  } catch (err) {
    console.error("Erro ao criar solicitação", err);
  }
}

