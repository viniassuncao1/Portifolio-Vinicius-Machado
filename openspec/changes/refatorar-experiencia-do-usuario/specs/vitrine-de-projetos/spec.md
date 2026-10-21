## Purpose

Mostrar os seis projetos numa vitrine de cartões com captura, etiquetas e destaques, com detalhes
em diálogo acessível e endereço próprio, sem perder o arquivo em código de cada projeto.

## ADDED Requirements

### Requirement: Cartões de projeto
A vitrine SHALL mostrar um cartão para cada um dos seis projetos, com captura de tela, número,
nome, etiquetas de tecnologia e até três destaques curtos, na mesma ordem da árvore do projeto.

#### Scenario: Seis cartões
- **WHEN** o visitante abre a vitrine de projetos
- **THEN** vê seis cartões, do Projeto 1 ao Projeto 6, cada um com captura de tela, nome, etiquetas
  e destaques curtos

#### Scenario: Cartão sem captura própria
- **WHEN** um projeto não tem captura de tela (por exemplo, o launcher de TV em Java)
- **THEN** o cartão mostra uma capa gerada no estilo do editor, com o nome da classe e o trecho
  principal em Java, e não uma imagem quebrada

### Requirement: Carrossel arrastável
Os cartões SHALL formar um carrossel que o visitante move arrastando com o ponteiro, com os botões
Anterior e Próximo, com as setas do teclado e pelos pontos de paginação, destacando o cartão
central e esmaecendo os vizinhos. Um arrasto MUST NOT abrir o cartão.

#### Scenario: Arrastar sem abrir
- **WHEN** o visitante arrasta o carrossel e solta o ponteiro sobre um cartão
- **THEN** o carrossel desliza e nenhum cartão é aberto

#### Scenario: Ir para um projeto pelo ponto
- **WHEN** o visitante ativa o ponto do Projeto 4
- **THEN** o carrossel centraliza o cartão do Projeto 4 pelo caminho mais curto

### Requirement: Sem movimento automático
O carrossel SHALL mudar de projeto só por ação do visitante (arrasto, botões Anterior e Próximo,
pontos de paginação e setas do teclado) e MUST NOT avançar sozinho, para que ninguém perca o projeto
que está lendo. Se um dia houver movimento automático, ele MUST ter botão Pausar/Retomar sempre
visível e começar parado com `prefers-reduced-motion`.

#### Scenario: Parado até o visitante agir
- **WHEN** a vitrine fica aberta por 10 segundos sem interação
- **THEN** o cartão central continua o mesmo e a rolagem do carrossel não muda

#### Scenario: Movimento reduzido
- **WHEN** o visitante com `prefers-reduced-motion: reduce` usa os botões do carrossel
- **THEN** o carrossel troca de cartão sem rolagem suave

### Requirement: Alternativa estática em grade
A vitrine SHALL oferecer a alternativa de ver todos os projetos numa grade, sem carrossel, com o
mesmo conteúdo dos cartões, para comparação rápida e para quem não usa arrasto.

#### Scenario: Alternar para a grade
- **WHEN** o visitante ativa "Ver em grade"
- **THEN** os seis cartões aparecem juntos, sem movimento, e o controle passa a "Ver em carrossel"

### Requirement: Expansão do cartão até a tela cheia
Ativar um cartão SHALL abrir os detalhes do projeto expandindo a partir da posição e do tamanho do
cartão até a tela cheia, e fechar SHALL recolher de volta ao cartão de origem. Com movimento
reduzido, os detalhes MUST aparecer e sumir sem animação.

#### Scenario: Abrir e fechar
- **WHEN** o visitante ativa o cartão do Projeto 2 e depois fecha os detalhes
- **THEN** os detalhes crescem do cartão até a tela cheia e, ao fechar, recolhem de volta ao
  cartão, que recebe o foco

#### Scenario: Cartão fora da tela ao fechar
- **WHEN** o cartão de origem não está visível ao fechar (porque o visitante navegou para outro
  projeto)
- **THEN** os detalhes somem com um esmaecimento, sem recolher para uma posição inexistente

### Requirement: Detalhes do projeto
Os detalhes SHALL mostrar o contador "NN / 06", o nome, as etiquetas, a descrição, os destaques,
uma galeria com imagem principal e miniaturas com troca por esmaecimento, o botão para o site ou
repositório (rotulado "Ver site" ou "Ver repositório" conforme o destino), e o acesso ao arquivo
`.java` do projeto.

#### Scenario: Troca de imagem na galeria
- **WHEN** o visitante ativa a terceira miniatura
- **THEN** a imagem principal troca por esmaecimento e a miniatura ativa fica marcada

#### Scenario: Link com rótulo do destino
- **WHEN** o projeto tem apenas repositório no GitHub
- **THEN** o botão se chama "Ver repositório" e abre em nova aba com `rel="noopener noreferrer"`

### Requirement: Navegação entre projetos
Dentro dos detalhes, o visitante SHALL ir ao projeto seguinte e ao anterior pelos botões e pelas
setas do teclado, dando a volta do último ao primeiro, sem fechar os detalhes.

#### Scenario: Próximo projeto
- **WHEN** os detalhes do Projeto 6 estão abertos e o visitante ativa "Próximo projeto"
- **THEN** os detalhes passam ao Projeto 1 e o contador mostra "01 / 06"

### Requirement: Diálogo acessível
Os detalhes SHALL ser um diálogo modal com nome acessível, foco levado ao botão de fechar ao abrir,
foco preso dentro dele, Esc para fechar, rolagem da página travada e foco devolvido ao cartão de
origem ao fechar. Os cartões MUST ser controles nativos (botão ou link), e as cópias usadas só para
o laço visual MUST ficar ocultas para tecnologias assistivas e fora da ordem de foco.

#### Scenario: Teclado
- **WHEN** o visitante abre um cartão com Enter, navega com Tab e fecha com Esc
- **THEN** o foco permanece dentro do diálogo e volta ao cartão ao fechar

#### Scenario: Leitor de tela
- **WHEN** um leitor de tela percorre a vitrine
- **THEN** cada projeto é anunciado uma única vez, sem duplicatas do laço

### Requirement: Endereço compartilhável do projeto
Abrir os detalhes de um projeto SHALL refletir no endereço (a rota do projeto), de modo que o
endereço possa ser compartilhado e abra direto os detalhes desse projeto, e Voltar do navegador
SHALL fechar os detalhes.

#### Scenario: Abrir pelo endereço
- **WHEN** o visitante abre diretamente o endereço do Projeto 3
- **THEN** a vitrine carrega e os detalhes do Projeto 3 já estão abertos

### Requirement: Imagens leves
As capturas de tela SHALL ser servidas em formato moderno (AVIF ou WebP), com dimensões
declaradas, carga tardia fora da primeira dobra, e nenhum arquivo de imagem da vitrine MUST passar
de 200 KB.

#### Scenario: Peso das imagens
- **WHEN** a vitrine é carregada
- **THEN** nenhuma imagem de projeto excede 200 KB e as imagens fora da tela só são pedidas ao
  chegarem perto dela
