# Design

## Context

Auditoria de UX de 14/10 (capturas no scratchpad do Regente). O conteúdo das seções é
`ConteudoDoEditor` com trechos e links (`link(trecho, href)`). A casca no celular usa uma gaveta
com a árvore. Os contatos já são links reais. O Executar abre o preview nos projetos com site.

## Goals / Non-Goals

**Goals:**

- Quem chega entende quem é o Vinicius, para onde ir e como falar com ele.
- Zero falhas de axe, inclusive `target-size`.

**Non-Goals:**

- Renomear rotas ou arquivos das seções.

## Decisions

### 1. Atalhos no código

Comentários com link (`// Próximo: ver os projetos →` para `/projeto-1`, `// Fale comigo →` para
`/contato`) usando o papel de comentário com sublinhado no hover e foco visível. "Próximo arquivo"
é um componente compartilhado no fim do editor, com o nome do arquivo seguinte da árvore
(`Próximo: Diferenciais.java →`); a última seção não tem.

### 2. Contato

Links com `text-decoration: underline dotted`, ícone ↗ nos externos (`aria-hidden`), `min-block-size`
de 24 px (44 px abaixo de 768 px). "Copiar e-mail" usa a Clipboard API com aviso
`aria-live="polite"` ("E-mail copiado"); sem a API, o botão não aparece.

### 3. Code vision

Linha acima da declaração da classe nos projetos com site, menor e em cinza como o code vision do
IntelliJ, com o botão `▶ Executar · Ver o site ao vivo` que abre o preview (mesmo efeito do
Executar).

### 4. Celular

Abaixo de 768 px, `white-space: pre-wrap` com recuo pendurado (`text-indent` negativo) e a
numeração alinhada à primeira linha visual. Botão da árvore com o texto "Seções". Pastas da gaveta
começam abertas.

### 5. Modo de leitura

Padrão ligado. O bloco do Javadoc ganha o atributo `data-modo="leitura"`: Inter 14 px, cor de
texto, `max-inline-size: 65ch`, fundo `--cor-javadoc-renderizado` (token nos dois temas), sem a
coluna de `*` nem `/**` e `*/`. O botão da calha (ícone de livro da IntelliJ Platform,
`aria-pressed`) alterna um sinal global guardado no `sessionStorage`. Retrato e `@author`
continuam. A digitação revela o bloco renderizado inteiro de uma vez. Texto copiado continua
igual ao do modo cru, sem marcadores.

### 6. Abas e ícones

Limite de 5 abas: abrir a sexta fecha a menos usada recentemente (nunca a ativa). Ícones
decorativos com opacidade 0,55 e sem hover.

## Risks / Trade-offs

- [Atalhos quebrarem a ilusão de código] → são comentários de código, como "TODO" clicáveis.
- [Quebra suave mudar a numeração] → só no celular, onde cortar texto é pior.

## Faixas da equipe

| Faixa    | Quem      | O quê                                                     |
| -------- | --------- | --------------------------------------------------------- |
| Conteúdo | Grafite   | Início (nome, `h1`, atalhos) e próximo arquivo nas seções  |
| Editor   | Pincel    | Modo de leitura e quebra suave (dono de `editor-de-codigo`) |
| Casca    | Nanquim   | Code vision, contato, abas, ícones, gaveta no celular      |
| Testes   | Sentinela | Specs, celular, axe nos dois temas                         |
| Docs     | Escriba   | README, `docs/`, diário                                    |
