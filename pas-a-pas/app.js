/* Pas à pas – une activité, une étape par écran, avec voix et encouragements.
   Données gardées sur le téléphone uniquement (localStorage). Aucun traceur, aucune publicité. */
'use strict';

const TEXTES = {
  fr: {
    code: 'fr-FR', conf: 'Confidentialité et aide', court: 'FR', nomLangue: 'Français',
    bonjour: 'Bonjour !', choisir: 'Choisissez une activité.',
    etape: (i, n) => `Étape ${i} sur ${n}`, ecouter: 'Écouter', fait: "C'est fait", accueil: 'Accueil', precedent: 'Étape précédente',
    bravos: ['Bravo !', 'Super !', 'Très bien !', 'Génial !', 'Continuez comme ça !'], presque: 'Vous y êtes presque !',
    fini: 'Bravo ! Vous avez fini.', recommencer: 'Recommencer',
    minuteur: 'Je compte avec vous', minuteurFin: "C'est fini !", lancer: 'Lancer le minuteur', secondes: 'secondes',
    aidant: 'Espace aidant', aidantIntro: 'Ici, un proche ou un professionnel prépare les activités.',
    nouvelle: 'Nouvelle activité', modifier: 'Modifier', supprimer: 'Supprimer', confirmerSuppr: (n) => `Supprimer « ${n} » ?`,
    nomActivite: "Nom de l'activité", image: 'Image', etapes: 'Étapes', texteEtape: "Texte de l'étape (phrase courte)",
    photo: 'Prendre ou choisir une photo', sansPhoto: 'Retirer la photo', minuteurEtape: 'Minuteur (en secondes, 0 = aucun)',
    ajouterEtape: 'Ajouter une étape', monter: 'Monter', descendre: 'Descendre', retirerEtape: "Retirer l'étape",
    enregistrer: 'Enregistrer', annuler: 'Annuler', reinit: 'Remettre les activités de départ', confirmerReinit: 'Remettre les activités de départ ? Vos activités seront effacées.',
    lectureAuto: 'Lire chaque étape à voix haute', langue: 'Langue', plein: "La mémoire du téléphone est pleine. Utilisez des photos moins nombreuses.",
    vide: 'Ajoutez au moins une étape avec un texte.', vie: 'Tout reste sur ce téléphone. Pas de compte, pas de publicité.',
    etapeN: (i) => `Étape ${i}`
  },
  nl: {
    code: 'nl-BE', conf: 'Privacy en hulp', court: 'NL', nomLangue: 'Nederlands',
    bonjour: 'Hallo!', choisir: 'Kies een activiteit.',
    etape: (i, n) => `Stap ${i} van ${n}`, ecouter: 'Luisteren', fait: 'Klaar', accueil: 'Begin', precedent: 'Vorige stap',
    bravos: ['Goed zo!', 'Super!', 'Heel goed!', 'Geweldig!', 'Ga zo door!'], presque: 'Bijna klaar!',
    fini: 'Goed zo! U bent klaar.', recommencer: 'Opnieuw',
    minuteur: 'Ik tel met u mee', minuteurFin: 'Klaar!', lancer: 'Timer starten', secondes: 'seconden',
    aidant: 'Voor begeleiders', aidantIntro: 'Hier maakt een naaste of begeleider de activiteiten.',
    nouvelle: 'Nieuwe activiteit', modifier: 'Wijzigen', supprimer: 'Verwijderen', confirmerSuppr: (n) => `„${n}” verwijderen?`,
    nomActivite: 'Naam van de activiteit', image: 'Afbeelding', etapes: 'Stappen', texteEtape: 'Tekst van de stap (korte zin)',
    photo: 'Foto maken of kiezen', sansPhoto: 'Foto weghalen', minuteurEtape: 'Timer (in seconden, 0 = geen)',
    ajouterEtape: 'Stap toevoegen', monter: 'Omhoog', descendre: 'Omlaag', retirerEtape: 'Stap weghalen',
    enregistrer: 'Opslaan', annuler: 'Annuleren', reinit: 'Startactiviteiten terugzetten', confirmerReinit: 'Startactiviteiten terugzetten? Uw activiteiten worden gewist.',
    lectureAuto: 'Elke stap voorlezen', langue: 'Taal', plein: 'Het geheugen van de telefoon is vol. Gebruik minder foto’s.',
    vide: 'Voeg minstens één stap met tekst toe.', vie: 'Alles blijft op deze telefoon. Geen account, geen reclame.',
    etapeN: (i) => `Stap ${i}`
  },
  en: {
    code: 'en-GB', conf: 'Privacy and help', court: 'EN', nomLangue: 'English',
    bonjour: 'Hello!', choisir: 'Choose an activity.',
    etape: (i, n) => `Step ${i} of ${n}`, ecouter: 'Listen', fait: 'Done', accueil: 'Home', precedent: 'Previous step',
    bravos: ['Well done!', 'Great!', 'Very good!', 'Brilliant!', 'Keep going!'], presque: 'Almost there!',
    fini: 'Well done! You have finished.', recommencer: 'Start again',
    minuteur: 'I am counting with you', minuteurFin: 'Finished!', lancer: 'Start the timer', secondes: 'seconds',
    aidant: 'For helpers', aidantIntro: 'Here, a relative or a professional prepares the activities.',
    nouvelle: 'New activity', modifier: 'Edit', supprimer: 'Delete', confirmerSuppr: (n) => `Delete “${n}”?`,
    nomActivite: 'Name of the activity', image: 'Picture', etapes: 'Steps', texteEtape: 'Text of the step (short sentence)',
    photo: 'Take or choose a photo', sansPhoto: 'Remove the photo', minuteurEtape: 'Timer (in seconds, 0 = none)',
    ajouterEtape: 'Add a step', monter: 'Move up', descendre: 'Move down', retirerEtape: 'Remove the step',
    enregistrer: 'Save', annuler: 'Cancel', reinit: 'Restore the starting activities', confirmerReinit: 'Restore the starting activities? Your activities will be erased.',
    lectureAuto: 'Read each step aloud', langue: 'Language', plein: 'The phone memory is full. Use fewer photos.',
    vide: 'Add at least one step with a text.', vie: 'Everything stays on this phone. No account, no ads.',
    etapeN: (i) => `Step ${i}`
  }
};
const LANGUES = ['fr', 'nl', 'en'];

/* Activités de départ, en phrases courtes (règles du FALC : une idée par phrase, mots simples). */
const MODELES = {
  mains: { icone: '🧼', nom: { fr: 'Me laver les mains', nl: 'Mijn handen wassen', en: 'Wash my hands' }, etapes: [
    ['🚰', 'Ouvrez le robinet.', 'Draai de kraan open.', 'Turn on the tap.'],
    ['🧴', 'Mettez du savon.', 'Neem zeep.', 'Put on some soap.'],
    ['👐', 'Frottez vos mains.', 'Wrijf uw handen.', 'Rub your hands.', 30],
    ['💧', 'Rincez vos mains.', 'Spoel uw handen.', 'Rinse your hands.'],
    ['🚰', 'Fermez le robinet.', 'Draai de kraan dicht.', 'Turn off the tap.'],
    ['🧻', 'Séchez vos mains.', 'Droog uw handen.', 'Dry your hands.']] },
  dents: { icone: '🪥', nom: { fr: 'Me brosser les dents', nl: 'Mijn tanden poetsen', en: 'Brush my teeth' }, etapes: [
    ['🪥', 'Mettez le dentifrice sur la brosse.', 'Doe tandpasta op de borstel.', 'Put toothpaste on the brush.'],
    ['😁', 'Brossez vos dents.', 'Poets uw tanden.', 'Brush your teeth.', 120],
    ['💦', 'Crachez dans le lavabo.', 'Spuug in de wastafel.', 'Spit in the sink.'],
    ['🥛', 'Rincez votre bouche.', 'Spoel uw mond.', 'Rinse your mouth.'],
    ['🧽', 'Rincez et rangez la brosse.', 'Spoel en berg de borstel op.', 'Rinse and put the brush away.']] },
  sac: { icone: '🎒', nom: { fr: 'Préparer mon sac', nl: 'Mijn tas klaarmaken', en: 'Pack my bag' }, etapes: [
    ['👛', 'Mettez votre portefeuille dans le sac.', 'Doe uw portemonnee in de tas.', 'Put your wallet in the bag.'],
    ['🔑', 'Mettez vos clés dans le sac.', 'Doe uw sleutels in de tas.', 'Put your keys in the bag.'],
    ['📱', 'Mettez votre téléphone dans le sac.', 'Doe uw telefoon in de tas.', 'Put your phone in the bag.'],
    ['🚌', 'Mettez votre carte de bus dans le sac.', 'Doe uw buskaart in de tas.', 'Put your bus card in the bag.'],
    ['🎒', 'Fermez le sac.', 'Doe de tas dicht.', 'Close the bag.']] },
  sortir: { icone: '🚪', nom: { fr: 'Sortir de la maison', nl: 'Het huis verlaten', en: 'Leave the house' }, etapes: [
    ['☔', 'Regardez le temps dehors.', 'Kijk naar het weer buiten.', 'Look at the weather outside.'],
    ['🧥', 'Mettez votre veste.', 'Doe uw jas aan.', 'Put on your coat.'],
    ['🎒', 'Prenez votre sac.', 'Neem uw tas.', 'Take your bag.'],
    ['💡', 'Éteignez la lumière.', 'Doe het licht uit.', 'Turn off the light.'],
    ['🔑', 'Fermez la porte à clé.', 'Doe de deur op slot.', 'Lock the door.']] },
  repas: { icone: '🍽️', nom: { fr: 'Mettre la table', nl: 'De tafel dekken', en: 'Set the table' }, etapes: [
    ['🍽️', 'Posez une assiette pour chaque personne.', 'Zet een bord voor elke persoon.', 'Put a plate for each person.'],
    ['🍴', 'Posez la fourchette à gauche.', 'Leg de vork links.', 'Put the fork on the left.'],
    ['🔪', 'Posez le couteau à droite.', 'Leg het mes rechts.', 'Put the knife on the right.'],
    ['🥛', 'Posez un verre devant l’assiette.', 'Zet een glas voor het bord.', 'Put a glass in front of the plate.'],
    ['🧻', 'Posez une serviette.', 'Leg een servet.', 'Put a napkin.']] }
};
const EMOJIS = ['🧼', '🚰', '🧴', '👐', '💧', '🧻', '🪥', '😁', '🥛', '🎒', '👛', '🔑', '📱', '🚌', '🚆', '🚪', '🧥', '👟', '👕', '👖',
  '🧦', '☔', '💡', '🍽️', '🍴', '🥣', '🍎', '🥪', '☕', '🛏️', '🚿', '🛁', '🚽', '💊', '🩺', '📅', '⏰', '🛒', '💶', '🏠',
  '🏫', '💼', '🧹', '🧺', '🗑️', '📞', '✉️', '🎵', '📺', '⚽', '🐕', '🌙', '☀️', '✅', '⭐', '❤️'];

const $ = (s) => document.querySelector(s);
const app = $('#app');
const echapper = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const stock = {
  lire(cle, defaut) { try { const v = localStorage.getItem('pap.' + cle); return v === null ? defaut : JSON.parse(v); } catch (e) { return defaut; } },
  ecrire(cle, v) { try { localStorage.setItem('pap.' + cle, JSON.stringify(v)); return true; } catch (e) { return false; } }
};

let langue = stock.lire('langue', (navigator.language || 'fr').slice(0, 2));
if (!TEXTES[langue]) langue = 'fr';
let T = TEXTES[langue];
let lectureAuto = stock.lire('lectureAuto', true);

function routinesDeDepart() {
  const i = LANGUES.indexOf(langue) + 1;
  return Object.entries(MODELES).map(([cle, m]) => ({
    id: cle, modele: cle, icone: m.icone, nom: m.nom[langue],
    etapes: m.etapes.map((e) => ({ icone: e[0], texte: e[i], minuteur: e[4] || 0 }))
  }));
}
let routines = stock.lire('routines', null) || routinesDeDepart();
function sauver() { if (!stock.ecrire('routines', routines)) { alert(T.plein); return false; } return true; }
/* Les activités de départ non modifiées suivent la langue choisie. */
function traduireModeles() {
  const i = LANGUES.indexOf(langue) + 1;
  routines.forEach((r) => {
    if (r.modele && MODELES[r.modele]) {
      const m = MODELES[r.modele]; r.nom = m.nom[langue];
      r.etapes = m.etapes.map((e) => ({ icone: e[0], texte: e[i], minuteur: e[4] || 0 }));
    }
  });
}

/* ---------- Voix, sons, vibrations ---------- */
let audio = null;
function parler(texte) {
  $('#annonce').textContent = '';
  setTimeout(() => { $('#annonce').textContent = texte; }, 30);
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
const sonBravo = () => { note(523, 0, 0.15); note(659, 0.12, 0.15); note(784, 0.24, 0.3); };
const sonFin = () => { [523, 659, 784, 1047].forEach((f, i) => note(f, i * 0.14, 0.3)); };
const vibrer = (m) => { if (navigator.vibrate) navigator.vibrate(m); };

/* ---------- Écrans ---------- */
let minuteurId = null;
function afficher(html, focusSel) {
  clearInterval(minuteurId); minuteurId = null;
  app.innerHTML = html;
  window.scrollTo(0, 0);
  const cible = app.querySelector(focusSel || 'h1, h2');
  if (cible) { cible.setAttribute('tabindex', '-1'); cible.focus(); }
}
const visuel = (e, grand) => e.photo ? `<img src="${e.photo}" alt="">` : `<span aria-hidden="true">${echapper(e.icone || '⭐')}</span>`;

function ecranAccueil() {
  document.title = 'Pas à pas';
  afficher(`
    <div class="barre"><h1>${T.bonjour}</h1>
      <button class="petit" id="langue" aria-label="${T.langue} : ${T.nomLangue}">${T.court}</button></div>
    <p>${T.choisir}</p>
    <div class="grille">
      ${routines.map((r, i) => `<button class="carte" data-i="${i}"><span class="emoji" aria-hidden="true">${echapper(r.icone)}</span><span>${echapper(r.nom)}</span></button>`).join('')}
    </div>
    <button class="petit" id="aidant"><span aria-hidden="true">⚙️</span> ${T.aidant}</button>
    <p class="aide">${T.vie}</p>
    <p><a class="lien" href="confidentialite.html">${T.conf}</a></p>`);
  app.querySelectorAll('.carte').forEach((b) => b.addEventListener('click', () => ecranEtape(+b.dataset.i, 0)));
  $('#aidant').addEventListener('click', ecranAidant);
  $('#langue').addEventListener('click', () => {
    langue = LANGUES[(LANGUES.indexOf(langue) + 1) % LANGUES.length]; T = TEXTES[langue];
    document.documentElement.lang = langue; stock.ecrire('langue', langue);
    traduireModeles(); sauver(); ecranAccueil(); $('#langue').focus();
  });
}

function ecranEtape(ri, ei) {
  const r = routines[ri], e = r.etapes[ei], n = r.etapes.length;
  document.title = `${r.nom} – ${T.etape(ei + 1, n)}`;
  afficher(`
    <div class="barre">
      <button class="petit" id="accueil"><span aria-hidden="true">🏠</span> ${T.accueil}</button>
      ${ei > 0 ? `<button class="petit" id="precedent" aria-label="${T.precedent}"><span aria-hidden="true">⬅</span></button>` : ''}
    </div>
    <h2>${echapper(r.nom)} — ${T.etape(ei + 1, n)}</h2>
    <div class="progression" aria-hidden="true">${r.etapes.map((_, k) => `<span class="point ${k < ei ? 'fait' : k === ei ? 'actuel' : ''}"></span>`).join('')}</div>
    <div class="image-etape">${visuel(e)}</div>
    <p class="texte-etape" id="texte">${echapper(e.texte)}</p>
    ${e.minuteur ? `<div><p class="minuteur" id="compte" aria-live="off">${e.minuteur}</p><div class="jauge" aria-hidden="true"><div id="jauge"></div></div></div>
      <button class="ecouter" id="lancer"><span aria-hidden="true">⏱️</span> ${T.lancer}</button>` : ''}
    <button class="ecouter" id="ecouter"><span aria-hidden="true">🔊</span> ${T.ecouter}</button>
    <button class="principal" id="fait"><span aria-hidden="true">✅</span> ${T.fait}</button>`, '#texte');
  $('#accueil').addEventListener('click', ecranAccueil);
  if (ei > 0) $('#precedent').addEventListener('click', () => ecranEtape(ri, ei - 1));
  $('#ecouter').addEventListener('click', () => parler(e.texte));
  if (e.minuteur) $('#lancer').addEventListener('click', () => lancerMinuteur(e.minuteur));
  $('#fait').addEventListener('click', () => etapeFaite(ri, ei));
  if (lectureAuto) setTimeout(() => parler(e.texte), 250);
}

function lancerMinuteur(total) {
  clearInterval(minuteurId);
  let reste = total; const debut = Date.now();
  parler(`${T.minuteur}. ${total} ${T.secondes}.`);
  minuteurId = setInterval(() => {
    reste = Math.max(0, total - Math.floor((Date.now() - debut) / 1000));
    const c = $('#compte'), j = $('#jauge'); if (!c) { clearInterval(minuteurId); return; }
    c.textContent = reste; j.style.width = `${(100 * (total - reste)) / total}%`;
    if (reste > 0 && reste <= 3) note(660, 0, 0.1);
    if (reste === 0) { clearInterval(minuteurId); note(880, 0, 0.4); vibrer([200, 100, 200]); parler(T.minuteurFin); $('#fait').focus(); }
  }, 1000);
}

function etapeFaite(ri, ei) {
  const r = routines[ri], dernier = ei === r.etapes.length - 1;
  if (dernier) { ecranFin(ri); return; }
  const restant = r.etapes.length - ei - 1;
  const mot = restant === 1 ? T.presque : T.bravos[Math.floor(Math.random() * T.bravos.length)];
  const b = $('#bravo');
  b.innerHTML = `<span class="emoji" aria-hidden="true">⭐</span><span>${mot}</span>`;
  b.hidden = false; sonBravo(); vibrer(80); parler(mot);
  setTimeout(() => { b.hidden = true; ecranEtape(ri, ei + 1); }, 1400);
}

function ecranFin(ri) {
  const r = routines[ri];
  document.title = `${r.nom} – ${T.fini}`;
  afficher(`
    <div class="fin"><p class="emoji" aria-hidden="true">🎉</p></div>
    <h2>${T.fini}</h2>
    <p class="texte-etape">${echapper(r.nom)}</p>
    <button class="principal" id="accueil"><span aria-hidden="true">🏠</span> ${T.accueil}</button>
    <button class="ecouter" id="encore"><span aria-hidden="true">🔁</span> ${T.recommencer}</button>`);
  sonFin(); vibrer([100, 60, 100, 60, 200]); parler(`${T.fini} ${r.nom}.`);
  $('#accueil').addEventListener('click', ecranAccueil);
  $('#encore').addEventListener('click', () => ecranEtape(ri, 0));
}

/* ---------- Espace aidant ---------- */
function ecranAidant() {
  document.title = `Pas à pas – ${T.aidant}`;
  afficher(`
    <div class="barre"><h1>${T.aidant}</h1><button class="petit" id="accueil"><span aria-hidden="true">🏠</span> ${T.accueil}</button></div>
    <p class="aide">${T.aidantIntro}</p>
    <label class="ligne" style="align-items:center"><input type="checkbox" id="auto" ${lectureAuto ? 'checked' : ''} style="width:44px;height:44px"> ${T.lectureAuto}</label>
    <button class="principal" id="nouvelle"><span aria-hidden="true">➕</span> ${T.nouvelle}</button>
    <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:10px">
      ${routines.map((r, i) => `<li class="ligne" style="align-items:center"><span aria-hidden="true" style="font-size:2rem">${echapper(r.icone)}</span>
        <span style="flex:1;font-weight:700">${echapper(r.nom)}</span>
        <button class="petit" data-modif="${i}" aria-label="${T.modifier} : ${echapper(r.nom)}">${T.modifier}</button>
        <button class="petit danger" data-suppr="${i}" aria-label="${T.supprimer} : ${echapper(r.nom)}">${T.supprimer}</button></li>`).join('')}
    </ul>
    <button class="petit danger" id="reinit">${T.reinit}</button>`);
  $('#accueil').addEventListener('click', ecranAccueil);
  $('#auto').addEventListener('change', (ev) => { lectureAuto = ev.target.checked; stock.ecrire('lectureAuto', lectureAuto); });
  $('#nouvelle').addEventListener('click', () => ecranEditeur(null));
  app.querySelectorAll('[data-modif]').forEach((b) => b.addEventListener('click', () => ecranEditeur(+b.dataset.modif)));
  app.querySelectorAll('[data-suppr]').forEach((b) => b.addEventListener('click', () => {
    const i = +b.dataset.suppr;
    if (confirm(T.confirmerSuppr(routines[i].nom))) { routines.splice(i, 1); sauver(); ecranAidant(); }
  }));
  $('#reinit').addEventListener('click', () => { if (confirm(T.confirmerReinit)) { routines = routinesDeDepart(); sauver(); ecranAidant(); } });
}

function reduirePhoto(fichier) {
  return new Promise((ok, ko) => {
    const img = new Image(), url = URL.createObjectURL(fichier);
    img.onload = () => {
      const max = 480, k = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas'); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
      ok(c.toDataURL('image/jpeg', 0.7));
    };
    img.onerror = ko; img.src = url;
  });
}

function ecranEditeur(index) {
  const brouillon = index === null ? { id: 'r' + Date.now(), icone: '⭐', nom: '', etapes: [{ icone: '⭐', texte: '', minuteur: 0 }] }
    : JSON.parse(JSON.stringify(routines[index]));
  const grilleEmoji = (choisi, attr) => `<div class="choix-emoji" role="group">${EMOJIS.map((em) =>
    `<button type="button" ${attr}="${em}" aria-pressed="${em === choisi}" aria-label="${em}">${em}</button>`).join('')}</div>`;
  function rendu() {
    afficher(`
      <div class="barre"><h1>${index === null ? T.nouvelle : T.modifier}</h1></div>
      <div><label for="nom">${T.nomActivite}</label><input type="text" id="nom" maxlength="40" value="${echapper(brouillon.nom)}" autocomplete="off"></div>
      <fieldset><legend>${T.image}</legend>${grilleEmoji(brouillon.icone, 'data-icone')}</fieldset>
      <h2>${T.etapes}</h2>
      ${brouillon.etapes.map((e, k) => `
        <fieldset data-k="${k}"><legend>${T.etapeN(k + 1)}</legend>
          <label for="t${k}">${T.texteEtape}</label><input type="text" id="t${k}" data-texte="${k}" maxlength="80" value="${echapper(e.texte)}" autocomplete="off">
          <details><summary style="min-height:48px;display:flex;align-items:center;font-weight:700;cursor:pointer">${T.image} : <span aria-hidden="true" style="font-size:2rem;margin-left:8px">${e.photo ? '' : echapper(e.icone)}</span>
            ${e.photo ? `<img class="vignette" src="${e.photo}" alt="">` : ''}</summary>${grilleEmoji(e.icone, `data-e${k}`)}</details>
          <div class="ligne">
            <label class="bouton petit" style="display:inline-flex"><span aria-hidden="true">📷</span> ${T.photo}<input type="file" accept="image/*" capture="environment" data-photo="${k}" class="sr-only"></label>
            ${e.photo ? `<button type="button" class="petit" data-sansphoto="${k}">${T.sansPhoto}</button>` : ''}
          </div>
          <label for="m${k}">${T.minuteurEtape}</label><input type="number" id="m${k}" data-min="${k}" min="0" max="3600" inputmode="numeric" value="${e.minuteur || 0}">
          <div class="ligne">
            ${k > 0 ? `<button type="button" class="petit" data-haut="${k}">⬆ ${T.monter}</button>` : ''}
            ${k < brouillon.etapes.length - 1 ? `<button type="button" class="petit" data-bas="${k}">⬇ ${T.descendre}</button>` : ''}
            ${brouillon.etapes.length > 1 ? `<button type="button" class="petit danger" data-retirer="${k}">${T.retirerEtape}</button>` : ''}
          </div>
        </fieldset>`).join('')}
      <button type="button" class="ecouter" id="ajouter"><span aria-hidden="true">➕</span> ${T.ajouterEtape}</button>
      <button type="button" class="principal" id="enregistrer"><span aria-hidden="true">💾</span> ${T.enregistrer}</button>
      <button type="button" class="petit" id="annuler">${T.annuler}</button>`, '#nom');
    const lireChamps = () => {
      brouillon.nom = $('#nom').value.trim();
      app.querySelectorAll('[data-texte]').forEach((x) => { brouillon.etapes[+x.dataset.texte].texte = x.value.trim(); });
      app.querySelectorAll('[data-min]').forEach((x) => { brouillon.etapes[+x.dataset.min].minuteur = Math.max(0, Math.min(3600, parseInt(x.value, 10) || 0)); });
    };
    const refaire = (focus) => { lireChamps(); delete brouillon.modele; rendu(); if (focus) { const f = app.querySelector(focus); if (f) f.focus(); } };
    app.querySelectorAll('[data-icone]').forEach((b) => b.addEventListener('click', () => { brouillon.icone = b.dataset.icone; refaire(`[data-icone="${b.dataset.icone}"]`); }));
    brouillon.etapes.forEach((e, k) => app.querySelectorAll(`[data-e${k}]`).forEach((b) => b.addEventListener('click', () => {
      e.icone = b.getAttribute(`data-e${k}`); delete e.photo; refaire(`#t${k}`);
    })));
    app.querySelectorAll('[data-photo]').forEach((x) => x.addEventListener('change', async () => {
      if (!x.files[0]) return; const k = +x.dataset.photo;
      try { brouillon.etapes[k].photo = await reduirePhoto(x.files[0]); } catch (e) { /* image illisible */ }
      refaire(`#t${k}`);
    }));
    app.querySelectorAll('[data-sansphoto]').forEach((b) => b.addEventListener('click', () => { delete brouillon.etapes[+b.dataset.sansphoto].photo; refaire(`#t${b.dataset.sansphoto}`); }));
    app.querySelectorAll('[data-haut]').forEach((b) => b.addEventListener('click', () => { lireChamps(); const k = +b.dataset.haut; [brouillon.etapes[k - 1], brouillon.etapes[k]] = [brouillon.etapes[k], brouillon.etapes[k - 1]]; refaire(`#t${k - 1}`); }));
    app.querySelectorAll('[data-bas]').forEach((b) => b.addEventListener('click', () => { lireChamps(); const k = +b.dataset.bas; [brouillon.etapes[k + 1], brouillon.etapes[k]] = [brouillon.etapes[k], brouillon.etapes[k + 1]]; refaire(`#t${k + 1}`); }));
    app.querySelectorAll('[data-retirer]').forEach((b) => b.addEventListener('click', () => { lireChamps(); brouillon.etapes.splice(+b.dataset.retirer, 1); refaire('#ajouter'); }));
    $('#ajouter').addEventListener('click', () => { lireChamps(); brouillon.etapes.push({ icone: '⭐', texte: '', minuteur: 0 }); refaire(`#t${brouillon.etapes.length - 1}`); });
    $('#annuler').addEventListener('click', ecranAidant);
    $('#enregistrer').addEventListener('click', () => {
      lireChamps();
      brouillon.etapes = brouillon.etapes.filter((e) => e.texte);
      if (!brouillon.etapes.length) { alert(T.vide); if (!brouillon.etapes.length) brouillon.etapes.push({ icone: '⭐', texte: '', minuteur: 0 }); rendu(); return; }
      if (!brouillon.nom) brouillon.nom = brouillon.etapes[0].texte;
      delete brouillon.modele;
      const avant = routines.slice();
      if (index === null) routines.push(brouillon); else routines[index] = brouillon;
      if (!sauver()) { routines = avant; return; }
      ecranAidant();
    });
  }
  rendu();
}

document.documentElement.lang = langue;
/* Accès direct par adresse (raccourcis, démonstrations) : #activite-mains-2, #fin-mains, #aidant, #editeur-0 */
(function () {
  const h = location.hash.slice(1).split('-'), i = routines.findIndex((r) => r.id === h[1]);
  if (h[0] === 'activite' && i >= 0) ecranEtape(i, Math.max(0, Math.min(routines[i].etapes.length - 1, (parseInt(h[2], 10) || 1) - 1)));
  else if (h[0] === 'fin' && i >= 0) ecranFin(i);
  else if (h[0] === 'aidant') ecranAidant();
  else if (h[0] === 'editeur') ecranEditeur(routines[+h[1]] ? +h[1] : null);
  else ecranAccueil();
})();
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
