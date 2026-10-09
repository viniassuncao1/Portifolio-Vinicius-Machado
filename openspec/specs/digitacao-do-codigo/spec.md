# digitacao-do-codigo Specification

## Purpose
Dar vida ao editor como numa IDE: o código aparece sendo digitado, com cursor e linha atual
destacada, sem atrapalhar quem prefere menos movimento ou usa tecnologias assistivas.

## Requirements

### Requirement: Digitação ao abrir uma seção
Ao abrir uma seção pela primeira vez na visita, o código SHALL aparecer sendo digitado em no
máximo 1,5 segundo no total. Nas aberturas seguintes da mesma seção, ele aparece pronto.

#### Scenario: Primeira abertura
- **WHEN** o visitante abre "Sobre Mim" pela primeira vez
- **THEN** o código é digitado progressivamente e termina em até 1,5 segundo

#### Scenario: Voltar a uma seção
- **WHEN** o visitante volta para "Sobre Mim" na mesma visita
- **THEN** o código aparece completo imediatamente

### Requirement: Pular a digitação
Qualquer clique no editor ou tecla pressionada durante a digitação SHALL completá-la
imediatamente.

#### Scenario: Pressa
- **WHEN** a digitação está em andamento e o visitante pressiona uma tecla
- **THEN** o código aparece completo

### Requirement: Conteúdo completo para todos
O HTML pré-renderizado e as tecnologias assistivas MUST receber o código completo desde o
início; a digitação é só visual.

#### Scenario: Leitor de tela
- **WHEN** um leitor de tela lê o editor durante a digitação
- **THEN** ele lê o código completo

#### Scenario: Movimento reduzido
- **WHEN** o visitante tem `prefers-reduced-motion: reduce`
- **THEN** não há digitação nem cursor piscando, e o código aparece pronto

### Requirement: Cursor e linha atual
Ao fim da digitação, o editor SHALL mostrar um cursor piscando no fim do código e destacar a
linha atual, e clicar numa linha SHALL mover o destaque para ela.

#### Scenario: Clique numa linha
- **WHEN** o visitante clica na linha 5
- **THEN** a linha 5 fica destacada e a barra de status mostra a linha 5
