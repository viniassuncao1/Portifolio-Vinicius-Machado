# Spec Delta

## MODIFIED Requirements

### Requirement: Histórico gerado no build
O build SHALL gerar um arquivo JSON com os commits do repositório (SHA, pais, nome do autor,
data, assunto e, nos merges de PR, o número, a branch e o título do PR), sem e-mails. Sem
histórico disponível, o arquivo MUST ter uma lista vazia e o build MUST NOT falhar.

#### Scenario: Build no CI
- **WHEN** o CI faz o build com o histórico completo
- **THEN** o JSON tem todos os commits da `main`, do mais novo para o mais antigo, e nenhum
  e-mail

#### Scenario: Clone raso
- **WHEN** o build roda sem histórico do Git
- **THEN** o build termina com sucesso e o JSON tem a lista vazia

#### Scenario: Título do PR
- **WHEN** o histórico tem o merge do PR #31
- **THEN** o commit tem o número 31 e o título "feat: fotos de perfil no Javadoc"

### Requirement: Carregamento sob demanda
O JSON do histórico MUST ser baixado só quando a página do repositório abre, e a página SHALL
mostrar um estado de carregamento e uma mensagem de erro com opção de tentar de novo.

#### Scenario: Primeira abertura
- **WHEN** o visitante abre a página inicial sem abrir o repositório
- **THEN** nenhuma requisição ao JSON do histórico é feita

## REMOVED Requirements

### Requirement: Painel do Git
**Reason**: o log cru na parte de baixo cobria o editor e não explicava nada ao visitante.
**Migration**: substituído por "Página do repositório".

### Requirement: Painel acessível
**Reason**: o painel saiu.
**Migration**: substituído por "Repositório acessível".

## ADDED Requirements

### Requirement: Página do repositório
A rota `/repositorio` SHALL mostrar, numa aba do editor, a página do repositório no estilo do
GitHub: nome, uma frase explicando o que o repositório mostra, botão "Ver no GitHub", número de
commits e de pull requests mesclados e a data do primeiro commit.

#### Scenario: Abrir o repositório
- **WHEN** o visitante abre `/repositorio`
- **THEN** a aba `Portfolio-Vinicius-Machado` fica ativa e a página mostra os números, a divisão
  por tipo, os últimos PRs com o PR #31 e o link para o histórico completo

#### Scenario: Histórico vazio
- **WHEN** o JSON não tem commits
- **THEN** a página mostra que o histórico não está disponível e mantém o link para o GitHub

### Requirement: Destaques do histórico
A página do repositório SHALL mostrar a divisão dos commits por tipo do Conventional Commits, com
legenda e porcentagem, os 8 pull requests mais recentes (título, número, branch, data, link), os
5 commits de código mais recentes (sem os de marcar tarefas, com link) e o link "Ver todo o
histórico no GitHub".

#### Scenario: Últimos pull requests
- **WHEN** o visitante abre `/repositorio`
- **THEN** a lista de pull requests começa pelo mais recente e cada item leva ao PR no GitHub

#### Scenario: Sem commits de tarefa
- **WHEN** o histórico tem commits "docs: marca a tarefa…"
- **THEN** eles não aparecem em "Últimos commits"

### Requirement: Repositório acessível
A página do repositório MUST passar no axe sem exclusões nos dois temas, a divisão por tipo MUST
ter texto (não só cor), os links externos MUST abrir em nova aba com `rel="noopener noreferrer"`
e, no celular, a página SHALL ficar em uma coluna, sem rolagem horizontal.

#### Scenario: Celular
- **WHEN** a página é aberta numa tela de 390x844
- **THEN** o conteúdo fica em uma coluna, sem rolagem horizontal da página
