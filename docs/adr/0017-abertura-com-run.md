# ADR-0017: Abertura com Run

- **Status:** Aceito
- **Data:** 2026-10-15
- **Substitui:** [ADR-0015](0015-tela-de-boas-vindas.md) (a abertura do site)

## Contexto

O [ADR-0015](0015-tela-de-boas-vindas.md) trocou a janela de Run automática por uma tela de
boas-vindas de 0,6 a 2 s. O Vinicius achou curta demais e quis que a abertura fosse a experiência
de **rodar o projeto**: o visitante vê a IDE abrir, aciona o Run e acompanha o build e o Spring
subindo antes de o portfólio aparecer. Compilar as classes do próprio currículo e subir um Spring
na porta 8080 mostra, logo na entrada, que ele conhece o ecossistema Java. O plano de design e de
animação foi feito com as skills do ECC `motion-foundations`, `motion-patterns`, `motion-advanced`,
`frontend-design-direction`, `make-interfaces-feel-better` e `accessibility`, partindo da auditoria
de UX de 14/10, e validado num protótipo antes de virar código.

## Decisão

1. **Splash de 3 s** com foto, nome, cargo e as etapas da IDE ("Opening Portfolio_Vinicius…",
   "Indexing 16 Java classes…", "Project ready"), com teto de 5 s se a rede estiver lenta.
2. **Pronto para executar:** o widget de Run do IntelliJ (`PortfolioApplication`, ▶ verde) recebe o
   foco. Enter, clique ou atalho (⌃R no Mac, ⇧F10 nos demais) executam.
3. **Execução automática:** se ninguém executar, o ▶ é acionado sozinho 5 s depois de ficar pronto,
   para o visitante nunca ficar preso.
4. **Build e log do Spring (~3,4 s):** uma janela Build/Run compila as 16 classes reais do portfólio
   (`> Task :compileJava`, `:processResources`, `:classes`, `:bootRun`) e mostra o log do Spring até
   `Started PortfolioApplication`. Em seguida a janela recolhe para a barra de status e os painéis
   da IDE entram em sequência (~0,7 s). O log do Spring é o mesmo da janela de Run, compartilhado.
5. **Sem pular:** não há botão Pular nem Esc. Em troca, cada fase tem um teto de tempo.
6. **Só em `/` e uma vez por sessão.** Quem chega por link direto de uma seção vai ao conteúdo, só com
   o aviso na barra de status.
7. **Movimento reduzido:** mesmas etapas, sem animação (log completo de uma vez, fades de até
   150 ms).
8. **Conteúdo sempre no HTML.** O conteúdo da rota fica no DOM, por baixo, e o cartão é pintado no
   primeiro quadro por um script inline (como o do tema). Sem JavaScript, nada muda.

## Alternativas consideradas

- **Manter a tela de boas-vindas curta (ADR-0015).** Segura para quem tem pressa, mas não conta a
  história de "rodar o projeto" e a abertura some em 2 s.
- **Abertura com botão Pular.** Dá controle, mas o Vinicius decidiu que a sequência é parte do
  conteúdo. O risco é tratado com tempo curto, uma vez por sessão e execução automática.
- **Abertura em toda visita e em links diretos.** Cansaria quem volta e atrasaria quem busca uma
  seção específica.

## Consequências

- Do clique ao portfólio leva cerca de 4,2 s (teto de 5 s); sem clique, o pior caso é cerca de 12 s,
  só na primeira visita da sessão e só na página inicial.
- A abertura é um `role="dialog"` modal com o resto da casca `inert`, foco no ▶ e depois no editor, e
  uma região `aria-live` que anuncia só os marcos, não o log linha a linha. A sequência não impõe
  limite de tempo ao visitante (WCAG 2.2.1) e o movimento automático acima de 5 s não existe
  (2.2.2).
- Os tokens de movimento novos (`--duracao-entrada-abertura`, `--duracao-recolher`,
  `--intervalo-escalonado`, `--curva-suave`) usam só `transform`, `opacity` e `clip-path`.
- Os testes precisam de relógio controlado em cada fase.
