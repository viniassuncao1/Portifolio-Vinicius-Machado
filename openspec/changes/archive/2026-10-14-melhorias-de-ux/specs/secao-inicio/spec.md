# Spec Delta

## ADDED Requirements

### Requirement: Quem é e para onde ir
O Início SHALL mostrar "Vinicius Machado" e o cargo em destaque no Javadoc de
`PortfolioApplication` e SHALL terminar com os atalhos clicáveis `// Próximo: ver os projetos →`
(para `/projeto-1`) e `// Fale comigo →` (para `/contato`).

#### Scenario: Atalho para os projetos
- **WHEN** o visitante ativa `// Próximo: ver os projetos →` no Início
- **THEN** a página do Projeto 1 abre
