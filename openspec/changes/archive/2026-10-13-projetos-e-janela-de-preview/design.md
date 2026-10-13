# Design

## Context

Seções são features com conteúdo tipado e páginas (`SECOES.paginas`); a barra de ferramentas é
decorativa (`aria-hidden`). Referências: telas 10 a 18. Os dois sites aceitam iframe (sem
`X-Frame-Options` nem CSP restritiva, conferido em 2026-10-13).

## Goals / Non-Goals

**Goals:**

- Uma janela de preview reutilizável, leve por padrão e acessível.

**Non-Goals:**

- Navegar entre vários sites na mesma janela ou redimensioná-la com o mouse.

## Decisions

### 1. Registro de previews em `core/`

`core/previews.ts` exporta um mapa `slug -> PreviewDeProjeto` (`titulo`, `url`, `captura`
com `src`, `largura`, `altura` e `alt`). O serviço `JanelaDePreview` (`@Service`) guarda o
preview aberto (signal) e o elemento que abriu, para devolver o foco.

### 2. Componente `JanelaDePreview` em `shared/`

`<dialog>` modal (foco preso e Escape nativos), com barra de título no estilo da IDE (nome do
projeto, — e ▢ decorativos, × funcional), área rolável com a captura (`NgOptimizedImage`,
`priority` desligado) e os botões "Ver ao vivo"/"Ver captura" e "Abrir em nova aba". O iframe
só é criado ao pedir: `sandbox="allow-scripts allow-same-origin allow-popups allow-forms"`,
`referrerpolicy="no-referrer"`, `loading="lazy"` e `title`. Montado uma vez na `Casca`.

### 3. Executar

Botão `BotaoExecutar` (`shared/`) abaixo do código nos projetos com preview. Na
`BarraDeFerramentas`, o play vira botão real ("Executar o projeto") só quando a rota atual tem
preview; nas demais segue decorativo.

### 4. Capturas

Capturas de página inteira dos dois sites em 1440 px de largura, geradas com o Playwright do
projeto por um script em `scripts/capturar-previews.mjs`, salvas em `public/projetos/` como
JPEG otimizado (até ~400 KB cada). O script fica versionado para atualizar as capturas quando
os sites mudarem.

### 5. Trilhas

| Trilha | Quem | Arquivos |
| ------ | ---- | -------- |
| Janela, Executar, registro e capturas | Pincel | `shared/janela-de-preview/`, `shared/botao-executar/`, `core/previews.ts`, `layout/barra-de-ferramentas/`, `layout/casca/`, `scripts/`, `public/projetos/` |
| Animação da janela | Compasso | estilos de animação da janela e `_movimento.scss`, depois do Pincel |
| Projetos 1 e 4 | Grafite | `features/projeto-1`, `features/projeto-4`, `paginas` do Projeto 4 |
| Projetos 2 e 3 | Nanquim | `features/projeto-2`, `features/projeto-3` e o registro das quatro rotas (por último) |
| Testes | Sentinela | `*.spec.ts`, `e2e/` |
| Docs | Escriba | `docs/` |

## Risks / Trade-offs

- [Site externo mudar ou sair do ar] → a captura é o padrão; "ao vivo" é opcional e o link
  externo continua funcionando.
- [Conteúdo de terceiros no iframe] → só carrega quando o visitante pede, com `sandbox` e sem
  referrer.
- [Peso das capturas] → JPEG otimizado e `loading="lazy"`.
