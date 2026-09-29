/**
 * painel.js
 * Mostra no painel os cadastros guardados no localStorage.
 * Usa textContent (nunca innerHTML) para exibir os dados digitados pelo usuário,
 * evitando injeção de HTML/script.
 */

import { lerCadastros, limparCadastros } from './armazenamento.js';

const ROTULOS_PARTICIPACAO = {
  voluntario: 'Voluntário',
  doador: 'Doador',
  ambos: 'Voluntário e doador',
};

function criarCelula(texto) {
  const td = document.createElement('td');
  td.textContent = texto;
  return td;
}

function desenharTabela() {
  const corpo = document.getElementById('cadastros-corpo');
  const tabela = document.getElementById('cadastros-tabela');
  const vazio = document.getElementById('cadastros-vazio');
  const botaoLimpar = document.getElementById('botao-limpar-cadastros');
  if (!corpo || !tabela || !vazio || !botaoLimpar) return;

  const cadastros = lerCadastros();
  corpo.replaceChildren();

  cadastros.forEach((c) => {
    const tr = document.createElement('tr');
    tr.append(
      criarCelula(c.nome),
      criarCelula(ROTULOS_PARTICIPACAO[c.participacao] || c.participacao),
      criarCelula(`${c.endereco.cidade}/${c.endereco.estado}`),
      criarCelula(new Date(c.criadoEm).toLocaleString('pt-BR')),
    );
    corpo.appendChild(tr);
  });

  const temDados = cadastros.length > 0;
  tabela.hidden = !temDados;
  botaoLimpar.hidden = !temDados;
  vazio.hidden = temDados;
}

export function iniciarPainel() {
  desenharTabela();

  const botaoLimpar = document.getElementById('botao-limpar-cadastros');
  botaoLimpar?.addEventListener('click', () => {
    if (window.confirm('Apagar todos os cadastros salvos neste navegador?')) {
      limparCadastros();
      desenharTabela();
    }
  });
}
