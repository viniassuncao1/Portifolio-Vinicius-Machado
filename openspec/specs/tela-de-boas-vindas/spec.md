# tela-de-boas-vindas Specification

## Purpose

Receber o visitante na abertura do portfólio com a foto, o nome e o cargo do Vinicius numa tela
no estilo da splash do IntelliJ, com um carregamento curto que nunca esconde o conteúdo.

## Requirements

### Requirement: Boas-vindas na abertura
Na primeira página aberta numa sessão, o site SHALL mostrar a tela de boas-vindas com a foto do
Vinicius (`alt` "Foto de Vinicius Machado"), o nome, o cargo, a frase de boas-vindas e uma barra
de carregamento com as etapas da inicialização do `PortfolioApplication`.

#### Scenario: Primeira visita
- **WHEN** o visitante abre qualquer página do site pela primeira vez na sessão
- **THEN** a tela de boas-vindas aparece com a foto, "Vinicius Machado" e a barra de carregamento

#### Scenario: Mesma sessão
- **WHEN** o visitante já viu a tela e abre outra página ou recarrega
- **THEN** a tela de boas-vindas não aparece

### Requirement: Curta e sem pular
A tela de boas-vindas MUST NOT ter botão de pular; SHALL ficar visível por no mínimo 0,6 s e
MUST fechar em no máximo 2 s (1 s com movimento reduzido), assim que a página estiver pronta.

#### Scenario: Teto
- **WHEN** a página demora mais que 2 s para ficar pronta
- **THEN** a tela de boas-vindas fecha aos 2 s mesmo assim

### Requirement: Conteúdo sempre presente
O conteúdo da página MUST continuar no HTML pré-renderizado e no DOM enquanto a tela de
boas-vindas está aberta; a tela SHALL existir só no navegador e MUST NOT aparecer sem
JavaScript.

#### Scenario: HTML pré-renderizado
- **WHEN** o HTML de `/sobre-mim` é baixado sem executar JavaScript
- **THEN** ele tem o conteúdo da seção e não tem a tela de boas-vindas

### Requirement: Boas-vindas acessível
A tela SHALL ser anunciada como status ("Carregando o portfólio de Vinicius Machado"), MUST
passar no axe sem exclusões nos dois temas, MUST NOT roubar o foco e SHALL respeitar
`prefers-reduced-motion` (sem barra animada nem fade).

#### Scenario: Movimento reduzido
- **WHEN** o visitante tem movimento reduzido e abre o site
- **THEN** a tela aparece sem animação e fecha em no máximo 1 s
