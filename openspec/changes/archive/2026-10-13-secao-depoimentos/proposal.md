# Proposal

## Why

"Depoimentos/Recomendações" é a última seção ainda com o aviso de "em construção". No design
(tela 29) ela só tem Lorem Ipsum; o Vinicius trouxe a primeira recomendação real, recebida no
LinkedIn.

## What Changes

- Seção **Depoimentos/Recomendações** com a recomendação de Luana Porto (Desenvolvedor Backend
  Java), que trabalhou na mesma equipe que o Vinicius, de 22/09/2026, em Java legível.
- Estrutura preparada para mais recomendações: cada nova é uma entrada a mais na lista, e as
  páginas da seção crescem se precisar.
- Entrada 0008 do diário.

## Capabilities

### New Capabilities

- `secao-depoimentos`: conteúdo da seção de depoimentos e recomendações.

### Modified Capabilities

Nenhuma.

## Impact

- Código: `features/depoimentos/` e o registro da rota.
- Testes: unitários e E2E da seção; axe na rota.
- Documentação: entrada 0008 do diário.
