# Spec Delta

## ADDED Requirements

### Requirement: Design como referência
As telas em `design/telas/` SHALL ser a referência da identidade visual (cores, tipografia,
proporções e estrutura de IDE). Desvios MUST ser permitidos quando melhoram a experiência de
IDE, a acessibilidade ou a modernidade do código, e MUST ser registrados no design da change.

#### Scenario: Comparação com a tela 01
- **WHEN** a página inicial é aberta numa janela de 1920x1080
- **THEN** a barra de ferramentas, o painel lateral e o editor mantêm as cores, as fontes e as
  proporções da `tela-01.png`

#### Scenario: Desvio intencional
- **WHEN** uma change acrescenta algo que não está nas telas, como a barra de status
- **THEN** o elemento usa os tokens do sistema visual e o desvio está descrito no design da
  change

## REMOVED Requirements

### Requirement: Fidelidade ao design de referência
**Reason**: O Vinicius redefiniu o design como referência, e não especificação (ADR-0010).
**Migration**: Usar o requisito "Design como referência".
