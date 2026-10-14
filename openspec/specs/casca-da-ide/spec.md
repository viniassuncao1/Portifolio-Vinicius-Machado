# casca-da-ide Specification

## Purpose
Dar a todas as páginas do portfólio a mesma estrutura de IDE estilo Eclipse (barra de
ferramentas, árvore de seções, aba e editor) e permitir navegar entre as seções por ela.

## Requirements

### Requirement: Estrutura fixa da IDE
Toda página SHALL exibir a barra de ferramentas escura no topo, a faixa de ferramentas e o
painel do projeto (com o cabeçalho `Portfolio_Vinicius` do design) à esquerda e, à direita, a
faixa de abas sobre o editor de cantos arredondados, com a barra de status no rodapé.

#### Scenario: Abertura de qualquer seção
- **WHEN** o visitante abre a página inicial ou a rota de qualquer seção
- **THEN** a barra de ferramentas, a faixa de ferramentas, o painel, a faixa de abas, o editor e
  a barra de status aparecem nas mesmas posições

### Requirement: Árvore com as seções do portfólio
O painel lateral SHALL mostrar o projeto em pastas, nesta ordem: `sobre` (Sobre Mim,
Diferenciais, Como uso a IA), `skills`, `experiencias`, `projetos` (Projeto 1 a 4), `formacao`
(Certificações, Eventos, Formação, Idiomas), `recomendacoes` e `contato`. Cada seção é um
arquivo `.java` na sua pasta, com os ícones do design, e clicar numa pasta SHALL expandir ou
recolher os arquivos dela.

#### Scenario: Lista completa
- **WHEN** a página inicial é aberta
- **THEN** a árvore mostra as 7 pastas na ordem definida e, ao expandi-las, os 15 arquivos das
  seções, cada um com o seu ícone

#### Scenario: Abrir a pasta de projetos
- **WHEN** o visitante clica na pasta `projetos` recolhida
- **THEN** a pasta expande e mostra `Projeto1.java` a `Projeto4.java`, com `aria-expanded="true"`

### Requirement: Navegação pela árvore
Cada item da árvore SHALL levar à rota da sua seção, e a rota SHALL ter um endereço próprio que
pode ser aberto diretamente ou compartilhado.

#### Scenario: Clique numa seção
- **WHEN** o visitante clica em "Experiências" na árvore
- **THEN** o endereço muda para a rota de Experiências e o editor mostra o conteúdo dessa seção

#### Scenario: Acesso direto pelo endereço
- **WHEN** o visitante abre diretamente o endereço da seção "Contato"
- **THEN** a página carrega já com "Contato" selecionado na árvore

### Requirement: Seção atual em destaque
O arquivo da seção aberta SHALL aparecer destacado na árvore, com a sua pasta expandida, e MUST
ser anunciado como a página atual para tecnologias assistivas.

#### Scenario: Seção selecionada
- **WHEN** a seção "Sobre Mim" está aberta
- **THEN** a pasta `sobre` está expandida e o arquivo de "Sobre Mim" aparece destacado e marcado
  como página atual

### Requirement: Seção ainda não construída
Enquanto o conteúdo de uma seção não existir, a rota dela SHALL exibir no editor um aviso de que
a seção está em construção, no mesmo estilo de código das demais telas.

#### Scenario: Seção sem conteúdo
- **WHEN** o visitante abre uma seção cujo conteúdo ainda não foi implementado
- **THEN** o editor mostra um comentário de código informando que a seção está em construção

### Requirement: Navegação por teclado
Todos os itens da árvore e os controles interativos SHALL ser alcançáveis pela tecla Tab, com
foco visível, e ativados pela tecla Enter.

#### Scenario: Navegação sem mouse
- **WHEN** o visitante usa Tab até o item "Eventos" e pressiona Enter
- **THEN** o foco fica visível durante o percurso e a seção "Eventos" é aberta

### Requirement: Elementos decorativos ocultos
Os controles que imitam a IDE sem ter função (ícones da barra, controles de janela, Estrutura e
botões do cabeçalho do painel) MUST ser ignorados por tecnologias assistivas e MUST NOT receber
foco. Buscar, Projeto, Commit, o indicador `master`, o botão de tema e Executar são botões reais,
com nome acessível.

#### Scenario: Leitor de tela na barra de ferramentas
- **WHEN** um leitor de tela percorre a página
- **THEN** os controles decorativos não são anunciados, e Buscar, Projeto, Commit, `master`, o
  botão de tema e Executar são anunciados como botões

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

### Requirement: Todas as rotas pré-renderizadas
A rota de cada seção SHALL ser entregue já renderizada no HTML, sem depender de JavaScript para
exibir a casca e o conteúdo inicial.

#### Scenario: Seção sem JavaScript
- **WHEN** a rota de uma seção é carregada com JavaScript desabilitado
- **THEN** a casca da IDE e o conteúdo do editor aparecem no HTML recebido

### Requirement: Mostrar e esconder o painel do projeto
No desktop, o botão Projeto da faixa de ferramentas SHALL mostrar e esconder o painel do projeto,
indicando o estado com `aria-pressed`, e o editor SHALL ocupar o espaço liberado.

#### Scenario: Esconder o projeto
- **WHEN** o visitante ativa Projeto com o painel aberto
- **THEN** o painel some, o editor ocupa a largura e o botão fica com `aria-pressed="false"`

### Requirement: Abrir o Git pela faixa de ferramentas
O botão Commit da faixa de ferramentas SHALL abrir e fechar o painel do Git, indicando o estado
com `aria-pressed`.

#### Scenario: Commit na faixa
- **WHEN** o visitante ativa Commit com o painel fechado
- **THEN** o painel do Git abre e o botão fica com `aria-pressed="true"`
