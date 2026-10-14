# Spec Delta

## Purpose

Oferecer um tema claro além do escuro do design, escolhido pelo sistema ou pelo visitante, sem
piscar no carregamento.

## ADDED Requirements

### Requirement: Tema inicial
Na primeira visita, o site SHALL usar o tema do sistema (`prefers-color-scheme`); depois de uma
escolha do visitante, SHALL usar a escolha guardada. O tema MUST ser aplicado antes da primeira
pintura, sem mostrar o outro tema por um instante.

#### Scenario: Sistema no claro
- **WHEN** o visitante abre o site pela primeira vez com o sistema no tema claro
- **THEN** a página já aparece no tema claro, sem piscar o escuro

#### Scenario: Sem JavaScript
- **WHEN** a página é aberta sem JavaScript com o sistema no tema claro
- **THEN** a página aparece no tema claro

### Requirement: Botão de tema
A barra de ferramentas SHALL ter um botão que alterna entre claro e escuro, com nome acessível
que diz o tema de destino e foco visível, e a escolha MUST ficar guardada no navegador.

#### Scenario: Trocar para o claro
- **WHEN** o visitante no tema escuro ativa o botão de tema
- **THEN** o site passa para o tema claro e continua claro ao recarregar a página

### Requirement: Contraste nos dois temas
Todos os textos, ícones informativos e cores de sintaxe MUST passar no contraste AA nos dois
temas, e o axe MUST passar sem exclusões nos dois.

#### Scenario: Código no tema claro
- **WHEN** a seção Skills é aberta no tema claro
- **THEN** cada cor de sintaxe tem contraste de pelo menos 4,5:1 sobre o fundo do editor

### Requirement: Troca suave
A troca de tema SHALL usar uma transição curta (View Transitions API, quando disponível) e MUST
ser imediata com `prefers-reduced-motion: reduce`.

#### Scenario: Movimento reduzido
- **WHEN** o visitante com movimento reduzido troca o tema
- **THEN** o novo tema aparece imediatamente, sem animação
