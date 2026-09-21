/* Schulverein-App – zeigt an, was in inhalte.json steht.
   Zum Ändern der Inhalte reicht die Datei inhalte.json. */

const SYMBOLE = {
  start:   '<path d="M3 10.5 12 3l9 7.5"/><path d="M5.5 9.5V20h13V9.5"/>',
  termine: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  helfen:  '<path d="M12 20s-7-4.4-7-9.2A4 4 0 0 1 12 8a4 4 0 0 1 7 2.8C19 15.6 12 20 12 20Z"/>',
  news:    '<rect x="3.5" y="5" width="17" height="14" rx="2.5"/><path d="M7 9.5h7M7 13h10M7 16h6"/>',
  mehr:    '<path d="M6 12h.01M12 12h.01M18 12h.01"/>'
};

const REITER = [
  { id: 'start',   name: 'Start' },
  { id: 'termine', name: 'Termine' },
  { id: 'helfen',  name: 'Helfen' },
  { id: 'news',    name: 'News' },
  { id: 'mehr',    name: 'Mehr' }
];

function t(wert) {
  return String(wert == null ? '' : wert)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function knopf(beschriftung, ziel) {
  if (!ziel) return '';
  return `<a class="ghost" href="${t(ziel)}" target="_blank" rel="noopener">${t(beschriftung || 'Öffnen')}</a>`;
}

function wappen(verein) {
  if (verein.logo) {
    return `<img class="logo" src="${t(verein.logo)}" alt="${t(verein.name)}">`;
  }
  return `<svg viewBox="0 0 100 100" role="img" aria-label="Vereinszeichen">
    <circle cx="50" cy="50" r="47" fill="var(--brand-soft)" stroke="var(--brand)" stroke-width="2.5"/>
    <path d="M26 38h20c3 0 5 1.6 5 4v24c0-2.4-2-4-5-4H26z" fill="var(--brand)"/>
    <path d="M74 38H54c-3 0-5 1.6-5 4v24c0-2.4 2-4 5-4h20z" fill="var(--sun)"/>
    <circle cx="50" cy="28" r="5" fill="var(--brand)"/>
  </svg>`;
}

function seiteStart(d) {
  const kacheln = [
    { go: 'mitglied', b: 'Mitglied werden', e: d.start.beitrag ? '15 € im Jahr' : '' },
    { go: 'termine',  b: 'Termine',         e: d.termine.length + ' Termine' },
    { go: 'helfen',   b: 'Helfen',          e: 'Wir suchen Hände' },
    { go: 'news',     b: 'Neuigkeiten',     e: 'Aus dem Verein' },
    { go: 'mehr',     b: 'Mehr',            e: 'T-Shirts, Kontakt, Vorstand' }
  ];
  return `
    <div class="crest">
      ${wappen(d.verein)}
      ${d.verein.logo ? '' : `<h1>${t(d.verein.name)}</h1>`}
      <p class="claim">${t(d.verein.claim)}</p>
    </div>
    <p class="lead">${t(d.start.text)} <strong>${t(d.start.beitrag)}</strong></p>
    <div class="tiles">
      ${kacheln.map(k => `<button class="tile" data-go="${k.go}"><b>${t(k.b)}</b><em>${t(k.e)}</em></button>`).join('')}
    </div>
    <div class="panel">
      <div>
        <p class="eyebrow">Nächster Termin</p>
        <h3>${t(d.start.naechster_termin.titel)}</h3>
        <p class="lead" style="margin-top:4px">${t(d.start.naechster_termin.text)}</p>
      </div>
      <div>
        <p class="eyebrow">Aktuell gesucht</p>
        <p class="lead" style="margin-top:2px">${t(d.start.gesucht)}</p>
        ${d.start.gesucht_link ? `<button class="zurueck" data-go="helfen" style="margin-top:6px">${t(d.start.gesucht_link)} &rarr;</button>` : ''}
      </div>
    </div>
    ${spendenKasten(d)}`;
}

function ibanLesbar(iban) {
  return String(iban || '').replace(/\s+/g, '').replace(/(.{4})/g, '$1 ').trim();
}

function spendenKasten(d) {
  const sp = d.spenden;
  if (!sp || !sp.iban) return '';                       // ohne IBAN kein Kasten
  const iban = String(sp.iban).replace(/\s+/g, '');
  return `
    <div class="panel spenden">
      <div class="spenden-kopf">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-9.2A4 4 0 0 1 12 8a4 4 0 0 1 7 2.8C19 15.6 12 20 12 20Z"/></svg>
        <div>
          <p class="eyebrow">${t(sp.titel || 'Spenden')}</p>
          <p class="lead" style="margin-top:2px">${t(sp.text)}</p>
        </div>
      </div>
      <dl class="konto">
        <div><dt>Empfänger</dt><dd>${t(sp.kontoinhaber)}</dd></div>
        <div><dt>IBAN</dt><dd class="iban">${t(ibanLesbar(iban))}</dd></div>
        ${sp.bic ? `<div><dt>BIC</dt><dd>${t(sp.bic)}</dd></div>` : ''}
        ${sp.bank ? `<div><dt>Bank</dt><dd>${t(sp.bank)}</dd></div>` : ''}
        <div><dt>Zweck</dt><dd>${t(sp.verwendungszweck)}</dd></div>
      </dl>
      <button class="ghost" type="button" data-kopieren="${t(iban)}">IBAN kopieren</button>
      ${sp.girocode ? `
        <div class="girocode">
          <img src="${t(sp.girocode)}" alt="QR-Code für die Überweisung" width="140" height="140">
          <p class="lead">Mit der Banking-App scannen – Empfänger, IBAN und Zweck sind dann schon ausgefüllt, ihr tragt nur noch den Betrag ein.</p>
        </div>` : ''}
      ${sp.hinweis ? `<p class="klein">${t(sp.hinweis)}</p>` : ''}
    </div>`;
}

function seiteMitglied(d) {
  return `
    <button class="zurueck" data-go="start">&larr; Startseite</button>
    <div><p class="eyebrow">Mitgliedschaft</p><h2>Mitglied werden</h2></div>
    <p class="lead">${t(d.mitglied.text)}</p>
    <div class="panel">
      <p class="eyebrow">Das Formular fragt</p>
      <ul class="liste">${d.mitglied.punkte.map(p => `<li>${t(p)}</li>`).join('')}</ul>
    </div>
    ${knopf(d.mitglied.knopf, d.mitglied.formular)}`;
}

function seiteTermine(d) {
  const eintraege = d.termine.map(e => `
    <div class="termin">
      <div class="datum"><div class="tag">${t(e.tag)}</div><div class="mon">${t(e.monat)}</div></div>
      <div>
        <h3>${t(e.titel)}</h3>
        <p>${e.zeit ? `<span class="zeit">${t(e.zeit)}</span> &middot; ` : ''}${t(e.text)}</p>
        ${e.hinweis ? `<p>${t(e.hinweis)}</p>` : ''}
        ${e.status ? `<span class="chip${/mitglied/i.test(e.status) ? ' gesperrt' : ''}">${t(e.status)}</span>` : ''}
        ${e.formular ? `<p style="margin-top:9px">${knopf(e.knopf, e.formular)}</p>` : ''}
      </div>
    </div>`).join('');
  return `
    <div><p class="eyebrow">Unsere Termine</p><h2>Termine &amp; Events</h2></div>
    <div class="panel">${eintraege}</div>`;
}

function aufrufKasten(a) {
  if (!a || !a.titel) return '';
  const tage = (a.tage || []).map(tg => `
    <div class="aufruf-tag">
      <p class="aufruf-wann"><b>${t(tg.tag)}</b>${tg.zeit ? ` &middot; ${t(tg.zeit)}` : ''}</p>
      <ul class="aufgaben">${(tg.aufgaben || []).map(x =>
        `<li><span>${t(x.was)}</span><span class="wer">${t(x.wer)}</span></li>`).join('')}</ul>
    </div>`).join('');
  return `
    <div class="panel aufruf">
      <div>
        <p class="eyebrow">Aufruf</p>
        <h3>${t(a.titel)}</h3>
        ${a.text ? `<p class="lead" style="margin-top:4px">${t(a.text)}</p>` : ''}
      </div>
      ${tage}
      ${a.sachen && a.sachen.length ? `
        <div>
          <p class="aufruf-wann"><b>${t(a.sachen_titel || 'Außerdem gesucht')}</b></p>
          <ul class="liste">${a.sachen.map(p => `<li>${t(p)}</li>`).join('')}</ul>
        </div>` : ''}
      ${a.dank ? `<p class="dank">${t(a.dank)}</p>` : ''}
      ${a.formular ? `<a class="voll-knopf" href="${t(a.formular)}" target="_blank" rel="noopener">${t(a.knopf || 'Ich helfe mit')}</a>` : ''}
    </div>`;
}

function seiteHelfen(d) {
  return `
    <div><p class="eyebrow">Mitmachen</p><h2>Helfen &amp; Mitmachen</h2></div>
    ${aufrufKasten(d.helfen.aufruf)}
    <p class="lead">${t(d.helfen.text)}</p>
    <div class="panel">
      <p class="eyebrow">Wobei es gerade klemmt</p>
      <ul class="liste">${d.helfen.punkte.map(p => `<li>${t(p)}</li>`).join('')}</ul>
    </div>
    ${knopf(d.helfen.knopf, d.helfen.formular)}`;
}

function seiteNews(d) {
  return `
    <div><p class="eyebrow">Aus dem Verein</p><h2>Neuigkeiten</h2></div>
    ${d.news.map(n => `
      <div class="panel">
        <div>
          <p class="eyebrow">${t(n.datum)}</p>
          <h3>${t(n.titel)}</h3>
          <p class="lead" style="margin-top:4px">${t(n.text)}</p>
        </div>
      </div>`).join('')}`;
}

function seiteMehr(d) {
  const v = d.verein;
  const block = b => `
    <div class="panel">
      <div>
        <p class="eyebrow">${t(b.titel)}</p>
        <p class="lead" style="margin-top:4px">${t(b.text)}</p>
      </div>
      ${knopf(b.knopf, b.formular)}
    </div>`;
  return `
    <div><p class="eyebrow">Service</p><h2>Mehr</h2></div>
    ${block(d.mehr.tshirt)}
    ${block(d.mehr.kontakt)}
    <div class="panel" id="pushBox" hidden>
      <div>
        <p class="eyebrow">${t((d.push && d.push.titel) || 'Benachrichtigungen')}</p>
        <p class="lead" style="margin-top:4px" data-status></p>
      </div>
      <button class="ghost" type="button">Benachrichtigungen einschalten</button>
    </div>
    <div class="panel">
      <p class="eyebrow">Vorstand</p>
      <div class="vorstand">
        ${d.vorstand.map(p => `<div>${t(p.name)} <span>${t(p.amt)}</span></div>`).join('')}
      </div>
    </div>
    <p class="impressum">
      <b>${t(v.name)}</b><br>${t(v.strasse)} &middot; ${t(v.ort)}<br>${t(v.email)}<br><br>
      ${t(v.gemeinnuetzig)}<br>${t(v.register)}<br><br>
      <a href="${t(v.satzung)}" target="_blank" rel="noopener">Satzung</a> &middot;
      <a href="${t(v.recht || 'recht.html')}">Impressum &amp; Datenschutz</a>
    </p>
    ${urheberZeile(d)}`;
}

function urheberZeile(d) {
  const v = d.verein;
  if (!v.urheber) return '';
  return `<p class="urheber">App entworfen von ${t(v.urheber)} &middot;
    &copy; ${t(v.urheber_jahr || new Date().getFullYear())} ${t(v.urheber)}. Alle Rechte vorbehalten.</p>`;
}

const SEITEN = {
  start: seiteStart, mitglied: seiteMitglied, termine: seiteTermine,
  helfen: seiteHelfen, news: seiteNews, mehr: seiteMehr
};

/* ---------- Benachrichtigungen ---------- */

function schluesselBytes(b64) {
  const s = (b64 + '='.repeat((4 - b64.length % 4) % 4)).replace(/-/g, '+').replace(/_/g, '/');
  const roh = atob(s);
  const out = new Uint8Array(roh.length);
  for (let i = 0; i < roh.length; i++) out[i] = roh.charCodeAt(i);
  return out;
}

async function pushEinrichten(d) {
  const kasten = document.getElementById('pushBox');
  if (!kasten) return;

  const cfg = d.push || {};
  if (!cfg.dienst || !cfg.schluessel) return;          // noch nicht eingerichtet

  const status = kasten.querySelector('[data-status]');
  const knopf = kasten.querySelector('button');
  kasten.hidden = false;

  if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) {
    knopf.hidden = true;
    status.textContent = 'Dein Gerät kann keine Benachrichtigungen anzeigen. '
      + 'Auf dem iPhone klappt es, sobald die App auf dem Startbildschirm liegt.';
    return;
  }

  let reg, abo = null;
  try {
    reg = await navigator.serviceWorker.ready;
    abo = await reg.pushManager.getSubscription();
  } catch (e) {
    knopf.hidden = true;
    status.textContent = 'Benachrichtigungen stehen hier gerade nicht zur Verfügung.';
    return;
  }

  function stand() {
    if (abo) {
      knopf.hidden = false;
      knopf.textContent = 'Benachrichtigungen ausschalten';
      status.textContent = 'Eingeschaltet. Ihr bekommt Nachrichten vom Schulverein.';
    } else if (Notification.permission === 'denied') {
      knopf.hidden = true;
      status.textContent = 'Benachrichtigungen sind für diese Seite blockiert. '
        + 'In den Einstellungen des Browsers könnt ihr sie wieder erlauben.';
    } else {
      knopf.hidden = false;
      knopf.textContent = 'Benachrichtigungen einschalten';
      status.textContent = cfg.text || '';
    }
  }
  stand();

  knopf.addEventListener('click', async () => {
    knopf.disabled = true;
    try {
      if (abo) {
        await fetch(cfg.dienst + '/abmelden', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: abo.endpoint })
        });
        await abo.unsubscribe();
        abo = null;
      } else {
        const erlaubnis = await Notification.requestPermission();
        if (erlaubnis !== 'granted') { stand(); knopf.disabled = false; return; }
        abo = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: schluesselBytes(cfg.schluessel)
        });
        const res = await fetch(cfg.dienst + '/anmelden', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ abo: abo.toJSON() })
        });
        if (!res.ok) throw new Error('abgelehnt');
      }
      stand();
    } catch (e) {
      status.textContent = 'Das hat gerade nicht geklappt. Bitte später noch einmal versuchen.';
    }
    knopf.disabled = false;
  });
}

function zeichne(d) {
  const wurzel = document.getElementById('app');
  wurzel.innerHTML = `
    <div class="phone">
      <div class="screen" id="screen"></div>
      <nav class="tabs" role="tablist" aria-label="Bereiche">
        ${REITER.map(r => `
          <button class="tab" role="tab" data-go="${r.id}" aria-selected="${r.id === 'start'}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"
                 stroke-linecap="round" stroke-linejoin="round">${SYMBOLE[r.id]}</svg>
            <span>${t(r.name)}</span><i class="dot"></i>
          </button>`).join('')}
      </nav>
    </div>
    <p class="fuss">${t(d.verein.name)}${d.verein.urheber
      ? `<br>&copy; ${t(d.verein.urheber_jahr || new Date().getFullYear())} ${t(d.verein.urheber)} &middot; <a href="${t(d.verein.recht || 'recht.html')}#urheberrecht">Urheberrecht</a>`
      : ''}</p>`;

  const screen = document.getElementById('screen');

  function zeige(name) {
    if (!SEITEN[name]) name = 'start';
    screen.innerHTML = SEITEN[name](d);
    const aktiv = (name === 'mitglied') ? 'start' : name;
    wurzel.querySelectorAll('.tab').forEach(tab =>
      tab.setAttribute('aria-selected', String(tab.dataset.go === aktiv)));
    try { localStorage.setItem('sv-seite', name); } catch (e) { /* egal */ }
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (name === 'mehr') pushEinrichten(d);
  }

  wurzel.addEventListener('click', async ev => {
    const kopie = ev.target.closest('[data-kopieren]');
    if (kopie) {
      const text = kopie.dataset.kopieren;
      let ok = false;
      try { await navigator.clipboard.writeText(text); ok = true; } catch (e) { /* Fallback */ }
      if (!ok) {
        const feld = document.createElement('textarea');
        feld.value = text; document.body.appendChild(feld); feld.select();
        try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
        feld.remove();
      }
      const alt = kopie.textContent;
      kopie.textContent = ok ? 'IBAN kopiert ✓' : 'Bitte von Hand markieren';
      setTimeout(() => { kopie.textContent = alt; }, 2000);
      return;
    }
    const el = ev.target.closest('[data-go]');
    if (el) zeige(el.dataset.go);
  });

  let start = 'start';
  try { start = localStorage.getItem('sv-seite') || 'start'; } catch (e) { /* egal */ }
  zeige(start);
}

async function starten() {
  let daten = window.INHALTE || null;
  try {
    const antwort = await fetch('inhalte.json', { cache: 'no-cache' });
    if (antwort.ok) daten = await antwort.json();
  } catch (e) { /* dann bleibt es bei den eingebauten Inhalten */ }

  if (!daten) {
    document.getElementById('app').innerHTML =
      '<p class="hinweis">Die Datei <b>inhalte.json</b> konnte nicht geladen werden.</p>';
    return;
  }
  zeichne(daten);
}

starten();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => { /* ohne Offline-Modus weiter */ });
  });
}
