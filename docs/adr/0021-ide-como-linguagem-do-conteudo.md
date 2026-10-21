# ADR-0021: A IDE como linguagem do conteúdo

- **Status:** Aceito
- **Data:** 2026-10-21
- **Substitui em parte:** o item 8 do [ADR-0019](0019-experiencia-focada-em-recrutadores.md) (as
  visões "Cartão" das seções, o cartão como visão inicial e o hero que vira cartão)

## Contexto

A experiência do ADR-0019 deixou o conteúdo em cartões, com um hero grande e uma visão geral em
faixas: na prática, o visual de um portfólio de referência dentro da moldura da IDE. Ao revisar, o
Vinicius preferiu a IDE e o Java como forma do próprio conteúdo, sem perder a leitura rápida de
quem recruta. Um protótipo de duas telas (Início e Skills) foi aprovado como direção.

## Decisão

1. Cada seção tem a forma de um arquivo ou ferramenta de IDE: o Início é a classe
   `ViniciusMachado` com um painel Run que digita o `./gradlew bootRun`; Skills é um `build.gradle`
   em que cada dependência aponta para os projetos que a usam; Experiência é um `git log --graph`;
   Projetos é uma janela de Run com a vitrine e o preview; Contato é um terminal com links reais; as
   demais seções são arquivos renderizados.
2. **Sai o controle Cartão ⇄ Código.** Onde o Java completo agrega, ele vira aba secundária do
   arquivo.
3. A árvore do projeto fica fixa no desktop (fileira que rola no celular), com marca deslizante no
   item atual, e a paleta Ctrl/Cmd+K ganha os atalhos do recrutador (currículo, LinkedIn, GitHub,
   copiar e-mail).
4. A primeira dobra do Início mostra nome, cargo, stack, "Disponível" e as ações de contato sem
   rolar, sem depender da metáfora.
5. Continuam: `core/perfil.ts` e `core/projetos.ts` como fonte única dos fatos, a vitrine e o
   diálogo de detalhes, o movimento só depois da hidratação e nunca com movimento reduzido, os dois
   temas, o SSG e o deploy manual (ADR-0020).

## Alternativas consideradas

- **Manter os cartões e só refinar:** reprovado pelo Vinicius na revisão.
- **Manter o toggle só no Início:** o Início já mostra a classe no editor; o botão seria redundante.
- **Vitrine em rota própria, como antes:** perde o "executar os projetos", que é o gesto mais forte
  da metáfora.

## Consequências

- Os componentes de `shared/cartoes/` e `SecaoEmDuasVisoes` saem ou viram peças das formas novas.
- Muitos testes e2e assumem o cartão como visão inicial e precisam ser adaptados.
- A produção não muda até o Vinicius pedir (ADR-0020).
