# Spec Delta

## MODIFIED Requirements

### Requirement: Abrir o Git pela faixa de ferramentas
O botão Commit da faixa de ferramentas SHALL abrir a página do repositório numa aba do editor,
indicando com `aria-current="page"` quando ela é a página atual.

#### Scenario: Commit na faixa
- **WHEN** o visitante ativa Commit
- **THEN** a aba `Portfolio-Vinicius-Machado` abre e o botão fica com `aria-current="page"`
