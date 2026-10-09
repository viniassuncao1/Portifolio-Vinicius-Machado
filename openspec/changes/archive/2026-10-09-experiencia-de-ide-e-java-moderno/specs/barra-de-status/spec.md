# Spec Delta

## Purpose

Completar a aparência de IDE com uma barra de status no rodapé, com informações reais do
arquivo aberto.

## ADDED Requirements

### Requirement: Informações do arquivo aberto
A casca SHALL exibir no rodapé uma barra de status com o nome do arquivo da aba ativa, a posição
`linha:coluna` do cursor, a codificação `UTF-8`, a versão `Java 21` e a branch `main`.

#### Scenario: Seção aberta
- **WHEN** a seção Skills está aberta
- **THEN** a barra de status mostra `Skills.java`, `UTF-8`, `Java 21` e `main`

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
