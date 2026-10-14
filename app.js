(function () {
  const RULES = window.RULES, CC = window.CC;
  const byCode = Object.fromEntries(RULES.map((r) => [r.code, r]));
  const $ = (id) => document.getElementById(id);

  // Country picker
  const pick = $("pick"), card = $("card");
  function showCountry(code) {
    const r = byCode[code];
    card.innerHTML = CC.countryCard(r, window.CHECKED) + `<p class="note"><a href="c/${r.slug}.html">Permanent page for ${CC.esc(r.name)}</a></p>`;
  }
  pick.addEventListener("change", () => showCountry(pick.value));

  // List checker
  const GENERIC = new Set(("info contact hello hi sales support office admin team mail email kontakt contacto contatto contatti bonjour hola hallo post service " +
    "kundenservice kundservice enquiries inquiries press presse marketing hr jobs careers billing accounts orders order shop booking bookings reception " +
    "secretariat sekretariat help customerservice customercare care general welcome web webmaster postmaster media pr partners partnerships business " +
    "commercial vendas ventas vente verkauf buero biuro kontor legal privacy datenschutz finance invoice invoices rechnung purchasing procurement einkauf " +
    "achat compras news newsletter feedback studio agency hq company direction direktion management ask connect getintouch reservations sav serviceclient " +
    "clientes atencion boutique commande bestellung tienda").split(" "));
  const FREEMAIL = new Set(("gmail.com googlemail.com yahoo.com yahoo.co.uk yahoo.fr yahoo.de yahoo.es yahoo.it outlook.com hotmail.com hotmail.co.uk hotmail.fr " +
    "hotmail.de hotmail.it hotmail.es live.com msn.com icloud.com me.com mac.com aol.com gmx.de gmx.net gmx.at gmx.ch web.de t-online.de freenet.de proton.me " +
    "protonmail.com orange.fr free.fr laposte.net sfr.fr wanadoo.fr libero.it virgilio.it tiscali.it alice.it btinternet.com sky.com telia.com bluewin.ch wp.pl " +
    "o2.pl onet.pl interia.pl ziggo.nl kpnmail.nl telenet.be skynet.be eircom.net bigpond.com shaw.ca rogers.com mail.com yandex.com zoho.com fastmail.com " +
    "hey.com tutanota.com tuta.io pm.me").split(" "));
  // Two-letter endings that are used as generic domains, not as a country signal.
  const GENERIC_CC = new Set("io co ai me tv cc eu gg so to fm ly sh im is vc ws".split(" "));

  const tldToCode = {};
  RULES.forEach((r) => r.tlds.forEach((t) => (tldToCode[t] = r.code)));
  const nameToCode = {};
  RULES.forEach((r) => { nameToCode[r.name.toUpperCase()] = r.code; });
  Object.assign(nameToCode, {
    "GREAT BRITAIN": "UK", "ENGLAND": "UK", "SCOTLAND": "UK", "WALES": "UK", "USA": "US", "UNITED STATES OF AMERICA": "US",
    "DEUTSCHLAND": "DE", "ESPAÑA": "ES", "ESPANA": "ES", "ITALIA": "IT", "NEDERLAND": "NL", "HOLLAND": "NL", "THE NETHERLANDS": "NL",
    "SVERIGE": "SE", "DANMARK": "DK", "ÖSTERREICH": "AT", "OSTERREICH": "AT", "POLSKA": "PL", "SCHWEIZ": "CH", "SUISSE": "CH",
    "BELGIQUE": "BE", "BELGIË": "BE", "BELGIE": "BE", "IRELAND": "IE", "FRANCE": "FR",
    "CZECHIA": "CZ", "ČESKO": "CZ", "CESKO": "CZ", "NORGE": "NO", "SUOMI": "FI", "EESTI": "EE", "LATVIJA": "LV", "LËTZEBUERG": "LU", "LUXEMBURG": "LU", "SLOVENSKO": "SK", "SLOVENIJA": "SI", "HRVATSKA": "HR", "ELLADA": "GR", "HELLAS": "GR", "KYPROS": "CY", "BALGARIYA": "BG", "БЪЛГАРИЯ": "BG"
  });
  const codeAlias = { GB: "UK", GBR: "UK", USA: "US" };
  RULES.forEach((r) => (codeAlias[r.code] = r.code));

  const EMAIL = /[A-Z0-9._%+'-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
  const TYPE_LABEL = { named: "Named person", generic: "Generic address", personal: "Personal mailbox" };
  const WHY = {
    ok: (n) => `No prior consent needed in ${n} for this kind of address. Identify yourself and offer an opt-out.`,
    cond: (n) => `Allowed in ${n} only in specific cases. Read the conditions before sending.`,
    consent: (n) => `Prior consent required in ${n} for this kind of address.`,
    unknown: (n) => `Not verified for this kind of address in ${n}.`
  };

  function cells(line) {
    return line.split(/[,;\t]/).map((c) => c.trim().replace(/^"|"$/g, "").trim());
  }

  function classify(text, fallback) {
    const lines = text.split(/\r?\n/).filter((l) => l.trim());
    let countryCol = -1, sourceCol = -1;
    if (lines.length && !EMAIL.test(lines[0])) {
      // Where the address came from: published by the company itself, or found by a vendor.
      sourceCol = cells(lines[0]).map((c) => c.toLowerCase().replace(/[\s_.-]+/g, "")).findIndex((c) => /^(source|addresssource|emailsource|contactsource|origin|published)$/.test(c));
      const header = cells(lines[0]).map((c) => c.toLowerCase().replace(/[\s_.-]+/g, ""));
      // Exports from lead tools name the column in many ways: countryCode, country_code, company_country, location.country...
      const exact = header.findIndex((c) => /^(country|countrycode|countryname|pays|land|pa[ií]s|paese|kraj)$/.test(c));
      countryCol = exact >= 0 ? exact : header.findIndex((c) => /(country|countrycode)$/.test(c) && !/^(phone|tel)/.test(c));
    }
    const seen = new Set(), rows = [];
    for (const line of lines) {
      const m = line.match(EMAIL);
      if (!m) continue;
      const email = m[0].toLowerCase();
      if (seen.has(email)) continue;
      seen.add(email);
      const [local, domain] = email.split("@");
      const parts = cells(line);

      let code = null, how = "";
      if (countryCol >= 0 && parts[countryCol]) {
        const v = parts[countryCol].toUpperCase();
        code = codeAlias[v] || nameToCode[v] || null;
        how = code ? "country column" : "";
        if (!code) { rows.push(row(email, null, `"${parts[countryCol]}" is not covered yet`, null)); continue; }
      }
      if (!code) {
        const hit = parts.find((c) => nameToCode[c.toUpperCase()]);
        if (hit) { code = nameToCode[hit.toUpperCase()]; how = "country in row"; }
      }
      const personal = FREEMAIL.has(domain);
      if (!code && !personal) {
        const tld = domain.split(".").pop();
        if (tldToCode[tld]) { code = tldToCode[tld]; how = `guessed from .${tld}`; }
        else if (tld.length === 2 && !GENERIC_CC.has(tld)) { rows.push(row(email, null, `.${tld} looks like a country that is not covered yet`, null)); continue; }
      }
      if (!code && fallback) { code = fallback; how = "default country"; }
      const type = personal ? "personal" : GENERIC.has(local.replace(/[._-]/g, "")) || GENERIC.has(local) ? "generic" : "named";
      if (!code) { rows.push(row(email, null, "Country unknown. Add a country column or set a default.", type)); continue; }
      rows.push(row(email, code, how, type, sourceCol >= 0 ? sourceOf(parts[sourceCol]) : ""));
    }
    return rows;
  }

  // "published" = the company put this address out itself (website, imprint, register);
  // "vendor" = found, enriched, guessed or bought. Anything else leaves the verdict as it is.
  function sourceOf(v) {
    v = (v || "").toLowerCase().trim();
    if (!v) return "";
    if (/^(yes|true|1|published|public|website|site|web|own site|company site|contact page|imprint|impressum|register|directory)$/.test(v) || /publish|website|contact page|imprint|impressum/.test(v)) return "published";
    if (/^(no|false|0)$/.test(v) || /vendor|enrich|apollo|zoominfo|hunter|clearbit|lusha|apify|scrap|guess|pattern|bought|purchas|database|finder|linkedin/.test(v)) return "vendor";
    return "";
  }
  const SOURCE_NOTE = { published: "published by the company", vendor: "found by a tool, not published by the company" };

  function row(email, code, how, type, src) {
    const r = code ? byCode[code] : null;
    const override = r && type && src && r.bySource && r.bySource[src] && r.bySource[src][type];
    const verdict = override || (r && type ? r[type] : "unknown");
    if (override) how = `${how}; address ${SOURCE_NOTE[src]}`;
    return {
      email, code: code || "", how, type: type || "", verdict, src: src || "",
      why: r ? WHY[verdict](r.name) + (override ? ` In ${r.name} this depends on whether the company published the address.` : "") : how,
      slug: r ? r.slug : "", source: r ? r.sources[0].url : ""
    };
  }

  const input = $("list"), out = $("results"), fallback = $("fallback"), dl = $("download");
  let last = [];

  // Anonymous usage events: only the event name is sent, never the list.
  function track(name) {
    try {
      if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: name, title: name, event: true });
    } catch (e) {}
  }

  function run(source) {
    track(source);
    last = classify(input.value, fallback.value);
    if (!last.length) { out.innerHTML = `<p class="note">No email addresses found.</p>`; dl.disabled = true; return; }
    const n = { ok: 0, cond: 0, consent: 0, unknown: 0 };
    last.forEach((r) => n[r.verdict]++);
    const shown = last.slice(0, 500);
    out.innerHTML = `
      <div class="summary"><span class="count">${last.length} addresses:</span>
        ${["ok", "cond", "consent", "unknown"].filter((k) => n[k]).map((k) => `<span class="chip ${k}">${n[k]} · ${CC.LABEL[k]}</span>`).join("")}
      </div>
      <div class="tablewrap"><table>
        <thead><tr><th>Email</th><th>Country</th><th class="hide-s">Type</th><th>Verdict</th><th>Why</th></tr></thead>
        <tbody>${shown.map((r) => `<tr>
          <td class="email">${CC.esc(r.email)}</td>
          <td>${r.code ? `<a href="c/${r.slug}.html">${r.code}</a>` : "?"}${r.code && r.how ? `<div class="quality">${CC.esc(r.how)}</div>` : ""}</td>
          <td class="hide-s">${CC.esc(TYPE_LABEL[r.type] || "")}</td>
          <td>${CC.chip(r.verdict)}</td>
          <td class="why">${CC.esc(r.why)}</td>
        </tr>`).join("")}</tbody>
      </table></div>
      ${last.length > shown.length ? `<p class="note">Showing the first ${shown.length}. The CSV has all ${last.length}.</p>` : ""}`;
    dl.disabled = false;
  }

  $("run").addEventListener("click", () => run("check-list"));
  $("sample").addEventListener("click", () => {
    input.value = [
      "email,company,country",
      "info@beispiel-shop.de,Beispiel GmbH,Germany",
      "marie.dupont@exemple.fr,Exemple SAS,France",
      "contact@exemple.fr,Exemple SAS,France",
      "hola@ejemplo.es,Ejemplo SL,Spain",
      "tom.baker@example.co.uk,Example Ltd,United Kingdom",
      "tombakerplumbing@gmail.com,Tom Baker Plumbing,United Kingdom",
      "anna@exempel.se,Exempel AB,Sweden",
      "sales@example.com,Example Inc,United States",
      "jan@voorbeeld.nl,Voorbeeld BV,Netherlands",
      "kontor@eksempel.dk,Eksempel ApS,Denmark"
    ].join("\n");
    run("check-sample");
  });
  $("file").addEventListener("change", (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => { input.value = reader.result; run("check-file"); };
    reader.readAsText(f);
  });
  $("want").addEventListener("click", () => {
    track("want-report");
    $("want").disabled = true;
    $("want").textContent = "Noted, thank you";
    $("want-note").innerHTML = 'Counted. If you want to hear when it is ready, or tell me what the report should include, write to <a href="https://x.com/phaz_dev" rel="noopener" target="_blank">@phaz_dev</a>.';
  });
  dl.addEventListener("click", () => {
    track("download-csv");
    const q = (s) => `"${String(s).replace(/"/g, '""')}"`;
    const csv = ["email,country,country_source,address_type,address_source,verdict,reason,source"]
      .concat(last.map((r) => [r.email, r.code, r.how, r.type, r.src, CC.LABEL[r.verdict], r.why, r.source].map(q).join(",")))
      .join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "cold-email-check.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  });
})();
