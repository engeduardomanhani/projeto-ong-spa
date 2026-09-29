/**
 * main.js
 * Ponto de entrada único: monta o mapa de rotas (template + função de
 * inicialização de cada tela) e liga o menu e o router.
 */

import { iniciarRouter } from './modules/router.js';
import { iniciarMenu } from './modules/menu.js';
import { iniciarDoacao } from './modules/doacao.js';
import { iniciarMascaras } from './modules/mascaras.js';
import { iniciarValidacao } from './modules/validacao.js';
import { iniciarPainel } from './modules/painel.js';

// "init" roda DEPOIS que o template é injetado, porque só então os
// elementos da tela existem no DOM.
const rotas = {
  '/inicio': {
    template: 'html/inicio.html',
    titulo: 'Página Inicial',
    init: iniciarDoacao,
  },
  '/projetos': {
    template: 'html/projetos.html',
    titulo: 'Projetos Sociais',
  },
  '/cadastro': {
    template: 'html/cadastro.html',
    titulo: 'Cadastro de Voluntários',
    init: () => {
      iniciarMascaras();
      iniciarValidacao();
    },
  },
  '/painel': {
    template: 'html/painel.html',
    titulo: 'Painel da ONG',
    init: iniciarPainel,
  },
};

iniciarMenu(); // o cabeçalho é fixo, então o menu é ligado uma única vez
iniciarRouter(rotas, document.getElementById('app'), '/inicio');
