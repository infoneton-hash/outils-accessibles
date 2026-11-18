/* Teinte – identifie la couleur et la lumière avec l'appareil photo.
   Tout est calculé sur le téléphone : aucune image n'est envoyée, aucun traceur. */
'use strict';

const TEXTES = {
  fr: {
    code: 'fr-FR', conf: 'Confidentialité et aide', court: 'FR', titre: 'Teinte – couleurs et lumière',
    intro: "Pointez le téléphone vers un objet. Teinte vous dit sa couleur.",
    couleur: 'Couleur', lumiere: 'Lumière', voix: "Voix de l'application", vibre: 'Vibrations',
    vie: 'Rien ne quitte votre téléphone. Pas de compte, pas de publicité.',
    annoncer: 'Annoncer', autoC: 'Annonce automatique', autoL: 'Son continu', retour: 'Retour',
    lampeOn: 'Allumer la lampe', lampeOff: 'Éteindre la lampe', langue: 'Changer de langue. Langue actuelle : français',
    pasCamera: "L'appareil photo n'est pas disponible. Autorisez l'accès à l'appareil photo dans les réglages du navigateur.",
    pret: 'Appareil photo prêt.',
    niveaux: ['Obscurité', 'Lumière faible', 'Lumière moyenne', 'Lumière forte', 'Lumière très forte'],
    teintes: { rouge: 'rouge', orange: 'orange', jaune: 'jaune', vertjaune: 'vert jaune', vert: 'vert', turquoise: 'turquoise',
      bleu: 'bleu', violet: 'violet', rose: 'rose', marron: 'marron', beige: 'beige', kaki: 'kaki',
      blanc: 'blanc', noir: 'noir', gris: 'gris', bordeaux: 'bordeaux', marine: 'bleu marine' },
    clair: 'clair', fonce: 'foncé', avantNuance: false
  },
  nl: {
    code: 'nl-BE', conf: 'Privacy en hulp', court: 'NL', titre: 'Teinte – kleuren en licht',
    intro: 'Richt de telefoon op een voorwerp. Teinte zegt de kleur.',
    couleur: 'Kleur', lumiere: 'Licht', voix: 'Stem van de app', vibre: 'Trillingen',
    vie: 'Niets verlaat uw telefoon. Geen account, geen reclame.',
    annoncer: 'Uitspreken', autoC: 'Automatisch uitspreken', autoL: 'Doorlopende toon', retour: 'Terug',
    lampeOn: 'Lamp aan', lampeOff: 'Lamp uit', langue: 'Taal wijzigen. Huidige taal: Nederlands',
    pasCamera: 'De camera is niet beschikbaar. Geef toegang tot de camera in de browserinstellingen.',
    pret: 'Camera klaar.',
    niveaux: ['Donker', 'Zwak licht', 'Gemiddeld licht', 'Sterk licht', 'Zeer sterk licht'],
    teintes: { rouge: 'rood', orange: 'oranje', jaune: 'geel', vertjaune: 'geelgroen', vert: 'groen', turquoise: 'turkoois',
      bleu: 'blauw', violet: 'paars', rose: 'roze', marron: 'bruin', beige: 'beige', kaki: 'kaki',
      blanc: 'wit', noir: 'zwart', gris: 'grijs', bordeaux: 'bordeauxrood', marine: 'marineblauw' },
    clair: 'licht', fonce: 'donker', avantNuance: true
  },
  en: {
    code: 'en-GB', conf: 'Privacy and help', court: 'EN', titre: 'Teinte – colours and light',
    intro: 'Point the phone at an object. Teinte tells you its colour.',
    couleur: 'Colour', lumiere: 'Light', voix: 'App voice', vibre: 'Vibration',
    vie: 'Nothing leaves your phone. No account, no ads.',
    annoncer: 'Speak', autoC: 'Automatic speech', autoL: 'Continuous tone', retour: 'Back',
    lampeOn: 'Turn torch on', lampeOff: 'Turn torch off', langue: 'Change language. Current language: English',
    pasCamera: 'The camera is not available. Allow camera access in the browser settings.',
    pret: 'Camera ready.',
    niveaux: ['Darkness', 'Low light', 'Medium light', 'Bright light', 'Very bright light'],
    teintes: { rouge: 'red', orange: 'orange', jaune: 'yellow', vertjaune: 'yellow green', vert: 'green', turquoise: 'turquoise',
      bleu: 'blue', violet: 'purple', rose: 'pink', marron: 'brown', beige: 'beige', kaki: 'khaki',
      blanc: 'white', noir: 'black', gris: 'grey', bordeaux: 'burgundy', marine: 'navy blue' },
    clair: 'light', fonce: 'dark', avantNuance: true
  }
};
const ORDRE_LANGUES = ['fr', 'nl', 'en'];

const $ = (id) => document.getElementById(id);
const stock = {
  lire(cle, defaut) { try { const v = localStorage.getItem('teinte.' + cle); return v === null ? defaut : JSON.parse(v); } catch (e) { return defaut; } },
  ecrire(cle, v) { try { localStorage.setItem('teinte.' + cle, JSON.stringify(v)); } catch (e) { /* stockage indisponible */ } }
};

let langue = stock.lire('langue', (navigator.language || 'fr').slice(0, 2));
if (!TEXTES[langue]) langue = 'fr';
let T = TEXTES[langue];
let mode = 'couleur';
let flux = null, piste = null, boucle = null, auto = false, lampe = false;
let dernierNom = '', candidat = '', depuis = 0;
let audio = null, oscillateur = null, gain = null;

/* ---------- Langue ---------- */
function appliquerLangue() {
  T = TEXTES[langue];
  document.documentElement.lang = langue;
  document.title = T.titre;
  $('btn-langue').textContent = T.court;
  $('btn-langue').setAttribute('aria-label', T.langue);
  $('intro').textContent = T.intro;
  $('lbl-couleur').textContent = T.couleur;
  $('lbl-lumiere').textContent = T.lumiere;
  $('lbl-voix').textContent = T.voix;
  $('lbl-vibre').textContent = T.vibre;
  $('note-vie-privee').textContent = T.vie;
  $('lien-conf').textContent = T.conf;
  $('lbl-annoncer').textContent = T.annoncer;
  $('lbl-retour').textContent = T.retour;
  majLibelles();
}
function majLibelles() {
  $('titre-mesure').textContent = mode === 'couleur' ? T.couleur : T.lumiere;
  $('lbl-auto').textContent = mode === 'couleur' ? T.autoC : T.autoL;
  $('lbl-lampe').textContent = lampe ? T.lampeOff : T.lampeOn;
}

/* ---------- Voix, sons, vibrations ---------- */
function parler(texte) {
  $('resultat').textContent = texte;
  if ($('opt-voix').checked && 'speechSynthesis' in window) {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(texte);
    u.lang = T.code; u.rate = 1;
    const v = speechSynthesis.getVoices().find((x) => x.lang && x.lang.toLowerCase().startsWith(langue));
    if (v) u.voice = v;
    speechSynthesis.speak(u);
    $('annonce').textContent = '';
  } else {
    // Sans la voix de l'application, le lecteur d'écran (VoiceOver, TalkBack) lit la zone « live ».
    $('annonce').textContent = '';
    setTimeout(() => { $('annonce').textContent = texte; }, 50);
  }
}
function vibrer(motif) { if ($('opt-vibre').checked && navigator.vibrate) navigator.vibrate(motif); }
function contexteAudio() {
  if (!audio) { const C = window.AudioContext || window.webkitAudioContext; if (C) audio = new C(); }
  if (audio && audio.state === 'suspended') audio.resume();
  return audio;
}
function bip(freq = 880, duree = 0.08) {
  const a = contexteAudio(); if (!a) return;
  const o = a.createOscillator(), g = a.createGain();
  o.frequency.value = freq; g.gain.value = 0.15;
  o.connect(g); g.connect(a.destination); o.start(); o.stop(a.currentTime + duree);
}
function sonContinu(actif) {
  const a = contexteAudio(); if (!a) return;
  if (actif && !oscillateur) {
    oscillateur = a.createOscillator(); gain = a.createGain();
    oscillateur.type = 'sine'; gain.gain.value = 0.12;
    oscillateur.connect(gain); gain.connect(a.destination); oscillateur.start();
  } else if (!actif && oscillateur) {
    oscillateur.stop(); oscillateur.disconnect(); oscillateur = null; gain = null;
  }
}

/* ---------- Couleurs ---------- */
function rgbVersTsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  return { h, s, l };
}
/* Renvoie une clé de teinte et une nuance (« clair », « foncé » ou rien). */
function nommerCouleur(r, g, b) {
  const { h, s, l } = rgbVersTsl(r, g, b);
  if (l < 0.12) return { cle: 'noir' };
  if (l > 0.9 && s < 0.5) return { cle: 'blanc' };
  if (s < 0.14 || (s < 0.22 && l < 0.3)) {
    if (l > 0.78) return { cle: 'blanc' };
    return { cle: 'gris', nuance: l < 0.35 ? 'fonce' : (l > 0.62 ? 'clair' : '') };
  }
  let cle;
  if (h < 15 || h >= 345) cle = 'rouge';
  else if (h < 40) cle = 'orange';
  else if (h < 64) cle = 'jaune';
  else if (h < 80) cle = 'vertjaune';
  else if (h < 160) cle = 'vert';
  else if (h < 195) cle = 'turquoise';
  else if (h < 255) cle = 'bleu';
  else if (h < 290) cle = 'violet';
  else cle = 'rose';
  // Cas particuliers fréquents dans l'habillement
  if (cle === 'jaune' && l < 0.4) return { cle: 'kaki' };
  if (cle === 'vertjaune' && l < 0.4) return { cle: 'kaki' };
  if (cle === 'orange' && l < 0.4) return { cle: 'marron', nuance: l < 0.2 ? 'fonce' : '' };
  if (cle === 'rouge' && l < 0.3) return { cle: 'bordeaux' };
  if ((cle === 'orange' || cle === 'jaune') && l > 0.7 && s < 0.6) return { cle: 'beige' };
  if (cle === 'bleu' && l < 0.25) return { cle: 'marine' };
  if (cle === 'rouge' && l > 0.7) cle = 'rose';
  let nuance = '';
  if (l < 0.3) nuance = 'fonce'; else if (l > 0.68) nuance = 'clair';
  return { cle, nuance };
}
function texteCouleurPropre(c) {
  const nom = T.teintes[c.cle];
  if (!c.nuance) return nom;
  const n = T[c.nuance];
  if (langue === 'fr') return nom + ' ' + n;
  if (langue === 'en') return n + ' ' + nom;
  return n + nom; // néerlandais : lichtblauw, donkergroen
}

/* ---------- Appareil photo ---------- */
async function demarrerCamera() {
  try {
    flux = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' }, width: { ideal: 640 }, height: { ideal: 480 } }, audio: false });
    $('video').srcObject = flux; await $('video').play();
    piste = flux.getVideoTracks()[0];
    const capacites = piste.getCapabilities ? piste.getCapabilities() : {};
    $('btn-lampe').hidden = !(capacites && capacites.torch);
    if (mode === 'lumiere' && capacites && capacites.exposureMode && capacites.exposureMode.includes('manual')) {
      // Exposition fixe : la mesure de lumière n'est pas corrigée par l'appareil.
      try { await piste.applyConstraints({ advanced: [{ exposureMode: 'manual' }] }); } catch (e) { /* non pris en charge */ }
    }
    bip(660); parler(T.pret);
    boucle = setInterval(analyser, 250);
  } catch (e) {
    parler(T.pasCamera);
  }
}
function arreterCamera() {
  clearInterval(boucle); boucle = null;
  sonContinu(false);
  if (flux) flux.getTracks().forEach((t) => t.stop());
  flux = null; piste = null; lampe = false;
}
function mesurer() {
  const v = $('video'); if (!v.videoWidth) return null;
  const toile = $('toile'), ctx = toile.getContext('2d', { willReadFrequently: true });
  if (mode === 'couleur') {
    // Zone centrale (sous la mire) : 22 % de la largeur
    const cote = Math.min(v.videoWidth, v.videoHeight) * 0.22;
    ctx.drawImage(v, (v.videoWidth - cote) / 2, (v.videoHeight - cote) / 2, cote, cote, 0, 0, 64, 64);
  } else {
    ctx.drawImage(v, 0, 0, v.videoWidth, v.videoHeight, 0, 0, 64, 64);
  }
  const px = ctx.getImageData(0, 0, 64, 64).data;
  let r = 0, g = 0, b = 0; const lum = [];
  for (let i = 0; i < px.length; i += 4) {
    r += px[i]; g += px[i + 1]; b += px[i + 2];
    lum.push(0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2]);
  }
  const n = px.length / 4;
  lum.sort((a, c) => a - c);
  const moyenne = lum.reduce((a, c) => a + c, 0) / n;
  const haut = lum[Math.floor(n * 0.95)];
  return { r: r / n, g: g / n, b: b / n, lumiere: (0.5 * moyenne + 0.5 * haut) / 255 };
}
function niveauLumiere(x) { return x < 0.12 ? 0 : x < 0.3 ? 1 : x < 0.55 ? 2 : x < 0.8 ? 3 : 4; }

function analyser() {
  const m = mesurer(); if (!m) return;
  if (mode === 'couleur') {
    $('pastille').style.background = `rgb(${m.r | 0}, ${m.g | 0}, ${m.b | 0})`;
    const nom = texteCouleurPropre(nommerCouleur(m.r, m.g, m.b));
    $('resultat').textContent = nom;
    if (auto) {
      const maintenant = Date.now();
      if (nom !== candidat) { candidat = nom; depuis = maintenant; }
      else if (nom !== dernierNom && maintenant - depuis > 900) { dernierNom = nom; vibrer(40); parler(nom); }
    }
  } else {
    const niv = niveauLumiere(m.lumiere);
    const gris = Math.round(m.lumiere * 255);
    $('pastille').style.background = `rgb(${gris}, ${gris}, ${gris})`;
    $('resultat').textContent = T.niveaux[niv];
    if (oscillateur) oscillateur.frequency.setTargetAtTime(150 + m.lumiere * 1350, audio.currentTime, 0.08);
    if (auto && String(niv) !== dernierNom) { dernierNom = String(niv); vibrer(niv >= 3 ? [60, 40, 60] : 40); }
  }
}
function annoncer() {
  const m = mesurer(); if (!m) { parler(T.pasCamera); return; }
  bip(); vibrer(30);
  if (mode === 'couleur') { dernierNom = texteCouleurPropre(nommerCouleur(m.r, m.g, m.b)); parler(dernierNom); }
  else parler(T.niveaux[niveauLumiere(m.lumiere)]);
}

/* ---------- Navigation ---------- */
function ouvrir(nouveauMode) {
  mode = nouveauMode; auto = false; dernierNom = '';
  $('btn-auto').setAttribute('aria-pressed', 'false');
  majLibelles();
  $('ecran-accueil').hidden = true; $('ecran-mesure').hidden = false;
  $('titre-mesure').setAttribute('tabindex', '-1'); $('titre-mesure').focus();
  contexteAudio();
  demarrerCamera();
}
function retour() {
  arreterCamera();
  $('ecran-mesure').hidden = true; $('ecran-accueil').hidden = false;
  $('btn-' + mode).focus();
}

$('btn-couleur').addEventListener('click', () => ouvrir('couleur'));
$('btn-lumiere').addEventListener('click', () => ouvrir('lumiere'));
$('btn-retour').addEventListener('click', retour);
$('btn-annoncer').addEventListener('click', annoncer);
$('btn-auto').addEventListener('click', () => {
  auto = !auto; dernierNom = ''; candidat = '';
  $('btn-auto').setAttribute('aria-pressed', String(auto));
  if (mode === 'lumiere') sonContinu(auto);
  bip(auto ? 990 : 440);
});
$('btn-lampe').addEventListener('click', async () => {
  if (!piste) return;
  lampe = !lampe;
  try { await piste.applyConstraints({ advanced: [{ torch: lampe }] }); } catch (e) { lampe = false; }
  $('btn-lampe').setAttribute('aria-pressed', String(lampe)); majLibelles();
});
$('btn-langue').addEventListener('click', () => {
  langue = ORDRE_LANGUES[(ORDRE_LANGUES.indexOf(langue) + 1) % ORDRE_LANGUES.length];
  stock.ecrire('langue', langue); appliquerLangue(); parler(T.intro);
});
['opt-voix', 'opt-vibre'].forEach((id) => {
  $(id).checked = stock.lire(id, true);
  $(id).addEventListener('change', () => stock.ecrire(id, $(id).checked));
});
document.addEventListener('visibilitychange', () => { if (document.hidden && flux) retour(); });

appliquerLangue();
// Raccourcis (écran d'accueil du téléphone) : index.html#couleur ou index.html#lumiere
if (location.hash === '#couleur' || location.hash === '#lumiere') ouvrir(location.hash.slice(1));
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});

// Exposé pour les tests automatiques uniquement
window.__teinte = { nommerCouleur, texteCouleurPropre, setLangue: (l) => { langue = l; appliquerLangue(); } };
