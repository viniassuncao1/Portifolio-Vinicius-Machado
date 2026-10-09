# Spec Delta

## Purpose

Permitir navegar pelo portfólio como numa IDE, pelo teclado: busca de seções no estilo "Go to
File" e navegação da árvore por setas.

## ADDED Requirements

### Requirement: Abrir a busca
Ctrl+P (ou Cmd+P no macOS) SHALL abrir uma caixa de busca de seções sobre o editor, com o foco
no campo de texto, e Escape SHALL fechá-la devolvendo o foco para onde estava.

#### Scenario: Atalho
- **WHEN** o visitante pressiona Cmd+P num Mac
- **THEN** a caixa de busca abre com o foco no campo

### Requirement: Filtrar e abrir
Digitar no campo SHALL filtrar as seções pelo nome do arquivo ou pelo título, sem diferenciar
maiúsculas e acentos; as setas escolhem um resultado e Enter abre a seção.

#### Scenario: Busca por parte do nome
- **WHEN** o visitante digita "exp" e pressiona Enter
- **THEN** a seção Experiências é aberta e a busca se fecha

### Requirement: Busca acessível
A busca MUST seguir o padrão de combobox do WAI-ARIA, com a lista de resultados anunciada e o
resultado ativo indicado por `aria-activedescendant`.

#### Scenario: Leitor de tela
- **WHEN** o visitante navega pelos resultados com as setas
- **THEN** o leitor de tela anuncia o resultado ativo

### Requirement: Botão para abrir a busca
A busca SHALL também poder ser aberta por um botão identificado na casca, para quem não usa
atalhos e no celular.

#### Scenario: Celular
- **WHEN** o visitante toca no botão de busca no celular
- **THEN** a caixa de busca abre

### Requirement: Árvore navegável por setas
Com o foco na árvore de seções, as setas para cima e para baixo SHALL mover o foco entre os
itens, Home e End SHALL ir ao primeiro e ao último, e Enter SHALL abrir a seção.

#### Scenario: Setas na árvore
- **WHEN** o foco está em "Diferenciais" e o visitante pressiona seta para baixo
- **THEN** o foco vai para "Como uso a IA"
