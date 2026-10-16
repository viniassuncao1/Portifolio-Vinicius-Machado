# 0020: Domínio próprio

- **Data:** 2026-10-16
- **Change:** [dominio-proprio](../../openspec/changes/archive/2026-10-16-dominio-proprio/)
- **PR:** [#36](https://github.com/viniassuncao1/Portifolio-Vinicius-Machado/pull/36)
- **ADRs:** nenhum novo.

## Problema

O portfólio ganhou um endereço próprio, `vinimachado.wattscompany.com.br`, no domínio da Watts
Company: um CNAME na Hostinger aponta para a Vercel. Só que o endereço antigo,
`portfolio-vinicius-machado.vercel.app`, continuava fixo no SEO, no sitemap, no `robots.txt`, no
README e no cartão de compartilhamento. Buscadores e o LinkedIn seguiriam usando o endereço antigo.

## Decisões

- **O domínio novo é o canônico.** `core/seo.ts` (canônico, `og:url` e dados estruturados), o
  sitemap, o `robots.txt` e a URL no rodapé do cartão de compartilhamento passam a usá-lo.
- **Um teste para o endereço não divergir.** O script do sitemap é Node e roda antes do build, então
  mantém a própria constante, e um teste unitário compara as duas. O endereço já havia ficado em
  dois lugares desde a [entrada 0009](0009-seo-e-compartilhamento.md), e a divergência passou a ser
  um erro de teste.
- **O endereço antigo redireciona.** Na Vercel, o `.vercel.app` do projeto responde 308 para o
  domínio novo, mantendo o caminho. É configuração do projeto, fora do código. Quem tinha o link
  antigo continua chegando.
- **O cartão continua com `ViniciusMachado.java`**, por decisão do Vinicius; só a URL muda.

## Aprendizado

- **Trocar de endereço é mais do que mudar o DNS.** O endereço está no canônico, no sitemap, no
  robots, nas tags de compartilhamento e na imagem do cartão. Se um ficar para trás, buscadores e
  redes sociais seguem o endereço antigo.
- **Prévias ficam em cache.** Depois do deploy é preciso revalidar a prévia no Post Inspector do
  LinkedIn e registrar o domínio no Google Search Console.
- **Uma constante para o endereço, e um teste quando não dá para ter só uma.**
- **Números finais.** 786 testes unitários (95,45% de cobertura de instruções) e 852 testes E2E.

## Links

- Change: [`openspec/changes/dominio-proprio`](../../openspec/changes/archive/2026-10-16-dominio-proprio/)
- Documentação: [deploy](../deploy.md#domínio-próprio) e [arquitetura](../arquitetura.md#seo-e-compartilhamento)
- Entrada anterior: [0019 seções sem paginação](0019-secoes-sem-paginacao.md)

## Rascunho de post para o LinkedIn

> Meu portfólio agora tem endereço próprio: vinimachado.wattscompany.com.br.
>
> O DNS foi um CNAME na Hostinger apontando para a Vercel, e levou minutos. O trabalho de verdade
> foi o resto: o endereço antigo estava no canônico, no sitemap, no robots.txt, nas tags de
> compartilhamento e até desenhado no cartão que aparece quando o link é postado no LinkedIn. Se um
> deles ficasse para trás, buscadores e redes sociais seguiriam o endereço velho.
>
> Troquei tudo, deixei um teste para garantir que as duas constantes do endereço não divergem e o
> .vercel.app agora redireciona para o domínio novo, mantendo o caminho. Depois do deploy, falta
> revalidar a prévia do link no Post Inspector do LinkedIn, que guarda cache.
>
> O aprendizado: mudar de domínio é uma checklist, não uma configuração de DNS.
>
> Quantos lugares guardam o endereço do seu site?
>
> #SEO #Vercel #Angular
