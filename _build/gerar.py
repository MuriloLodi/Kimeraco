"""
Gera as páginas estáticas de serviço e de região da Kimera Co.

Uso (na raiz do repositório):
    python _build/gerar.py

O GitHub Pages (Jekyll) ignora pastas que começam com "_", então esta pasta
não é publicada. As páginas saem em pastas com index.html para ter URL limpa
(ex.: /landing-page/). Depois de rodar, confira o sitemap.xml gerado.
"""
import html
import json
import os
import sys
from datetime import date

sys.path.insert(0, os.path.dirname(__file__))
from servicos import SERVICOS  # noqa: E402

try:
    from regioes import ESTADOS, CIDADES  # noqa: E402
except ImportError:
    ESTADOS, CIDADES = [], []

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://kimeraco.com.br"
HOJE = date.today().isoformat()
WPP_NUM = "5545999997579"
ORG_ID = SITE + "/#organization"

E = html.escape


def wpp(msg):
    from urllib.parse import quote
    return f"https://wa.me/{WPP_NUM}?text={quote(msg)}"


WPP_SVG = ('<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.116 1.524 5.843L0 24l6.34-1.498A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.79 9.79 0 01-5.006-1.374l-.36-.214-3.727.88.942-3.636-.234-.374A9.761 9.761 0 012.182 12C2.182 6.575 6.575 2.182 12 2.182S21.818 6.575 21.818 12 17.425 21.818 12 21.818z"/></svg>')

NAV = """  <header id="nav" role="banner">
    <div class="nav-inner">
      <a href="/" class="nav-logo" aria-label="Kimera Co., página inicial">Kimera<span>.</span></a>
      <nav class="nav-links" aria-label="Menu principal">
        <a href="/servicos.html" class="nav-link">Serviços</a>
        <a href="/criacao-de-sites/" class="nav-link">Atendimento no Brasil</a>
        <a href="/planos.html" class="nav-link">Planos</a>
        <a href="/portfolio.html" class="nav-link">Portfólio</a>
        <a href="{orc}" class="btn btn-primary btn-sm nav-cta" target="_blank" rel="noopener noreferrer">Pedir orçamento</a>
      </nav>
      <button class="nav-burger" aria-label="Abrir menu" aria-expanded="false" aria-controls="nav-drawer"><span></span><span></span><span></span></button>
    </div>
    <div id="nav-drawer" class="nav-drawer" aria-hidden="true" inert>
      <a href="/servicos.html" class="nav-link">Serviços</a>
      <a href="/criacao-de-sites/" class="nav-link">Atendimento no Brasil</a>
      <a href="/planos.html" class="nav-link">Planos</a>
      <a href="/portfolio.html" class="nav-link">Portfólio</a>
      <a href="{orc}" class="btn btn-primary" style="margin-top:16px;justify-content:center;" target="_blank" rel="noopener noreferrer">Pedir orçamento</a>
    </div>
  </header>"""

FOOTER = """  <footer role="contentinfo">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="/" class="nav-logo">Kimera<span>.</span></a>
          <p>Criação de sites, landing pages, lojas virtuais e identidade visual.<br><strong>Base em Toledo (PR)</strong> · atendimento 100% online para todo o Brasil.</p>
        </div>
        <div class="footer-col">
          <div class="footer-col-title">Serviços</div>
          <ul>
{servicos}
          </ul>
        </div>
        <div class="footer-col">
          <div class="footer-col-title">Empresa</div>
          <ul>
            <li><a href="/criacao-de-sites/">Atendimento no Brasil</a></li>
            <li><a href="/portfolio.html">Portfólio</a></li>
            <li><a href="/planos.html">Planos e preços</a></li>
            <li><a href="/servicos.html">Todos os serviços</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <div class="footer-col-title">Contato</div>
          <ul>
            <li><a href="mailto:contato@kimeraco.com.br">contato@kimeraco.com.br</a></li>
            <li><a href="https://wa.me/5545999997579" target="_blank" rel="noopener noreferrer">+55 45 99999-7579</a></li>
            <li><a href="https://www.instagram.com/kimeraco_/" target="_blank" rel="noopener noreferrer">Instagram</a></li>
            <li>Toledo - PR · Brasil</li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="footer-copy">© {ano} Kimera Co. Todos os direitos reservados.</div>
        <div class="footer-legal">
          <a href="/privacy.html">Política de Privacidade</a>
          <a href="/terms.html">Termos de Uso</a>
        </div>
      </div>
    </div>
  </footer>"""


def footer():
    itens = "\n".join(
        f'            <li><a href="/{s["slug"]}/">{E(s["menu"])}</a></li>' for s in SERVICOS
    )
    return FOOTER.format(servicos=itens, ano=date.today().year)


def jsonld(obj):
    return '  <script type="application/ld+json">\n' + json.dumps(obj, ensure_ascii=False, indent=2) + "\n  </script>"


def breadcrumb_schema(trail):
    return {
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": i + 1, "name": nome, "item": SITE + url}
            for i, (nome, url) in enumerate(trail)
        ],
    }


def breadcrumb_html(trail):
    partes = []
    for i, (nome, url) in enumerate(trail):
        if i == len(trail) - 1:
            partes.append(f'<span aria-current="page">{E(nome)}</span>')
        else:
            partes.append(f'<a href="{url}">{E(nome)}</a><span aria-hidden="true">/</span>')
    return '<nav class="kp-crumbs" aria-label="Você está em">' + "".join(partes) + "</nav>"


def faq_schema(faq):
    return {
        "@type": "FAQPage",
        "mainEntity": [
            {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}}
            for q, a in faq
        ],
    }


def faq_html(faq):
    itens = "\n".join(
        f"        <details>\n          <summary>{E(q)}</summary>\n          <p>{E(a)}</p>\n        </details>"
        for q, a in faq
    )
    return f'      <div class="kp-faq">\n{itens}\n      </div>'


def page(path, title, description, body, graph, og_image="/assets/img/og-kimera.jpg", wpp_msg=None):
    url = SITE + path
    orc = wpp(wpp_msg or "Olá! Vim pelo site da Kimera Co. e quero um orçamento de site.")
    schema = {"@context": "https://schema.org", "@graph": graph}
    doc = f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#000000">
  <meta name="format-detection" content="telephone=no">
  <title>{E(title)}</title>
  <meta name="description" content="{E(description)}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
  <link rel="canonical" href="{url}">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Kimera Co.">
  <meta property="og:title" content="{E(title)}">
  <meta property="og:description" content="{E(description)}">
  <meta property="og:url" content="{url}">
  <meta property="og:image" content="{SITE}{og_image}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{E(title)}">
  <meta name="twitter:description" content="{E(description)}">
  <meta name="twitter:image" content="{SITE}{og_image}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/css/design-system.css">
  <link rel="stylesheet" href="/assets/css/styles.css">
  <link rel="stylesheet" href="/assets/css/paginas.css">
  <link rel="icon" href="/assets/img/logo.ico">
{jsonld(schema)}
</head>
<body>
{NAV.format(orc=E(orc))}
  <main id="conteudo">
{body}
  </main>
{footer()}
  <a class="wpp-float" href="{E(orc)}" target="_blank" rel="noopener noreferrer" aria-label="Chamar no WhatsApp">{WPP_SVG}</a>
  <script src="/assets/js/paginas.js" defer></script>
</body>
</html>
"""
    out = os.path.join(ROOT, path.strip("/"), "index.html")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    with open(out, "w", encoding="utf-8", newline="\n") as f:
        f.write(doc)
    return path


def acoes(msg, secundario=None):
    sec = secundario or ('/planos.html', 'Ver planos e preços')
    return f"""        <div class="kp-actions">
          <a href="{E(wpp(msg))}" class="btn btn-primary btn-lg btn-arrow" target="_blank" rel="noopener noreferrer">Pedir orçamento no WhatsApp <span class="arrow">→</span></a>
          <a href="{sec[0]}" class="btn btn-secondary btn-lg">{E(sec[1])}</a>
        </div>"""


def cta(titulo, sub, msg):
    return f"""    <section class="kp-cta" aria-labelledby="cta-t">
      <div class="container">
        <h2 class="kp-h2" id="cta-t">{titulo}</h2>
        <p class="kp-sub">{E(sub)}</p>
{acoes(msg)}
      </div>
    </section>"""


def org_ref():
    return {"@id": ORG_ID}


# ─── Página de serviço ────────────────────────────────────────────
def gerar_servico(s):
    path = f"/{s['slug']}/"
    trail = [("Início", "/"), ("Serviços", "/servicos.html"), (s["menu"], path)]
    msg = f"Olá! Vim pelo site da Kimera Co. e quero um orçamento de {s['menu'].lower()}."

    inclusos = "\n".join(f"            <li>{i}</li>" for i in s["inclusos"])
    pra_quem = "\n".join(
        f'          <div class="kp-card"><h3>{E(t)}</h3><p>{E(d)}</p></div>' for t, d in s["pra_quem"]
    )
    etapas = "\n".join(
        f'          <div class="kp-card"><span class="kp-num">{i + 1:02d}</span><h3>{E(t)}</h3><p>{E(d)}</p></div>'
        for i, (t, d) in enumerate(s["etapas"])
    )
    texto = "\n".join(f"          <p>{p}</p>" for p in s["texto"])
    outros = "\n".join(
        f'          <li><a href="/{o["slug"]}/">{E(o["menu"])}</a></li>' for o in SERVICOS if o["slug"] != s["slug"]
    )
    figura = ""
    if s.get("imagem"):
        src, alt, cap = s["imagem"]
        figura = f"""        <figure class="kp-figure">
          <img src="{src}" alt="{E(alt)}" width="960" height="720" loading="lazy" decoding="async">
          <figcaption>{E(cap)}</figcaption>
        </figure>"""

    body = f"""    <section class="kp-hero" aria-labelledby="h1">
      <div class="container">
        {breadcrumb_html(trail)}
        <p class="kp-eyebrow">{E(s['eyebrow'])}</p>
        <h1 class="kp-h1" id="h1">{s['h1']}</h1>
        <p class="kp-lead">{E(s['lead'])}</p>
{acoes(msg)}
        <ul class="kp-badges">
          <li>Atendimento 100% online</li>
          <li>Todo o Brasil</li>
          <li>{E(s['prazo'])}</li>
        </ul>
      </div>
    </section>

    <section class="kp-section" aria-labelledby="sobre-t">
      <div class="container kp-split">
        <div>
          <h2 class="kp-h2" id="sobre-t">{E(s['sobre_titulo'])}</h2>
          <div class="kp-prose" style="margin-top:var(--sp-24)">
{texto}
          </div>
        </div>
        <div>
{figura}
          <div class="kp-card" style="margin-top:{'var(--sp-20)' if figura else '0'}">
            <h3>O que vem no projeto</h3>
            <ul class="kp-list" style="margin-top:var(--sp-20)">
{inclusos}
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="kp-section" aria-labelledby="praquem-t">
      <div class="container">
        <div class="kp-head">
          <h2 class="kp-h2" id="praquem-t">{E(s['pra_quem_titulo'])}</h2>
        </div>
        <div class="kp-grid">
{pra_quem}
        </div>
      </div>
    </section>

    <section class="kp-section" aria-labelledby="etapas-t">
      <div class="container">
        <div class="kp-head">
          <h2 class="kp-h2" id="etapas-t">Como funciona, do primeiro contato à entrega</h2>
          <p class="kp-sub">Tudo acontece online. Você acompanha cada etapa pelo WhatsApp e aprova antes de seguir para a próxima.</p>
        </div>
        <div class="kp-grid kp-grid--4">
{etapas}
        </div>
      </div>
    </section>

    <section class="kp-section" aria-labelledby="preco-t">
      <div class="container kp-split">
        <div>
          <h2 class="kp-h2" id="preco-t">Quanto custa</h2>
          <div class="kp-prose" style="margin-top:var(--sp-24)"><p>{s['preco_texto']}</p></div>
        </div>
        <div class="kp-price">
          <strong>{E(s['preco'])}</strong>
          <span>{E(s['preco_nota'])}</span>
        </div>
      </div>
    </section>

    <section class="kp-section" aria-labelledby="faq-t">
      <div class="container">
        <div class="kp-head"><h2 class="kp-h2" id="faq-t">Perguntas frequentes</h2></div>
{faq_html(s['faq'])}
      </div>
    </section>

    <section class="kp-section" aria-labelledby="outros-t">
      <div class="container">
        <div class="kp-head">
          <h2 class="kp-h2" id="outros-t">Outros serviços</h2>
          <p class="kp-sub">Dá para contratar separado ou junto num plano. <a class="kp-link" href="/criacao-de-sites/">Veja como atendemos cada estado</a>.</p>
        </div>
        <ul class="kp-links">
{outros}
        </ul>
      </div>
    </section>

{cta(s['cta_titulo'], 'Me conta o que sua empresa faz e o que precisa. Respondo pelo WhatsApp com um caminho e um valor.', msg)}"""

    servico = {
        "@type": "Service",
        "@id": SITE + path + "#servico",
        "name": s["schema_nome"],
        "serviceType": s["schema_nome"],
        "description": s["description"],
        "url": SITE + path,
        "provider": org_ref(),
        "areaServed": {"@type": "Country", "name": "Brasil"},
        "availableChannel": {"@type": "ServiceChannel", "serviceUrl": SITE + path, "availableLanguage": "pt-BR"},
    }
    if s.get("preco_min"):
        servico["offers"] = {
            "@type": "Offer",
            "priceCurrency": "BRL",
            "price": s["preco_min"],
            "priceSpecification": {"@type": "PriceSpecification", "minPrice": s["preco_min"], "priceCurrency": "BRL"},
            "url": SITE + "/planos.html",
        }
    graph = [
        {"@type": "WebPage", "@id": SITE + path, "url": SITE + path, "name": s["title"], "description": s["description"],
         "inLanguage": "pt-BR", "isPartOf": {"@id": SITE + "/#website"}, "breadcrumb": {"@id": SITE + path + "#breadcrumb"}},
        dict(breadcrumb_schema(trail), **{"@id": SITE + path + "#breadcrumb"}),
        servico,
        faq_schema(s["faq"]),
    ]
    return page(path, s["title"], s["description"], body, graph, wpp_msg=msg)


HUB_FAQ = [
    ("Como funciona o atendimento online?", "A conversa inicial é por videochamada ou áudio no WhatsApp. Depois disso, o briefing é preenchido online, o layout é apresentado num link do Figma onde você comenta direto nas telas, e o site é publicado no seu domínio. Você acompanha tudo pelo celular."),
    ("Vocês emitem nota fiscal e contrato para outros estados?", "Sim. O contrato é assinado digitalmente e a nota fiscal é emitida normalmente, seja qual for o estado da sua empresa."),
    ("A distância atrapalha o SEO local do meu site?", "Não. O que faz seu site aparecer na sua cidade é o conteúdo do site, o seu endereço no Perfil da Empresa no Google e as avaliações dos seus clientes. A localização de quem programou o site não entra nessa conta."),
    ("E se eu estiver em outro fuso horário?", "Reuniões são marcadas no horário que funciona para você. Para clientes do Acre, Amazonas, Mato Grosso, Mato Grosso do Sul, Rondônia e Roraima, a agenda já considera a diferença em relação a Brasília."),
    ("Como é feito o pagamento?", "50% na entrada e 50% na entrega, por Pix, transferência ou cartão de crédito. Nada muda por você estar em outro estado."),
    ("Vocês fazem reunião presencial?", "Para empresas do Oeste do Paraná (Toledo, Cascavel e região), dá para marcar uma conversa presencial. Para o resto do Brasil, o atendimento é por vídeo, o que costuma ser mais rápido para os dois lados."),
]


def gerar_hub(regioes_html=""):
    path = "/criacao-de-sites/"
    trail = [("Início", "/"), ("Criação de sites no Brasil", path)]
    title = "Criação de Sites para Todo o Brasil, com Atendimento Online | Kimera Co."
    desc = "Criação de sites profissionais para empresas de qualquer cidade do Brasil. Briefing, aprovação e entrega 100% online, com contrato, nota fiscal e suporte pelo WhatsApp."
    msg = "Olá! Vim pelo site da Kimera Co. e quero um orçamento de site para minha empresa."
    etapas = "\n".join(
        f'          <div class="kp-card"><span class="kp-num">{i + 1:02d}</span><h3>{E(t)}</h3><p>{E(d)}</p></div>'
        for i, (t, d) in enumerate(ETAPAS_REMOTO)
    )
    servicos = "\n".join(f'          <li><a href="/{s["slug"]}/">{E(s["menu"])}</a></li>' for s in SERVICOS)
    body = f"""    <section class="kp-hero" aria-labelledby="h1">
      <div class="container">
        {breadcrumb_html(trail)}
        <p class="kp-eyebrow">Atendimento em todo o Brasil</p>
        <h1 class="kp-h1" id="h1">Criação de sites para empresas de <em>qualquer cidade do Brasil</em></h1>
        <p class="kp-lead">A Kimera Co. tem base em Toledo, no Paraná, e cria sites para empresas do país inteiro. Todo o projeto acontece online: você conversa direto com quem desenha e programa o seu site, aprova cada etapa pelo celular e recebe tudo pronto no seu domínio.</p>
{acoes(msg, ('/portfolio.html', 'Ver portfólio'))}
        <ul class="kp-badges">
          <li>Contrato digital</li>
          <li>Nota fiscal</li>
          <li>Pix, transferência ou cartão</li>
        </ul>
      </div>
    </section>

    <section class="kp-section" aria-labelledby="porque-t">
      <div class="container kp-split">
        <div>
          <h2 class="kp-h2" id="porque-t">Por que contratar um site de fora da sua cidade</h2>
        </div>
        <div class="kp-prose">
          <p>Site não precisa de visita técnica. O que define um bom projeto é entender o seu negócio e o seu cliente, e isso se faz numa boa conversa, não numa sala de reunião. Em agência grande é comum o projeto passar por várias mãos até chegar em quem executa. Aqui você fala sempre com quem está fazendo.</p>
          <p>O site aparece para quem está perto de você porque o conteúdo fala da sua região, dos seus serviços e do seu endereço, e porque o seu <strong>Perfil da Empresa no Google</strong> está bem cuidado. Onde o desenvolvedor mora não muda nada disso. A gente ajusta título, texto e dados estruturados para a sua cidade e orienta como cuidar do Perfil da Empresa.</p>
          <p>Os <a href="/planos.html">preços são os mesmos para qualquer estado</a>, com valor fechado antes de começar.</p>
        </div>
      </div>
    </section>

    <section class="kp-section" aria-labelledby="como-t">
      <div class="container">
        <div class="kp-head">
          <h2 class="kp-h2" id="como-t">Como é o projeto à distância</h2>
          <p class="kp-sub">Quatro etapas, todas pelo computador ou pelo celular.</p>
        </div>
        <div class="kp-grid kp-grid--4">
{etapas}
        </div>
      </div>
    </section>
{regioes_html}
    <section class="kp-section" aria-labelledby="serv-t">
      <div class="container">
        <div class="kp-head"><h2 class="kp-h2" id="serv-t">O que dá para contratar</h2></div>
        <ul class="kp-links">
{servicos}
        </ul>
      </div>
    </section>

    <section class="kp-section" aria-labelledby="faq-t">
      <div class="container">
        <div class="kp-head"><h2 class="kp-h2" id="faq-t">Dúvidas de quem é de outro estado</h2></div>
{faq_html(HUB_FAQ)}
      </div>
    </section>

{cta('Sua cidade não é <em style="font-style:normal;color:var(--c-accent)">problema</em>', 'Manda uma mensagem contando o que sua empresa faz. A resposta vem pelo WhatsApp, com caminho e valor.', msg)}"""
    graph = [
        {"@type": "WebPage", "@id": SITE + path, "url": SITE + path, "name": title, "description": desc,
         "inLanguage": "pt-BR", "isPartOf": {"@id": SITE + "/#website"}, "about": org_ref()},
        breadcrumb_schema(trail),
        {"@type": "Service", "name": "Criação de sites", "serviceType": "Criação de sites", "provider": org_ref(),
         "areaServed": {"@type": "Country", "name": "Brasil"}, "url": SITE + path,
         "offers": {"@type": "Offer", "priceCurrency": "BRL", "price": "1297", "url": SITE + "/planos.html"}},
        faq_schema(HUB_FAQ),
    ]
    return page(path, title, desc, body, graph, wpp_msg=msg)


ETAPAS_REMOTO = [
    ("Chamada de 30 minutos", "Por vídeo ou áudio, no horário que for melhor para você. Saímos dela com o escopo desenhado."),
    ("Proposta por escrito", "Valor fechado, prazo e o que está incluso. Contrato assinado digitalmente e 50% de entrada."),
    ("Layout no Figma", "Você abre o link, comenta nas telas e aprova. Ajustes acontecem antes de qualquer código."),
    ("Site no ar", "Publicação no seu domínio, Google Search Console configurado e um guia de como manter."),
]


def gerar_404():
    body = """    <section class="kp-hero" aria-labelledby="h1" style="min-height:70vh;display:flex;align-items:center">
      <div class="container">
        <p class="kp-eyebrow">Erro 404</p>
        <h1 class="kp-h1" id="h1">Essa página <em>não existe</em> (ou mudou de lugar)</h1>
        <p class="kp-lead">O link pode estar quebrado ou a página foi removida. Escolha um caminho abaixo.</p>
        <div class="kp-actions">
          <a href="/" class="btn btn-primary btn-lg">Ir para o início</a>
          <a href="/servicos.html" class="btn btn-secondary btn-lg">Ver serviços</a>
        </div>
      </div>
    </section>"""
    path = "/404/"
    page(path, "Página não encontrada | Kimera Co.", "A página que você procurou não existe.", body, [])
    src = os.path.join(ROOT, "404", "index.html")
    with open(src, encoding="utf-8") as f:
        doc = f.read()
    doc = doc.replace('<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">', '<meta name="robots" content="noindex">')
    doc = doc.replace('  <link rel="canonical" href="https://kimeraco.com.br/404/">\n', "")
    with open(os.path.join(ROOT, "404.html"), "w", encoding="utf-8", newline="\n") as f:
        f.write(doc)
    os.remove(src)
    os.rmdir(os.path.dirname(src))


def main():
    gerados = []
    for s in SERVICOS:
        gerados.append(("servico", gerar_servico(s)))
    gerar_404()
    regioes_html = ""
    try:
        from regioes_build import hub_regioes_html
        regioes_html = hub_regioes_html(sys.modules[__name__])
    except ImportError:
        pass
    gerados.append(("hub", gerar_hub(regioes_html)))
    try:
        from regioes_build import gerar_regioes  # noqa: E402
        gerados += gerar_regioes(sys.modules[__name__])
    except ImportError:
        pass
    escrever_sitemap([p for _, p in gerados])
    print(f"{len(gerados)} páginas geradas.")


ESTATICAS = [
    ("/", "1.0"),
    ("/servicos.html", "0.9"),
    ("/planos.html", "0.9"),
    ("/portfolio.html", "0.8"),
    ("/privacy.html", "0.2"),
    ("/terms.html", "0.2"),
]


def escrever_sitemap(paths):
    linhas = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for p, pr in ESTATICAS:
        linhas.append(f"  <url><loc>{SITE}{p}</loc><lastmod>{HOJE}</lastmod><priority>{pr}</priority></url>")
    for p in paths:
        pr = "0.8" if p.count("/") <= 2 else "0.6"
        linhas.append(f"  <url><loc>{SITE}{p}</loc><lastmod>{HOJE}</lastmod><priority>{pr}</priority></url>")
    linhas.append("</urlset>")
    with open(os.path.join(ROOT, "sitemap.xml"), "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(linhas) + "\n")


if __name__ == "__main__":
    main()
