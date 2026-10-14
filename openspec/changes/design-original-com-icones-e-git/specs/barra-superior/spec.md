# Spec Delta

## Purpose

Reproduzir a barra principal do IntelliJ New UI, com o projeto, a branch e as ações de executar
e buscar, de modo que o site se pareça com a IDE real.

## ADDED Requirements

### Requirement: Widgets de projeto e branch
A barra superior SHALL mostrar, à esquerda, o widget do projeto com o selo `PV` e o nome
`portfolio-vinicius`, e o widget da branch com o ícone de branch e o nome `master`, ambos
decorativos.

#### Scenario: Abertura do site
- **WHEN** o visitante abre qualquer página no desktop
- **THEN** a barra superior mostra `portfolio-vinicius` e `master` à esquerda

### Requirement: Ações da barra superior
À direita, a barra superior SHALL mostrar a configuração de execução `PortfolioApplication`,
Executar, Depurar, Buscar e Configurações. Buscar MUST abrir a busca de seções; Executar MUST
abrir o preview nos projetos com site e ficar decorativo nas demais páginas; Depurar,
Configurações e a configuração de execução são decorativos.

#### Scenario: Buscar pela barra
- **WHEN** o visitante ativa o botão Buscar
- **THEN** a busca de seções abre com o foco no campo

#### Scenario: Executar num projeto com site
- **WHEN** o visitante está no Projeto 2 e ativa Executar na barra superior
- **THEN** a janela de preview do projeto abre
