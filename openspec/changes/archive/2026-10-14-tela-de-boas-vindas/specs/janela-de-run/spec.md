# Spec Delta

## MODIFIED Requirements

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
