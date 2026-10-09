# Spec Delta

## ADDED Requirements

### Requirement: Verificação automática de acessibilidade
Os testes E2E SHALL verificar automaticamente as regras de acessibilidade WCAG A e AA na página
inicial e na rota de cada seção, e o pipeline MUST falhar quando houver qualquer violação.

#### Scenario: Página sem violações
- **WHEN** os testes E2E rodam numa página que atende às regras WCAG A e AA
- **THEN** a verificação de acessibilidade passa

#### Scenario: Violação de contraste
- **WHEN** um texto da página tem contraste abaixo do mínimo WCAG AA
- **THEN** a etapa de testes E2E falha indicando a regra violada e o elemento afetado
