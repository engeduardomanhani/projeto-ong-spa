/**
 * menu.js
 * Menu hambúrguer (mobile) e submenu de "Projetos Sociais".
 * Roda uma única vez, pois o cabeçalho fica fora da área trocada pelo router.
 */

export function iniciarMenu() {
  const botaoMenu = document.getElementById('botao-menu');
  const menu = document.getElementById('menu-navegacao');
  if (!botaoMenu || !menu) return;

  botaoMenu.addEventListener('click', () => {
    const aberto = menu.classList.toggle('menu-aberto');
    botaoMenu.setAttribute('aria-expanded', String(aberto));
  });

  document.querySelectorAll('.botao-submenu').forEach((botao) => {
    botao.addEventListener('click', () => {
      const item = botao.closest('.tem-submenu');
      if (!item) return;
      const aberto = item.classList.toggle('submenu-aberto');
      botao.setAttribute('aria-expanded', String(aberto));
    });
  });

  // Ao navegar, fecha o menu mobile e o submenu
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('menu-aberto');
      botaoMenu.setAttribute('aria-expanded', 'false');
      document.querySelectorAll('.tem-submenu.submenu-aberto').forEach((item) => {
        item.classList.remove('submenu-aberto');
        item.querySelector('.botao-submenu')?.setAttribute('aria-expanded', 'false');
      });
    });
  });
}
