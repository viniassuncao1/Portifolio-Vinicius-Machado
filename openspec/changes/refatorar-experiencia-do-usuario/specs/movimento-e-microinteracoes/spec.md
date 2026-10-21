## ADDED Requirements

### Requirement: Movimento com propósito e reversível
Toda animação SHALL servir a orientação, ao feedback ou à hierarquia, e MUST ter um estado final
legível sem ela. O site SHALL funcionar por completo, com todo o conteúdo visível, sem JavaScript e
sem animações.

#### Scenario: Sem JavaScript
- **WHEN** a página é carregada com JavaScript desabilitado
- **THEN** todo o texto das seções está visível, sem trechos ocultos à espera de uma animação

### Requirement: Movimento reduzido sem custo
Com `prefers-reduced-motion: reduce`, o site MUST NOT animar entradas, rolagem suave, parallax,
carrosséis automáticos nem transições de cor, exibindo direto o estado final, e MUST NOT carregar a
biblioteca de animação.

#### Scenario: Preferência ativada
- **WHEN** o visitante com movimento reduzido percorre a página e abre um projeto
- **THEN** nada se move sozinho, as mudanças aparecem imediatamente e a biblioteca de animação não
  é baixada

### Requirement: Biblioteca de animação sob demanda
O código de animação baseado em biblioteca SHALL ser carregado depois da primeira renderização, só
quando o visitante aceita movimento, e MUST NOT entrar no pacote inicial. Animações que o CSS e as
View Transitions resolvem MUST usar esses recursos.

#### Scenario: Pacote inicial
- **WHEN** a página inicial é carregada com movimento permitido
- **THEN** o JavaScript inicial não contém a biblioteca de animação, que é baixada em seguida

### Requirement: Tema de cores por seção
Ao rolar a página inicial, as cores do site SHALL transitar suavemente entre os temas de cada
seção, definidos por tokens, em cerca de 0,9 s e sem piscar, e todo par de texto e fundo de cada
tema MUST manter contraste de pelo menos 4,5:1.

#### Scenario: Chegar a outra seção
- **WHEN** a seção "Projetos" passa da metade da altura da janela
- **THEN** as variáveis de cor do site transitam para as do tema de "Projetos"

#### Scenario: Contraste em todos os temas
- **WHEN** a verificação automática de contraste roda em cada seção
- **THEN** nenhum texto fica abaixo de 4,5:1 em nenhum dos temas

### Requirement: Revelação de títulos e blocos
Títulos de seção SHALL aparecer por linha, subindo de uma máscara, e blocos de texto SHALL entrar
com leve deslocamento e esmaecimento quando chegam a cerca de 90% da altura da janela, uma única
vez. Frases de abertura SHALL se acender palavra a palavra conforme o scroll.

#### Scenario: Título de seção
- **WHEN** o título de uma seção entra na janela
- **THEN** suas linhas sobem da máscara em sequência e permanecem visíveis

### Requirement: Indicador deslizante nas abas e na navegação
O destaque da aba ativa e do item de navegação SHALL deslizar até o item ativo ou sob o ponteiro,
e voltar ao ativo quando o ponteiro sai.

#### Scenario: Trocar de aba
- **WHEN** o visitante ativa outra aba aberta
- **THEN** o indicador desliza da aba anterior à nova

### Requirement: Linha do tempo que se desenha
Experiências e formação SHALL ser exibidas numa linha do tempo vertical cuja linha se preenche
conforme o scroll, com cada item acendendo ao ser alcançado, em uma coluna única no celular.

#### Scenario: Rolar a linha do tempo
- **WHEN** o visitante rola até o terceiro item
- **THEN** a linha está preenchida até ele e os três primeiros itens estão acesos

### Requirement: Interações de ponteiro opcionais
Efeitos que dependem de mouse (botões que seguem levemente o ponteiro, inclinação 3D dos
cartões, parallax da foto e cursor personalizado) SHALL existir só com ponteiro fino e hover, MUST
NOT ocultar o cursor nativo e MUST NOT ser necessários para nenhuma tarefa.

#### Scenario: Tela de toque
- **WHEN** o visitante usa um dispositivo de toque
- **THEN** nenhum efeito de ponteiro é aplicado e todos os controles funcionam normalmente

### Requirement: Barra de status viva
A barra de status SHALL mostrar o relógio de Brasília, atualizado a cada 30 s, e o estado
"disponível" do Vinicius com um indicador discreto, e MUST NOT anunciar o relógio a cada
atualização para leitores de tela.

#### Scenario: Relógio
- **WHEN** a página está aberta
- **THEN** a barra de status mostra a hora de Brasília no formato HH:mm e a atualiza sem recarregar

### Requirement: Foco e leitura durante o movimento
Nenhuma animação MUST mover um controle focado para fora do alcance, atrasar a leitura de um
conteúdo por mais de 1,2 s nem impedir a interação durante a transição.

#### Scenario: Interagir durante a revelação
- **WHEN** o visitante ativa um botão enquanto o bloco dele ainda está entrando
- **THEN** o botão responde na hora
