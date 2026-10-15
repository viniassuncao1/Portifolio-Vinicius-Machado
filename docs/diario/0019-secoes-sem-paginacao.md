# 0019: Seções num arquivo só, sem paginação

- **Data:** 2026-10-15
- **Change:** [secoes-sem-paginacao](../../openspec/changes/secoes-sem-paginacao/)
- **PR:** a definir
- **ADRs:** [0018](../adr/0018-secoes-num-arquivo-so.md), que refina o [0011](../adr/0011-identidade-visual-intellij-new-ui.md)

Capturas desta entrada: a definir.

## Problema

Cinco seções (Skills, Experiências, Certificações, Projeto 4 e Projeto 5) eram divididas em páginas,
com o controle `◂ 1/4 ▸` abaixo do código. O [ADR-0011](../adr/0011-identidade-visual-intellij-new-ui.md)
já dizia que isso não existe numa IDE de verdade e previa trocar a paginação por vários arquivos na
árvore. Ao ver o resultado, o Vinicius não gostou do controle: ele esconde conteúdo atrás de cliques.
Ele quer cada seção inteira na mesma tela, **como um arquivo Java que se rola**.

## Decisões

- **Um arquivo por seção.** As partes viram blocos da mesma classe: o `package`, os `import` e a
  declaração aparecem uma vez, e cada parte ganha um comentário de cabeçalho, o Javadoc no modo de
  leitura e a instância. O Java continua válido.
- **O controle de páginas sai do site inteiro**, junto com o campo `paginas` e as rotas por página.
- **Links antigos redirecionam.** `/skills/2`, `/projeto-5/4` e os demais levam à seção, e o sitemap
  lista só as seções.
- **O ADR-0018 refina, e não desfaz, o ADR-0011.** O item 2 dele previa vários arquivos por seção;
  a decisão agora é um arquivo só. Descartei os vários arquivos (trocariam o clique de página pelo
  clique de arquivo e encheriam a árvore) e manter a paginação.

## Aprendizado

- **Ver o resultado muda a decisão.** A previsão de um ADR escrito antes de ver o site (vários
  arquivos) não sobreviveu ao uso. Refinar o ADR em vez de apagá-lo guarda o raciocínio.
- **As melhorias anteriores tornaram isso possível.** O modo de leitura do Javadoc, a quebra suave no
  celular e a digitação que termina em até 1,5 s qualquer que seja o tamanho deixam seções longas
  confortáveis de rolar.
- **Quem compartilhou um link antigo não pode pagar pela mudança.** Redirecionar os endereços de
  página custa pouco e evita links quebrados.
- **Números finais.** Testes unitários: a definir. Testes E2E: a definir.

## Links

- Change: [`openspec/changes/secoes-sem-paginacao`](../../openspec/changes/secoes-sem-paginacao/)
- ADR: [0018 seções num arquivo só](../adr/0018-secoes-num-arquivo-so.md)
- Documentação: [componentes](../componentes.md#seção-longa-um-arquivo-só)
- Entrada anterior: [0018 Projeto 5, o próprio portfólio](0018-projeto-5-o-proprio-portfolio.md)

## Rascunho de post para o LinkedIn

> Tirei a paginação do meu portfólio, e foi uma boa decisão voltar atrás num ADR.
>
> O site simula uma IDE, e cinco seções eram divididas em páginas, com o controle "1/4" embaixo do
> código. Eu mesmo tinha registrado num ADR que isso não existe numa IDE de verdade e planejado
> trocar por vários arquivos na árvore. Quando vi o resultado, não gostei: esconde conteúdo atrás de
> cliques. Agora cada seção é um arquivo Java só, que se rola, com todas as partes na mesma tela.
>
> O ADR novo refina o antigo em vez de apagá-lo, e os links antigos, como /skills/2, redirecionam
> para a seção, para ninguém ter link quebrado. O que tornou isso fácil foram as melhorias de antes:
> modo de leitura do Javadoc, quebra suave no celular e uma digitação que termina em 1,5 s, não
> importa o tamanho.
>
> O aprendizado: a decisão que você registra antes de ver o resultado é uma hipótese, não uma
> sentença.
>
> Você revisa as suas decisões depois de ver o resultado?
>
> #UX #Angular #ADR
