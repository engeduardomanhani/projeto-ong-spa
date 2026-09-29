# Instituto Mãos que Ajudam — Projeto SPA (JavaScript)

**Versão:** 1.0.1

Site da ONG transformado em uma **Single Page Application**: um único
`index.html` com cabeçalho e rodapé fixos, e o conteúdo de cada tela é carregado
por JavaScript dentro de `<main id="app">`.

## Como executar

O `fetch()` não funciona abrindo o arquivo direto (`file://`). Use um servidor
estático, por exemplo a extensão **Live Server** do VS Code (botão direito em
`index.html` → *Open with Live Server*).

## Estrutura de diretórios

```
projeto-ong/
├── index.html              → único ponto de entrada (cabeçalho, <main id="app"> vazio, rodapé)
├── html/                   → templates de tela (fragmentos, sem <head>/<body>)
│   ├── inicio.html
│   ├── projetos.html
│   ├── cadastro.html
│   └── painel.html
├── css/
│   └── style.css           → Design System (variáveis, tipografia, componentes)
├── imagens/                → fotos dos projetos e da página inicial
└── js/
    ├── main.js             → mapa de rotas e inicialização
    └── modules/
        ├── router.js       → lê o hash da URL e decide qual template carregar
        ├── templates.js    → busca o HTML (fetch) e injeta no #app
        ├── menu.js         → menu hambúrguer e submenu
        ├── mascaras.js     → máscaras de CPF, telefone e CEP
        ├── validacao.js    → validação do formulário e mensagens de erro
        ├── armazenamento.js→ leitura/gravação no localStorage
        ├── doacao.js       → botão "Copiar chave Pix"
        └── painel.js       → lista os cadastros salvos no painel
```

## Navegação (roteamento por hash)

| Link            | Tela                    |
|-----------------|-------------------------|
| `#/inicio`      | Página inicial          |
| `#/projetos`    | Projetos sociais        |
| `#/cadastro`    | Cadastro de voluntários |
| `#/painel`      | Painel da ONG           |

Sub-âncoras seguem o formato `#/rota/id` (ex.: `#/projetos/mesa`,
`#/inicio/doar`). Rota desconhecida cai em `#/inicio`.

Fluxo: `hashchange` (ou carga inicial) → `router.js` lê o hash → `templates.js`
faz o `fetch` e injeta o HTML no `#app` → o router atualiza `aria-current`, o
título da aba, executa o `init` da tela e move o foco para o conteúdo.

**Por que hash e não History API?** A History API exige que o servidor devolva o
`index.html` para qualquer caminho. O hash funciona em qualquer servidor
estático, sem configuração.

## Formulário, validação e localStorage

- O formulário tem `novalidate`; as regras (`required`, `pattern`, `minlength`,
  `type`) continuam no HTML e são lidas por `validacao.js` via API de validação.
- Erros aparecem abaixo de cada campo (`aria-invalid` + `aria-describedby`),
  na saída do campo e ao enviar; o foco vai para o primeiro campo inválido.
- Regras extras: CPF com dígitos verificadores e data de nascimento não futura.
- Ao enviar um formulário válido, `armazenamento.js` grava o cadastro no
  `localStorage` (chave `maosqueajudam:cadastros`). O CPF **não** é gravado.
- O painel lê esses cadastros e os exibe em uma tabela, com botão para apagá-los.

## Acessibilidade

`aria-current="page"` no menu, foco movido para o conteúdo a cada troca de tela,
`role="status"` nas mensagens de sucesso, erros ligados aos campos.

## Fluxo de trabalho (GitFlow)

| Branch | Função |
|--------|--------|
| `main` | Versões estáveis, cada uma marcada com uma tag (ex.: `v1.0.0`) |
| `develop` | Integração do código em desenvolvimento |
| `feature/*` | Uma branch por funcionalidade, criada a partir da `develop` |
| `release/*` | Preparação de uma versão, criada a partir da `develop` |
| `hotfix/*` | Correções urgentes, criadas a partir da `main` |

Nenhuma alteração é feita direto na `main`.

### Commits semânticos

Cada mensagem começa com um tipo: `feat` (nova funcionalidade), `fix` (correção),
`docs` (documentação), `style` (formatação), `refactor` (reorganização do código
sem mudar o comportamento) ou `chore` (tarefas de manutenção).
Exemplo: `docs: documentar o fluxo GitFlow no README`.