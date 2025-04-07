// sistema.js - AP. SISTEMA LOTO FÁCIL

let historico = [];

function carregarHistorico() {
  const resultadosTexto = document.getElementById("inputResultados").value.trim();
  const linhas = resultadosTexto.split("\n");
  historico = linhas.map(linha => linha.match(/\d{2}/g).map(Number));

  const ultimoResultado = historico[0];
  document.getElementById("ultimoResultado").textContent = `Último resultado: ${ultimoResultado.map(n => n.toString().padStart(2, '0')).join(" ")}`;
}

function avaliarPadroes() {
  if (historico.length === 0) return alert("Histórico não carregado.");

  const freq = new Array(26).fill(0); // índice 0 não será usado
  historico.forEach(jogo => {
    jogo.forEach(n => freq[n]++);
  });

  const resultado = freq
    .map((qtd, i) => i > 0 ? `${i.toString().padStart(2, '0')}: ${qtd}` : null)
    .filter(Boolean)
    .join("\n");

  document.getElementById("resultadoPadroes").textContent = resultado;
  document.getElementById("btnGerarSugestoes").disabled = false;
}

function gerarApostas() {
  const qtd = parseInt(document.getElementById("qtdApostas").value);
  if (!qtd || qtd < 1) return alert("Quantidade inválida.");

  const freq = new Array(26).fill(0);
  historico.forEach(jogo => jogo.forEach(n => freq[n]++));

  const topNumeros = freq
    .map((qtd, i) => ({ numero: i, qtd }))
    .filter(item => item.numero > 0)
    .sort((a, b) => b.qtd - a.qtd)
    .slice(0, 20)
    .map(item => item.numero);

  const apostas = [];
  for (let i = 0; i < qtd; i++) {
    const aposta = [];
    while (aposta.length < 15) {
      const dezena = topNumeros[Math.floor(Math.random() * topNumeros.length)];
      if (!aposta.includes(dezena)) aposta.push(dezena);
    }
    apostas.push(aposta.sort((a, b) => a - b));
  }

  const texto = apostas.map(a => a.map(n => n.toString().padStart(2, '0')).join(" ")).join("\n");
  document.getElementById("apostasGeradas").textContent = texto;
}

function analisarAcertos() {
  const input = document.getElementById("resultadoOficial").value.trim();
  if (!input.match(/^(\d{2}\s*){15}$/)) return alert("Insira exatamente 15 dezenas com dois dígitos.");

  const resultado = input.match(/\d{2}/g).map(Number);
  const apostasTexto = document.getElementById("apostasGeradas").textContent.trim().split("\n");

  const resultados = apostasTexto.map((linha, i) => {
    const aposta = linha.match(/\d{2}/g).map(Number);
    const acertos = aposta.filter(n => resultado.includes(n)).length;
    return acertos >= 11 ? `Aposta ${i + 1}: ${acertos} acertos` : null;
  }).filter(Boolean);

  document.getElementById("resultadoAcertos").textContent = resultados.length
    ? resultados.join("\n")
    : "Nenhuma aposta com 11 ou mais acertos.";
}
