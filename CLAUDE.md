# CLAUDE.md

Instruções para agentes de IA que trabalham neste repositório.

## Projeto

Portfólio pessoal de Vinicius Machado em Angular 22, pré-renderizado (SSG) e publicado na Vercel
pelo GitHub Actions. O visual simula uma IDE escura no estilo Eclipse. O design de referência fica em
`design/` (não versionado): `portfolio.pdf` é o original, `telas/tela-01.png` a `tela-30.png` são
as telas exportadas (use estas, porque o PDF não é legível pelas ferramentas) e
`telas/textos.md` tem os textos de cada tela. Trate o design como **referência** de identidade visual
(cores, tipografia, proporções e estrutura de IDE), não como especificação pixel a pixel
([ADR-0010](docs/adr/0010-design-como-referencia-e-java-moderno.md)). Preserve as informações das
telas; desvios que melhorem a experiência de IDE, a acessibilidade ou o código são bem-vindos.

O código exibido nas seções é **Java moderno (21)** com padrões de mercado: `record`, `List.of`,
`var`, `Optional`, `java.time`, text blocks e Javadoc, sintaticamente válido, com identificadores
em inglês e textos para o leitor em pt-BR.

O repositório também é uma vitrine. Código, commits e documentação precisam estar no nível de um
projeto profissional.

## Fluxo de trabalho (obrigatório)

1. Toda funcionalidade começa com uma change no OpenSpec (`/opsx:propose`). Artefatos em pt-BR.
2. Implemente numa branch (`feat/...`, `fix/...`, `chore/...`), nunca direto na `main`.
3. Commits pequenos, um assunto por commit, em Conventional Commits e em pt-BR:
   `feat: adiciona árvore de navegação lateral`.
4. Antes de dar uma tarefa como concluída, rode:
   `npm run lint && npm run test:ci && npm run build && npm run e2e`.
5. Atualize a documentação (`README.md`, `docs/`) quando a mudança afetar o que ela descreve.

## Decisões e equipe

- Leia os ADRs em `docs/adr/` antes de propor mudanças. Não rediscuta uma decisão aceita sem
  propor um novo ADR.
- Decisão nova de arquitetura, ferramenta ou processo exige um ADR no mesmo PR.
- O trabalho é feito por uma equipe de agentes no Maestri. Papéis, escopos e regras estão em
  `docs/equipe-de-agentes/`. Respeite o escopo do seu papel.

## Regras de código

Siga as regras em `.claude/rules/ecc/` (common, typescript, angular, web). Em conflito, a regra
mais específica vence.

## Estrutura

- `src/app/core/`: singletons e configurações globais
- `src/app/shared/`: componentes, diretivas e pipes reutilizáveis
- `src/app/layout/`: casca da IDE
- `src/app/features/<secao>/`: uma pasta por seção, carregada com `loadComponent`
- Uma feature não importa de outra feature.
- Nomes de arquivo no guia de estilo 2025 (`inicio.ts`, `inicio.spec.ts`).
- Identificadores de código em inglês ou português de forma consistente dentro de cada feature;
  textos visíveis ao usuário em pt-BR.

## Animações e transições

- Respeite `prefers-reduced-motion` em toda animação.
- Prefira CSS e a View Transitions API. Use bibliotecas só quando a necessidade estiver
  justificada no design da change.

## Boas práticas de Angular e TypeScript

Geradas pelo Angular CLI (`--ai-config=claude-code`).

You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

### TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

### Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Do NOT set `changeDetection: ChangeDetectionStrategy.OnPush` explicitly. `OnPush` is the default in Angular v22+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

### Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

#### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `model()` for two-way bound properties with `[(prop)]` syntax instead of pairing `input()` with `output()`
- Use `computed()` for derived state
- Use `linkedSignal()` for state derived from multiple reactive sources that must stay synchronized
- Prefer inline templates for small components
- Prefer Signal Forms (`@angular/forms/signals`) for new forms. They are stable in Angular v22+ and provide signal-based state, type-safe field access, and schema-based validation
- When not using Signal Forms, prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- Do NOT import `CommonModule`, import only the directives and pipes the template uses, such as `AsyncPipe` or `DatePipe`
- When using external templates/styles, use paths relative to the component TS file.

### State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

### Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.

### Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Prefer the `@Service` decorator over `@Injectable({providedIn: 'root'})` for new singleton services (Angular v22+)
- Use the `inject()` function instead of constructor injection
