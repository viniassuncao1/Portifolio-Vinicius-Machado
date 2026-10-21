# Spec Delta

## Purpose
Define como o conteúdo do portfólio usa elementos de IDE e do Java como forma de cada seção, mantendo a leitura rápida para quem recruta.

## ADDED Requirements

### Requirement: Primeira dobra para recrutadores
The system SHALL mostrar, na primeira tela do Início e sem rolagem, o nome, o cargo, a stack principal, o disponível para propostas e os atalhos para Currículo (PDF), LinkedIn, GitHub e copiar o e-mail, no desktop e no celular.

#### Scenario: Visitante abre o Início
- **WHEN** o visitante abre `/` numa janela de 1440x900 ou de 390x844
- **THEN** nome, cargo, stack, "Disponível" e as ações de contato estão visíveis sem rolar

### Requirement: Sidebar fixa do projeto
The system SHALL manter a árvore do projeto sempre visível no desktop, com ícone por arquivo e um indicador que se desloca até o item da seção atual, e no celular SHALL oferecer a mesma navegação numa fileira que rola.

#### Scenario: Troca de seção
- **WHEN** o visitante escolhe outro arquivo na árvore, na aba ou na paleta de comandos
- **THEN** árvore, aba e conteúdo mudam juntos e a seção nova fica marcada com `aria-current`

### Requirement: Início como classe Java com Run
The system SHALL apresentar o Início como a classe `ViniciusMachado` no editor, com um painel Run que mostra a inicialização da aplicação e termina com a apresentação do Vinicius.

#### Scenario: Run com movimento
- **WHEN** o Início abre e o visitante não pediu movimento reduzido
- **THEN** o log do Run aparece linha a linha e termina em "Disponível para propostas"

#### Scenario: Sem movimento ou sem JavaScript
- **WHEN** o visitante pediu movimento reduzido ou o JavaScript está desligado
- **THEN** o log completo já está no HTML e nada é digitado

### Requirement: Skills como build.gradle
The system SHALL apresentar as skills como as dependências de um `build.gradle`, agrupadas pelos níveis de conhecimento, e cada dependência SHALL mostrar os projetos da vitrine que a usam ao receber hover, foco ou toque.

#### Scenario: Dependência com projeto
- **WHEN** o visitante passa o mouse, foca ou toca numa dependência
- **THEN** um painel lista os projetos que a usam, com links para a vitrine

### Requirement: Cada seção com a forma do seu arquivo
The system SHALL dar a cada seção uma forma de IDE própria (Experiência como `git log --graph`, Projetos como janela de Run com preview, Contato como terminal), sem repetir o mesmo cartão em todas.

#### Scenario: Experiência
- **WHEN** o visitante abre Experiências
- **THEN** as experiências aparecem como commits num grafo, com os mesmos fatos de `core/perfil.ts`

### Requirement: Fatos em uma fonte só
The system SHALL ler todos os fatos exibidos de `core/perfil.ts` e `core/projetos.ts`, de modo que nenhuma forma de apresentação divirja das demais.

#### Scenario: Divergência
- **WHEN** um fato exibido difere do dado de origem
- **THEN** o teste unitário correspondente falha

### Requirement: Acessibilidade e movimento
The system SHALL passar no axe (WCAG AA) nos dois temas, manter foco visível, respeitar `prefers-reduced-motion` e carregar a biblioteca de movimento só depois da hidratação.

#### Scenario: Movimento reduzido
- **WHEN** o visitante pediu movimento reduzido
- **THEN** nenhuma animação decorativa roda e todo o conteúdo está visível no primeiro quadro
