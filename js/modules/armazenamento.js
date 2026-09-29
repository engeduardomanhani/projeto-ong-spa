/**
 * armazenamento.js
 * Responsabilidade única: ler e gravar cadastros no localStorage.
 * Nenhum outro módulo mexe direto no localStorage.
 */

const CHAVE = 'maosqueajudam:cadastros';

export function lerCadastros() {
  try {
    const bruto = localStorage.getItem(CHAVE);
    const lista = bruto ? JSON.parse(bruto) : [];
    return Array.isArray(lista) ? lista : [];
  } catch (erro) {
    // JSON corrompido ou localStorage bloqueado: trata como lista vazia
    console.error('Erro ao ler cadastros:', erro);
    return [];
  }
}

/** Retorna true se salvou, false se o navegador recusou (ex.: modo privado cheio). */
export function salvarCadastro(dados) {
  try {
    const lista = lerCadastros();
    lista.push({
      id: Date.now(),
      criadoEm: new Date().toISOString(),
      ...dados,
    });
    localStorage.setItem(CHAVE, JSON.stringify(lista));
    return true;
  } catch (erro) {
    console.error('Erro ao salvar cadastro:', erro);
    return false;
  }
}

export function limparCadastros() {
  try {
    localStorage.removeItem(CHAVE);
  } catch (erro) {
    console.error('Erro ao limpar cadastros:', erro);
  }
}
