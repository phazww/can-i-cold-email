// Rules for sending unsolicited marketing email to business recipients, by recipient country.
// verdict: "ok" = no prior consent needed (conditions apply), "cond" = only in narrow cases,
//          "consent" = prior consent required, "unknown" = not verified.
// quality: "primary" = checked against the law text or the regulator's own guidance,
//          "secondary" = based on law-firm or vendor commentary, not yet checked against the official text.
window.CHECKED = "2026-10-10";
window.RULES = [
  {
    code: "US", slug: "united-states", name: "United States", tlds: ["us"],
    named: "ok", generic: "ok", personal: "ok", quality: "primary",
    rule: "No prior consent is needed. CAN-SPAM is an opt-out law and it covers business-to-business email as well.",
    must: [
      "Accurate From, To and Reply-To; a subject line that matches the content",
      "Say clearly that the message is an ad",
      "Include a valid physical postal address",
      "Explain how to opt out and honour opt-outs within 10 business days"
    ],
    notes: ["State laws are not covered here."],
    sources: [{ label: "FTC: CAN-SPAM Act compliance guide for business", url: "https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business", type: "regulator" }]
  },
  {
    code: "UK", slug: "united-kingdom", name: "United Kingdom", tlds: ["uk"],
    named: "ok", generic: "ok", personal: "consent", quality: "primary",
    rule: "The PECR consent rule for email does not apply to corporate subscribers (companies, LLPs, public bodies). Sole traders and some partnerships count as individuals and need consent.",
    must: [
      "Do not disguise or conceal your identity",
      "Give a valid address to opt out or unsubscribe, and honour opt-outs",
      "If the address names a person (jane.doe@company.co.uk), UK GDPR still applies: you need a lawful basis and must respect objections"
    ],
    notes: [],
    sources: [{ label: "ICO: Business-to-business marketing", url: "https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/business-to-business-marketing/", type: "regulator" }]
  },
  {
    code: "CA", slug: "canada", name: "Canada", tlds: ["ca"],
    named: "cond", generic: "cond", personal: "consent", quality: "primary",
    rule: "CASL requires consent, express or implied, for commercial email, including B2B. Consent is implied when the recipient has conspicuously published the address without a statement that they do not want unsolicited messages, and your message is relevant to their business or role.",
    must: [
      "Check that the address is published openly and carries no \"no solicitation\" statement",
      "Make sure the message relates to the recipient's business, role or duties",
      "Identify yourself and include a working unsubscribe mechanism"
    ],
    notes: ["A personal mailbox is treated here as needing consent unless one of the implied-consent cases clearly applies."],
    sources: [{ label: "CASL, section 10(9)(b) and (c) (Justice Laws Website)", url: "https://laws-lois.justice.gc.ca/eng/acts/E-1.6/page-2.html", type: "law" }]
  },
  {
    code: "AU", slug: "australia", name: "Australia", tlds: ["au"],
    named: "cond", generic: "cond", personal: "consent", quality: "secondary",
    rule: "The Spam Act requires consent, express or inferred. Consent can be inferred when a work-related address is conspicuously published, carries no statement that commercial messages are unwanted, and your message relates directly to the recipient's role.",
    must: [
      "Check that the address is published openly with no \"no commercial messages\" statement",
      "Make sure the message relates directly to the recipient's role or function",
      "Identify the sender and include a working unsubscribe"
    ],
    notes: ["The ACMA page did not load during this check. The conditions above come from third-party pages quoting ACMA. Verify on acma.gov.au."],
    sources: [
      { label: "ACMA: Avoid sending spam (verify here)", url: "https://www.acma.gov.au/avoid-sending-spam", type: "regulator" },
      { label: "Flying Solo, quoting ACMA on conspicuous publication", url: "https://www.flyingsolo.com.au/forums/topic/consent-email-sms-marketing/", type: "secondary" }
    ]
  },
  {
    code: "DE", slug: "germany", name: "Germany", tlds: ["de"],
    named: "consent", generic: "consent", personal: "consent", quality: "primary",
    rule: "Advertising by email without the addressee's prior express consent is an unacceptable nuisance under UWG section 7(2). For email the law does not distinguish consumers from businesses.",
    must: [
      "Get express consent before the first email",
      "Existing customers only: you may email about your own similar products if you got the address from a sale, they have not objected, and every message offers an opt-out (section 7(3))"
    ],
    notes: [],
    sources: [{ label: "UWG (Act against Unfair Competition), section 7, official English translation", url: "https://www.gesetze-im-internet.de/englisch_uwg/englisch_uwg.html", type: "law" }]
  },
  {
    code: "FR", slug: "france", name: "France", tlds: ["fr"],
    named: "ok", generic: "ok", personal: "unknown", quality: "primary",
    rule: "B2B prospecting by email does not need prior consent if the message relates to the recipient's profession. The person must be informed and able to object. Generic addresses of companies (info@, contact@) are outside these rules.",
    must: [
      "Send only offers related to the recipient's professional role",
      "Tell the person their address may be used for prospecting and let them object",
      "Offer a simple way to refuse further messages in every email"
    ],
    notes: ["Consumers need prior consent. Sole traders using a personal mailbox were not checked."],
    sources: [{ label: "CNIL: La prospection commerciale par courrier électronique", url: "https://www.cnil.fr/fr/la-prospection-commerciale-par-courrier-electronique", type: "regulator" }]
  },
  {
    code: "ES", slug: "spain", name: "Spain", tlds: ["es"],
    named: "consent", generic: "consent", personal: "consent", quality: "primary",
    rule: "LSSI article 21 prohibits promotional email that was not previously requested or expressly authorised by the recipient. The article speaks of \"recipients\" and does not exempt companies.",
    must: [
      "Get a request or express authorisation before the first email",
      "Existing customers only: allowed for your own similar products if contact details were lawfully obtained and each message offers a simple, free way to object (article 21(2))"
    ],
    notes: [],
    sources: [{ label: "Ley 34/2002 (LSSI), artículo 21 (BOE)", url: "https://www.boe.es/buscar/act.php?id=BOE-A-2002-13758", type: "law" }]
  },
  {
    code: "IT", slug: "italy", name: "Italy", tlds: ["it"],
    named: "consent", generic: "consent", personal: "consent", quality: "primary",
    rule: "Promotional email needs prior consent of the \"contracting party or user\", which includes legal persons. An address being public (website, register, PEC index) does not replace consent.",
    must: [
      "Get consent before the first email, also for company addresses",
      "Existing customers only: \"soft spam\" for similar products using the address given in a sale, if the person was informed and did not refuse"
    ],
    notes: [],
    sources: [{ label: "Garante Privacy: Linee guida in materia di attività promozionale e contrasto allo spam (2013)", url: "https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/2542348", type: "regulator" }]
  },
  {
    code: "NL", slug: "netherlands", name: "Netherlands", tlds: ["nl"],
    named: "cond", generic: "cond", personal: "consent", quality: "primary",
    rule: "Article 11.7 of the Telecommunications Act requires provable prior consent of the subscriber or user. No consent is needed only for contact details the recipient has designated and published for that purpose, used in line with that purpose.",
    must: [
      "Use only an address the business itself published for receiving this kind of message, and stay within that purpose",
      "State your real identity and a valid address or number to stop the messages in every email",
      "Existing customers: allowed for your own similar products if they could object when the address was collected"
    ],
    notes: ["An address simply being visible on a website is not the same as being designated for commercial offers."],
    sources: [
      { label: "Telecommunicatiewet, artikel 11.7 (text via Maxius)", url: "https://maxius.nl/telecommunicatiewet/artikel11.7", type: "law" },
      { label: "ACM: spam rules", url: "https://www.acm.nl/nl/onderwerpen/telecommunicatie/internet/spam", type: "regulator" }
    ]
  },
  {
    code: "BE", slug: "belgium", name: "Belgium", tlds: ["be"],
    named: "consent", generic: "ok", personal: "consent", quality: "secondary",
    rule: "Advertising by email needs prior consent. According to Belgian law-firm commentary, a Royal Decree of 4 April 2003 exempts emails to legal persons at impersonal addresses such as info@.",
    must: [
      "Without consent, use only impersonal company addresses (info@, contact@)",
      "Explain how to object and offer a working way to do so in every message"
    ],
    notes: ["Not yet checked against the official text of the Royal Decree or FPS Economy guidance."],
    sources: [{ label: "Lexgo: Email marketing, a reminder of what you need to consider", url: "https://www.lexgo.be/en/news-and-articles/4554-email-marketing-kind-reminder-of-what-you-need-to-consider", type: "secondary" }]
  },
  {
    code: "IE", slug: "ireland", name: "Ireland", tlds: ["ie"],
    named: "cond", generic: "ok", personal: "consent", quality: "primary",
    rule: "For business subscribers the rule is opt-out: it is an offence to send unsolicited marketing email to a subscriber, including a business subscriber, that has notified you it does not consent. The DPC warns that emailing an individual at a work address is not automatically B2B.",
    must: [
      "Stop immediately when a business tells you it does not consent",
      "Treat named individuals with care: the DPC says consent of the individual may still be required",
      "Include a working opt-out in every message"
    ],
    notes: ["The \"named address\" verdict is cautious because the DPC guidance on individuals at work addresses could not be read in full."],
    sources: [{ label: "DPC case study: prosecution of Viking Direct (Regulation 13(4), S.I. 336 of 2011)", url: "https://dataprotection.ie/en/dpc-guidance/case-studies/electronic-direct-marketing/prosecution-viking-direct-ireland-limited", type: "regulator" }]
  },
  {
    code: "SE", slug: "sweden", name: "Sweden", tlds: ["se"],
    named: "ok", generic: "ok", personal: "consent", quality: "primary",
    rule: "Section 19 of the Marketing Act requires prior consent only when marketing by email to a natural person. Marketing to a legal person does not need consent, but section 20 requires a valid address for opting out in every message.",
    must: [
      "Include a valid address where the recipient can ask you to stop, also when emailing a company",
      "Treat sole traders (enskild firma) as natural persons"
    ],
    notes: ["That a named employee's work address counts as the company's is from Swedish legal commentary, not from the statute itself."],
    sources: [
      { label: "Marknadsföringslag (2008:486), 19 and 20 §§ (Riksdagen)", url: "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/marknadsforingslag-2008486_sfs-2008-486/", type: "law" },
      { label: "Lawline: consent for email marketing to a person at another company", url: "https://lawline.se/answers/kravs-samtycke-for-att-skicka-e-post-i-marknadsforingssyfte-till-person-pa-annat-foretag", type: "secondary" }
    ]
  },
  {
    code: "DK", slug: "denmark", name: "Denmark", tlds: ["dk"],
    named: "consent", generic: "consent", personal: "consent", quality: "primary",
    rule: "The spam ban in section 10 of the Marketing Practices Act applies to all recipients: consumers, companies and public authorities. It makes no difference whether you write to a general mailbox such as info@ or to a named employee.",
    must: [
      "Get consent before the first email",
      "Existing customers only: narrow exception in section 10(2) for your own similar products"
    ],
    notes: [],
    sources: [{ label: "Forbrugerombudsmanden: Vejledning om spamforbuddet (2021)", url: "https://forbrugerombudsmanden.dk/media/bjajzdv1/vejledning-om-spamforbuddet-2021-a.pdf", type: "regulator" }]
  },
  {
    code: "AT", slug: "austria", name: "Austria", tlds: ["at"],
    named: "consent", generic: "consent", personal: "consent", quality: "primary",
    rule: "Sending email for direct marketing without the recipient's prior consent is not permitted under section 174(3) TKG 2021. The text speaks of \"recipients\" and does not distinguish consumers from businesses.",
    must: [
      "Get consent before the first email",
      "Existing customers only: exception in section 174(4) for your own similar products or services"
    ],
    notes: [],
    sources: [{ label: "TKG 2021, § 174 (RIS, federal legal information system)", url: "https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20011678&Paragraf=174", type: "law" }]
  },
  {
    code: "PL", slug: "poland", name: "Poland", tlds: ["pl"],
    named: "consent", generic: "consent", personal: "consent", quality: "secondary",
    rule: "Article 398 of the Electronic Communications Law bans sending commercial information, including direct marketing, to a subscriber or end user without prior consent. Polish legal commentary reads this as covering companies as well as individuals.",
    must: [
      "Get consent before the first email, tied to the specific address",
      "Do not treat a published address as consent"
    ],
    notes: ["No UKE or UODO statement on B2B email was found. The B2B reading comes from commentary."],
    sources: [
      { label: "Prawo komunikacji elektronicznej, art. 398 (text via LexLege)", url: "https://lexlege.pl/komunik-elektr/art-398/", type: "law" },
      { label: "Prawo.pl: marketing consents under the Electronic Communications Law", url: "https://www.prawo.pl/biznes/zgody-marketingowe-i-kontakty-handlowe-co-mowi-prawo-komunikacji-elektronicznej,530981.html", type: "secondary" }
    ]
  },
  {
    code: "CH", slug: "switzerland", name: "Switzerland", tlds: ["ch"],
    named: "consent", generic: "consent", personal: "consent", quality: "secondary",
    rule: "Article 3(1)(o) of the Unfair Competition Act treats mass advertising by email as unfair unless the sender has prior consent, names the correct sender and offers a free, easy way to refuse. Whether business recipients are treated differently was not confirmed.",
    must: [
      "Get consent before automated mass mailings",
      "Existing customers only: exception for your own similar offers if they were told they could refuse"
    ],
    notes: ["Based on Swiss legal publishers, not the SECO page or the statute text. The rule targets mass advertising."],
    sources: [{ label: "WEKA: Rechtssicheres E-Mail-Marketing in der Schweiz", url: "https://www.weka.ch/themen/datenschutz-und-it-recht/datenschutz-umsetzen/article/datenschutz-newsletter-rechtssicheres-e-mail-marketing-in-der-schweiz/", type: "secondary" }]
  }
];
