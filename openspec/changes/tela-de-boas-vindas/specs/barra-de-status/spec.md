# Spec Delta

## ADDED Requirements

### Requirement: Aviso de inicialização
Depois que a tela de boas-vindas fecha, a barra de status SHALL mostrar por 6 s o aviso
`PortfolioApplication started in 1.8 s`, anunciado com `aria-live="polite"`.

#### Scenario: Depois das boas-vindas
- **WHEN** a tela de boas-vindas fecha
- **THEN** a barra de status mostra `PortfolioApplication started in 1.8 s` e o aviso some depois
  de 6 s
