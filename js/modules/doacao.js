/**
 * doacao.js
 * Botão "Copiar chave" do Pix (tela inicial).
 * Se o navegador não suportar a Clipboard API, o botão não faz nada
 * e a pessoa ainda pode copiar o texto manualmente.
 */

export function iniciarDoacao() {
  const botao = document.getElementById('botao-copiar-pix');
  const chave = document.getElementById('chave-pix');
  const confirmacao = document.getElementById('mensagem-pix-copiado');

  if (!botao || !chave || !confirmacao || !navigator.clipboard) return;

  botao.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(chave.textContent.trim());
      confirmacao.hidden = false;
      setTimeout(() => { confirmacao.hidden = true; }, 3000);
    } catch (erro) {
      console.error('Não foi possível copiar a chave Pix:', erro);
    }
  });
}
