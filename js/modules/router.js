/**
 * router.js
 * Responsabilidade única: interceptar a intenção de navegação do usuário
 * (mudança no hash da URL) e decidir qual template carregar.
 *
 * Roteamento por HASH (ex.: index.html#/projetos) em vez da History API,
 * porque o hash funciona em qualquer servidor estático, sem configurar
 * fallback para o index.html.
 *
 * Formato do hash: #/rota  ou  #/rota/ancora  (ex.: #/projetos/mesa)
 */

import { carregarTemplate } from './templates.js';

const NOME_DO_SITE = 'Instituto Mãos que Ajudam';

export function iniciarRouter(rotas, container, rotaPadrao = '/inicio') {
  let ultimaRequisicao = 0;

  async function renderizarRotaAtual() {
    // "#/projetos/mesa" -> rota "/projetos", âncora "mesa"
    const partes = window.location.hash.match(/^#(\/[^/]*)\/?(.*)$/);
    const rotaPedida = partes ? partes[1] : rotaPadrao;
    const ancora = partes ? partes[2] : '';

    // Rota inexistente cai na rota padrão (evita tela em branco)
    const rota = rotas[rotaPedida] ? rotaPedida : rotaPadrao;
    const config = rotas[rota];

    // Se o usuário clicar rápido em dois links, só a última resposta vale
    const requisicao = ++ultimaRequisicao;
    const ok = await carregarTemplate(config.template, container);
    if (requisicao !== ultimaRequisicao) return;

    atualizarLinkAtivo(rota);
    document.title = `${config.titulo} | ${NOME_DO_SITE}`;

    if (ok && typeof config.init === 'function') config.init();

    const alvo = ancora && document.getElementById(ancora);
    if (alvo) {
      alvo.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
      container.focus({ preventScroll: true }); // acessibilidade: foco no novo conteúdo
    }
  }

  // Marca no menu a rota atual com aria-current="page"
  function atualizarLinkAtivo(rota) {
    document.querySelectorAll('.navegacao-principal a[data-rota]').forEach((link) => {
      if (link.getAttribute('href') === `#${rota}`) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  window.addEventListener('hashchange', renderizarRotaAtual);
  renderizarRotaAtual(); // carga inicial (acesso direto ou F5)
}
