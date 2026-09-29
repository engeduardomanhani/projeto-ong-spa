/**
 * mascaras.js
 * Máscaras de entrada (CPF, telefone e CEP) do formulário de cadastro.
 * Só formata o texto enquanto a pessoa digita; a validação fica em validacao.js.
 */

const apenasDigitos = (valor) => valor.replace(/\D/g, '');

// 000.000.000-00
export function mascaraCPF(valor) {
  return apenasDigitos(valor)
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

// (00) 00000-0000 ou (00) 0000-0000
export function mascaraTelefone(valor) {
  const d = apenasDigitos(valor).slice(0, 11);
  if (d.length === 0) return '';
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

// 00000-000
export function mascaraCEP(valor) {
  const d = apenasDigitos(valor).slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
}

function aplicarMascara(idDoCampo, funcaoMascara) {
  const campo = document.getElementById(idDoCampo);
  if (!campo) return;
  campo.addEventListener('input', () => {
    campo.value = funcaoMascara(campo.value);
  });
}

export function iniciarMascaras() {
  aplicarMascara('cpf', mascaraCPF);
  aplicarMascara('telefone', mascaraTelefone);
  aplicarMascara('cep', mascaraCEP);

  // A data de nascimento não pode ser no futuro.
  const nascimento = document.getElementById('nascimento');
  if (nascimento) {
    const hoje = new Date();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
    nascimento.max = `${hoje.getFullYear()}-${mes}-${dia}`;
  }
}
