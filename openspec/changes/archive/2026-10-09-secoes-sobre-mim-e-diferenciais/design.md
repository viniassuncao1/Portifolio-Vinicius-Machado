# Design

## Context

A casca, o editor e o modelo de conteúdo já existem (`docs/componentes.md`). As rotas das 15
seções carregam `SecaoEmConstrucao`. Telas de referência: `tela-02.png` (Sobre Mim) e
`tela-03.png` (Diferenciais).

## Goals / Non-Goals

**Goals:**

- Criar as duas seções só com dados, validando o caminho "nova seção = novo arquivo de
  conteúdo" documentado.

**Non-Goals:**

- Mudar a casca ou a árvore.

## Decisions

### 1. Uma feature por seção

`features/sobre-mim/` e `features/diferenciais/`, cada uma com o componente (`sobre-mim.ts`,
`diferenciais.ts`), o conteúdo tipado (`*.conteudo.ts`) e o teste. A rota da seção troca o
`loadComponent` de `SecaoEmConstrucao` para a feature. Features não importam umas das outras.

### 2. Papel `valor` para literais não textuais

Novo papel `'valor'` no modelo, com a construtora `valor('true')` e o token
`--cor-sintaxe-valor`. A cor amostrada na tela 03 é `#4fafac`, com contraste de 5,43:1 sobre o
fundo do editor (`#2b2b2b`), então não precisa de ajuste. Usar o papel `literal` não serviria:
ele é verde e o design distingue os dois.

### 3. Fidelidade ao design

O conteúdo reproduz as telas como estão, inclusive o que não é Java válido (na tela 03 a classe
não tem a chave de fechamento final). Linhas compactas (`linhaCompacta`) seguem o espaçamento
das telas onde os campos ficam agrupados (tela 03, linhas 3 e 5).

## Risks / Trade-offs

- [O parágrafo quebra em pontos diferentes do design conforme a largura] → o editor já quebra
  pela largura disponível; a comparação no portal confere o desktop em 1920x1080.
