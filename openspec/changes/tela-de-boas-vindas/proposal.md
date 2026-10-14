# Proposal

## Why

O site abre direto no editor e quem chega não vê o rosto nem o nome do Vinicius logo de cara. O
Vinicius quer uma abertura com boas-vindas, a foto dele e um carregamento curto, como a tela de
abertura (splash) do IntelliJ ao carregar um projeto. Hoje a "abertura" é a janela de Run, que
cobre 37 a 40% da tela e continua aberta depois do log (auditoria de UX de 14/10).

## What Changes

- **Tela de boas-vindas** no estilo da splash do IntelliJ: foto do Vinicius, "Vinicius Machado",
  "Desenvolvedor Full Stack", "Seja bem-vindo" e a barra "Carregando Portfolio_Vinicius…" com as
  etapas do Spring subindo (`Starting PortfolioApplication…`, `Tomcat started on port 8080`).
- **Não dá para pular**, mas é curta: no mínimo 0,6 s (para não piscar) e no máximo 2 s; termina
  assim que o Angular, as fontes e a página atual estão prontos. Saída com fade de ~200 ms.
- **Uma vez por sessão** e só na primeira página aberta, em qualquer rota.
- **A janela de Run deixa de abrir sozinha:** o log do Spring vira o carregamento. A janela de Run
  continua no Executar. A barra de status mostra `PortfolioApplication started in 1.8 s` por
  alguns segundos depois da abertura.
- **ADR-0015** registra a troca (atualiza o ADR-0011 na parte da janela de Run na abertura).
- Entrada do diário.

## Capabilities

### New Capabilities

- `tela-de-boas-vindas`: abertura com foto, boas-vindas e carregamento.

### Modified Capabilities

- `janela-de-run`: não abre mais sozinha na primeira visita.
- `barra-de-status`: aviso de inicialização depois da abertura.

## Impact

- Código: `layout/tela-de-boas-vindas/`, serviço da janela de Run (remove a abertura automática),
  barra de status, `app.html` da casca.
- O HTML pré-renderizado não muda: a tela é montada só no navegador, por cima do conteúdo.
- Testes: unitários e E2E (sessão, duração, movimento reduzido, axe, celular, conteúdo no HTML).
