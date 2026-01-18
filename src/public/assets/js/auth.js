/* ======================
   CADASTRO
====================== */
const cadastroForm = document.getElementById("cadastroForm");

if (cadastroForm) {
  cadastroForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;
    const tipo = document.getElementById("tipo").value;
    const regiao = document.getElementById("regiao").value.trim();

    if (!nome || !email || !senha || !tipo || !regiao) {
      alert("Preencha todos os campos.");
      return;
    }

    try {
      const res = await fetch("/api/auth/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha, tipo, regiao })
      });

      if (!res.ok) {
        const msg = await res.text();
        alert(msg || "Erro ao cadastrar");
        return;
      }

      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Erro ao cadastrar");
        return;
      }

      alert("Cadastro realizado com sucesso!");
      window.location.href = "login.html";

    } catch (err) {
      console.error(err);
      alert("Erro de conexão com o servidor.");
    }
  });
}

/* ======================
   LOGIN
====================== */
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;
    const tipo = document.getElementById("tipo").value;

    if (!email || !senha || !tipo) {
      alert("Preencha todos os campos.");
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha, tipo })
      });

      if (!res.ok) {
        const msg = await res.text();
        alert(msg || "Email ou senha inválidos");
        return;
      }

      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Login inválido");
        return;
      }

      /* Salva sessão simples */
      if (tipo === "empresa") {
        localStorage.setItem("empresaId", data.id);
        window.location.href = "dashboard/empresa.html";
      } else {
        localStorage.setItem("prestadorId", data.id);
        window.location.href = "dashboard/prestador.html";
      }

    } catch (err) {
      console.error(err);
      alert("Erro ao conectar com o servidor.");
    }
  });
}
