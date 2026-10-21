## 1. Base, ADR e medição

- [x] 1.1 Criar a branch `feat/refatorar-experiencia` a partir da `main` (feito pelo Regente) e verificar com `git branch --show-current`
- [x] 1.2 Medir a linha de base (Lighthouse mobile e AXE em `/`, `/skills` e `/projeto-2`) e salvar os números em `docs/diario/`; verificar que o arquivo lista as quatro notas e as violações atuais
- [x] 1.3 Escrever o ADR que revisa o ADR-0012 (desvio do design original, a biblioteca `motion`, `dialog` e View Transitions) e atualizar o índice em `docs/adr/README.md`; verificar que o ADR-0012 aponta "Substituído em parte" para ele
- [x] 1.4 Criar o teste de contraste de tokens (todos os pares de cada tema, claro e escuro) e verificar que ele falha de propósito com um par abaixo de 4,5:1 e passa com os valores reais

## 2. Tokens e sistema visual (Pincel)

- [x] 2.1 Definir os tokens de tema por seção (fundo, texto, secundário, linha, acento, acento 2, texto sobre o acento) em `src/styles`, registrados com `@property`, nas variantes clara e escura; verificar com o teste de contraste da 1.4
- [x] 2.2 Aplicar anel de foco de 2px com contraste ≥ 3:1 por tema e remover o acento único fixo; verificar com um e2e de Tab em duas seções de temas diferentes
- [x] 2.3 Atualizar `docs/componentes.md` com os tokens novos e o `sistema-visual` no README; verificar que os nomes dos tokens citados existem no código

## 2b. Modo recrutador (Pincel e Compasso)

- [x] 2b.1 Criar o controle "Cartão ⇄ Código" por seção, com `aria-pressed` e a escolha lembrada (com `try/catch`); verificar com e2e que a visão inicial é "Cartão" e que o conteúdo é o mesmo nas duas visões
- [x] 2b.2 Implementar o hero "código que vira cartão" (digitação e resolução em até 2,5 s, com modo direto em movimento reduzido); verificar com e2e e medir que o LCP não piora em relação à linha de base
- [x] 2b.3 Implementar a barra de ações (Currículo, LinkedIn, GitHub, e-mail com copiar e confirmação em `aria-live`) e os comandos equivalentes na busca; verificar com e2e de clique, copiar e Ctrl/Cmd+K. O Currículo aponta para `public/CV_Vinicius_Machado_Desenvolvedor_FullStack_Java.pdf` (já adicionado) e o e2e confere que o arquivo responde 200 com `application/pdf`

## 3. Camada de movimento com `motion` e protótipo do carrossel (Compasso)

- [x] 3.1 Prototipar o carrossel só com `scroll-snap` + Pointer Events (arrasto, botões, pontos, centralização do cartão) e medir se atende à spec `vitrine-de-projetos`; verificar com um e2e de arrasto sem abrir o cartão
- [x] 3.2 Adicionar `motion` e criar `src/app/core/movimento/` (tokens, `MovimentoConfig` com `signal` de movimento reduzido e carregamento por `import()` em `afterNextRender`) e as diretivas `appRevelar`, `appMagnetico` e `appContador`; verificar com testes unitários que, com movimento reduzido, a biblioteca não é importada, e medir que o pacote inicial não contém `motion` e o tamanho do chunk
- [x] 3.3 Registrar a decisão (com os tamanhos medidos) no ADR da 1.3; verificar que o ADR cita o resultado do protótipo

## 4. Vitrine de projetos (Pincel e Compasso)

- [x] 4.1 Criar `projetos.dados.ts` tipado com os seis projetos (ordem, slug, etiquetas, até 3 destaques, imagens, link e rótulo "Ver site"/"Ver repositório"); verificar com um teste que a ordem bate com `secao-projetos`
- [x] 4.2 Criar o script Playwright que captura os sites no ar e gera AVIF/WebP ≤ 200 KB em `public/projetos/`, e o componente de capa em código para os projetos sem captura; verificar o tamanho dos arquivos e que nenhum cartão mostra imagem quebrada
- [x] 4.3 Implementar os cartões (`<button>`/`<a>`), o carrossel com pausa explícita (`aria-pressed`), a grade alternativa e o comportamento em toque e movimento reduzido; verificar com testes unitários e e2e de teclado, pausa e grade
- [x] 4.4 Implementar o `<dialog>` de detalhes com contador, galeria, link rotulado, "Ver em código", navegação anterior/próximo e foco devolvido ao cartão; verificar com e2e (Enter abre, Tab preso, Esc fecha, foco volta)
- [x] 4.5 Implementar a expansão do cartão à tela cheia e a volta com View Transitions, com fallback sem animação e esmaecimento quando o cartão está fora da tela; verificar com e2e em Chromium e WebKit e com `prefers-reduced-motion`
- [x] 4.6 Criar a rota `/projetos/:slug` pré-renderizada e a integração com Voltar do navegador; manter `/projeto-N` como arquivo em código; verificar abrindo `/projetos/<slug>` direto e `/projeto-3` sem perda de conteúdo
- [x] 4.7 Ligar a vitrine à seção de projetos e à árvore, e rodar o AXE na vitrine e no diálogo; verificar zero violações e atualizar `docs/componentes.md`

## 5. Movimento e microinterações (Compasso)

- [x] 5.1 Implementar o tema por seção na visão geral (`IntersectionObserver` + `data-tema` + transição das variáveis) e nas rotas; verificar com e2e que o tema muda ao passar da metade e que não há piscada
- [x] 5.2 Implementar a revelação de títulos por linha, dos blocos e a frase que se acende (`animation-timeline` com fallback); verificar que sem JavaScript todo o texto está visível e que com movimento reduzido aparece o estado final
- [x] 5.3 Implementar o indicador deslizante nas abas e na navegação; verificar com e2e a posição do indicador ao ativar outra aba
- [x] 5.4 Implementar a linha do tempo que se desenha na visão geral (coluna única no celular); verificar com e2e o preenchimento ao rolar
- [x] 5.5 Implementar as interações de ponteiro (botões magnéticos, inclinação 3D, parallax, cursor opcional) só com ponteiro fino e sem ocultar o cursor nativo; verificar que em toque nada é aplicado
- [x] 5.6 Implementar o relógio de Brasília (30 s, fora de `aria-live`) e o "disponível" na barra de status; verificar com teste unitário usando relógio falso
- [x] 5.7 Rodar a verificação de reduced-motion e de reflow (sem JavaScript) em todas as telas; verificar com `e2e` dedicado e atualizar a spec de movimento reduzido existente

## 6. Casca reimaginada e orientação (Pincel)

- [x] 6.1 (acabamento; redesenho completo na 9.1) Redesenhar a casca (barra superior, painel recolhível, faixa de abas, barra de status, proporções e paleta pelos tokens) mantendo pacotes, abas, Git e ▶ Executar; verificar que as seções abrem pelos mesmos endereços e que `casca.spec.ts` e os e2e de casca passam
- [x] 6.2 Criar a visão geral rolável em `/` (primeira dobra, blocos-resumo e caminhos rápidos Projetos/Currículo/Contato) sem perder `Inicio.java` como arquivo; verificar com e2e que a primeira dobra de 1440x900 mostra nome, cargo, stack, "disponível" e as três ações
- [x] 6.3 Implementar a barra de ações inferior no celular (Seções, Projetos, Contato), a gaveta com pastas abertas e a vitrine em grade; verificar em 390x844 sem rolagem horizontal
- [x] 6.4 Tornar a abertura opcional (pular com toque/tecla, lembrar a visita, sem atrasar o LCP); verificar com e2e de Esc e de segunda visita
- [x] 6.5 Ajustar a busca (Ctrl/Cmd+K) e o "Próximo arquivo" à nova casca; verificar com os e2e de busca e de teclado existentes

## 7. Qualidade e entrega

- [x] 7.1 Otimizar imagens e fotos (AVIF/WebP, `NgOptimizedImage`, dimensões, carga tardia) e impor o orçamento de 200 KB no CI; verificar que o teste falha com um arquivo acima do limite
- [x] 7.2 Rodar Lighthouse mobile e AXE em `/`, na vitrine e em uma rota de seção e atingir as metas da spec `orientacao-do-visitante`; verificar com o relatório salvo em `docs/diario/`
- [x] 7.3 Atualizar `README.md`, `docs/arquitetura.md`, `docs/componentes.md` e registrar a entrada do diário; verificar que as capturas e comandos citados existem
- [x] 7.4 Rodar `npm run lint && npm run test:ci && npm run build && npm run e2e` e verificar que tudo passa, com a cobertura ≥ 80% nos arquivos novos
- [ ] 7.5 Revisão visual com o Vinicius (casca e vitrine) e correção do que ele apontar; verificar com a aprovação dele registrada no PR

> Nota de execução (2026-10-21): os grupos 2b, 5, 6 e 7 foram entregues pela reformulação do
> grupo 8. Ficam em aberto, de propósito: **5.5** (inclinação 3D dos cartões, parallax da foto e
> cursor personalizado; só os botões magnéticos do hero foram feitos), **6.1** (a casca de IDE
> ganhou indicador deslizante, barra de carregamento e relógio, mas não foi redesenhada), **7.4**
> (gate final verde: lint, 994 testes unitários, build e 946 E2E), **7.5** (revisão visual do Vinicius) e o merge do PR #41, que fica com o Vinicius.

## 8. Reformulação v2 e execução pelo Maestri

Escopo, trilhas, skills e critérios de pronto estão em
[`docs/equipe-de-agentes/briefing-experiencia-recrutadores.md`](../../../docs/equipe-de-agentes/briefing-experiencia-recrutadores.md).
Aprovação antecipada pelo Vinicius: executar tudo de uma vez, sem pausar para aprovar.

- [x] 8.1 Sistema visual v2: tipografia com `@fontsource-variable`, escala de espaço, raios concêntricos, sombras tingidas, grão e os componentes base (superfície em double-bezel, botão em pílula com seta aninhada, etiqueta); verificar com testes dos componentes, o teste de contraste dos temas e `docs/componentes.md` atualizado
- [x] 8.2 Visão geral `/` rolável com os 8 blocos (hero, provas, sobre, stack, experiência, formação, projetos, contato), atalho para a rota de cada seção e `Inicio.java` preservado; verificar com E2E da primeira dobra em 1440x900 e 390x844 e com o HTML sem JavaScript
- [x] 8.3 Hero "código que vira cartão" (digitação e resolução em até 2,5 s, modo direto sem movimento); verificar com E2E e com o LCP medido igual ou melhor que a linha de base
- [x] 8.4 Barra de ações do recrutador (Currículo, LinkedIn, GitHub, e-mail com copiar e confirmação) e os comandos equivalentes na busca; verificar com E2E, incluindo o PDF respondendo 200 com `application/pdf`
- [x] 8.5 Ilha de navegação e barra de ações no celular (Seções, Projetos, Contato); verificar com E2E em 390x844 sem rolagem horizontal
- [x] 8.6 Visões "Cartão" das seções e o controle "Cartão ⇄ Código" com a escolha lembrada (2b.1); verificar com E2E que o conteúdo é o mesmo nas duas visões
- [x] 8.7 Movimento: tema por seção na visão geral e nas rotas, revelações, frase que se acende, contadores, indicadores deslizantes, barra "compilando", git graph que se desenha, interações de ponteiro e barra de status viva; verificar com E2E e com o modo de movimento reduzido
- [x] 8.8 Abertura (Run) opcional: pular com toque ou tecla e não repetir na visita seguinte; verificar com E2E de Esc e de segunda visita
- [x] 8.9 Detalhes de projeto v2 (abas "Visão geral / Código / Stack" e bloco de build) e restyling da casca de IDE com os tokens v2; verificar com E2E e axe
- [x] 8.10 Desempenho: manter o Lighthouse móvel em 100, LCP ≤ 2,5 s e CLS ≤ 0,05 com a página nova (a linha de base real é 100 e LCP 1,1 s; a de 4,5 s era um artefato do servidor sem compressão); verificado em `/`, `/projetos` e `/skills`, salvo em `docs/diario/`
- [x] 8.11 Regressão visual (320, 768, 1024 e 1440, claro e escuro), axe em todas as rotas e orçamentos no CI (imagem ≤ 200 KB, JS inicial sem o `motion`); verificar com a suíte E2E verde
- [x] 8.12 Documentação final (ADR-0019, README, `docs/arquitetura.md`, `docs/componentes.md`, diário 0023) e PR aberto sem merge; verificar que lint, testes unitários, build e E2E passam e que o PR descreve as skills usadas

## 9. Fechamento (Regente, 2026-10-21)

O segundo PR marcou a 6.1 com um acabamento de CSS; o redesenho pedido pela tarefa e pela seção
"Casca reimaginada" do `design.md` fica neste grupo. A produção não muda (ADR-0020): o Vinicius
revisa tudo no `localhost:4200` e decide quando publicar. Briefing de cada trilha:
`docs/equipe-de-agentes/briefing-experiencia-recrutadores.md` (trilhas A e B).

- [ ] 9.1 [Pincel] Redesenhar a casca de verdade, com os tokens v2 e as superfícies double-bezel: barra superior com identidade do projeto, busca (Ctrl/Cmd+K) e ▶ Executar; painel do projeto recolhível (botão e atalho, estado lembrado na sessão); faixa de abas com o indicador deslizante; barra de status com caminho, branch, relógio de Brasília e "disponível"; proporções e paleta pelos tokens, nos dois temas e no celular (barra de ações inferior). Mantém pacotes, abas, Git, ▶ Executar, rotas e slugs — verificar com capturas `casca-v2-*` em 1440 e 390, claro e escuro, e `casca.spec.ts`
- [ ] 9.2 [Compasso] Movimento da casca nova: painel recolhível, indicador das abas, barra de status viva e estados de hover/foco/pressionado, só `transform`/`opacity`, tokens de movimento e movimento reduzido — verificar no portal e com os e2e de movimento
- [ ] 9.3 [Nanquim] Corrigir a spec `secao-sobre-mim` que falha em `openspec validate --specs --strict` (requisito com mais de 500 caracteres) e conferir que as specs desta change sincronizam limpas (`.maestri/sincronizar-specs.py` num rascunho, sem gravar) — verificar com `openspec validate --specs --strict`
- [ ] 9.4 [Sentinela] E2E da casca nova (estrutura, painel recolhível, teclado, axe nos dois temas, celular sem rolagem horizontal) e uma galeria de revisão para o Vinicius: capturas de todas as rotas em 320, 768, 1024 e 1440, claro e escuro, em `.maestri/capturas/revisao/` com um `index.html` local — verificar com `npm run lint && npm run test:ci && npm run build && npm run e2e`
- [ ] 9.5 [Escriba] `docs/componentes.md`, `docs/arquitetura.md`, README e a entrada do diário do fechamento — verificar com `npm run format:check`
- [ ] 9.6 [Regente] Revisar, abrir o PR sem publicar, arquivar a change com sync das specs depois do merge — verificar pelo PR com CI verde e a produção inalterada

## Workflow follow-up

- Abrir o PR (o Regente), esperar a CI e o merge sem apagar a branch, e arquivar a change com `/opsx:archive`.
- Atualizar as specs principais (sync) e registrar o resultado no diário.

> Nota (2026-10-21, segundo PR): **5.5** (inclinação 3D dos cartões, parallax da foto e cursor
> personalizado, só com ponteiro fino e sem movimento reduzido), **6.1** (acabamento da casca: barra
> de acento no item atual, sombra interna do editor e da barra de ferramentas) e as visões Cartão
> de todas as seções restantes foram entregues na branch `feat/refinos-da-experiencia`.
