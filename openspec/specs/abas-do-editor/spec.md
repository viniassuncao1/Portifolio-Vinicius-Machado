# abas-do-editor Specification

## Purpose
Reproduzir a experiência de abas de uma IDE: cada seção aberta vira uma aba de arquivo, e o
visitante alterna e fecha abas como no Eclipse ou no IntelliJ.

## Requirements

### Requirement: Uma aba por seção aberta
Ao abrir uma seção, a faixa de abas SHALL mostrar uma aba com o nome do arquivo da seção (por
exemplo, `SobreMim.java`), com o ícone de arquivo Java, e marcá-la como ativa. Abrir uma seção
que já tem aba apenas a ativa.

#### Scenario: Abrir duas seções
- **WHEN** o visitante abre "Sobre Mim" e depois "Skills / STACK"
- **THEN** a faixa mostra as abas `SobreMim.java` e `Skills.java`, com `Skills.java` ativa

#### Scenario: Início
- **WHEN** o visitante abre a página inicial
- **THEN** a aba ativa é `ViniciusMachado.java`

### Requirement: Alternar entre abas
Clicar numa aba SHALL abrir a seção correspondente, e o endereço da página SHALL mudar para a
rota dessa seção.

#### Scenario: Voltar para uma aba
- **WHEN** há as abas `SobreMim.java` e `Skills.java` e o visitante clica em `SobreMim.java`
- **THEN** a seção Sobre Mim é exibida e o endereço é `/sobre-mim`

### Requirement: Fechar abas
Cada aba SHALL ter um botão de fechar. Fechar a aba ativa SHALL ativar a aba vizinha; fechar a
última aba SHALL levar à página inicial.

#### Scenario: Fechar a aba ativa
- **WHEN** a aba ativa `Skills.java` é fechada e existe a aba `SobreMim.java`
- **THEN** a seção Sobre Mim é exibida

### Requirement: Abas acessíveis
A faixa de abas MUST seguir o padrão de abas do WAI-ARIA (`tablist`, `tab`, `aria-selected`),
com setas para mudar de aba e Delete para fechar a aba focada.

#### Scenario: Teclado na faixa de abas
- **WHEN** o foco está numa aba e o visitante pressiona seta para a direita
- **THEN** o foco vai para a próxima aba

### Requirement: Abas lembradas na visita
As abas abertas SHALL ser mantidas durante a visita (inclusive ao recarregar a página), e a
página pré-renderizada SHALL exibir pelo menos a aba da rota atual.

#### Scenario: Recarregar a página
- **WHEN** o visitante tem três abas abertas e recarrega a página
- **THEN** as três abas continuam abertas
