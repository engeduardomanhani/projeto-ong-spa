/**
 * templates.js
 * Responsabilidade única: buscar um fragmento HTML no servidor (fetch)
 * e injetá-lo dentro de um elemento contêiner do DOM.
 * Não sabe nada sobre rotas — só sabe "buscar e injetar".
 */

export async function carregarTemplate(caminho, container) {
  try {
    const resposta = await fetch(caminho);

    if (!resposta.ok) {
      throw new Error(`Não foi possível carregar ${caminho} (HTTP ${resposta.status})`);
    }

    container.innerHTML = await resposta.text();
    return true;
  } catch (erro) {
    console.error('Erro ao carregar template:', erro);
    container.innerHTML = `
      <section>
        <h1>Ops, algo deu errado</h1>
        <p>Não foi possível carregar esta página. Tente novamente.</p>
      </section>
    `;
    return false;
  }
}
