# Proposal

## Why

O Vinicius não gostou do controle de páginas (`◂ 1/4 ▸`): ele esconde conteúdo atrás de cliques e
não existe numa IDE de verdade (o ADR-0011 já apontava isso). Ele quer cada seção inteira na
mesma tela, como um arquivo Java que se rola.

## What Changes

- **Cada seção vira um arquivo só:** Skills (3 páginas hoje), Experiências (3), Projeto 4 (3),
  Projeto 5 (4) e Certificações (3) passam a mostrar todo o conteúdo num único `.java`, rolando.
  As partes de cada seção viram blocos do mesmo arquivo (por exemplo, um record e várias
  instâncias, cada uma com o seu Javadoc), sem repetir `package`, `import` e a declaração da classe.
- **Sai o controle de páginas** do site inteiro.
- **Endereços antigos** (`/skills/2`, `/experiencias/3`, `/projeto-5/4` etc.) levam à seção, para
  não quebrar links já compartilhados.
- Sitemap, títulos da janela, abas, busca e "Próximo arquivo" deixam de considerar páginas.
- **ADR-0018** registra a decisão (refina o ADR-0011, item 2: as seções não viram vários arquivos,
  viram um arquivo só).
- Entrada do diário.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `paginas-de-secao`: sai a paginação; ficam o "Próximo arquivo" e o redirecionamento dos
  endereços antigos.
- `secao-skills`, `secao-experiencias`, `secao-certificacoes`, `secao-projetos`: conteúdo numa
  tela só.
- `seo-e-compartilhamento`: o sitemap lista só os endereços das seções.

## Impact

- Código: conteúdo das 5 seções, `core/secoes.ts` (sai `paginas`), rotas, componente de controle
  de páginas (sai), título da janela, sitemap, numeração e digitação de conteúdos longos.
- Testes: unitários e E2E das 5 seções, redirecionamento, sitemap, axe.
