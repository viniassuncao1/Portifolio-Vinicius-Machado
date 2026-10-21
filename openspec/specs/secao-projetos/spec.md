# secao-projetos Specification

## Purpose
Apresentar os projetos que o Vinicius entregou, em Java legível, com acesso aos sites que estão
no ar.

## Requirements

### Requirement: Ordem dos projetos para vagas Java
Os projetos SHALL aparecer na árvore nesta ordem: Projeto 1, cases da Memora; Projeto 2, este
portfólio; Projeto 3, launcher de TV; Projeto 4, Ana; Projeto 5, landing page da Dra. Juliana;
Projeto 6, landing page da Watts Company.

#### Scenario: Pasta de projetos
- **WHEN** o visitante expande a pasta de projetos
- **THEN** vê `Projeto1.java` a `Projeto6.java`, com os cases da Memora primeiro

### Requirement: Projeto 3, launcher de TV
A rota `/projeto-3` SHALL apresentar o fork do CleanYourTV, do Gathin: um launcher Android em
Java levado para o Android 4.4 (`minSdk` de 26 para 19), com o que depende de Android 5.0+
isolado em classes chamadas depois de checar a versão, cerca de 70 avisos de compatibilidade
resolvidos, os 42 testes passando e o teste numa TV Philco com 456 MB de RAM, com backup e
comando de reversão para cada passo. O `▶ Executar` MUST abrir o repositório no GitHub em nova
aba.

#### Scenario: Abrir o Projeto 3
- **WHEN** o visitante abre "Projeto 3" na árvore
- **THEN** vê o launcher em Java, o crédito ao CleanYourTV e o link para o repositório

### Requirement: Projeto 4, Ana
A rota `/projeto-4` SHALL apresentar a Ana: agente de IA em n8n que atende os pacientes de uma
fisioterapeuta autônoma pelo WhatsApp (com Google OAuth 2.0 e API do WhatsApp), que responde,
marca, desmarca e cancela sessões, confirma, aciona a profissional e bloqueia spam, e o painel
de controle/CRM em React feito com Claude Code e SDD.

#### Scenario: Abertura
- **WHEN** o visitante abre o Projeto 4
- **THEN** ele vê a Ana, a plataforma WhatsApp, o n8n, as integrações e o painel em React

### Requirement: Projeto 5, landing page da Dra. Juliana
A rota `/projeto-5` SHALL apresentar a landing page em HTML e JavaScript com design autoral,
foco em conversão, prova social com avaliação 5.0 no Doctoralia, especialidades, convênios,
depoimentos e o caminho para o WhatsApp, com o link https://www.drajulianamaluhy.com/ e
preview.

#### Scenario: Abertura
- **WHEN** o visitante abre o Projeto 5
- **THEN** ele vê a descrição, o link do site e o botão "▶ Executar"

### Requirement: Projeto 6, landing page da Watts Company
A rota `/projeto-6` SHALL apresentar a landing page em React da Watts Company, com foco em
conversão de leads, a proposta "Automatize. Escale. Domine." e o CTA de diagnóstico gratuito,
com o link https://wattscompany.com.br/ e preview.

#### Scenario: Abertura
- **WHEN** o visitante abre o Projeto 6
- **THEN** ele vê a descrição, o link do site e o botão "▶ Executar"

### Requirement: Projeto 1, cases da Memora
A seção Projeto 1 SHALL mostrar num arquivo só os três cases da Memora: migração de APIs e
microsserviços de Oracle para PostgreSQL em produção, scrapers de licitações em Java com
Playwright (Coren e Sanesul) e o AyoForms (PHP 8 e JavaScript com MySQL, login via Google
Workspace e Microsoft Azure, upload de vídeo, insights de acesso e votação com conteúdo do
SharePoint).

#### Scenario: Três cases
- **WHEN** o visitante abre o Projeto 1
- **THEN** os três cases aparecem no mesmo arquivo, cada um com o que foi feito

### Requirement: Projeto 2, este portfólio
A rota `/projeto-2` SHALL apresentar, em `Projeto2.java`, num arquivo só e em 4 partes, o próprio
portfólio como estudo de desenvolvimento com IA: o estudo, SDD com OpenSpec, o ECC de Affaan
Mustafa (vencedor do hackathon Anthropic x Forum Ventures em setembro de 2025) e o Maestri de
Evert Junior, desenvolvedor brasileiro, com links externos para o repositório, o ECC e o Maestri.

#### Scenario: Abrir o Projeto 2
- **WHEN** o visitante abre "Projeto 2" na árvore
- **THEN** o arquivo começa pelo estudo, com o link para o repositório no GitHub

#### Scenario: Página do Maestri
- **WHEN** o visitante chega à parte do Maestri no Projeto 2
- **THEN** o texto apresenta o Maestri, de Evert Junior, e a equipe de agentes do portfólio, com
  link para o Maestri em nova aba

#### Scenario: Code vision
- **WHEN** o visitante ativa `▶ Executar · Ver no GitHub` no Projeto 2
- **THEN** o repositório abre em nova aba com `rel="noopener noreferrer"`

### Requirement: Vitrine como porta de entrada dos projetos
A seção de projetos SHALL abrir pela vitrine da spec `vitrine-de-projetos`, listando os seis
projetos na ordem definida em "Ordem dos projetos para vagas Java", e cada cartão SHALL levar aos
detalhes do projeto.

#### Scenario: Entrar pela vitrine
- **WHEN** o visitante ativa "Projetos" na página inicial ou na barra de ações
- **THEN** vê a vitrine com os seis cartões na ordem definida

### Requirement: Arquivo Java como detalhe em código
Cada projeto SHALL manter a sua rota `/projeto-N` com o arquivo `.java` inteiro, como o detalhe em
código, acessível pelos detalhes da vitrine, e MUST NOT perder nenhum conteúdo ou endereço
existente.

#### Scenario: Ver o código do projeto
- **WHEN** o visitante ativa "Ver em código" nos detalhes do Projeto 3
- **THEN** abre `/projeto-3` com o arquivo `Projeto3.java` e o ▶ Executar de sempre

#### Scenario: Endereço antigo
- **WHEN** alguém abre um `/projeto-N` já compartilhado
- **THEN** a página carrega o arquivo do projeto como antes
