# janela-de-run Specification

## Purpose

Simular a execução do projeto Spring Boot ao abrir o portfólio, com o log de inicialização numa
janela de Run como a do IntelliJ.

## Requirements

### Requirement: Log de inicialização
A janela de Run SHALL abrir na parte de baixo da IDE quando o visitante ativa o Executar e
mostrar o log de inicialização do `PortfolioApplication` (banner do Spring e as linhas de
inicialização até `Started PortfolioApplication`), linha a linha, em no máximo 2,5 s, ficando
aberta com o log completo depois. A janela MUST NOT abrir sozinha.

#### Scenario: Primeira visita
- **WHEN** o visitante abre o site pela primeira vez na sessão
- **THEN** a janela de Run não abre sozinha

#### Scenario: Executar
- **WHEN** o visitante ativa Executar fora dos projetos com site
- **THEN** a janela de Run abre e, em até 2,5 s, mostra a linha `Started PortfolioApplication`

#### Scenario: Segunda página na mesma sessão
- **WHEN** o visitante abre outra página ou recarrega
- **THEN** a janela de Run não abre sozinha

### Requirement: Nunca bloqueia
A janela de Run MUST NOT cobrir o conteúdo do editor de forma que impeça a leitura nem roubar o
foco; SHALL ter "Pular" (mostra o log completo na hora) e fechar, e Esc SHALL fechar quando o foco
estiver nela.

#### Scenario: Pular
- **WHEN** o visitante ativa "Pular" durante o log
- **THEN** o log aparece completo imediatamente

### Requirement: Movimento reduzido
Com `prefers-reduced-motion: reduce`, a janela de Run MUST NOT abrir sozinha; aberta pelo
Executar, mostra o log completo sem animação.

#### Scenario: Visitante com movimento reduzido
- **WHEN** o visitante com movimento reduzido abre o site
- **THEN** a janela de Run não abre sozinha

### Requirement: Janela de Run acessível
A janela de Run SHALL ser uma região com nome acessível, o log MUST ser texto (não imagem), a
linha final SHALL ser anunciada uma vez de forma educada (`aria-live="polite"`) e o axe MUST
passar sem exclusões, no desktop e no celular.

#### Scenario: Leitor de tela
- **WHEN** o log termina
- **THEN** o leitor de tela anuncia uma vez que a aplicação foi iniciada
