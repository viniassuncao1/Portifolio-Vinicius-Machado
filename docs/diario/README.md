# Diário de desenvolvimento

Aqui eu registro a construção do portfólio, **change a change**. Cada entrada conta o problema,
o que decidi, o que descartei e o que aprendi, e traz um rascunho de post para o LinkedIn.

O motivo está no [ADR-0008](../adr/0008-diario-de-desenvolvimento.md): o portfólio é uma vitrine
e eu quero mostrar o processo, não só o resultado.

## Regras

- Toda change do OpenSpec tem uma entrada, criada no mesmo Pull Request da change, antes do
  merge.
- O arquivo se chama `NNNN-nome-da-change.md`, com a numeração em sequência.
- O rascunho do post é revisado por mim antes de ser publicado.
- Só entram fatos do projeto. Nada de números ou resultados inventados.

## Entradas

| Entrada                                         | Data       | Resumo                                                                                               |
| ----------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------- |
| [0001](0001-fundacao-do-projeto.md)             | 2026-10-08 | Angular 22 pré-renderizado, CI/CD na Vercel, ADRs, OpenSpec e equipe de IA.                          |
| [0002](0002-fundacao-visual-e-casca-da-ide.md)  | 2026-10-09 | Tokens, casca da IDE como rota-pai, editor de código com dados tipados, gaveta no celular e axe.     |
| [0003](0003-secoes-sobre-mim-e-diferenciais.md) | 2026-10-09 | Primeiras seções só com dados, papel de sintaxe `valor`, parágrafo em 72 colunas e mapa de features. |

## Modelo de entrada

```markdown
# NNNN: <título da change>

- **Data:** AAAA-MM-DD
- **Change:** <link para a change em openspec/>
- **PR:** <link>
- **ADRs:** <links, se houver>

## Problema

O que precisava ser resolvido e por quê.

## Decisões

O que foi decidido e quais alternativas foram descartadas, com o motivo.

## Aprendizado

O que aprendi, inclusive o que deu errado.

## Links

Change, Pull Request e ADRs relacionados.

## Rascunho de post para o LinkedIn

Texto em pt-BR, na primeira pessoa, com gancho na primeira linha, de 150 a 250 palavras,
terminando com uma pergunta ao leitor e com no máximo 3 hashtags.
```
