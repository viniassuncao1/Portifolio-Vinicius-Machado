# 0024: Refinos da experiência

- **Data:** 2026-10-21
- **Change:** [refatorar-experiencia-do-usuario](../../openspec/changes/refatorar-experiencia-do-usuario/) (follow-ups 5.5 e 6.1)
- **PR:** [#42](https://github.com/viniassuncao1/Portifolio-Vinicius-Machado/pull/42) (base `feat/refatorar-experiencia`)
- **Testes:** 1017 testes unitários (95,15% de cobertura de instruções) e 1004 testes E2E
- **ADRs:** [0019](../adr/0019-experiencia-focada-em-recrutadores.md), item 8

## Problema

A [entrada 0023](0023-experiencia-focada-em-recrutadores.md) deixou pontas soltas de propósito: só
os botões magnéticos do hero tinham interação de ponteiro, a casca ainda era a da IDE original e
várias seções não tinham a visão em cartão. O pedido agora é fechar essas pontas sem mexer na
estrutura.

## O que mudou

- **Interações de ponteiro (5.5).** Três peças novas: a diretiva `appInclinar` (inclinação 3D de até
  5°, com mola na volta), a `appParallax` (a foto acompanha o ponteiro) e o cursor do site
  (`layout/cursor-do-site`). Todas só rodam com ponteiro fino e sem movimento reduzido; em toque não
  fazem nada. O cursor nativo continua visível.
- **Acabamento da casca (6.1).** Pequeno e por tokens: uma barra de acento na borda do arquivo da
  seção atual na árvore, um fio de luz no topo do editor e uma sombra fina separando a barra
  superior do painel, em vez de mais uma borda. Pacotes, abas, Git e ▶ Executar ficaram como estão.
- **Visões em cartão que faltavam.** Diferenciais, Como uso a IA, Certificações, Eventos, Idiomas,
  Depoimentos e os Projetos 1 a 6 ganharam cartões em `shared/cartoes`, com `projeto-em-cartao` para
  os projetos. A `SecaoEmDuasVisoes` mostra o cartão ou o código, e `?visao=codigo` abre o arquivo
  sem mudar a preferência de quem visita.

## Dois achados de qualidade

- **Foco do botão "Ver como cartão".** O anel usava a cor do texto e perdia contraste em alguns
  temas. Passou para o rosa global (`--cor-foco`), como o resto do site.
- **Teste que só quebrava na CI.** A digitação única do hero ficava numa variável do módulo, que
  vazava entre arquivos de teste quando a CI roda com menos processos. O PR #41 ficou vermelho só
  lá. Virou o serviço `DigitacaoDoHero` (commit `4f3f585` no PR #41), com estado por injetor.

## Aprendizado

- **Estado de módulo é estado global escondido.** No meu computador cada arquivo de teste tinha o
  próprio processo e nada aparecia; na CI, com menos processos, o estado vazou. Estado que precisa
  durar uma vez só mora num serviço.
- **Interação de ponteiro é acabamento, não requisito.** Por isso fica atrás de ponteiro fino e
  movimento reduzido, e nenhuma tarefa depende dela.
- **Foco visível segue o token.** Uma cor de foco por componente é uma regressão esperando para
  acontecer.

## Links

- Change: [`openspec/changes/refatorar-experiencia-do-usuario`](../../openspec/changes/refatorar-experiencia-do-usuario/)
- Entrada anterior: [0023 experiência focada em recrutadores](0023-experiencia-focada-em-recrutadores.md)

## Rascunho de post para o LinkedIn

> O teste passava no meu computador e quebrava só na CI.
>
> A causa: a animação de digitação do hero guardava "já digitei" numa variável do módulo. Na minha
> máquina cada arquivo de teste rodava isolado. Na CI, com menos processos, o estado vazou de um
> arquivo para outro. Virou um serviço do Angular, com estado por injetor, e o teste ficou
> determinístico.
>
> No mesmo ciclo fechei os refinos do portfólio: inclinação 3D nos cartões, parallax na foto e um
> cursor próprio, só com mouse e sem "reduzir movimento" ligado. Em toque, nada disso roda. Também
> entraram os cartões que faltavam para as seções restantes, cada uma com a visão em código a um
> clique.
>
> Um detalhe de acessibilidade que quase passou: o anel de foco de um botão usava a cor do texto e
> perdia contraste. Agora usa o token de foco do site, como todo o resto.
>
> Lição: estado de módulo é estado global escondido, e interação de ponteiro é acabamento, não
> requisito.
>
> Qual bug já passou na sua máquina e quebrou só na CI?
>
> #Angular #Testes #Acessibilidade
