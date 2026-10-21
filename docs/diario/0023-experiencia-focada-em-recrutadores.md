# 0023: Experiência focada em recrutadores

- **Data:** 2026-10-20
- **Change:** [refatorar-experiencia-do-usuario](../../openspec/changes/refatorar-experiencia-do-usuario/)
- **PR:** a abrir
- **ADRs:** [0019](../adr/0019-experiencia-focada-em-recrutadores.md)

## Problema

A casca de IDE funciona, mas a experiência é estática e presa ao design original: seções como
arquivos de código, projetos sem vitrine, pouco movimento e uma árvore que o recrutador precisa
entender antes de achar o que importa. O pedido é uma experiência mais viva e mais clara para quem
recruta, com a IDE como referência mínima.

## Linha de base (antes da change)

Medida em 2026-10-20 sobre o build de produção servido localmente, com Lighthouse 12 no perfil
móvel padrão (throttling simulado) e o axe dos E2E.

| Página       | Desempenho | Acessibilidade | Boas práticas | SEO | LCP   | CLS   | TBT   |
| ------------ | ---------- | -------------- | ------------- | --- | ----- | ----- | ----- |
| `/`          | 70         | 100            | 100           | 100 | 5,1 s | 0,02  | 70 ms |
| `/skills`    | 74         | 100            | 100           | 100 | 4,5 s | 0,014 | 10 ms |
| `/projeto-2` | 74         | 100            | 100           | 100 | 4,5 s | 0,036 | 0 ms  |

- **axe (WCAG 2 A e AA):** 0 violações nas 37 verificações dos E2E, no celular.
- **Leitura:** acessibilidade, boas práticas e SEO já estão no teto. O ponto fraco é o desempenho,
  sobretudo o LCP (4,5 a 5,1 s, contra a meta de 2,5 s). A meta da change é Lighthouse móvel 95 em
  desempenho, então o orçamento de peso e a abertura que não atrasa o conteúdo importam mais do que
  correções de acessibilidade.

## Medições da biblioteca de movimento

Empacotadas com o esbuild (minificadas, gzip): `animate` + `inView` do `motion` somam 24,6 KB e
`motion/mini` (só `animate`) 3,3 KB. A biblioteca é carregada por `import()` e só quando há
movimento. A conferência de que o pacote inicial não a contém só faz sentido quando o primeiro
componente usar as diretivas (grupo 5).

## O que já foi entregue

- Temas de cor por seção com teste de contraste, camada de movimento com `motion` (diretivas
  `appRevelar`, `appMagnetico` e `appContador`) e a vitrine de projetos em `/projetos`.
- A expansão do cartão até a tela cheia só funcionou de verdade depois de entender que o roteador
  abria a própria View Transition logo depois da minha e interrompia a animação. A solução foi
  deixar o roteador conduzir: a vitrine só combina qual cartão é a origem (`TransicaoDoProjeto`).
- O E2E da vitrine achou três bugs reais que os testes unitários não pegaram: o `offsetParent` dos
  cartões estava errado (a centralização do carrossel falhava), os cartões tinham larguras
  diferentes por causa do `min-width` de itens flex e o foco inicial do diálogo ia para o lugar
  errado.

## Decisões

- ADR-0019: a IDE vira linguagem, cartão e código são duas visões, vitrine de projetos, `motion` no
  lugar do GSAP e abertura que pode ser pulada.

## Aprendizado

- Medir antes mostrou que o problema real é o LCP, não a acessibilidade.

## Links

- Entrada anterior: [0022 textos para vagas Java](0022-copy-para-vagas-java.md)
