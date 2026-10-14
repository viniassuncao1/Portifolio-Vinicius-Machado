# Spec Delta

## MODIFIED Requirements

### Requirement: Estrutura fixa da IDE
Toda página SHALL exibir a barra de ferramentas do design no topo, a faixa de ferramentas e o
painel do projeto (com o cabeçalho `Portfolio_Vinicius` do design) à esquerda e, à direita, a
faixa de abas sobre o editor de cantos arredondados, com a barra de status no rodapé.

#### Scenario: Abertura de qualquer seção
- **WHEN** o visitante abre a página inicial ou a rota de qualquer seção
- **THEN** a barra de ferramentas, a faixa de ferramentas, o painel, a faixa de abas, o editor e
  a barra de status aparecem nas mesmas posições

### Requirement: Elementos decorativos ocultos
Os controles que imitam a IDE sem ter função (ícones da barra, controles de janela, indicador de
branch, Commit e Estrutura, botões do cabeçalho do painel e Executar fora dos projetos com site)
MUST ser ignorados por tecnologias assistivas e MUST NOT receber foco. Buscar, Projeto e
Executar nos projetos com site são botões reais, com nome acessível.

#### Scenario: Leitor de tela na barra de ferramentas
- **WHEN** um leitor de tela percorre a página
- **THEN** os controles decorativos não são anunciados, e Buscar e Projeto são anunciados como
  botões

### Requirement: Adaptação a telas pequenas
Em telas com largura menor que 768px, a faixa de ferramentas SHALL ficar oculta, o painel do
projeto SHALL ficar recolhido, abrindo pelo botão Projeto da barra superior, e o editor SHALL
ocupar a largura disponível sem rolagem horizontal da página.

#### Scenario: Celular de 390px
- **WHEN** a página inicial é aberta numa tela de 390x844
- **THEN** o editor ocupa a largura da tela, a página não rola na horizontal e há um botão para
  abrir a árvore de seções

#### Scenario: Escolha de seção no celular
- **WHEN** o visitante abre a árvore pelo botão e escolhe "Formação"
- **THEN** a seção "Formação" é aberta e a árvore volta a ficar recolhida

## ADDED Requirements

### Requirement: Mostrar e esconder o painel do projeto
No desktop, o botão Projeto da faixa de ferramentas SHALL mostrar e esconder o painel do projeto,
indicando o estado com `aria-pressed`, e o editor SHALL ocupar o espaço liberado.

#### Scenario: Esconder o projeto
- **WHEN** o visitante ativa Projeto com o painel aberto
- **THEN** o painel some, o editor ocupa a largura e o botão fica com `aria-pressed="false"`
