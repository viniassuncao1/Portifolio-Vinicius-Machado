# Tasks

## 1. Decisões e specs

- [x] 1.1 Resolver com o Vinicius as perguntas abertas do design (toggle Cartão ⇄ Código; Projetos) e registrar o novo ADR que revisa o item 8 do ADR-0019
- [x] 1.2 Reler os requisitos sincronizados de `secao-inicio`, `secao-skills`, `secao-experiencias`, `secao-contato`, `secao-sobre-mim` e `casca-da-ide` e escrever os deltas MODIFIED/REMOVED do que o cartão como padrão contradiz; validar com `openspec validate`

## 2. Casca: sidebar, abas e paleta

- [ ] 2.1 Sidebar fixa com ícone por arquivo e marca deslizante no item atual (celular: fileira que rola); verificar `aria-current` e navegação por teclado
- [ ] 2.2 Breadcrumb que acompanha a rolagem e abas com indicador; verificar com e2e que árvore, aba e conteúdo mudam juntos
- [ ] 2.3 Paleta Ctrl/Cmd+K com abrir arquivo, baixar currículo, abrir LinkedIn/GitHub e copiar e-mail

## 3. Início

- [ ] 3.1 Início como `public class ViniciusMachado` com cargo, stack e provas; verificar a primeira dobra em 1440x900 e 390x844
- [ ] 3.2 Painel Run que digita o `./gradlew bootRun` e termina na apresentação; log completo no HTML sem JS ou com movimento reduzido

## 4. Skills e demais seções

- [ ] 4.1 `build.gradle` interativo com a dica tecnologia → projeto (hover, foco e toque), lendo de `core/`
- [ ] 4.2 Experiência como `git log --graph`; Contato como terminal com links reais
- [ ] 4.3 Sobre, Formação, Diferenciais, IA, Certificações, Eventos, Idiomas e Depoimentos como arquivos renderizados na linguagem da IDE
- [ ] 4.4 Projetos: integrar a vitrine à janela de Run com preview, conforme a decisão de 1.1

## 5. Limpeza e qualidade

- [ ] 5.1 Remover os cartões e estilos de referência que sobrarem; ajustar `SecaoEmDuasVisoes` conforme a decisão de 1.1
- [ ] 5.2 Adaptar testes unitários e e2e (cartão deixa de ser padrão); `perfil.spec.ts` continua garantindo fatos únicos
- [ ] 5.3 axe nos dois temas, `prefers-reduced-motion`, Lighthouse móvel e capturas de tela para o diário
- [ ] 5.4 Atualizar README, `docs/componentes.md` e o diário; rodar `npm run lint && npm run test:ci && npm run build && npm run e2e`
