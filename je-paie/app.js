/* Je paie – aider à payer et à vérifier la monnaie en euros.
   Méthode « un billet de plus » (next-dollar strategy) : on donne un billet qui couvre le prix, puis on vérifie la monnaie.
   Tout est calculé sur le téléphone, en centimes. Aucun traceur, aucune publicité. */
'use strict';

const TEXTES = {
  fr: {
    code: 'fr-FR', conf: 'Confidentialité et aide', court: 'FR', nomLangue: 'Français', langue: 'Langue',
    bonjour: 'Bonjour !', quoi: 'Que voulez-vous faire ?',
    payer: 'Je paie', assez: "J'ai assez d'argent ?",
    combienCoute: 'Combien ça coûte ?', combienJai: "Combien d'argent vous avez ?",
    aideClavier: 'Tapez le prix avec les chiffres.', effacer: 'Effacer un chiffre', virgule: 'virgule', valider: 'Valider',
    donnez: 'Donnez cet argent :', donnezDire: (m) => `Donnez ${m}.`, jaiDonne: "J'ai donné",
    rendu: 'Le vendeur vous rend :', renduDire: (m) => `Le vendeur vous rend ${m}. Comptez avec les images.`, pasDeMonnaie: 'Le vendeur ne vous rend rien.',
    verifier: 'Comptez avec les images.', cestBon: "C'est bon", bravo: 'Bravo ! Vous avez payé.',
    ouiAssez: 'Oui, vous avez assez.', reste: (m) => `Il vous restera ${m}.`, nonAssez: "Non, vous n'avez pas assez.", manque: (m) => `Il manque ${m}.`,
    accueil: 'Accueil', retour: 'Retour', vie: 'Tout reste sur ce téléphone. Pas de compte, pas de publicité.',
    vide: "Tapez d'abord un montant.", trop: 'Montant trop grand. Maximum 300 euros.',
    billet: 'billet', billets: 'billets', piece: 'pièce', pieces: 'pièces', de: 'de',
    montant: (e, c) => e && c ? (c < 10 ? `${e} ${e > 1 ? 'euros' : 'euro'} et ${c} ${c > 1 ? 'centimes' : 'centime'}` : `${e} ${e > 1 ? 'euros' : 'euro'} ${c}`) : e ? `${e} ${e > 1 ? 'euros' : 'euro'}` : `${c} ${c > 1 ? 'centimes' : 'centime'}`,
    unite: (v) => v >= 100 ? `${v / 100} ${v >= 200 ? 'euros' : 'euro'}` : `${v} ${v > 1 ? 'centimes' : 'centime'}`
  },
  nl: {
    code: 'nl-BE', conf: 'Privacy en hulp', court: 'NL', nomLangue: 'Nederlands', langue: 'Taal',
    bonjour: 'Hallo!', quoi: 'Wat wilt u doen?',
    payer: 'Ik betaal', assez: 'Heb ik genoeg geld?',
    combienCoute: 'Hoeveel kost het?', combienJai: 'Hoeveel geld hebt u?',
    aideClavier: 'Typ de prijs met de cijfers.', effacer: 'Eén cijfer wissen', virgule: 'komma', valider: 'Bevestigen',
    donnez: 'Geef dit geld:', donnezDire: (m) => `Geef ${m}.`, jaiDonne: 'Ik heb betaald',
    rendu: 'U krijgt terug:', renduDire: (m) => `U krijgt ${m} terug. Tel mee met de afbeeldingen.`, pasDeMonnaie: 'U krijgt niets terug.',
    verifier: 'Tel mee met de afbeeldingen.', cestBon: 'Het klopt', bravo: 'Goed zo! U hebt betaald.',
    ouiAssez: 'Ja, u hebt genoeg.', reste: (m) => `U houdt ${m} over.`, nonAssez: 'Nee, u hebt niet genoeg.', manque: (m) => `Er ontbreekt ${m}.`,
    accueil: 'Begin', retour: 'Terug', vie: 'Alles blijft op deze telefoon. Geen account, geen reclame.',
    vide: 'Typ eerst een bedrag.', trop: 'Bedrag te groot. Maximaal 300 euro.',
    billet: 'briefje', billets: 'briefjes', piece: 'munt', pieces: 'munten', de: 'van',
    montant: (e, c) => e && c ? `${e} euro ${c}` : e ? `${e} euro` : `${c} cent`,
    unite: (v) => v >= 100 ? `${v / 100} euro` : `${v} cent`
  },
  en: {
    code: 'en-GB', conf: 'Privacy and help', court: 'EN', nomLangue: 'English', langue: 'Language',
    bonjour: 'Hello!', quoi: 'What do you want to do?',
    payer: 'I pay', assez: 'Do I have enough money?',
    combienCoute: 'How much does it cost?', combienJai: 'How much money do you have?',
    aideClavier: 'Type the price with the numbers.', effacer: 'Delete one number', virgule: 'point', valider: 'OK',
    donnez: 'Give this money:', donnezDire: (m) => `Give ${m}.`, jaiDonne: 'I have paid',
    rendu: 'You get back:', renduDire: (m) => `You get back ${m}. Count with the pictures.`, pasDeMonnaie: 'You get nothing back.',
    verifier: 'Count with the pictures.', cestBon: 'It is right', bravo: 'Well done! You have paid.',
    ouiAssez: 'Yes, you have enough.', reste: (m) => `You will have ${m} left.`, nonAssez: 'No, you do not have enough.', manque: (m) => `You need ${m} more.`,
    accueil: 'Home', retour: 'Back', vie: 'Everything stays on this phone. No account, no ads.',
    vide: 'Type an amount first.', trop: 'Amount too big. Maximum 300 euros.',
    billet: 'note', billets: 'notes', piece: 'coin', pieces: 'coins', de: 'of',
    montant: (e, c) => e && c ? `${e} ${e > 1 ? 'euros' : 'euro'} ${c}` : e ? `${e} ${e > 1 ? 'euros' : 'euro'}` : `${c} ${c > 1 ? 'cents' : 'cent'}`,
    unite: (v) => v >= 100 ? `${v / 100} ${v >= 200 ? 'euros' : 'euro'}` : `${v} ${v > 1 ? 'cents' : 'cent'}`
  }
};
const LANGUES = ['fr', 'nl', 'en'];
const BILLETS = [20000, 10000, 5000, 2000, 1000, 500];        // en centimes
const PIECES = [200, 100, 50, 20, 10, 5, 2, 1];
const MAX = 30000; // 300 € : au-delà, payer en espèces devient rare et la méthode moins adaptée

const $ = (s) => document.querySelector(s);
const app = $('#app');
const stock = {
  lire(cle, defaut) { try { const v = localStorage.getItem('jepaie.' + cle); return v === null ? defaut : JSON.parse(v); } catch (e) { return defaut; } },
  ecrire(cle, v) { try { localStorage.setItem('jepaie.' + cle, JSON.stringify(v)); } catch (e) { /* stockage indisponible */ } }
};
let langue = stock.lire('langue', (navigator.language || 'fr').slice(0, 2));
if (!TEXTES[langue]) langue = 'fr';
let T = TEXTES[langue];

/* ---------- Calculs (en centimes) ---------- */
/* Ce qu'il faut donner : billets et pièces familiers, en dépassant le prix le moins possible, avec peu d'objets. */
function aDonner(prix) {
  const choix = [5000, 2000, 1000, 500, 200, 100];
  const donne = []; let reste = prix;
  while (reste > 0) {
    const assez = choix.filter((v) => v >= reste);
    const v = assez.length ? Math.min(...assez) : 5000;
    donne.push(v); reste -= v;
  }
  return donne.sort((a, b) => b - a);
}
/* Rendu de monnaie : le moins d'objets possible. */
function decomposer(montant) {
  const res = []; let reste = montant;
  for (const v of [...BILLETS.filter((b) => b <= 5000), ...PIECES]) { while (reste >= v) { res.push(v); reste -= v; } }
  return res;
}
const somme = (l) => l.reduce((a, b) => a + b, 0);
function texteMontant(c) { return T.montant(Math.floor(c / 100), c % 100); }
function affichageMontant(c) {
  const e = Math.floor(c / 100), ct = c % 100;
  return langue === 'en' ? `€${e}.${String(ct).padStart(2, '0')}` : `${e},${String(ct).padStart(2, '0')} €`;
}
/* Description parlée d'une liste d'argent : « 1 billet de 10 euros et 2 pièces de 1 euro ». */
function texteListe(liste) {
  const groupes = [];
  liste.forEach((v) => { const g = groupes.find((x) => x.v === v); if (g) g.n++; else groupes.push({ v, n: 1 }); });
  const et = { fr: ' et ', nl: ' en ', en: ' and ' }[langue];
  return groupes.map(({ v, n }) => {
    const estBillet = v >= 500;
    const mot = estBillet ? (n > 1 ? T.billets : T.billet) : (n > 1 ? T.pieces : T.piece);
    return `${n} ${mot} ${T.de} ${T.unite(v)}`;
  }).reduce((tout, morceau, i, l) => i === 0 ? morceau : tout + (i === l.length - 1 ? et : ', ') + morceau, '');
}
function dessinArgent(liste) {
  const groupes = [];
  liste.forEach((v) => { const g = groupes.find((x) => x.v === v); if (g) g.n++; else groupes.push({ v, n: 1 }); });
  return `<div class="argent" role="img" aria-label="${texteListe(liste)}">${groupes.map(({ v, n }) => {
    const etiquette = v >= 100 ? `${v / 100} €` : `${v} c`;
    const objet = v >= 500 ? `<div class="billet b${v / 100}">${etiquette}</div>` : `<div class="piece p${v}">${etiquette}</div>`;
    return `<div class="groupe">${Array.from({ length: Math.min(n, 4) }, () => objet).join('')}${n > 1 ? `<span class="fois">× ${n}</span>` : ''}</div>`;
  }).join('')}</div>`;
}

/* ---------- Voix, sons ---------- */
let audio = null;
function parler(texte) {
  $('#annonce').textContent = ''; setTimeout(() => { $('#annonce').textContent = texte; }, 30);
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(texte); u.lang = T.code; u.rate = 0.9;
  const v = speechSynthesis.getVoices().find((x) => x.lang && x.lang.toLowerCase().startsWith(langue));
  if (v) u.voice = v;
  speechSynthesis.speak(u);
}
function note(freq, debut, duree) {
  if (!audio) { const C = window.AudioContext || window.webkitAudioContext; if (!C) return; audio = new C(); }
  if (audio.state === 'suspended') audio.resume();
  const o = audio.createOscillator(), g = audio.createGain(), t = audio.currentTime + debut;
  o.type = 'triangle'; o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.2, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + duree);
  o.connect(g); g.connect(audio.destination); o.start(t); o.stop(t + duree + 0.05);
}
const vibrer = (m) => { if (navigator.vibrate) navigator.vibrate(m); };

/* ---------- Écrans ---------- */
function afficher(html, focusSel) {
  app.innerHTML = html; window.scrollTo(0, 0);
  const cible = app.querySelector(focusSel || 'h1, h2');
  if (cible) { cible.setAttribute('tabindex', '-1'); cible.focus(); }
}
const barre = (retour) => `<div class="barre"><button class="petit" id="accueil"><span aria-hidden="true">🏠</span> ${T.accueil}</button>
  ${retour ? `<button class="petit" id="retour"><span aria-hidden="true">⬅</span> ${T.retour}</button>` : ''}</div>`;
function lierBarre(retour) { $('#accueil').addEventListener('click', ecranAccueil); if (retour) $('#retour').addEventListener('click', retour); }

function ecranAccueil() {
  document.title = 'Je paie';
  afficher(`
    <div class="barre"><h1>${T.bonjour}</h1><button class="petit" id="langue" aria-label="${T.langue} : ${T.nomLangue}">${T.court}</button></div>
    <p>${T.quoi}</p>
    <button class="carte" id="payer" style="width:100%"><span class="emoji" aria-hidden="true">💶</span><span>${T.payer}</span></button>
    <button class="carte" id="assez" style="width:100%"><span class="emoji" aria-hidden="true">👛</span><span>${T.assez}</span></button>
    <p class="aide">${T.vie}</p>
    <p><a class="lien" href="confidentialite.html">${T.conf}</a></p>`);
  $('#payer').addEventListener('click', () => ecranClavier(T.combienCoute, '🏷️', (prix) => ecranDonner(prix), ecranAccueil));
  $('#assez').addEventListener('click', () => ecranClavier(T.combienJai, '👛', (jai) =>
    ecranClavier(T.combienCoute, '🏷️', (prix) => ecranVerdict(jai, prix), ecranAccueil), ecranAccueil));
  $('#langue').addEventListener('click', () => {
    langue = LANGUES[(LANGUES.indexOf(langue) + 1) % LANGUES.length]; T = TEXTES[langue];
    document.documentElement.lang = langue; stock.ecrire('langue', langue); ecranAccueil(); $('#langue').focus();
  });
}

function ecranClavier(question, emoji, suite, retour) {
  document.title = `Je paie – ${question}`;
  let saisie = '';
  const centimes = () => {
    if (!saisie) return 0;
    const [e, c = ''] = saisie.split(',');
    return parseInt(e || '0', 10) * 100 + parseInt((c + '00').slice(0, 2), 10);
  };
  const montre = () => {
    const [e, c] = saisie.split(',');
    $('#affichage').textContent = saisie ? (langue === 'en' ? `€${e || 0}${c !== undefined ? '.' + c : ''}` : `${e || 0}${c !== undefined ? ',' + c : ''} €`) : (langue === 'en' ? '€0' : '0 €');
  };
  afficher(`${barre(retour)}
    <h2><span aria-hidden="true">${emoji}</span> ${question}</h2>
    <p class="aide">${T.aideClavier}</p>
    <output class="affichage" id="affichage" aria-live="polite"></output>
    <div class="clavier">
      ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `<button data-n="${n}">${n}</button>`).join('')}
      <button data-n="," aria-label="${T.virgule}">${langue === 'en' ? '.' : ','}</button>
      <button data-n="0">0</button>
      <button id="effacer" aria-label="${T.effacer}"><span aria-hidden="true">⌫</span></button>
    </div>
    <button class="principal" id="valider"><span aria-hidden="true">✅</span> ${T.valider}</button>`);
  lierBarre(retour); montre(); parler(question);
  app.querySelectorAll('[data-n]').forEach((b) => b.addEventListener('click', () => {
    const n = b.dataset.n, [e, c] = saisie.split(',');
    if (n === ',') { if (c === undefined) saisie = (saisie || '0') + ','; }
    else if (c !== undefined) { if (c.length < 2) saisie += n; }
    else if ((e || '').length < 3) saisie = (saisie === '0' ? '' : saisie) + n;
    note(600, 0, 0.05); montre();
  }));
  $('#effacer').addEventListener('click', () => { saisie = saisie.slice(0, -1); note(400, 0, 0.05); montre(); });
  $('#valider').addEventListener('click', () => {
    const v = centimes();
    if (!v) { parler(T.vide); return; }
    if (v > MAX) { parler(T.trop); return; }
    suite(v);
  });
}

function ecranDonner(prix) {
  const don = aDonner(prix);
  document.title = `Je paie – ${T.donnez}`;
  afficher(`${barre(() => ecranClavier(T.combienCoute, '🏷️', ecranDonner, ecranAccueil))}
    <h2>${T.donnez}</h2>
    <p class="texte-etape" style="font-size:1.4rem">🏷️ ${affichageMontant(prix)}</p>
    ${dessinArgent(don)}
    <p class="texte-etape">${texteListe(don)}</p>
    <button class="principal" id="ok"><span aria-hidden="true">🤝</span> ${T.jaiDonne}</button>`);
  lierBarre(() => ecranClavier(T.combienCoute, '🏷️', ecranDonner, ecranAccueil));
  parler(`${texteMontant(prix)}. ${T.donnezDire(texteListe(don))}`);
  $('#ok').addEventListener('click', () => ecranRendu(prix, somme(don)));
}

function ecranRendu(prix, donne) {
  const monnaie = donne - prix, liste = decomposer(monnaie);
  document.title = `Je paie – ${T.rendu}`;
  afficher(`${barre(() => ecranDonner(prix))}
    <h2>${T.rendu}</h2>
    ${monnaie ? `<p class="affichage">${affichageMontant(monnaie)}</p>${dessinArgent(liste)}<p class="aide" style="text-align:center">${T.verifier}</p>`
              : `<p class="texte-etape">${T.pasDeMonnaie}</p>`}
    <button class="principal" id="ok"><span aria-hidden="true">✅</span> ${T.cestBon}</button>`);
  lierBarre(() => ecranDonner(prix));
  parler(monnaie ? T.renduDire(texteMontant(monnaie)) : T.pasDeMonnaie);
  $('#ok').addEventListener('click', ecranBravo);
}

function ecranBravo() {
  afficher(`<p class="verdict" aria-hidden="true">🎉</p><h2>${T.bravo}</h2>
    <button class="principal" id="accueil"><span aria-hidden="true">🏠</span> ${T.accueil}</button>`);
  [523, 659, 784, 1047].forEach((f, i) => note(f, i * 0.14, 0.3)); vibrer([100, 60, 200]); parler(T.bravo);
  $('#accueil').addEventListener('click', ecranAccueil);
}

function ecranVerdict(jai, prix) {
  const ok = jai >= prix, diff = Math.abs(jai - prix);
  const titre = ok ? T.ouiAssez : T.nonAssez, detail = ok ? (diff ? T.reste(texteMontant(diff)) : '') : T.manque(texteMontant(diff));
  afficher(`${barre()}
    <p class="verdict ${ok ? 'oui' : 'non'}" aria-hidden="true">${ok ? '✅' : '❌'}</p>
    <h2>${titre}</h2>
    <p class="texte-etape">👛 ${affichageMontant(jai)} &nbsp; 🏷️ ${affichageMontant(prix)}</p>
    ${detail ? `<p class="texte-etape">${detail}</p>` : ''}
    <button class="principal" id="fin"><span aria-hidden="true">🏠</span> ${T.accueil}</button>`);
  lierBarre();
  if (ok) { note(784, 0, 0.2); note(1047, 0.15, 0.3); vibrer(80); } else { note(330, 0, 0.4); vibrer([200, 100, 200]); }
  parler(`${titre} ${detail}`);
  $('#fin').addEventListener('click', ecranAccueil);
}

document.documentElement.lang = langue;
/* Accès direct par adresse (démonstrations) : #prix, #donner-750, #rendu-750, #assez-2000-750, #bravo (montants en centimes) */
(function () {
  const h = location.hash.slice(1).split('-'), a = parseInt(h[1], 10), b = parseInt(h[2], 10);
  if (h[0] === 'prix') ecranClavier(T.combienCoute, '🏷️', ecranDonner, ecranAccueil);
  else if (h[0] === 'donner' && a > 0 && a <= MAX) ecranDonner(a);
  else if (h[0] === 'rendu' && a > 0 && a <= MAX) ecranRendu(a, somme(aDonner(a)));
  else if (h[0] === 'assez' && a >= 0 && b > 0) ecranVerdict(a, b);
  else if (h[0] === 'bravo') ecranBravo();
  else ecranAccueil();
})();
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
window.__jepaie = { aDonner, decomposer, texteListe, texteMontant };
