"""Páginas por segmento, guia de preço e página de freelancer. Chamado por gerar.py."""
from segmentos import SEGMENTOS

HUB = "/segmentos/"


def _cards(g, itens, num=False):
    E = g.E
    out = []
    for i, (t, d) in enumerate(itens):
        n = f'<span class="kp-num">{i + 1:02d}</span>' if num else ""
        out.append(f'          <div class="kp-card">{n}<h3>{E(t)}</h3><p>{E(d)}</p></div>')
    return "\n".join(out)


def _lis(itens):
    return "\n".join(f"            <li>{i}</li>" for i in itens)


def _prose(ps):
    return "\n".join(f"          <p>{p}</p>" for p in ps)


def _outros_segmentos(g, atual=None):
    E = g.E
    return "\n".join(
        f'          <li><a href="/{s["slug"]}/">Site para {E(s["nome"].lower())}</a></li>'
        for s in SEGMENTOS if s["slug"] != atual
    )


def gerar_segmento(g, s):
    E = g.E
    path = f"/{s['slug']}/"
    trail = [("Início", "/"), ("Sites por segmento", HUB), (s["nome"], path)]
    msg = f"Olá! Vim pelo site da Kimera Co. Tenho um(a) {s['singular']} e quero um orçamento de site."
    figura = ""
    if s.get("imagem"):
        src, alt, cap = s["imagem"]
        figura = f"""        <figure class="kp-figure" style="margin-bottom:var(--sp-20)">
          <img src="{src}" alt="{E(alt)}" width="960" height="720" loading="lazy" decoding="async">
          <figcaption>{E(cap)}</figcaption>
        </figure>"""
    servicos = "\n".join(f'          <li><a href="/{x["slug"]}/">{E(x["menu"])}</a></li>' for x in g.SERVICOS)
    body = f"""    <section class="kp-hero" aria-labelledby="h1">
      <div class="container">
        {g.breadcrumb_html(trail)}
        <p class="kp-eyebrow">Site para {E(s['nome'].lower())}</p>
        <h1 class="kp-h1" id="h1">{s['h1']}</h1>
        <p class="kp-lead">{E(s['lead'])}</p>
{g.acoes(msg)}
        <ul class="kp-badges">
          <li>Atendimento 100% online</li>
          <li>Todo o Brasil</li>
          <li>Orçamento pelo WhatsApp</li>
        </ul>
      </div>
    </section>

    <section class="kp-section" aria-labelledby="ctx-t">
      <div class="container kp-split">
        <div><h2 class="kp-h2" id="ctx-t">Como o cliente escolhe um(a) {E(s['singular'])}</h2></div>
        <div class="kp-prose">
{_prose(s['contexto'])}
        </div>
      </div>
    </section>

    <section class="kp-section" aria-labelledby="est-t">
      <div class="container">
        <div class="kp-head">
          <h2 class="kp-h2" id="est-t">As páginas que o site precisa ter</h2>
          <p class="kp-sub">Ponto de partida que ajustamos ao seu caso na conversa inicial.</p>
        </div>
        <div class="kp-grid">
{_cards(g, s['estrutura'], num=True)}
        </div>
      </div>
    </section>

    <section class="kp-section" aria-labelledby="reg-t">
      <div class="container kp-split">
        <div>
{figura}
          <div class="kp-card">
            <h3>{E(s['regras_titulo'])}</h3>
            <ul class="kp-list" style="margin-top:var(--sp-20)">
{_lis(s['regras'])}
            </ul>
          </div>
        </div>
        <div>
          <h2 class="kp-h2" id="reg-t">Erros comuns que fazem perder cliente</h2>
          <ul class="kp-list" style="margin-top:var(--sp-24)">
{_lis(s['erros'])}
          </ul>
          <div class="kp-prose" style="margin-top:var(--sp-32)"><p><strong>Qual plano escolher:</strong> {E(s['plano'])} <a href="/planos.html">Ver planos</a>.</p></div>
        </div>
      </div>
    </section>

    <section class="kp-section" aria-labelledby="faq-t">
      <div class="container">
        <div class="kp-head"><h2 class="kp-h2" id="faq-t">Perguntas frequentes</h2></div>
{g.faq_html(s['faq'])}
      </div>
    </section>

    <section class="kp-section" aria-labelledby="mais-t">
      <div class="container">
        <div class="kp-head">
          <h2 class="kp-h2" id="mais-t">Outros segmentos e serviços</h2>
          <p class="kp-sub">Também atendemos por região: <a class="kp-link" href="/criacao-de-sites/">veja como funciona em cada estado</a>.</p>
        </div>
        <ul class="kp-links">
{_outros_segmentos(g, s['slug'])}
        </ul>
        <div class="kp-region">
          <h3>Serviços</h3>
          <ul class="kp-links">
{servicos}
          </ul>
        </div>
      </div>
    </section>

{g.cta(f'Vamos fazer o site do seu <em style="font-style:normal;color:var(--c-accent)">{E(s["singular"])}</em>?', 'Conta como funciona o seu negócio. A resposta vem pelo WhatsApp, com caminho e valor.', msg)}"""
    graph = [
        {"@type": "WebPage", "@id": g.SITE + path, "url": g.SITE + path, "name": s["title"], "description": s["desc"],
         "inLanguage": "pt-BR", "isPartOf": {"@id": g.SITE + "/#website"}},
        g.breadcrumb_schema(trail),
        {"@type": "Service", "name": f"Criação de site para {s['nome'].lower()}", "serviceType": "Criação de sites",
         "audience": {"@type": "BusinessAudience", "name": s["nome"]},
         "provider": g.org_ref(), "areaServed": {"@type": "Country", "name": "Brasil"}, "url": g.SITE + path},
        g.faq_schema(s["faq"]),
    ]
    return g.page(path, s["title"], s["desc"], body, graph, wpp_msg=msg)


def gerar_hub_segmentos(g):
    E = g.E
    path = HUB
    trail = [("Início", "/"), ("Sites por segmento", path)]
    title = "Sites por Segmento: Advogados, Clínicas, Restaurantes e Mais | Kimera Co."
    desc = "Criação de sites pensados para cada tipo de negócio: advogados, clínicas, dentistas, psicólogos, contabilidade, restaurantes, imobiliárias e oficinas."
    msg = "Olá! Vim pelo site da Kimera Co. e quero um orçamento de site."
    cards = "\n".join(
        f'          <a class="kp-card" href="/{s["slug"]}/" style="display:block"><h3>Site para {E(s["nome"].lower())}</h3><p>{E(s["lead"].split(". ")[0])}.</p></a>'
        for s in SEGMENTOS
    )
    body = f"""    <section class="kp-hero" aria-labelledby="h1">
      <div class="container">
        {g.breadcrumb_html(trail)}
        <p class="kp-eyebrow">Sites por segmento</p>
        <h1 class="kp-h1" id="h1">Cada tipo de negócio <em>pede um site diferente</em></h1>
        <p class="kp-lead">Um escritório de advocacia segue as regras da OAB, uma clínica precisa do CRM à vista, um restaurante vive do cardápio no celular. Escolha o seu segmento e veja o que funciona no seu caso.</p>
{g.acoes(msg)}
      </div>
    </section>

    <section class="kp-section" aria-labelledby="seg-t">
      <div class="container">
        <div class="kp-head"><h2 class="kp-h2" id="seg-t">Escolha o seu segmento</h2></div>
        <div class="kp-grid">
{cards}
        </div>
        <p class="kp-sub" style="margin-top:var(--sp-40)">Seu segmento não está na lista? A gente atende qualquer tipo de empresa. <a class="kp-link" href="{E(g.wpp(msg))}" target="_blank" rel="noopener noreferrer">Chama no WhatsApp</a>.</p>
      </div>
    </section>

{g.cta('Seu negócio, <em style="font-style:normal;color:var(--c-accent)">seu site</em>', 'Conta o que sua empresa faz. A resposta vem pelo WhatsApp.', msg)}"""
    graph = [
        {"@type": "CollectionPage", "@id": g.SITE + path, "url": g.SITE + path, "name": title, "description": desc,
         "inLanguage": "pt-BR", "isPartOf": {"@id": g.SITE + "/#website"},
         "hasPart": [{"@type": "WebPage", "url": g.SITE + f"/{s['slug']}/", "name": s["title"]} for s in SEGMENTOS]},
        g.breadcrumb_schema(trail),
    ]
    return g.page(path, title, desc, body, graph, wpp_msg=msg)


PRECO_FAQ = [
    ("Quanto custa um site simples?", "Depende do que \"simples\" significa no seu caso: quantas páginas, quem escreve os textos, se entra identidade visual. Por isso a Kimera não trabalha com tabela fixa: você conta o que precisa e recebe uma proposta com valor fechado. Fora a criação, há o domínio, de cerca de R$ 40 por ano no Registro.br para .com.br."),
    ("Quanto custa manter um site por mês?", "Depende de como ele foi feito. Sites estáticos podem ficar em hospedagens gratuitas ou baratas; sites com painel ou loja têm mensalidade de hospedagem ou de plataforma. Se quiser terceirizar atualizações e suporte, existe a manutenção mensal, orçada conforme o site."),
    ("Por que um site custa tão diferente de um lugar para outro?", "Porque o preço junta coisas diferentes: tema pronto ou design exclusivo, quem escreve os textos, quantas páginas, se tem loja, integrações, SEO e suporte. Dois orçamentos só são comparáveis quando incluem as mesmas coisas."),
    ("Site feito em Wix ou construtor pronto é mais barato?", "A mensalidade pode parecer menor, mas você paga para sempre, fica preso à plataforma e o resultado costuma ser mais lento e genérico. Para quem quer só testar uma ideia pode servir; para empresa que quer aparecer no Google, um site próprio costuma compensar."),
    ("Loja virtual custa quanto?", "Loja virtual tem orçamento próprio, porque o valor muda com a plataforma (Shopify, WooCommerce ou sob medida), o número de produtos e as integrações. Fora a criação, existe a mensalidade da plataforma e as taxas do meio de pagamento."),
    ("Como peço um orçamento na Kimera?", "Pelo WhatsApp: conte o que sua empresa faz, o que precisa no site e se já tem logo, textos e fotos. A resposta vem com escopo, prazo e valor fechado. O pagamento é 50% na entrada e 50% na entrega, por Pix, transferência ou cartão."),
]


def gerar_guia_preco(g):
    E = g.E
    path = "/quanto-custa-um-site/"
    trail = [("Início", "/"), ("Quanto custa um site", path)]
    title = "Quanto Custa um Site? O que Define o Preço e Como Comparar Orçamentos | Kimera Co."
    desc = "Quanto custa criar um site: o que faz o preço subir ou descer, os custos fixos (domínio, hospedagem, e-mail) e um checklist para comparar orçamentos sem cair em armadilha."
    msg = "Olá! Li o guia no site da Kimera Co. e quero um orçamento para o meu site."
    tabela = [
        ("Domínio .com.br", "Cerca de R$ 40 por ano", "Registro direto no Registro.br, no seu CPF ou CNPJ."),
        ("Hospedagem", "De gratuita a mensalidade", "Site estático pode ficar em hospedagem gratuita; site com painel ou loja precisa de servidor ou plataforma paga."),
        ("E-mail profissional", "Varia por provedor", "Google Workspace e Microsoft 365 cobram por conta; algumas hospedagens incluem caixas."),
        ("Criação do site", "Pagamento único, sob orçamento", "Muda com número de páginas, textos, identidade visual, integrações e suporte."),
        ("Manutenção", "Opcional, mensal", "Atualizações de conteúdo, backup, correções e suporte, para quem não quer mexer no site."),
    ]
    linhas = "\n".join(
        f"            <tr><th scope=\"row\">{E(a)}</th><td>{E(b)}</td><td>{E(c)}</td></tr>" for a, b, c in tabela
    )
    fatores = [
        ("Design exclusivo ou tema pronto", "Tema pronto é mais barato e mais rápido, mas fica com a cara de outros sites. Design exclusivo leva mais horas e diferencia a marca."),
        ("Número de páginas", "Cada página tem texto, layout e SEO próprios. Um site de 3 páginas e um de 15 são projetos bem diferentes."),
        ("Quem escreve os textos", "Texto pronto do cliente barateia. Copy escrita para vender e para o Google exige trabalho a mais."),
        ("Loja e integrações", "Pagamento, frete, nota fiscal, sistema de agenda ou ERP aumentam o escopo."),
        ("SEO e velocidade", "Fazer o site carregar rápido e estar pronto para o Google exige cuidado técnico que nem todo orçamento inclui."),
        ("Suporte depois da entrega", "Alguns preços baixos não incluem nenhum ajuste depois que o site vai ao ar."),
    ]
    checklist = [
        "O design é <strong>exclusivo</strong> ou é um tema pronto adaptado?",
        "Quantas páginas estão incluídas e quem escreve os textos?",
        "Domínio e hospedagem ficam no <strong>seu</strong> nome?",
        "O site sai otimizado para o Google (títulos, velocidade, Search Console)?",
        "Quantas rodadas de ajuste estão incluídas antes da entrega?",
        "O que acontece depois que o site vai ao ar: tem suporte? Por quanto tempo?",
        "Tem contrato com escopo, prazo e forma de pagamento?",
    ]
    lis = "\n".join(f"            <li>{i}</li>" for i in checklist)
    body = f"""    <section class="kp-hero" aria-labelledby="h1">
      <div class="container">
        {g.breadcrumb_html(trail)}
        <p class="kp-eyebrow">Guia · atualizado em 2026</p>
        <h1 class="kp-h1" id="h1">Quanto custa <em>um site profissional</em>?</h1>
        <p class="kp-lead">Resposta honesta: depende do que entra no projeto. Um site de três páginas com texto pronto e um site completo com identidade visual e loja são trabalhos muito diferentes. Este guia mostra o que define o preço, os custos que aparecem depois e como comparar orçamentos de lugares diferentes.</p>
{g.acoes(msg)}
      </div>
    </section>

    <section class="kp-section" aria-labelledby="tab-t">
      <div class="container">
        <div class="kp-head">
          <h2 class="kp-h2" id="tab-t">Os custos de ter um site, item por item</h2>
          <p class="kp-sub">Alguns são fixos e pagos direto por você; a criação é o que varia de um projeto para outro.</p>
        </div>
        <div class="kp-table-wrap">
          <table class="kp-table">
            <thead><tr><th scope="col">Item</th><th scope="col">Como é cobrado</th><th scope="col">Observação</th></tr></thead>
            <tbody>
{linhas}
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="kp-section" aria-labelledby="fat-t">
      <div class="container">
        <div class="kp-head">
          <h2 class="kp-h2" id="fat-t">O que faz o preço de um site subir ou descer</h2>
          <p class="kp-sub">Antes de comparar dois orçamentos, confira se eles incluem as mesmas coisas.</p>
        </div>
        <div class="kp-grid">
{_cards(g, fatores, num=True)}
        </div>
      </div>
    </section>

    <section class="kp-section" aria-labelledby="chk-t">
      <div class="container kp-split">
        <div>
          <h2 class="kp-h2" id="chk-t">7 perguntas para fazer antes de fechar qualquer orçamento</h2>
          <p class="kp-sub">Servem para a Kimera e para qualquer outro profissional. Se a resposta não estiver no orçamento, pergunte.</p>
        </div>
        <ul class="kp-list">
{lis}
        </ul>
      </div>
    </section>

    <section class="kp-section" aria-labelledby="ex-t">
      <div class="container kp-split">
        <div><h2 class="kp-h2" id="ex-t">Três projetos, três escopos</h2></div>
        <div class="kp-prose">
          <p><strong>Psicóloga que atende online.</strong> Início, sobre e contato, com 1 e-mail profissional e algumas artes para o Instagram. Projeto enxuto, pronto em cerca de duas semanas.</p>
          <p><strong>Escritório de contabilidade.</strong> Até 5 páginas (início, serviços, abertura de empresa, sobre e contato), identidade visual básica, e-mails da equipe, Google Analytics e WhatsApp integrado.</p>
          <p><strong>Clínica com várias especialidades.</strong> Uma página por especialidade, identidade visual com manual da marca, artes para redes sociais e suporte prioritário nos primeiros meses.</p>
          <p>Cada um recebe uma proposta diferente, com valor fechado antes de começar. Veja o que vem em cada pacote na página de <a href="/planos.html">planos</a>.</p>
        </div>
      </div>
    </section>

    <section class="kp-section" aria-labelledby="faq-t">
      <div class="container">
        <div class="kp-head"><h2 class="kp-h2" id="faq-t">Perguntas sobre preço e orçamento</h2></div>
{g.faq_html(PRECO_FAQ)}
      </div>
    </section>

{g.cta('Quer saber quanto fica <em style="font-style:normal;color:var(--c-accent)">o seu site</em>?', 'Manda o que sua empresa faz e o que precisa. A resposta vem pelo WhatsApp com escopo, prazo e valor fechado.', msg)}"""
    graph = [
        {"@type": "Article", "@id": g.SITE + path + "#artigo", "headline": "Quanto custa um site profissional?",
         "description": desc, "inLanguage": "pt-BR", "url": g.SITE + path, "datePublished": "2026-11-21",
         "dateModified": g.HOJE, "author": g.org_ref(), "publisher": g.org_ref(),
         "image": g.SITE + "/assets/img/og-kimera.jpg", "mainEntityOfPage": g.SITE + path},
        g.breadcrumb_schema(trail),
        g.faq_schema(PRECO_FAQ),
    ]
    return g.page(path, title, desc, body, graph, wpp_msg=msg)


FREELA_FAQ = [
    ("É melhor contratar freelancer ou agência para fazer site?", "Depende do projeto. Freelancer costuma ser mais barato e mais próximo, mas pode faltar processo e suporte. Agência tem estrutura, mas costuma custar mais e o projeto passa por várias pessoas. A Kimera fica no meio: você fala direto com quem faz, com contrato, prazo e suporte definidos."),
    ("Como saber se um freelancer de sites é confiável?", "Peça portfólio com sites no ar, confira se eles carregam rápido no celular, peça contrato com escopo e prazo, e confirme que domínio e hospedagem ficam no seu nome. Desconfie de quem fica com os acessos."),
    ("Freelancer de sites atende cliente de outra cidade?", "Atende. Site não precisa de visita: briefing, aprovação e entrega acontecem online. A Kimera tem base em Toledo (PR) e atende o Brasil inteiro assim."),
    ("Quanto cobra um freelancer para fazer um site?", "Varia muito com experiência e escopo. Na Kimera o valor é fechado antes de começar, depois de uma conversa sobre o que você precisa. Veja o guia de quanto custa um site para saber o que comparar entre orçamentos."),
    ("Os acessos do site ficam comigo?", "Sim. Domínio e hospedagem ficam no seu nome desde o começo. Você não fica refém de ninguém."),
]


def gerar_freelancer(g):
    E = g.E
    path = "/freelancer-de-sites/"
    trail = [("Início", "/"), ("Freelancer de sites", path)]
    title = "Freelancer de Criação de Sites com Contrato e Suporte | Kimera Co."
    desc = "Procurando freelancer para criar seu site? Na Kimera você fala direto com quem faz, com contrato, prazo, valor fechado e suporte. Atendimento online para todo o Brasil."
    msg = "Olá! Vim pelo site da Kimera Co. e procuro alguém para fazer o site da minha empresa."
    comp = [
        ("Freelancer comum", "Costuma cobrar menos e ter contato direto. O risco é sumir no meio do projeto, não ter contrato ou ficar com os acessos do seu site."),
        ("Agência grande", "Processo e equipe completos. Em compensação, custa mais e o projeto passa por atendimento, gerente e só depois por quem executa."),
        ("Kimera Co.", "Contato direto com quem desenha e programa, mas com contrato, prazo, valor fechado no orçamento, portfólio no ar e suporte depois da entrega."),
    ]
    checklist = [
        "Portfólio com sites <strong>no ar</strong>, não só imagens.",
        "Contrato com escopo, prazo e valor por escrito.",
        "Domínio e hospedagem registrados no <strong>seu</strong> nome.",
        "Layout apresentado para aprovação antes da programação.",
        "Site testado no celular e com velocidade boa no Lighthouse.",
        "Combinado claro sobre ajustes e suporte depois da entrega.",
    ]
    body = f"""    <section class="kp-hero" aria-labelledby="h1">
      <div class="container">
        {g.breadcrumb_html(trail)}
        <p class="kp-eyebrow">Freelancer de sites</p>
        <h1 class="kp-h1" id="h1">Freelancer de sites, <em>com a segurança de uma empresa</em></h1>
        <p class="kp-lead">Você quer falar direto com quem vai fazer o seu site, sem intermediário e sem o custo de uma agência grande. Mas também quer contrato, prazo e alguém que responda depois da entrega. É assim que a Kimera trabalha, com atendimento online para qualquer cidade do Brasil.</p>
{g.acoes(msg, ('/portfolio.html', 'Ver portfólio'))}
      </div>
    </section>

    <section class="kp-section" aria-labelledby="cmp-t">
      <div class="container">
        <div class="kp-head"><h2 class="kp-h2" id="cmp-t">Freelancer, agência ou Kimera?</h2></div>
        <div class="kp-grid">
{_cards(g, comp)}
        </div>
      </div>
    </section>

    <section class="kp-section" aria-labelledby="chk-t">
      <div class="container kp-split">
        <div>
          <h2 class="kp-h2" id="chk-t">Checklist antes de contratar qualquer pessoa para fazer seu site</h2>
          <p class="kp-sub">Vale para a Kimera e para qualquer outro profissional.</p>
        </div>
        <ul class="kp-list">
{_lis(checklist)}
        </ul>
      </div>
    </section>

    <section class="kp-section" aria-labelledby="como-t">
      <div class="container">
        <div class="kp-head"><h2 class="kp-h2" id="como-t">Como funciona com a Kimera</h2></div>
        <div class="kp-grid kp-grid--4">
{_cards(g, g.ETAPAS_REMOTO, num=True)}
        </div>
      </div>
    </section>

    <section class="kp-section" aria-labelledby="faq-t">
      <div class="container">
        <div class="kp-head"><h2 class="kp-h2" id="faq-t">Perguntas frequentes</h2></div>
{g.faq_html(FREELA_FAQ)}
        <p class="kp-sub" style="margin-top:var(--sp-32)">Quer comparar valores? Leia o guia <a class="kp-link" href="/quanto-custa-um-site/">quanto custa um site</a> ou veja os <a class="kp-link" href="/segmentos/">sites por segmento</a>.</p>
      </div>
    </section>

{g.cta('Fale direto <em style="font-style:normal;color:var(--c-accent)">com quem faz</em>', 'Manda uma mensagem contando o que sua empresa precisa. A resposta vem pelo WhatsApp.', msg)}"""
    graph = [
        {"@type": "WebPage", "@id": g.SITE + path, "url": g.SITE + path, "name": title, "description": desc,
         "inLanguage": "pt-BR", "isPartOf": {"@id": g.SITE + "/#website"}},
        g.breadcrumb_schema(trail),
        {"@type": "Service", "name": "Criação de sites", "serviceType": "Criação de sites", "provider": g.org_ref(),
         "areaServed": {"@type": "Country", "name": "Brasil"}, "url": g.SITE + path},
        g.faq_schema(FREELA_FAQ),
    ]
    return g.page(path, title, desc, body, graph, wpp_msg=msg)


def gerar_extras(g):
    out = [("hub-seg", gerar_hub_segmentos(g))]
    for s in SEGMENTOS:
        out.append(("segmento", gerar_segmento(g, s)))
    out.append(("guia", gerar_guia_preco(g)))
    out.append(("freela", gerar_freelancer(g)))
    return out
