# Design

## Context

Todas as seções são código no `EditorDeCodigo`. O Javadoc (`LinhaDeJavadoc`) já é exibido como
texto corrido, parecido com o comentário de documentação renderizado do IntelliJ. Links no código
já existem (`link(trecho, href)`, com `target="_blank"` e `rel="noopener noreferrer"` para links
externos). Imagens já usam `NgOptimizedImage` (ícones e janela de preview). Fotos originais:
`.maestri/fotos/vinicius-original.png` e `.maestri/fotos/luana-original.png` (400x400).

## Goals / Non-Goals

**Goals:**

- Mostrar o rosto do Vinicius e da Luana sem sair da linguagem visual da IDE.
- Zero deslocamento de layout, imagens leves, acessível nos dois temas.

**Non-Goals:**

- Galeria, foto em outras seções, foto no cartão de compartilhamento (que continua como está, por
  decisão do Vinicius em 14/10).

## Decisions

### 1. Retrato no Javadoc

`LinhaDeJavadoc` ganha o campo opcional `retrato: { src, alt, tamanho }` e a função
`javadocComRetrato(recuo, texto, retrato)` em `conteudo.ts`. O template renderiza a foto redonda
dentro do bloco do Javadoc, à esquerda do texto, mantendo a coluna de ` * ` e o recuo. Tamanho:
96 px no Início e no Sobre Mim, 64 px na recomendação; no celular, 64 e 48 px. Borda de 1 px na
cor da borda do editor, por token, nos dois temas.

### 2. Autor com link

Na recomendação, o Javadoc termina com uma linha `@author Luana Porto` em que o nome é link para o
LinkedIn (mesmo tratamento de links externos do editor, com indicação acessível de que abre em
nova aba). O nome e o cargo continuam também no `new Recomendacao(...)`.

### 3. Imagens

Versões em WebP em `public/fotos/` com 2x o maior tamanho exibido (192x192 para o Vinicius e
128x128 para a Luana), abaixo de 30 KB cada. `NgOptimizedImage` com `width`/`height` fixos; a do
Início com `priority` (está acima da dobra), as outras com carregamento preguiçoso. `alt`:
"Foto de Vinicius Machado" e "Foto de Luana Porto".

### 4. Digitação

Na digitação das seções, o retrato aparece junto com a linha do Javadoc a que pertence, sem
animação própria. Com movimento reduzido, aparece direto. O pré-render já inclui a imagem.

## Risks / Trade-offs

- [Foto destoar da estética de código] → foto pequena, redonda, dentro do Javadoc renderizado,
  como o IntelliJ faz.
- [Privacidade da foto da Luana] → foto enviada pelo Vinicius com autorização dela; nada baixado do
  LinkedIn.

## Faixas da equipe

| Faixa    | Quem      | O quê                                                     |
| -------- | --------- | --------------------------------------------------------- |
| Editor   | Pincel    | Retrato no Javadoc, `@author` com link, imagens WebP      |
| Seções   | Grafite   | Início, Sobre Mim e Depoimentos com as fotos              |
| Testes   | Sentinela | Unitários, E2E, axe nos dois temas, celular, CLS          |
| Docs     | Escriba   | `docs/componentes.md`, README e diário                    |
