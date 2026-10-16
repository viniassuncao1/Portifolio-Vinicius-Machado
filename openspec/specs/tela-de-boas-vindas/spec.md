# tela-de-boas-vindas Specification

## Purpose

Abrir o portfólio como se o projeto fosse executado no IntelliJ: splash com a foto, o nome e o
cargo do Vinicius, o Run, o build das classes e o log do Spring, antes de revelar a IDE.

## Requirements

### Requirement: Conteúdo sempre presente
O conteúdo da página MUST continuar no HTML pré-renderizado e no DOM enquanto a tela de
boas-vindas está aberta; a tela SHALL existir só no navegador e MUST NOT aparecer sem
JavaScript.

#### Scenario: HTML pré-renderizado
- **WHEN** o HTML de `/sobre-mim` é baixado sem executar JavaScript
- **THEN** ele tem o conteúdo da seção e não tem a tela de boas-vindas

### Requirement: Splash da abertura
Na primeira abertura da página inicial numa sessão, o site SHALL mostrar por 3 s o cartão com a
foto do Vinicius (`alt` "Foto de Vinicius Machado"), o nome, o cargo, "Seja bem-vindo ao meu
portfólio" e a barra de carregamento com as etapas da IDE.

#### Scenario: Primeira visita à página inicial
- **WHEN** o visitante abre `/` pela primeira vez na sessão
- **THEN** o cartão aparece com a foto, "Vinicius Machado" e a barra de carregamento

#### Scenario: Mesma sessão
- **WHEN** o visitante já viu a abertura e volta a `/` ou recarrega
- **THEN** a abertura não aparece

### Requirement: Só na página inicial
A abertura MUST NOT aparecer quando a primeira página da sessão não é `/`; nesse caso a barra de
status mostra o aviso de inicialização.

#### Scenario: Link direto
- **WHEN** o visitante abre `/projeto-2` direto
- **THEN** o conteúdo do Projeto 2 aparece sem abertura

### Requirement: Executar o projeto
Depois do splash, a abertura SHALL mostrar o widget de Run do IntelliJ com o botão "Executar
PortfolioApplication" focado; clique, Enter ou o atalho (⌃R no Mac, ⇧F10 nos outros sistemas)
SHALL executar. Se ninguém executar em 5 s, a execução MUST começar sozinha.

#### Scenario: Executar pelo teclado
- **WHEN** o Run aparece e o visitante aperta Enter
- **THEN** a execução começa

#### Scenario: Sem clique
- **WHEN** o Run aparece e o visitante não faz nada por 5 s
- **THEN** a execução começa sozinha

### Requirement: Build e Spring
Ao executar, a abertura SHALL mostrar a janela Build/Run com `> Task :compileJava`, uma
classe por seção do portfólio sendo compilada (lista derivada das seções), as tarefas seguintes e o log do Spring até `Started
PortfolioApplication`, e então SHALL revelar a IDE com a janela recolhendo para a barra de
status, em no máximo 5 s desde o início da execução, com o foco no editor ao fim.

#### Scenario: Do clique ao portfólio
- **WHEN** o visitante executa o projeto
- **THEN** em até 5 s o Início está visível, a abertura saiu e o foco está no editor

### Requirement: Sem pular e com teto
A abertura MUST NOT ter botão de pular nem atalho para pular, e cada fase MUST ter teto: splash
em até 5 s (rede lenta), execução automática 5 s depois de pronta e revelação em até 5 s depois
de executar.

#### Scenario: Sem pular
- **WHEN** o visitante procura um jeito de pular ou aperta Esc
- **THEN** não há botão de pular e Esc não fecha a abertura

### Requirement: Abertura acessível
A abertura SHALL ser um diálogo modal rotulado pelo nome, com o resto da casca `inert`; uma
região `aria-live` SHALL anunciar só os marcos (carregando, projeto pronto, compilando,
portfólio pronto); MUST passar no axe sem exclusões em cada fase, nos dois temas e no celular,
sem rolagem horizontal; com `prefers-reduced-motion` SHALL ter as mesmas etapas sem movimento
(log completo de uma vez, só opacidade de até 150 ms).

#### Scenario: Movimento reduzido
- **WHEN** o visitante com movimento reduzido executa o projeto
- **THEN** o build e o log aparecem completos de uma vez e a IDE surge com um fade, sem
  deslocamento
