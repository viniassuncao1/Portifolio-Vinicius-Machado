## ADDED Requirements

### Requirement: Vitrine como porta de entrada dos projetos
A seção de projetos SHALL abrir pela vitrine da spec `vitrine-de-projetos`, listando os seis
projetos na ordem definida em "Ordem dos projetos para vagas Java", e cada cartão SHALL levar aos
detalhes do projeto.

#### Scenario: Entrar pela vitrine
- **WHEN** o visitante ativa "Projetos" na página inicial ou na barra de ações
- **THEN** vê a vitrine com os seis cartões na ordem definida

### Requirement: Arquivo Java como detalhe em código
Cada projeto SHALL manter a sua rota `/projeto-N` com o arquivo `.java` inteiro, como o detalhe em
código, acessível pelos detalhes da vitrine, e MUST NOT perder nenhum conteúdo ou endereço
existente.

#### Scenario: Ver o código do projeto
- **WHEN** o visitante ativa "Ver em código" nos detalhes do Projeto 3
- **THEN** abre `/projeto-3` com o arquivo `Projeto3.java` e o ▶ Executar de sempre

#### Scenario: Endereço antigo
- **WHEN** alguém abre um `/projeto-N` já compartilhado
- **THEN** a página carrega o arquivo do projeto como antes
