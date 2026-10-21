# Spec Delta

## ADDED Requirements

### Requirement: Vitrine dentro da janela de Run
A seção Projetos SHALL abrir como uma janela de Run da IDE ("executar os projetos"), com a vitrine
dos seis projetos como conteúdo dela e o preview vivo de cada projeto com site, mantendo os
endereços `/projetos` e `/projetos/<slug>`, o diálogo de detalhes e o funcionamento sem
JavaScript.

#### Scenario: Abrir Projetos
- **WHEN** o visitante abre `/projetos`
- **THEN** vê a janela de Run com a vitrine dos seis projetos e consegue abrir o preview de um
  projeto com site

#### Scenario: Endereço do projeto
- **WHEN** o visitante abre `/projetos/memora` direto
- **THEN** a janela de Run abre com os detalhes desse projeto
