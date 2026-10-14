// Shared between the build script (Node) and the page (browser).
(function (g) {
  const LABEL = { ok: "No consent needed", cond: "Only in specific cases", consent: "Consent first", unknown: "Not verified" };
  const TYPES = [
    { key: "named", who: "Named person at a company", eg: (d) => "jane.doe@company." + d },
    { key: "generic", who: "Generic company address", eg: (d) => "info@company." + d },
    { key: "personal", who: "Sole trader or personal mailbox", eg: () => "jane@gmail.com" }
  ];
  const EG_TLD = { UK: "co.uk", US: "com", AU: "com.au" };
  const TAG = { law: "Law", regulator: "Regulator", official: "Official", secondary: "Commentary" };

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const chip = (v) => `<span class="chip ${v}">${LABEL[v]}</span>`;
  const quality = (r) =>
    r.quality === "primary"
      ? `<span class="quality">Checked against the law or regulator</span>`
      : `<span class="quality secondary">Commentary only, not yet checked against the official text</span>`;

  function countryCard(r, checked) {
    const tld = EG_TLD[r.code] || r.tlds[0];
    return `
      <div class="verdicts">
        ${TYPES.map((t) => `
        <div class="verdict">
          <div class="who">${t.who}</div>
          <div class="eg">${esc(t.eg(tld))}</div>
          ${chip(r[t.key])}
        </div>`).join("")}
      </div>
      <p class="rule">${esc(r.rule)}</p>
      <h3>What you have to do</h3>
      <ul class="must">${r.must.map((m) => `<li>${esc(m)}</li>`).join("")}</ul>
      ${r.notes.map((n) => `<p class="note">${esc(n)}</p>`).join("")}
      <div class="src">
        ${quality(r)} · checked ${esc(r.checked || checked)}
        <ul>${r.sources.map((s) => `<li><span class="tag">${TAG[s.type]}</span><a href="${esc(s.url)}" rel="noopener" target="_blank">${esc(s.label)}</a></li>`).join("")}</ul>
      </div>`;
  }

  g.CC = { LABEL, TYPES, esc, chip, quality, countryCard };
})(typeof window !== "undefined" ? window : globalThis);
