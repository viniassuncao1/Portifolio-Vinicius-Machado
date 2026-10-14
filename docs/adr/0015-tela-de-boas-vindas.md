# ADR-0015: Tela de boas-vindas no lugar da abertura com a janela de Run

- **Status:** Aceito
- **Data:** 2026-10-14
- **Substitui em parte:** [ADR-0011](0011-identidade-visual-intellij-new-ui.md) (a janela de Run
  como abertura do site)

## Contexto

O [ADR-0011](0011-identidade-visual-intellij-new-ui.md) previu uma janela de Run que simula a
inicialização do Spring, e ela passou a abrir sozinha na primeira página de cada sessão. Uma
auditoria de UX (14/10), feita com as skills do ECC `web-design-guidelines`,
`make-interfaces-feel-better`, `redesign-existing-projects` e `accessibility`, mostrou os
problemas: a janela cobre 37 a 40% da tela, continua aberta depois do log e a primeira impressão
é um console, não uma pessoa. Quem chega não vê o rosto nem o nome do Vinicius. O Vinicius pediu
uma abertura com boas-vindas e a foto, como a **splash do IntelliJ** ao carregar um projeto.

## Decisão

1. **Uma tela de boas-vindas** abre o site: foto do Vinicius, nome, cargo, "Seja bem-vindo" e uma
   barra "Carregando Portfolio_Vinicius…" que percorre as etapas do log do Spring. O log do Spring
   vira o carregamento.
2. **Curta, uma vez por sessão e sem pular.** Fica no mínimo 0,6 s (para não piscar) e no máximo
   2 s, e fecha assim que o Angular, as fontes e a página estão prontos. Só na primeira página
   aberta da sessão (`sessionStorage`), em qualquer rota. Como dura no máximo 2 s, não precisa de
   botão de pular.
3. **Nunca esconde o conteúdo.** Ela é uma camada só do navegador por cima do HTML pré-renderizado,
   que continua inteiro no DOM (bom para buscadores e para o LCP). Com movimento reduzido, não há
   barra animada nem fade e o teto cai para 1 s. Sem JavaScript, não aparece.
4. **A janela de Run deixa de abrir sozinha.** Ela continua no Executar da barra. Depois das
   boas-vindas, a barra de status mostra por alguns segundos `PortfolioApplication started in
1.8 s`.

## Alternativas consideradas

- **Manter a janela de Run automática.** Ela cobre o conteúdo e a primeira impressão fica sendo um
  console.
- **Uma tela com botão "Pular".** Mais flexível, mas é mais um controle para uma espera de 2 s.
- **Splash em toda navegação.** Cansaria quem volta ao site na mesma sessão.

## Consequências

- O visitante vê o rosto e o nome do Vinicius logo de cara, no estilo de uma IDE de verdade.
- O requisito de abertura da spec `janela-de-run` muda: a janela só abre pelo Executar.
- O teto de 2 s mantém a tela dentro do limite do WCAG 2.2.2 (conteúdo que se move por mais de 5 s
  exigiria um controle de pausa).
