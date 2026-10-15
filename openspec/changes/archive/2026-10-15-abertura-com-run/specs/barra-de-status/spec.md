# Spec Delta

## MODIFIED Requirements

### Requirement: Aviso de inicialização
Depois que a abertura termina, ou na primeira página da sessão quando a abertura não é mostrada,
a barra de status SHALL mostrar por 6 s o aviso `PortfolioApplication started in 1.8 s`,
anunciado com `aria-live="polite"`.

#### Scenario: Depois das boas-vindas
- **WHEN** a abertura termina
- **THEN** a barra de status mostra `PortfolioApplication started in 1.8 s` e o aviso some depois
  de 6 s

#### Scenario: Link direto
- **WHEN** a primeira página da sessão é `/contato`
- **THEN** a barra de status mostra o aviso por 6 s
