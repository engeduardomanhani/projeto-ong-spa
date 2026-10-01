# Instituto Mãos que Ajudam — Projeto SPA (JavaScript)

**Versão:** 1.2.0

Site da ONG transformado em uma **Single Page Application**: um único
`index.html` com cabeçalho e rodapé fixos, e o conteúdo de cada tela é carregado
por JavaScript dentro de `<main id="app">`.

## Como executar

Requer Node.js 20 ou mais.

- **Desenvolvimento:** `npm install` e depois `npm run dev`.
- **Build de produção:** `npm run build` gera a pasta `dist/` com CSS e JS minificados (Vite). Para conferir o resultado: `npm run preview`.

O `fetch()` não funciona abrindo o arquivo direto (`file://`), e as telas ficam em `public/`, então use o servidor do Vite (`npm run dev`).

## Estrutura de diretórios

```
projeto-ong/
├── index.html              → único ponto de entrada (cabeçalho, <main id="app"> vazio, rodapé)
├── package.json            → scripts do Vite (dev, build, preview)
├── vite.config.js          → configuração do Vite (base './')
├── public/                 → copiado sem alteração para o dist/
│   ├── html/               → templates de tela (fragmentos, sem <head>/<body>)
│   └── imagens/            → fotos dos projetos e da página inicial
├── css/
│   └── style.css           → Design System (variáveis, tipografia, componentes)
└── js/
    ├── main.js             → mapa de rotas e inicialização
    └── modules/            → router, templates, menu, máscaras, validação, armazenamento, doação e painel
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

## Como contribuir

1. Crie uma branch a partir da `develop`: `git switch -c feature/nome-da-feature`.
2. Faça commits semânticos (`feat:`, `fix:`, `docs:`).
3. Envie a branch e abra um pull request para a `develop`, descrevendo o que mudou e por quê.

## Instalação local

## Instalação local

**Pré-requisitos:** navegador atual, Git, VS Code e Node.js (versão LTS atual).

1. Clone o repositório: `git clone https://github.com/engeduardomanhani/projeto-ong-spa.git`
2. Entre na pasta e abra no VS Code: `cd projeto-ong-spa` e `code .`
3. Troque para a branch de desenvolvimento: `git switch develop`
4. Instale as dependências: `npm install`
5. Rode em desenvolvimento: `npm run dev` e abra o endereço mostrado no terminal.

**Scripts disponíveis:**
- `npm run dev`: servidor de desenvolvimento (Vite)
- `npm run build`: gera a versão minificada em `dist/`
- `npm run preview`: serve a pasta `dist/` para testar a build
- `npm run imagens`: gera as versões WebP (480, 960 e a largura original) em `public/imagens/`

**Build:** `npm run build` gera a pasta `dist/` e `npm run preview` serve o resultado.

**Testes:** são manuais. Navegue pelo menu, envie o formulário e confira o painel.

## Acessibilidade

- **Landmarks e estrutura:** `<header>`, `<nav>`, `<main>` e `<footer>`; cada tela usa `<section aria-labelledby>` com um `<h1>`.
- **Menu:** botões com `aria-expanded`, `aria-controls` e `aria-label`; `aria-current="page"` no link da tela atual.
- **Teclado:** contorno de foco visível (`:focus-visible`) em links, botões e campos; o submenu abre também com `:focus-within`.
- **SPA:** o foco é movido para o conteúdo e o título da aba é atualizado a cada troca de tela.
- **Formulário:** `label`, `fieldset`/`legend`, erros ligados aos campos (`aria-invalid` + `aria-describedby`), foco no primeiro erro.
- **Mensagens e progresso:** `role="status"` nas confirmações e `role="progressbar"` nas campanhas.
- **Cores e tema:** contraste mínimo de 4,5:1 (WCAG AA) e modo escuro automático via `prefers-color-scheme`.