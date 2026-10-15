# Design

## Context

Seções com `paginas` em `core/secoes.ts` têm rotas `/<seção>/<n>`, um conteúdo por página
(`CONTEUDOS_<SECAO>: readonly ConteudoDoEditor[]`) e o controle `◂ n/N ▸` abaixo do código. O
ADR-0011 previa o fim da paginação com vários arquivos por seção. A change
`projeto-5-o-proprio-portfolio`, ainda não mesclada, criou o Projeto 5 com 4 páginas.

## Goals / Non-Goals

**Goals:**

- Tudo de uma seção visível rolando, sem clique.
- Links antigos continuam funcionando.

**Non-Goals:**

- Dividir seções em vários arquivos na árvore.

## Decisions

### 1. Um arquivo por seção

Cada seção passa a exportar um único `ConteudoDoEditor`. As partes viram blocos dentro da mesma
classe: o cabeçalho (`package`, `import`, declaração) aparece uma vez; cada parte vira um bloco com
comentário de cabeçalho (`// Memora`, `// Watts Company`), o Javadoc no modo de leitura e a
instância. O Java continua válido (ADR-0010) e com identificadores em português (ADR-0011).

### 2. Endereços antigos

As rotas `/<seção>/<n>` viram redirecionamentos para `/<seção>` (`redirectTo` no Angular; no
pré-render, o HTML de redirecionamento com `<link rel="canonical">` e `meta refresh`, ou a regra
de redirect da Vercel em `vercel.json` com 301, a escolher pelo que funcionar no SSG). Saem do
sitemap.

### 3. Conteúdo longo

A numeração por linha lógica e a digitação já funcionam com conteúdo longo (a digitação termina
em até 1,5 s qualquer que seja o tamanho). O "Próximo arquivo" fica no fim do arquivo.

## Risks / Trade-offs

- [Seções longas no celular] → quebra suave e modo de leitura já deixam a leitura confortável.
- [Links antigos] → redirecionamento.

## Faixas da equipe

| Faixa    | Quem      | O quê                                                                |
| -------- | --------- | -------------------------------------------------------------------- |
| Conteúdo | Grafite   | Skills, Experiências, Projeto 5 num arquivo só                       |
| Conteúdo | Nanquim   | Projeto 4 e Certificações num arquivo só                             |
| Casca    | Pincel    | Remover o controle de páginas, rotas, redirecionamento, título, sitemap |
| Testes   | Sentinela | Unitários e E2E                                                      |
| Docs     | Escriba   | ADR-0018, README, `docs/`, diário                                    |
