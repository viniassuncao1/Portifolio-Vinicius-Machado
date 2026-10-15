# barra-de-status Specification

## Purpose
Completar a aparência de IDE com uma barra de status no rodapé, com informações reais do
arquivo aberto.

## Requirements

### Requirement: Informações do arquivo aberto
A casca SHALL exibir no rodapé uma barra de status, nas cores do design, com, à esquerda, os breadcrumbs do
arquivo da aba ativa (`portfolio-vinicius › src › main › java › … › Arquivo.java`) e, à direita,
a posição `linha:coluna`, `LF`, `UTF-8`, `4 spaces` e a branch `master`.

#### Scenario: Seção aberta
- **WHEN** a seção Skills está aberta
- **THEN** a barra de status mostra os breadcrumbs terminando em `Skills.java`, e à direita
  `LF`, `UTF-8`, `4 spaces` e `master`

### Requirement: Posição do cursor
A posição exibida SHALL acompanhar a linha destacada no editor.

#### Scenario: Linha clicada
- **WHEN** o visitante clica na linha 7 do editor
- **THEN** a barra de status mostra `7:1`

### Requirement: Barra de status acessível
A barra de status MUST ter o papel `status` e só anunciar mudanças de arquivo, sem anunciar
cada mudança de posição do cursor.

#### Scenario: Troca de seção
- **WHEN** o visitante troca de seção
- **THEN** um leitor de tela anuncia o novo arquivo uma vez

### Requirement: Commit do deploy
A barra de status SHALL mostrar o SHA curto (7 caracteres) do commit que gerou o deploy, como
link para o commit no GitHub; sem essa informação (build local), o item não aparece.

#### Scenario: Site em produção
- **WHEN** o visitante abre o site publicado
- **THEN** a barra de status mostra o SHA curto do commit, com link para
  `https://github.com/viniassuncao1/Portifolio-Vinicius-Machado/commit/<sha>`

### Requirement: Aviso de inicialização
Depois que a tela de boas-vindas fecha, a barra de status SHALL mostrar por 6 s o aviso
`PortfolioApplication started in 1.8 s`, anunciado com `aria-live="polite"`.

#### Scenario: Depois das boas-vindas
- **WHEN** a tela de boas-vindas fecha
- **THEN** a barra de status mostra `PortfolioApplication started in 1.8 s` e o aviso some depois
  de 6 s
