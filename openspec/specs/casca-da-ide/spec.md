# casca-da-ide Specification

## Purpose
Dar a todas as páginas do portfólio a mesma estrutura de IDE estilo Eclipse (barra de
ferramentas, árvore de seções, aba e editor) e permitir navegar entre as seções por ela.

## Requirements

### Requirement: Estrutura fixa da IDE
Toda página SHALL exibir a barra de ferramentas no topo, o painel lateral com a árvore de seções
à esquerda e, à direita, a faixa de abas sobre a área do editor, com a barra de status no
rodapé.

#### Scenario: Abertura de qualquer seção
- **WHEN** o visitante abre a página inicial ou a rota de qualquer seção
- **THEN** a barra de ferramentas, o painel lateral, a faixa de abas e a barra de status
  aparecem nas mesmas posições

### Requirement: Árvore com as seções do portfólio
O painel lateral SHALL listar, nesta ordem, as seções: Sobre Mim, Diferenciais, Como uso a IA,
Skills / STACK, Experiências, Projeto 1, Projeto 2, Projeto 3, Projeto 4, Certificações,
Eventos, Formação, Idiomas, Depoimentos/Recomendações e Contato.

#### Scenario: Lista completa
- **WHEN** a página inicial é aberta
- **THEN** a árvore mostra as 15 seções na ordem definida, cada uma com o seu ícone

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
O item da seção aberta SHALL aparecer destacado e expandido na árvore, como no design, e MUST
ser anunciado como a página atual para tecnologias assistivas.

#### Scenario: Seção selecionada
- **WHEN** a seção "Sobre Mim" está aberta
- **THEN** o item "Sobre Mim" aparece destacado, com a seta apontando para baixo, e é marcado
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
Os botões da barra de ferramentas e os controles de janela, que imitam a IDE sem ter função,
MUST ser ignorados por tecnologias assistivas e MUST NOT receber foco.

#### Scenario: Leitor de tela na barra de ferramentas
- **WHEN** um leitor de tela percorre a página
- **THEN** os ícones da barra de ferramentas e os controles de janela não são anunciados

### Requirement: Adaptação a telas pequenas
Em telas com largura menor que 768px, o painel lateral SHALL ficar recolhido, abrindo por um
botão identificado, e o editor SHALL ocupar a largura disponível sem rolagem horizontal da
página.

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
