# Spec Delta

## MODIFIED Requirements

### Requirement: Informações do arquivo aberto
A casca SHALL exibir no rodapé uma barra de status da New UI com, à esquerda, os breadcrumbs do
arquivo da aba ativa (`portfolio-vinicius › src › main › java › … › Arquivo.java`) e, à direita,
a posição `linha:coluna`, `LF`, `UTF-8`, `4 spaces` e a branch `master`.

#### Scenario: Seção aberta
- **WHEN** a seção Skills está aberta
- **THEN** a barra de status mostra os breadcrumbs terminando em `Skills.java`, e à direita
  `LF`, `UTF-8`, `4 spaces` e `master`

## ADDED Requirements

### Requirement: Commit do deploy
A barra de status SHALL mostrar o SHA curto (7 caracteres) do commit que gerou o deploy, como
link para o commit no GitHub; sem essa informação (build local), o item não aparece.

#### Scenario: Site em produção
- **WHEN** o visitante abre o site publicado
- **THEN** a barra de status mostra o SHA curto do commit, com link para
  `https://github.com/viniassuncao1/Portifolio-Vinicius-Machado/commit/<sha>`
