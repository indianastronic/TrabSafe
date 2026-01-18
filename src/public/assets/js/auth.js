/* ======================
   CADASTRO
====================== */
const cadastroForm = document.getElementById("cadastroForm");

if (cadastroForm) {
  cadastroForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const tipo = document.getElementById("tipo").value;
    const regiao = document.getElementById("regiao").value;

    const res = await fetch("/api/auth/cadastro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, senha, tipo, regiao })
    });

    const data = await res.json();

    if (!data.success) {
      alert(data.message || "Erro ao cadastrar");
      return;
    }

    alert("Cadastro realizado com sucesso!");
    window.location.href = "login.html";
  });
}

/* ======================
   LOGIN
====================== */
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const tipo = document.getElementById("tipo").value;

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha, tipo })
    });

    const data = await res.json();

    if (!data.success) {
      alert("Login inválido");
      return;
    }

    if (tipo === "empresa") {
      localStorage.setItem("empresaId", data.id);
      window.location.href = "dashboard/empresa.html";
    } else {
      localStorage.setItem("prestadorId", data.id);
      window.location.href = "dashboard/prestador.html";
    }
  });
}
