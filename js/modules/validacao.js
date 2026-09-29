/**
 * validacao.js
 * Responsabilidade única: validar o formulário de cadastro, mostrar
 * feedback ao usuário e, se tudo estiver certo, pedir para salvar.
 *
 * O formulário tem "novalidate" para que os balões do navegador não
 * apareçam; as mesmas regras (required, pattern, minlength, type) são
 * lidas da API de validação (campo.validity) e as mensagens aparecem
 * abaixo de cada campo, ligadas por aria-describedby.
 */

import { salvarCadastro } from './armazenamento.js';

// ---------- Regra extra: CPF com dígitos verificadores ----------
function cpfValido(cpf) {
  const d = cpf.replace(/\D/g, '');
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;

  const digito = (tamanho) => {
    let soma = 0;
    for (let i = 0; i < tamanho; i++) soma += Number(d[i]) * (tamanho + 1 - i);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };
  return digito(9) === Number(d[9]) && digito(10) === Number(d[10]);
}

// ---------- Mensagens de erro ----------
function mensagemDoCampo(campo) {
  campo.setCustomValidity('');
  if (campo.id === 'cpf' && campo.value.length === 14 && !cpfValido(campo.value)) {
    campo.setCustomValidity('Este CPF não é válido. Confira os números.');
  }

  const v = campo.validity;
  if (v.valid) return '';
  if (v.valueMissing) return 'Preencha este campo.';
  if (v.typeMismatch) return 'Informe um e-mail válido, como nome@exemplo.com.';
  if (v.patternMismatch) return campo.title || 'O formato informado não é válido.';
  if (v.tooShort) return `Use pelo menos ${campo.minLength} caracteres.`;
  if (v.rangeOverflow) return 'A data não pode ser no futuro.';
  return campo.validationMessage;
}

// Grupos de rádio e o checkbox de consentimento têm o erro no fieldset
function mensagemDoGrupo(nome, formulario) {
  const opcoes = formulario.querySelectorAll(`input[name="${nome}"]`);
  const marcado = [...opcoes].some((o) => o.checked);
  if (marcado) return '';
  return nome === 'consentimento'
    ? 'É necessário concordar para enviar o cadastro.'
    : 'Escolha uma das opções.';
}

// ---------- Exibição do erro ----------
function obterAreaDeErro(campo) {
  const ancora = campo.closest('.campo') || campo.closest('fieldset');
  const id = `erro-${campo.name || campo.id}`;
  let area = document.getElementById(id);
  if (!area) {
    area = document.createElement('p');
    area.id = id;
    area.className = 'erro-campo';
    area.hidden = true;
    ancora.appendChild(area);
  }
  return area;
}

function mostrarErro(campos, mensagem) {
  const area = obterAreaDeErro(campos[0]);
  area.textContent = mensagem;
  area.hidden = !mensagem;

  campos.forEach((campo) => {
    if (mensagem) {
      campo.setAttribute('aria-invalid', 'true');
      campo.setAttribute('aria-describedby', unir(campo.getAttribute('aria-describedby'), area.id));
    } else {
      campo.removeAttribute('aria-invalid');
      const restante = (campo.getAttribute('aria-describedby') || '')
        .split(' ').filter((id) => id && id !== area.id).join(' ');
      if (restante) campo.setAttribute('aria-describedby', restante);
      else campo.removeAttribute('aria-describedby');
    }
  });
  campos[0].closest('.campo, fieldset')?.classList.toggle('tem-erro', Boolean(mensagem));
}

function unir(atual, novo) {
  const ids = (atual || '').split(' ').filter(Boolean);
  if (!ids.includes(novo)) ids.push(novo);
  return ids.join(' ');
}

// ---------- Validação de um "item" (campo ou grupo) ----------
function validarItem(item, formulario) {
  const mensagem = item.grupo
    ? mensagemDoGrupo(item.grupo, formulario)
    : mensagemDoCampo(item.campos[0]);
  mostrarErro(item.campos, mensagem);
  return !mensagem;
}

function listarItens(formulario) {
  const itens = [];
  const gruposVistos = new Set();

  formulario.querySelectorAll('input, select, textarea').forEach((campo) => {
    const ehGrupoObrigatorio =
      (campo.type === 'radio' && campo.required) || campo.id === 'consentimento';

    if (ehGrupoObrigatorio) {
      if (gruposVistos.has(campo.name)) return;
      gruposVistos.add(campo.name);
      itens.push({
        grupo: campo.name,
        campos: [...formulario.querySelectorAll(`input[name="${campo.name}"]`)],
      });
    } else if (campo.type !== 'checkbox' && campo.type !== 'radio') {
      itens.push({ campos: [campo] });
    }
  });
  return itens;
}

// ---------- Coleta dos dados ----------
function coletarDados(formulario) {
  const dados = new FormData(formulario);
  // O CPF NÃO é guardado no localStorage: qualquer script da página
  // (ou pessoa com acesso ao navegador) poderia lê-lo.
  return {
    nome: dados.get('nome').trim(),
    email: dados.get('email').trim(),
    telefone: dados.get('telefone'),
    nascimento: dados.get('nascimento'),
    endereco: {
      cep: dados.get('cep'),
      logradouro: dados.get('logradouro').trim(),
      numero: dados.get('numero').trim(),
      complemento: dados.get('complemento').trim(),
      bairro: dados.get('bairro').trim(),
      cidade: dados.get('cidade').trim(),
      estado: dados.get('estado'),
    },
    participacao: dados.get('participacao'),
    areas: dados.getAll('areas'),
    mensagem: dados.get('mensagem').trim(),
  };
}

// ---------- Ponto de entrada ----------
export function iniciarValidacao() {
  const formulario = document.getElementById('form-cadastro');
  const confirmacao = document.getElementById('mensagem-sucesso');
  if (!formulario || !confirmacao) return;

  const itens = listarItens(formulario);

  // Feedback em tempo real: valida ao sair do campo e revalida enquanto digita
  // (só depois de o campo já ter mostrado um erro, para não incomodar antes da hora)
  itens.forEach((item) => {
    item.campos.forEach((campo) => {
      campo.addEventListener('blur', () => {
        if (!item.grupo) validarItem(item, formulario);
      });
      const evento = campo.tagName === 'SELECT' || item.grupo ? 'change' : 'input';
      campo.addEventListener(evento, () => {
        confirmacao.hidden = true;
        if (item.grupo || campo.getAttribute('aria-invalid')) {
          validarItem(item, formulario);
        }
      });
    });
  });

  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    confirmacao.hidden = true;

    const invalidos = itens.filter((item) => !validarItem(item, formulario));
    if (invalidos.length > 0) {
      invalidos[0].campos[0].focus(); // leva a pessoa direto ao primeiro erro
      return;
    }

    const salvou = salvarCadastro(coletarDados(formulario));
    if (!salvou) {
      confirmacao.textContent = 'Não foi possível salvar o cadastro neste navegador. Tente novamente.';
      confirmacao.classList.add('mensagem-erro');
      confirmacao.hidden = false;
      confirmacao.focus();
      return;
    }

    formulario.reset();
    itens.forEach((item) => mostrarErro(item.campos, ''));
    confirmacao.textContent =
      'Cadastro enviado com sucesso! Obrigado por fazer parte da nossa rede de apoiadores.';
    confirmacao.classList.remove('mensagem-erro');
    confirmacao.hidden = false;
    confirmacao.focus();
  });
}
