# secao-projetos Specification

## Purpose
Apresentar os projetos que o Vinicius entregou, em Java legível, com acesso aos sites que estão
no ar.

## Requirements

### Requirement: Projeto 1, Ana
A rota `/projeto-1` SHALL apresentar a Ana: agente de IA em n8n que atende os pacientes de uma
fisioterapeuta autônoma pelo WhatsApp (com Google OAuth 2.0 e API do WhatsApp), que responde,
marca, desmarca e cancela sessões, confirma, aciona a profissional e bloqueia spam, e o painel
de controle/CRM em React feito com Claude Code e SDD.

#### Scenario: Abertura
- **WHEN** o visitante abre o Projeto 1
- **THEN** ele vê a Ana, a plataforma WhatsApp, o n8n, as integrações e o painel em React

### Requirement: Projeto 2, landing page da Dra. Juliana
A rota `/projeto-2` SHALL apresentar a landing page em HTML e JavaScript com design autoral,
foco em conversão, prova social com avaliação 5.0 no Doctoralia, especialidades, convênios,
depoimentos e o caminho para o WhatsApp, com o link https://www.drajulianamaluhy.com/ e
preview.

#### Scenario: Abertura
- **WHEN** o visitante abre o Projeto 2
- **THEN** ele vê a descrição, o link do site e o botão "▶ Executar"

### Requirement: Projeto 3, landing page da Watts Company
A rota `/projeto-3` SHALL apresentar a landing page em React da Watts Company, com foco em
conversão de leads, a proposta "Automatize. Escale. Domine." e o CTA de diagnóstico gratuito,
com o link https://wattscompany.com.br/ e preview.

#### Scenario: Abertura
- **WHEN** o visitante abre o Projeto 3
- **THEN** ele vê a descrição, o link do site e o botão "▶ Executar"

### Requirement: Projeto 4, cases da Memora
A seção Projeto 4 SHALL ter três páginas com os cases da Memora: migração de APIs e
microsserviços de Oracle para PostgreSQL em produção, scrapers de licitações em Java com
Playwright (Coren e Sanesul) e o AyoForms (PHP e MySQL, login via Google Workspace e Microsoft
Azure, upload de vídeo, insights de acesso e votação com conteúdo do SharePoint).

#### Scenario: Três cases
- **WHEN** o visitante percorre as três páginas do Projeto 4
- **THEN** cada página mostra um case com o que foi feito
