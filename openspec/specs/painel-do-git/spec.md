# painel-do-git Specification

## Purpose

Mostrar o histórico real do repositório num painel do Git como o do IntelliJ, gerado no build e
servido como arquivo estático.

## Requirements

### Requirement: Histórico gerado no build
O build SHALL gerar um arquivo JSON com os commits do repositório (SHA, pais, nome do autor,
data, assunto e, nos merges de PR, o número e a branch), sem e-mails. Sem histórico disponível, o arquivo MUST ter uma lista vazia e o build MUST NOT
falhar.

#### Scenario: Build no CI
- **WHEN** o CI faz o build com o histórico completo
- **THEN** o JSON tem todos os commits da `main`, do mais novo para o mais antigo, e nenhum
  e-mail

#### Scenario: Clone raso
- **WHEN** o build roda sem histórico do Git
- **THEN** o build termina com sucesso e o JSON tem a lista vazia

### Requirement: Painel do Git
O painel SHALL mostrar, na parte de baixo da IDE, o grafo das branches com cores por faixa e,
em cada linha, o assunto, o autor e a data do commit. Escolher um commit SHALL mostrar os
detalhes: SHA, mensagem, autor, data, link para o commit no GitHub e, nos merges de PR, link
para o PR.

#### Scenario: Ver um merge
- **WHEN** o visitante abre o painel e escolhe o merge do PR #27
- **THEN** os detalhes mostram o SHA, a mensagem, o autor, a data e os links para o commit e
  para o PR #27 no GitHub

#### Scenario: Histórico vazio
- **WHEN** o JSON não tem commits
- **THEN** o painel mostra uma mensagem dizendo que o histórico não está disponível

### Requirement: Carregamento sob demanda
O JSON do histórico MUST ser baixado só quando o painel abre pela primeira vez, e o painel SHALL
mostrar um estado de carregamento e uma mensagem de erro com opção de tentar de novo.

#### Scenario: Primeira abertura
- **WHEN** o visitante abre a página inicial sem abrir o painel
- **THEN** nenhuma requisição ao JSON do histórico é feita

### Requirement: Painel acessível
O painel SHALL ser navegável por teclado (setas para mudar de commit, Enter para ver os
detalhes, Esc para fechar, com o foco voltando para quem abriu), MUST passar no axe sem
exclusões e SHALL respeitar `prefers-reduced-motion` ao abrir e fechar. O grafo é decorativo
para leitores de tela; cada commit é anunciado pelo assunto, autor e data.

#### Scenario: Fechar com Esc
- **WHEN** o visitante abre o painel pelo indicador `master` e aperta Esc
- **THEN** o painel fecha e o foco volta para o indicador `master`

#### Scenario: Celular
- **WHEN** o painel é aberto numa tela de 390x844
- **THEN** ocupa a tela, sem rolagem horizontal da página, com um botão para fechar
