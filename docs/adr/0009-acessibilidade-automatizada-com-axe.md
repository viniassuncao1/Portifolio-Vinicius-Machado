# ADR-0009: Acessibilidade automatizada com axe nos testes E2E

- **Status:** Aceito
- **Data:** 2026-10-08

## Contexto

O projeto exige conformidade com WCAG AA. Revisar isso só à mão não se sustenta: a cada seção
nova, um contraste ou um rótulo ARIA pode regredir sem que ninguém perceba. A verificação
precisa rodar sozinha em todo Pull Request e bloquear o merge quando falhar.

## Decisão

Usar o **`@axe-core/playwright`** nos testes E2E. Os testes percorrem as páginas do site e rodam
o axe com as tags `wcag2a` e `wcag2aa`. Qualquer violação reprova o teste e, com isso, o job de
E2E do CI.

- As regras não são desligadas para "passar". Elementos decorativos recebem `aria-hidden`.
- Uma exceção só entra com justificativa escrita no próprio teste.
- A verificação automática não substitui a revisão manual de teclado e leitor de tela.

## Alternativas consideradas

- **Lighthouse CI:** mede vários aspectos além da acessibilidade e é mais pesado. A nota de
  acessibilidade é um resumo e esconde qual regra falhou.
- **pa11y:** foca em acessibilidade, mas é uma ferramenta a mais, com navegador próprio, quando o
  Playwright já está no projeto.
- **Só revisão manual:** pega o que a automação não vê, mas depende de lembrar de fazer e não
  barra regressões no CI.

## Consequências

- `@axe-core/playwright` entra como dependência de desenvolvimento.
- Cada rota nova precisa ser incluída na varredura do axe.
- A automação cobre só parte dos critérios do WCAG. O teclado e o leitor de tela seguem com
  revisão manual.
