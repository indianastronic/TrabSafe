const empresaId = localStorage.getItem("empresaId");

if (!empresaId) {
  location.href = "/login.html";
}

// BUSCAR INDICADORES
fetch(`/api/dashboard/empresa/${empresaId}`)
  .then(res => res.json())
  .then(dados => {
    document.getElementById("validos").innerText = dados.validos;
    document.getElementById("vencendo").innerText = dados.vencendo;
    document.getElementById("asos").innerText = dados.asos;

    new Chart(document.getElementById("grafico"), {
      type: "bar",
      data: {
        labels: ["Válidos", "Vencendo", "ASOs"],
        datasets: [{
          data: [dados.validos, dados.vencendo, dados.asos]
        }]
      }
    });
  });

// UPLOAD
document.getElementById("formUpload").addEventListener("submit", e => {
  e.preventDefault();

  const formData = new FormData(e.target);
  formData.append("empresaId", empresaId);

  fetch("/api/documentos/upload", {
    method: "POST",
    body: formData
  }).then(() => {
    alert("Documento enviado com sucesso");
    location.reload();
  });
});
