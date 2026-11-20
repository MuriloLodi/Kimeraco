"""Geração das páginas de estado e cidade. Chamado por gerar.py."""
from regioes import ESTADOS, CIDADES

BASE = "/criacao-de-sites/"
REGIOES_ORDEM = ["Sul", "Sudeste", "Centro-Oeste", "Nordeste", "Norte"]


def do(prep):
    return {"no": "do", "na": "da", "em": "de"}[prep]


def fuso_txt(fuso, onde):
    if fuso == 0:
        return f"{onde} está no mesmo fuso de Brasília, o mesmo da Kimera, então a agenda é simples: reuniões em horário comercial e respostas no WhatsApp ao longo do dia."
    h = "1 hora" if fuso == -1 else f"{-fuso} horas"
    return f"{onde} fica {h} atrás de Brasília. As reuniões são marcadas no seu horário local e os prazos de entrega já consideram essa diferença."


def estado_url(e):
    return f"{BASE}{e['slug']}/"


def cidade_url(c):
    return f"{BASE}{c['slug']}/"


def _cards(g, itens):
    E = g.E
    return "\n".join(f'          <div class="kp-card"><h3>{E(t)}</h3><p>{E(d)}</p></div>' for t, d in itens)


def _etapas(g):
    E = g.E
    return "\n".join(
        f'          <div class="kp-card"><span class="kp-num">{i + 1:02d}</span><h3>{E(t)}</h3><p>{E(d)}</p></div>'
        for i, (t, d) in enumerate(g.ETAPAS_REMOTO)
    )


def _servicos_links(g):
    E = g.E
    return "\n".join(f'          <li><a href="/{s["slug"]}/">{E(s["menu"])}</a></li>' for s in g.SERVICOS)


def _prose(ps):
    return "\n".join(f"          <p>{p}</p>" for p in ps)


FAQ_GERAL_PRECO = ("Quanto custa um site profissional?", "Os planos vão de R$ 1.297 (site de até 3 páginas) a R$ 4.997 (site completo com identidade visual premium), com pagamento de 50% na entrada e 50% na entrega. Loja virtual tem orçamento próprio.")
FAQ_GERAL_PRAZO = ("Em quanto tempo o site fica pronto?", "De 15 a 30 dias depois da aprovação do briefing, conforme o plano. O que mais influencia o prazo é a entrega de textos e fotos.")


def gerar_estado(g, e):
    E = g.E
    path = estado_url(e)
    onde = f"{e['prep']} {e['nome']}"           # no Paraná
    de = f"{do(e['prep'])} {e['nome']}"          # do Paraná
    if any(c["nome"] == e["nome"] for c in CIDADES):  # SP e RJ: evita colidir com a página da capital
        onde = f"no estado {do(e['prep'])} {e['nome']}"
        de = f"do estado {do(e['prep'])} {e['nome']}"
    trail = [("Início", "/"), ("Criação de sites no Brasil", BASE), (e["nome"], path)]
    title = f"Criação de Sites {onde[0].upper() + onde[1:].replace('estado', 'Estado')} ({e['uf']}) | Kimera Co."
    title = title.replace("Sites No ", "Sites no ").replace("Sites Na ", "Sites na ").replace("Sites Em ", "Sites em ")
    msg = f"Olá! Vim pelo site da Kimera Co. Minha empresa é {de} e quero um orçamento de site."

    cidades_pag = {c["nome"]: c for c in CIDADES if c["estado"] == e["slug"]}
    itens = []
    for nome in e["cidades"]:
        base_nome = nome.split(" (")[0]
        if base_nome in cidades_pag:
            itens.append(f'          <li><a href="{cidade_url(cidades_pag[base_nome])}">{E(nome)}</a></li>')
        else:
            itens.append(f'          <li><span>{E(nome)}</span></li>')
    cidades_html = "\n".join(itens)

    vizinhos = [x for x in ESTADOS if x["regiao"] == e["regiao"] and x["slug"] != e["slug"]]
    viz_html = "\n".join(f'          <li><a href="{estado_url(x)}">{E(x["nome"])}</a></li>' for x in vizinhos)

    faq = e["faq"] + [FAQ_GERAL_PRECO]
    body = f"""    <section class="kp-hero" aria-labelledby="h1">
      <div class="container">
        {g.breadcrumb_html(trail)}
        <p class="kp-eyebrow">{E(e['regiao'])} · {E(e['uf'])}</p>
        <h1 class="kp-h1" id="h1">Criação de sites <em>{E(onde)}</em></h1>
        <p class="kp-lead">Sites, landing pages e lojas virtuais para empresas {E(de)}, de {E(e['capital'])} ao interior. O projeto é todo online: conversa por vídeo, layout aprovado pelo celular e site publicado no seu domínio.</p>
{g.acoes(msg)}
        <dl class="kp-facts">
          <div class="kp-fact"><dt>Capital</dt><dd>{E(e['capital'])}</dd></div>
          <div class="kp-fact"><dt>Fuso</dt><dd>{'Brasília' if e['fuso'] == 0 else f"Brasília {e['fuso']}h"}</dd></div>
          <div class="kp-fact"><dt>Atendimento</dt><dd>{'Presencial no Oeste e online' if e['uf'] == 'PR' else '100% online'}</dd></div>
          <div class="kp-fact"><dt>Planos</dt><dd>a partir de R$ 1.297</dd></div>
        </dl>
      </div>
    </section>

    <section class="kp-section" aria-labelledby="mercado-t">
      <div class="container kp-split">
        <div><h2 class="kp-h2" id="mercado-t">O mercado {E(de)} e o que ele pede de um site</h2></div>
        <div class="kp-prose">
{_prose(e['economia'])}
        </div>
      </div>
    </section>

    <section class="kp-section" aria-labelledby="seg-t">
      <div class="container">
        <div class="kp-head"><h2 class="kp-h2" id="seg-t">Projetos que fazem sentido {E(onde)}</h2></div>
        <div class="kp-grid">
{_cards(g, e['segmentos'])}
        </div>
      </div>
    </section>

    <section class="kp-section" aria-labelledby="como-t">
      <div class="container">
        <div class="kp-head">
          <h2 class="kp-h2" id="como-t">Como funciona o atendimento à distância</h2>
          <p class="kp-sub">{E(fuso_txt(e['fuso'], e['nome']))}</p>
        </div>
        <div class="kp-grid kp-grid--4">
{_etapas(g)}
        </div>
      </div>
    </section>

    <section class="kp-section" aria-labelledby="cid-t">
      <div class="container">
        <div class="kp-head">
          <h2 class="kp-h2" id="cid-t">Cidades {E(de)} que atendemos</h2>
          <p class="kp-sub">Estas são as principais, mas qualquer município {E(de)} é atendido do mesmo jeito.</p>
        </div>
        <ul class="kp-links">
{cidades_html}
        </ul>
      </div>
    </section>

    <section class="kp-section" aria-labelledby="faq-t">
      <div class="container">
        <div class="kp-head"><h2 class="kp-h2" id="faq-t">Perguntas de empresas {E(de)}</h2></div>
{g.faq_html(faq)}
      </div>
    </section>

    <section class="kp-section" aria-labelledby="mais-t">
      <div class="container">
        <div class="kp-head"><h2 class="kp-h2" id="mais-t">Serviços e outros estados</h2></div>
        <ul class="kp-links">
{_servicos_links(g)}
        </ul>
        <div class="kp-region">
          <h3>Região {E(e['regiao'])}</h3>
          <ul class="kp-links">
{viz_html}
          </ul>
        </div>
      </div>
    </section>

{g.cta(f'Sua empresa {E(de)} merece <em style="font-style:normal;color:var(--c-accent)">um site à altura</em>', 'Conta o que você faz e o que precisa. Respondo pelo WhatsApp com um caminho e um valor.', msg)}"""

    area = {"@type": "State", "name": e["nome"], "containedInPlace": {"@type": "Country", "name": "Brasil"}}
    graph = [
        {"@type": "WebPage", "@id": g.SITE + path, "url": g.SITE + path, "name": title, "description": e["desc"],
         "inLanguage": "pt-BR", "isPartOf": {"@id": g.SITE + "/#website"}},
        g.breadcrumb_schema(trail),
        {"@type": "Service", "name": f"Criação de sites {onde}", "serviceType": "Criação de sites",
         "provider": g.org_ref(), "areaServed": area, "url": g.SITE + path,
         "offers": {"@type": "Offer", "priceCurrency": "BRL", "price": "1297", "url": g.SITE + "/planos.html"}},
        g.faq_schema(faq),
    ]
    return g.page(path, title, e["desc"], body, graph, wpp_msg=msg)


def gerar_cidade(g, c):
    E = g.E
    path = cidade_url(c)
    est = next(x for x in ESTADOS if x["slug"] == c["estado"])
    trail = [("Início", "/"), ("Criação de sites no Brasil", BASE), (est["nome"], estado_url(est)), (c["nome"], path)]
    title = f"Criação de Sites em {c['nome']} ({c['uf']}) | Kimera Co."
    msg = f"Olá! Vim pelo site da Kimera Co. Minha empresa é de {c['nome']} e quero um orçamento de site."

    irmas = [x for x in CIDADES if x["estado"] == c["estado"] and x["slug"] != c["slug"]]
    outras = irmas + [x for x in CIDADES if x["estado"] != c["estado"]][: max(0, 6 - len(irmas))]
    outras_html = "\n".join(f'          <li><a href="{cidade_url(x)}">{E(x["nome"])}</a></li>' for x in outras[:8])

    atendimento = (
        "Presencial ou online" if c["presencial"] else "100% online"
    )
    fuso_frase = fuso_txt(est["fuso"], c["nome"])
    faq = c["faq"] + [FAQ_GERAL_PRAZO]

    body = f"""    <section class="kp-hero" aria-labelledby="h1">
      <div class="container">
        {g.breadcrumb_html(trail)}
        <p class="kp-eyebrow">{E(c['nome'])} · {E(c['uf'])}</p>
        <h1 class="kp-h1" id="h1">Criação de sites em <em>{E(c['nome'])}</em></h1>
        <p class="kp-lead">{E(c['desc'])}</p>
{g.acoes(msg, ('/portfolio.html', 'Ver portfólio'))}
        <ul class="kp-badges">
          <li>{E(atendimento)}</li>
          <li>A partir de R$ 1.297</li>
          <li>Entrega de 15 a 30 dias</li>
        </ul>
      </div>
    </section>

    <section class="kp-section" aria-labelledby="mercado-t">
      <div class="container kp-split">
        <div><h2 class="kp-h2" id="mercado-t">Fazer site para empresa de {E(c['nome'])}</h2></div>
        <div class="kp-prose">
{_prose(c['economia'])}
        </div>
      </div>
    </section>

    <section class="kp-section" aria-labelledby="seg-t">
      <div class="container">
        <div class="kp-head"><h2 class="kp-h2" id="seg-t">Quem mais contrata site em {E(c['nome'])}</h2></div>
        <div class="kp-grid">
{_cards(g, c['segmentos'])}
        </div>
      </div>
    </section>

    <section class="kp-section" aria-labelledby="como-t">
      <div class="container">
        <div class="kp-head">
          <h2 class="kp-h2" id="como-t">{'Do café na empresa ao site no ar' if c['presencial'] else 'Do primeiro contato ao site no ar'}</h2>
          <p class="kp-sub">{E(fuso_frase)}</p>
        </div>
        <div class="kp-grid kp-grid--4">
{_etapas(g)}
        </div>
      </div>
    </section>

    <section class="kp-section" aria-labelledby="faq-t">
      <div class="container">
        <div class="kp-head"><h2 class="kp-h2" id="faq-t">Perguntas frequentes em {E(c['nome'])}</h2></div>
{g.faq_html(faq)}
      </div>
    </section>

    <section class="kp-section" aria-labelledby="mais-t">
      <div class="container">
        <div class="kp-head">
          <h2 class="kp-h2" id="mais-t">Serviços e outras cidades</h2>
          <p class="kp-sub">Veja também a página de <a class="kp-link" href="{estado_url(est)}">criação de sites {E(est['prep'])} {E(est['nome'])}</a>.</p>
        </div>
        <ul class="kp-links">
{_servicos_links(g)}
        </ul>
        <div class="kp-region">
          <h3>Outras cidades</h3>
          <ul class="kp-links">
{outras_html}
          </ul>
        </div>
      </div>
    </section>

{g.cta(f'Vamos fazer o site da sua empresa <em style="font-style:normal;color:var(--c-accent)">em {E(c["nome"])}</em>?', 'Manda uma mensagem contando o que sua empresa faz. A resposta vem pelo WhatsApp.', msg)}"""

    area = {"@type": "City", "name": c["nome"],
            "containedInPlace": {"@type": "State", "name": est["nome"]}}
    graph = [
        {"@type": "WebPage", "@id": g.SITE + path, "url": g.SITE + path, "name": title, "description": c["desc"],
         "inLanguage": "pt-BR", "isPartOf": {"@id": g.SITE + "/#website"}},
        g.breadcrumb_schema(trail),
        {"@type": "Service", "name": f"Criação de sites em {c['nome']}", "serviceType": "Criação de sites",
         "provider": g.org_ref(), "areaServed": area, "url": g.SITE + path,
         "offers": {"@type": "Offer", "priceCurrency": "BRL", "price": "1297", "url": g.SITE + "/planos.html"}},
        g.faq_schema(faq),
    ]
    return g.page(path, title, c["desc"], body, graph, wpp_msg=msg)


def gerar_regioes(g):
    out = []
    for e in ESTADOS:
        out.append(("estado", gerar_estado(g, e)))
    for c in CIDADES:
        out.append(("cidade", gerar_cidade(g, c)))
    return out


def hub_regioes_html(g):
    E = g.E
    blocos = []
    for reg in REGIOES_ORDEM:
        ests = sorted([e for e in ESTADOS if e["regiao"] == reg], key=lambda x: x["nome"])
        lis = "\n".join(f'            <li><a href="{estado_url(e)}">{E(e["nome"])}</a></li>' for e in ests)
        blocos.append(f"""        <div class="kp-region">
          <h3>{E(reg)}</h3>
          <ul class="kp-links">
{lis}
          </ul>
        </div>""")
    cids = "\n".join(f'            <li><a href="{cidade_url(c)}">{E(c["nome"])} ({E(c["uf"])})</a></li>' for c in CIDADES)
    return f"""
    <section class="kp-section" aria-labelledby="estados-t">
      <div class="container">
        <div class="kp-head">
          <h2 class="kp-h2" id="estados-t">Escolha seu estado</h2>
          <p class="kp-sub">Cada página fala do mercado local, dos segmentos que mais procuram site e de como fica o atendimento na sua região.</p>
        </div>
{chr(10).join(blocos)}
        <div class="kp-region">
          <h3>Cidades</h3>
          <ul class="kp-links">
{cids}
          </ul>
        </div>
      </div>
    </section>
"""
