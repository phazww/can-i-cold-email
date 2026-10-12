// Generates index.html and c/<slug>.html from data.js. Run: node build.js
const fs = require("fs");
const path = require("path");
globalThis.window = globalThis;
require("./data.js");
require("./render.js");
const { RULES, CHECKED, CC } = globalThis;
const SITE = "Can I cold email?";
const BASE = "https://phazww.github.io/can-i-cold-email/";
const sorted = [...RULES].sort((a, b) => a.name.localeCompare(b.name));

const head = (title, desc, root, page) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${CC.esc(title)}</title>
<meta name="description" content="${CC.esc(desc)}">
<link rel="canonical" href="${BASE}${page}">
<meta property="og:type" content="website">
<meta property="og:title" content="${CC.esc(title)}">
<meta property="og:description" content="${CC.esc(desc)}">
<meta property="og:url" content="${BASE}${page}">
<link rel="stylesheet" href="${root}style.css">
</head>
<body>
<div class="wrap">
<header class="site">
  <a class="brand" href="${root}index.html">${SITE} <span>B2B rules by country</span></a>
  <nav class="site"><a href="${root}index.html#check">Check a list</a><a href="${root}index.html#report">Report</a><a href="${root}index.html#countries">Countries</a><a href="${root}index.html#method">Method</a></nav>
</header>`;

const foot = `
<footer class="site">
  <p>This is a research summary, not legal advice. Rules are those of the recipient's country and cover the first unsolicited marketing email to a business recipient. Data protection law (GDPR, UK GDPR) applies separately whenever an address identifies a person.</p>
  <p>Last checked ${CHECKED}. Found a mistake or need another country? Write to <a href="https://x.com/phaz_dev" rel="noopener">@phaz_dev</a>.</p>
  <p>Visits are counted with GoatCounter, without cookies. Lists you check are never sent anywhere.</p>
</footer>
</div>
<script data-goatcounter="https://phaz.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>`;

const table = (root) => `
<div class="tablewrap"><table>
  <thead><tr><th>Country</th><th>Named person</th><th>Generic address</th><th class="hide-s">Personal mailbox</th><th class="hide-s">Source</th></tr></thead>
  <tbody>${sorted.map((r) => `
    <tr>
      <td class="country"><a href="${root}c/${r.slug}.html">${CC.esc(r.name)}</a></td>
      <td>${CC.chip(r.named)}</td>
      <td>${CC.chip(r.generic)}</td>
      <td class="hide-s">${CC.chip(r.personal)}</td>
      <td class="hide-s"><span class="quality ${r.quality}">${r.quality === "primary" ? "Law or regulator" : "Commentary only"}</span></td>
    </tr>`).join("")}
  </tbody>
</table></div>`;

const first = RULES.find((r) => r.code === "DE");
const nPrimary = RULES.filter((r) => r.quality === "primary").length;

const index = `${head(
  `${SITE} B2B cold email rules by country, with sources`,
  `Check whether you may send a cold email to a company in ${RULES.length} countries. Every answer links to the law or the regulator. Paste a lead list and get a verdict per address.`,
  "",
  ""
)}
<main>
<div class="hero">
  <h1>Can I cold email a company in that country?</h1>
  <p class="lede">The answer changes at every border. Germany, Spain and Italy want consent first. France, Sweden and the US do not. Here are the rules for ${RULES.length} countries, each linked to the law or the regulator.</p>
  <div class="pick">
    <label for="pick">The recipient is in</label>
    <select id="pick">${sorted.map((r) => `<option value="${r.code}"${r.code === first.code ? " selected" : ""}>${CC.esc(r.name)}</option>`).join("")}</select>
  </div>
  <div class="card" id="card">${CC.countryCard(first, CHECKED)}<p class="note"><a href="c/${first.slug}.html">Permanent page for ${CC.esc(first.name)}</a></p></div>
</div>

<section id="check">
  <h2>Check a lead list</h2>
  <p class="sub">Paste email addresses or a CSV export. Each address gets a verdict based on the recipient's country and the kind of address: a named person, a generic mailbox like info@, or a personal mailbox.</p>
  <textarea id="list" placeholder="email,company,country&#10;info@example.de,Example GmbH,Germany&#10;jane.doe@example.co.uk,Example Ltd,United Kingdom" spellcheck="false"></textarea>
  <div class="row">
    <button id="run">Check list</button>
    <button id="sample" class="ghost">Try a sample</button>
    <button id="download" class="ghost" disabled>Download CSV</button>
    <label>or open a file <input type="file" id="file" accept=".csv,.txt,text/csv,text/plain"></label>
  </div>
  <div class="row">
    <label for="fallback">If the country is unknown (.com addresses), assume</label>
    <select id="fallback"><option value="">nothing, mark as unknown</option>${sorted.map((r) => `<option value="${r.code}">${CC.esc(r.name)}</option>`).join("")}</select>
  </div>
  <p class="privacy">Your list never leaves this page. The check runs in your browser and no address is uploaded.</p>
  <div id="results"></div>
</section>

<section id="report">
  <h2>Campaign report</h2>
  <p class="sub">For teams that send to several countries at once and need something to show a client or a manager.</p>
  <div class="card offer">
    <div class="offer-main">
      <p class="rule">Upload the lead list for one campaign and get a report back:</p>
      <ul class="must">
        <li>The list split into three files: send, send only with conditions, do not send</li>
        <li>For every country in the list: what the law allows, with the source</li>
        <li>What each email must contain in that country: sender identity, address, opt-out wording</li>
        <li>A one-page summary you can forward as it is</li>
      </ul>
    </div>
    <div class="offer-side">
      <div class="price">$29 <span>per campaign</span></div>
      <button id="want">I want this</button>
      <p class="privacy" id="want-note">Not built yet. The button only tells me someone is interested. Nothing is charged and nothing is collected.</p>
    </div>
  </div>
</section>

<section id="countries">
  <h2>All ${RULES.length} countries</h2>
  <p class="sub">The verdict is for the first marketing email to someone who is not your customer and has not asked to hear from you.</p>
  ${table("")}
</section>

<section id="method">
  <h2>Method and limits</h2>
  <ul class="method">
    <li>Each country was checked on ${CHECKED} against the text of the law or the regulator's own guidance where it could be opened. ${nPrimary === RULES.length ? `All ${RULES.length} countries are checked that way.` : `${nPrimary} of ${RULES.length} countries are checked that way. The rest are marked "Commentary only".`}</li>
    <li>"No consent needed" never means no rules. Every country still requires a real sender identity and a working way to opt out.</li>
    <li>The country is taken from your list. If there is no country column, it is guessed from the domain ending (.de, .fr) and labelled as a guess.</li>
    <li>An address is treated as generic when the part before @ is a role word such as info, contact or sales, and as personal when the domain is a consumer mail provider such as gmail.com.</li>
    <li>Not covered: existing customers, newsletters people signed up for, phone, SMS, LinkedIn, and the sender's own national rules.</li>
  </ul>
</section>
</main>
${foot}
<script src="data.js"></script>
<script src="render.js"></script>
<script src="app.js"></script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, "index.html"), index);
fs.mkdirSync(path.join(__dirname, "c"), { recursive: true });

const short = { ok: "Yes, without prior consent", cond: "Only in specific cases", consent: "No, not without prior consent", unknown: "Not verified" };
for (const r of RULES) {
  const page = `${head(
    `Is B2B cold email legal in ${r.name}? Rules and sources`,
    `${r.name}: ${short[r.named]} for a named person at a company. ${r.rule}`.slice(0, 300),
    "../",
    `c/${r.slug}.html`
  )}
<main>
<p class="crumb"><a href="../index.html#countries">All countries</a> / ${CC.esc(r.name)}</p>
<h1>Is B2B cold email legal in ${CC.esc(r.name)}?</h1>
<p class="lede">${r.named === "unknown" ? "For a named person at a company the answer is not verified yet." : `${short[r.named]} when you write to a named person at a company.`} ${r.generic !== r.named ? `For a generic address such as info@: ${short[r.generic].toLowerCase()}.` : "The same applies to generic addresses such as info@."}</p>
<div class="card">${CC.countryCard(r, CHECKED)}</div>
<p class="cta"><a href="../index.html#check">Check a whole lead list</a></p>
</main>
${foot}
</body>
</html>
`;
  fs.writeFileSync(path.join(__dirname, "c", `${r.slug}.html`), page);
}
const urls = [BASE, ...RULES.map((r) => `${BASE}c/${r.slug}.html`)];
fs.writeFileSync(
  path.join(__dirname, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${u}</loc><lastmod>${CHECKED}</lastmod></url>`).join("\n")}\n</urlset>\n`
);
fs.writeFileSync(path.join(__dirname, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${BASE}sitemap.xml\n`);
console.log(`Built index.html, ${RULES.length} country pages, sitemap.xml and robots.txt.`);
