# barra-superior Specification

## Purpose

Manter a barra de ferramentas do design original, com ícones de IDE de verdade, o indicador de
branch do Git e as ações de executar e buscar.

## Requirements

### Requirement: Barra de ferramentas do design com Git
A barra superior SHALL ter fundo escuro nos cinzas do design (sem o degradê claro), ícones do
design à esquerda, controles de janela à direita e um indicador de branch com o ícone de branch e
o nome `master`, que é um botão real e abre o painel do Git.

#### Scenario: Abertura do site
- **WHEN** o visitante abre qualquer página no desktop
- **THEN** a barra superior é escura, com os ícones do design e o indicador `master`

#### Scenario: Abrir o Git pela branch
- **WHEN** o visitante ativa o indicador `master`
- **THEN** o painel do Git abre com o commit mais recente em foco

### Requirement: Ações da barra superior
Buscar MUST abrir a busca de seções; Executar MUST abrir o preview nos projetos com site e ficar
decorativo nas demais páginas; os demais ícones e os controles de janela são decorativos.

#### Scenario: Buscar pela barra
- **WHEN** o visitante ativa o botão Buscar
- **THEN** a busca de seções abre com o foco no campo

#### Scenario: Executar num projeto com site
- **WHEN** o visitante está no Projeto 2 e ativa Executar na barra superior
- **THEN** a janela de preview do projeto abre
