# Spec Delta

## MODIFIED Requirements

### Requirement: Uma aba por seção aberta
Ao abrir uma seção, a faixa de abas SHALL mostrar uma aba com o nome do arquivo da seção (por
exemplo, `SobreMim.java`), com o ícone de arquivo Java, e marcá-la como ativa. A página do
repositório SHALL abrir como a aba `Portfolio-Vinicius-Machado`, com o ícone do GitHub. Abrir
uma seção que já tem aba apenas a ativa.

#### Scenario: Abrir duas seções
- **WHEN** o visitante abre "Sobre Mim" e depois "Skills / STACK"
- **THEN** a faixa mostra as abas `SobreMim.java` e `Skills.java`, com `Skills.java` ativa

#### Scenario: Início
- **WHEN** o visitante abre a página inicial
- **THEN** a aba ativa é `PortfolioApplication.java`

#### Scenario: Repositório
- **WHEN** o visitante ativa o botão Commit
- **THEN** a aba `Portfolio-Vinicius-Machado` abre e fica ativa
