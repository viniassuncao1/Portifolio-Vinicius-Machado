## Purpose

Fazer quem recruta entender em segundos quem é o Vinicius, o que ele faz e onde ver os projetos,
o currículo e o contato, a partir da primeira dobra e de caminhos curtos em qualquer página.

## ADDED Requirements

### Requirement: Primeira dobra que responde em segundos
A página inicial SHALL, sem rolar, dizer quem é o Vinicius, o que faz, a disponibilidade e levar
a Projetos, ao Currículo e ao Contato por três ações visíveis.

#### Scenario: Primeira dobra
- **WHEN** a página inicial abre numa janela de 1440x900
- **THEN** a primeira tela mostra nome, cargo, a stack principal, "disponível" e os botões
  Projetos, Currículo e Contato

### Requirement: Caminhos rápidos para quem recruta
O site SHALL oferecer, em qualquer seção, acesso direto a Projetos, Contato e Currículo, e a busca
de seções (Ctrl/Cmd+K) MUST continuar abrindo qualquer seção pelo teclado.

#### Scenario: Contato de qualquer seção
- **WHEN** o visitante está em "Skills" e ativa Contato
- **THEN** chega ao contato em um passo

### Requirement: Saber onde se está
A casca SHALL indicar a seção atual na árvore, na aba e no caminho da barra de status, e a página
MUST NOT esconder conteúdo importante atrás de cliques além do cartão de projeto.

#### Scenario: Seção em foco
- **WHEN** o visitante abre "Experiências"
- **THEN** árvore, aba e caminho da barra de status apontam para "Experiências"

### Requirement: Navegação própria para o celular
Em telas com menos de 768 px, a navegação SHALL usar uma barra de ações com Seções, Projetos e
Contato ao alcance do polegar, e a vitrine SHALL abrir em grade, sem arrasto horizontal
obrigatório, e nenhuma página MUST rolar na horizontal.

#### Scenario: Celular de 390 px
- **WHEN** a página inicial abre numa tela de 390x844
- **THEN** há uma barra de ações com Seções, Projetos e Contato e a página não rola na horizontal

### Requirement: Tempo até o conteúdo
A abertura animada de IDE SHALL ser opcional: o visitante MUST poder pulá-la com um toque ou uma
tecla, ela MUST ser dispensada em visitas seguintes, e o conteúdo MUST estar acessível a leitores
de tela desde o primeiro quadro.

#### Scenario: Pular a abertura
- **WHEN** o visitante pressiona Esc durante a abertura
- **THEN** a casca aparece de imediato e a abertura não volta nessa visita

### Requirement: Metas de qualidade medidas
A página inicial no celular SHALL atingir pelo menos 95 em Desempenho, 100 em Acessibilidade, 100
em Boas Práticas e 100 em SEO no Lighthouse, com LCP de até 2,5 s e CLS de até 0,05, e o AXE MUST
não reportar violações.

#### Scenario: Auditoria
- **WHEN** o Lighthouse e o AXE rodam na página inicial e na vitrine de projetos no celular
- **THEN** as metas são atingidas e nenhuma violação é reportada

### Requirement: Cartão e código como duas visões do mesmo conteúdo
Cada seção SHALL poder ser lida em duas visões, "Cartão" (layout visual e escaneável) e "Código"
(arquivo Java do editor), com o mesmo conteúdo, e a visão "Cartão" MUST ser a inicial para quem
chega pela primeira vez. A escolha SHALL ser lembrada na visita e trocada por um controle com
`aria-pressed`, sem recarregar a página.

#### Scenario: Primeira visita
- **WHEN** um visitante abre uma seção pela primeira vez
- **THEN** vê a visão "Cartão" e encontra o controle para ver o mesmo conteúdo como código

#### Scenario: Trocar para código
- **WHEN** o visitante ativa "Código"
- **THEN** o conteúdo aparece como o arquivo Java da seção, com a mesma informação, e a escolha é
  lembrada na próxima seção aberta

### Requirement: Código que vira cartão na abertura
A primeira dobra SHALL apresentar a classe `ViniciusMachado` sendo escrita e resolvida no cartão
de apresentação (nome, cargo, stack, "disponível" e ações), em até 2,5 s, com um modo sem
animação que mostra o cartão direto.

#### Scenario: Compilar o cartão
- **WHEN** a página inicial abre com movimento permitido
- **THEN** o código é digitado e, ao terminar, vira o cartão de apresentação sem recarregar

#### Scenario: Movimento reduzido
- **WHEN** a página inicial abre com `prefers-reduced-motion: reduce`
- **THEN** o cartão aparece direto, sem digitação

### Requirement: Barra de ações do recrutador
O site SHALL manter à vista, em qualquer seção, as ações Currículo, LinkedIn, GitHub e Contato
(e-mail), com cópia do e-mail por um toque e confirmação anunciada a leitores de tela, e a busca
(Ctrl/Cmd+K) SHALL listar as mesmas ações como comandos.

#### Scenario: Copiar o e-mail
- **WHEN** o visitante ativa "Copiar e-mail"
- **THEN** o e-mail vai para a área de transferência e aparece a confirmação "E-mail copiado"

#### Scenario: Comando na busca
- **WHEN** o visitante abre a busca e digita "currículo"
- **THEN** o comando "Baixar currículo" aparece e baixa o PDF ao ser ativado
