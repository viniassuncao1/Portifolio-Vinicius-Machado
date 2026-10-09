# diario-de-desenvolvimento Specification

## Purpose
Registrar a construção do portfólio change a change, com o raciocínio por trás de cada decisão,
para servir de histórico do projeto e de matéria-prima para posts no LinkedIn.

## Requirements

### Requirement: Uma entrada por change
Toda change do OpenSpec SHALL ter uma entrada no diário em `docs/diario/`, criada no mesmo Pull
Request da change, antes do merge.

#### Scenario: PR de uma change
- **WHEN** o Pull Request de uma change é aberto
- **THEN** ele inclui um arquivo novo em `docs/diario/` referente a essa change

### Requirement: Conteúdo da entrada
Cada entrada SHALL conter: o problema, as decisões tomadas e as alternativas descartadas, o que
foi aprendido, os links para a change, o PR e os ADRs relacionados, e um rascunho de post para o
LinkedIn em pt-BR.

#### Scenario: Entrada completa
- **WHEN** a entrada de uma change é revisada
- **THEN** ela tem as seções de problema, decisões, aprendizado, links e rascunho de post

### Requirement: Índice do diário
O diário SHALL ter um índice em `docs/diario/README.md` com todas as entradas em ordem
cronológica, a data e um resumo de uma linha.

#### Scenario: Nova entrada no índice
- **WHEN** uma entrada é adicionada
- **THEN** o índice passa a listá-la com a data e o resumo

### Requirement: Entrada retroativa da fundação
O diário SHALL começar com uma entrada sobre a fundação do projeto já concluída (Angular com
pré-renderização, CI/CD com GitHub Actions e Vercel, ADRs, OpenSpec e a equipe de agentes no
Maestri).

#### Scenario: Primeira entrada
- **WHEN** o diário é aberto pela primeira vez
- **THEN** a primeira entrada descreve a fundação do projeto, com o seu rascunho de post
