// ============================================================
// EPSTEIN ISLAND ESCAPE v4.0 — Major gameplay overhaul
// 15 linear levels, 5 bosses, i18n, audio, mouse/pad/touch
// ============================================================
(()=>{
'use strict';

// ======================== CONSTANTS ========================
const T=32, PLAYER_SPEED=2.5, SPRINT_MULT=1.7, PLAYER_SIZE=16, ENEMY_SIZE=20;
const DETECTION=150, DETECTION_SPRINT=250, ENEMY_CD=800, BOSS_CD=600, PICKUP_R=30;
let CONTROL_SCHEME='keyboard'; // 'keyboard' or 'mouse'
let mouseX=0,mouseY=0,mouseDown=false;
let gamepadActive=false;
let highScore=parseInt(localStorage.getItem('epstein_highscore')||'0');
let currentScore=0;

// ======================== I18N ========================
const TEXT={
fi:{
  subtitle:'Pakene saarelta hengissä',
  menuDesc:'Heräät tuntemattomassa paikassa Epsteinin saaren syvyyksissä.\nKannibaali-satanistit, vartijakaarti ja salaiset kulttilaiset saartavat sinut.\n15 tasoa, 5 pomoa, satunnaisgeneroidut kentät. Pakene tai kuole.',
  controls:'WASD / Nuolet = Liiku | Klikkaa/SPACE = Hyökkää | SHIFT = Juokse | E = Poimi | 1–6 = Vaihda ase',
  controlKB:'Näppäimistö (SPACE hyökkäys)',
  controlMouse:'Hiiri + Näppäimistö (klikkaa hyökkäys 8 suuntaan)',
  controlPrompt:'Valitse ohjaus:',
  killAll:'TAPA KAIKKI VIHOLLISET!',
  score:'Pisteet',
  hiScore:'Ennätys',
  mysteryGood:['HP +25!','Nopeus boost!','DMG +50%!','Ammo +15!'],
  mysteryBad:['Myrkky! HP -20','Hitaus!','Ammo katoaa!'],
  pressEnter:'[ PAINA ENTER ALOITTAAKSESI ]',
  continuePrompt:'[ PAINA ENTER JATKAAKSESI ]',
  retryPrompt:'[ PAINA ENTER YRITTÄÄKSESI UUDELLEEN ]',
  replayPrompt:'[ PAINA ENTER PELATAKSESI UUDELLEEN ]',
  deathTitle:'💀 KUOLIT',
  victoryTitle:'🎉 PÄÄSIT PAKOON!',
  victoryDesc:'Onnistuit pakenemaan Epsteinin saarelta!\nVoitit Hillaryn, Trumpin, P Diddyn, Bill Gatesin ja Zombi-Epsteinin!\nMaailma saa tietää totuuden… vai peitetäänkö kaikki jälleen?',
  victoryThanks:'Kiitos pelaamisesta!',
  exit:'ULOS',locked:'LUKITTU',bossDown:'POMO KUKISTETTU!',
  deathMsgs:['Satanistit saivat sinut kiinni…','Kannibaalit saivat ateriansa…','Et ollut tarpeeksi nopea…','Kultti vaatii uhrinsa…','Saari nielaisi sinut…'],
  levels:[
    {name:'Taso 1 – Vankityrmä',desc:'Heräät kylmässä sellissä saaren alla.\nKuulet kaukaista laulantaa ja kaikuvia askeleita.\nEtsi tie ulos tyrmästä.'},
    {name:'Taso 2 – Rituaalihuone',desc:'Satanistinen rituaalihuone avautuu edessäsi.\nPentagrammit hehkuvat punaisena lattiassa.\nKulttilaiset suorittavat synkkää seremoniaa.'},
    {name:'Taso 3 – Katakombat',desc:'Tuhansia vuosia vanhat katakombat aukeavat edessäsi.\nKallonmuotoiset kolot seinämissä tuijottavat sinua.\nKannibaalit väijyvät arkkujen ja luukäytävien varjoissa.'},
    {name:'Taso 4 – Kannibaalien keittiö',desc:'Kammottava keittiö täynnä verta ja lihankoukkuja.\nIhmisten päitä lojuu lattioilla. Pannuissa kiehuu jotain kauheaa.\nKannibaalit valmistavat iltapalaa… sinusta.'},
    {name:'Taso 5 – MKUltra-laboratorio',desc:'Salainen mielenhallinta-laboratorio teräslattioilla.\nLeikkauspöytiä, elektrodi-kypäriä ja pakkopaitoja.\nCIA:n dokumentteja kaikkialla. Löydät pesäpallomailan sähköshokkihuoneesta.'},
    {name:'Taso 6 – Hillaryn palvelinfarmi',desc:'"Nämä sähköpostit olivat henkilökohtaisia!"\nTeollinen palvelinfarmi huminoi betoniseinien sisällä.\nServerikaappien LED-valot vilkkuvat pimeydessä. Hän huutaa "DELETE!"'},
    {name:'Taso 7 – Illuminati-temppeli',desc:'Mustakullattu temppeli Illuminatin symboleilla.\nVäärinpäin ristejä ja pyramideja joka puolella.\nKaikkialle näkevä silmä tuijottaa joka seinältä.'},
    {name:'Taso 8 – Epsteinin kartano',desc:'Keskiaikainen puukartano täynnä synkkiä salaisuuksia.\nTakat, kirjahyllyt ja kynttilakruunut valaisevat pimeät käytävät.\nEliittivartijat partioivat joka huoneessa.'},
    {name:'Taso 9 – Trumpin tanssihalli',desc:'"Tämä on paras saari, kaikki sanovat niin!"\nKaikki on kullasta: seinät, pylväät, patsaat ja timantit.\nDonald Trump hallitsee tanssisalia. Hän on VALTAVA.'},
    {name:'Taso 10 – P Diddyn bileet',desc:'"Let\'s party! Kukaan ei lähde bileistäni!"\nDiskopallot pyörivät, bassot järisyttävät. Vauvaöljyä kaikkialla.\nKokaiiniviivoja pöydällä. Löydät pistoolin.'},
    {name:'Taso 11 – Bill Gatesin rokotusklinikka',desc:'"Aika boosteriannokselle! Luota tieteeseen!"\nSteriili valkoinen klinikka. Sairaala-sänkyjä ja tippa-telineitä.\nBiohazard-merkkejä joka nurkassa. Windows päivittyy… sinun DNA:hasi.'},
    {name:'Taso 12 – Saaren viidakko',desc:'Pääsit viimein ulos rakennuksista saaren viidakkoon!\nTribaalisoturit varjostavat sinua puiden seasta.\nEtä tiesi rantaa kohti.'},
    {name:'Taso 13 – Saaren rannikko',desc:'Rantaviiva näkyy! Hiekka narisee jalkojen alla.\nVartijat partioivat rantaa. Vesi on kylmää.\nLöydät katanan vanhasta laivanhylystä.'},
    {name:'Taso 14 – Satama',desc:'Satama-alue laitureineen ja veneineen.\nVesi loiskii puulaiturien alla. Veneitä kiikkuu ankkureissaan.\nLöydät haulikon vartijoiden varastosta.'},
    {name:'Taso 15 – SUURI PAKO',desc:'"Että luulit pakenevasi?! MINÄ EN KUOLLUT!"\nZombi-Epstein nousee sataman laiturialueella.\nVoita hänet ja pakene veneellä lopullisesti!'},
  ]
},
en:{
  subtitle:'Escape the Island Alive',
  menuDesc:'You wake up in an unknown place deep inside Epstein\'s island.\nCannibal-satanists, armed guards and secret cultists surround you.\n15 levels, 5 bosses, procedurally generated. Escape or die.',
  controls:'WASD / Arrows = Move | Click/SPACE = Attack | SHIFT = Sprint | E = Pick up | 1–6 = Switch weapon',
  controlKB:'Keyboard Only (SPACE to attack)',
  controlMouse:'Mouse + Keyboard (click to attack 8-way)',
  controlPrompt:'Choose controls:',
  killAll:'KILL ALL ENEMIES!',
  score:'Score',
  hiScore:'High Score',
  mysteryGood:['HP +25!','Speed boost!','DMG +50%!','Ammo +15!'],
  mysteryBad:['Poison! HP -20','Slowdown!','Ammo lost!'],
  pressEnter:'[ PRESS ENTER TO START ]',
  continuePrompt:'[ PRESS ENTER TO CONTINUE ]',
  retryPrompt:'[ PRESS ENTER TO RETRY ]',
  replayPrompt:'[ PRESS ENTER TO PLAY AGAIN ]',
  deathTitle:'💀 YOU DIED',
  victoryTitle:'🎉 YOU ESCAPED!',
  victoryDesc:'You escaped Epstein\'s island!\nYou defeated Hillary, Trump, P Diddy, Bill Gates and Zombie-Epstein!\nThe world will know the truth… or will they cover it up again?',
  victoryThanks:'Thanks for playing!',
  exit:'EXIT',locked:'LOCKED',bossDown:'BOSS DEFEATED!',
  deathMsgs:['The satanists got you…','The cannibals got their meal…','You weren\'t fast enough…','The cult demands its sacrifice…','The island swallowed you…'],
  levels:[
    {name:'Level 1 – The Dungeon',desc:'You wake up in a cold cell beneath the island.\nYou hear distant chanting and echoing footsteps.\nFind your way out of the dungeon.'},
    {name:'Level 2 – Ritual Chamber',desc:'A satanic ritual chamber opens before you.\nPentagrams glow red on the floor.\nCultists perform a dark ceremony.'},
    {name:'Level 3 – Catacombs',desc:'Ancient catacombs full of skull niches and coffins.\nCannibal lurk in the shadowy tunnels between bone walls.\nWill you find a knife near an old victim?'},
    {name:'Level 4 – Cannibal Kitchen',desc:'A blood-soaked kitchen with meat hooks and severed heads.\nPans sizzle with something horrible. Blood drips everywhere.\nThe cannibals are preparing dinner… you.'},
    {name:'Level 5 – MKUltra Lab',desc:'An industrial mind-control laboratory with steel floors.\nOperating tables, electrode helmets, straitjackets.\nCIA documents everywhere. You find a bat in the shock room.'},
    {name:'Level 6 – Hillary\'s Server Farm',desc:'"Those emails were personal!"\nAn industrial server farm hums behind concrete walls.\nServer rack LEDs blink in the dark. She screams "DELETE!"'},
    {name:'Level 7 – Illuminati Temple',desc:'A black-gold temple with Illuminati symbols.\nInverted crosses and pyramids everywhere.\nThe all-seeing eye stares from every wall.'},
    {name:'Level 8 – Epstein\'s Mansion',desc:'A medieval wooden mansion full of dark secrets.\nFireplaces, bookshelves and chandeliers light the dark halls.\nElite guards patrol every room.'},
    {name:'Level 9 – Trump\'s Dance Hall',desc:'"This is the best island, everyone says so!"\nEverything is gold: walls, pillars, statues and diamonds.\nDonald Trump rules the hall. He is HUGE.'},
    {name:'Level 10 – P Diddy\'s Party',desc:'"Let\'s party! Nobody leaves my party!"\nDisco balls spin, bass speakers pound. Baby oil everywhere.\nCocaine lines on the tables. You find a pistol.'},
    {name:'Level 11 – Bill Gates Vaccine Clinic',desc:'"Time for your booster! Trust the science!"\nA sterile white clinic. Hospital beds and IV drips.\nBiohazard signs in every corner. Windows is updating… your DNA.'},
    {name:'Level 12 – Island Jungle',desc:'You finally made it outside into the island jungle!\nTribal warriors stalk you from between the trees.\nMake your way toward the coast.'},
    {name:'Level 13 – Island Coast',desc:'The coastline is in sight! Sand crunches underfoot.\nGuards patrol the beach. The water is cold.\nYou find a katana in an old shipwreck.'},
    {name:'Level 14 – The Dock',desc:'A dock area with wooden piers, boats and water.\nWaves lap against the pilings. Boats sway at anchor.\nYou find a shotgun in the guards\' storage.'},
    {name:'Level 15 – THE GREAT ESCAPE',desc:'"You thought you could escape?! I DIDN\'T KILL MYSELF!"\nZombie-Epstein rises at the dock pier area.\nDefeat him and escape by boat!'},
  ]
}
};
let LANG='fi';
function t(key){return TEXT[LANG][key];}

// ======================== WEAPONS ========================
const WEAPON_SLOTS=['fists','knife','bat','katana','gun','shotgun'];
const WEAPONS={
  fists:  {fi:'Nyrkit',en:'Fists',         dmg:12,range:30,cd:350,ranged:false},
  knife:  {fi:'Veitsi',en:'Knife',          dmg:28,range:34,cd:280,ranged:false},
  bat:    {fi:'Pesäpallomaila',en:'Bat',     dmg:40,range:44,cd:380,ranged:false},
  katana: {fi:'Katana',en:'Katana',          dmg:65,range:48,cd:240,ranged:false},
  gun:    {fi:'Pistooli',en:'Pistol',        dmg:55,range:240,cd:480,ranged:true},
  shotgun:{fi:'Haulikko',en:'Shotgun',       dmg:75,range:140,cd:700,ranged:true},
};
function wName(id){return WEAPONS[id][LANG];}

// ======================== LEVEL CONFIG ========================
// LINEAR STORY ORDER:
// 1-5: Underground (dungeon→ritual→catacombs→kitchen→lab)
// 6-8: Indoor upper (hillary→illuminati temple→mansion)
// 9-11: Indoor bosses (trump→p diddy→gates)
// 12-13: Outdoor (jungle→coast)
// 14-15: Escape (dock→final boss)
const LEVEL_CFG=[
  // 0: Dungeon — cold stone prison
  {outdoor:false,tileStyle:'dungeon',wallColor:'#3a3a3a',floorColor:'#1a1a1a',wallHi:'#4a4a4a',floorHi:'#222',darkness:0.4,
   mapW:48,mapH:32,rooms:{count:9,min:5,max:8},
   enemies:[{type:'cultist',count:6,hp:30}],
   items:[{type:'health',count:3,amount:25},{type:'mystery',count:2}],
   boss:null,decos:['torch','chain','skull','crack','cobweb'],decoChance:0.04},
  // 1: Ritual Chamber — red stone with blood
  {outdoor:false,tileStyle:'ritual',wallColor:'#3a1010',floorColor:'#1a0808',wallHi:'#501818',floorHi:'#250c0c',darkness:0.3,
   mapW:50,mapH:32,rooms:{count:9,min:5,max:9},
   enemies:[{type:'cultist',count:7,hp:35},{type:'cultist',count:3,hp:40}],
   items:[{type:'health',count:3,amount:30},{type:'mystery',count:2}],
   boss:null,decos:['pentagram','candle','blood','altar','inverted_cross'],decoChance:0.06},
  // 2: Catacombs — skull niches, arched stone, bone floors
  {outdoor:false,tileStyle:'catacombs',wallColor:'#3a3020',floorColor:'#1a1810',wallHi:'#4a4030',floorHi:'#252010',darkness:0.55,
   mapW:52,mapH:34,rooms:{count:10,min:5,max:8},
   enemies:[{type:'cannibal',count:6,hp:50},{type:'cultist',count:3,hp:40}],
   items:[{type:'knife',count:1},{type:'health',count:3,amount:30},{type:'mystery',count:2}],
   boss:null,decos:['niche_skull','bones','cobweb','crack','torch','coffin'],decoChance:0.07},
  // 3: Cannibal Kitchen — bloody tiles, meat hooks
  {outdoor:false,tileStyle:'kitchen',wallColor:'#2a1515',floorColor:'#1a0808',wallHi:'#3a2020',floorHi:'#250c0c',darkness:0.2,
   mapW:50,mapH:32,rooms:{count:9,min:5,max:9},
   enemies:[{type:'cannibal',count:7,hp:55},{type:'cannibal',count:3,hp:60}],
   items:[{type:'health',count:4,amount:35},{type:'mystery',count:2}],
   boss:null,decos:['hook','blood','meat','severed_head','pan','bones','blood_drip'],decoChance:0.08},
  // 4: MKUltra Lab — industrial green tile, steel walls
  {outdoor:false,tileStyle:'lab',wallColor:'#1a2a1a',floorColor:'#dde8dd',wallHi:'#2a3a2a',floorHi:'#ccd8cc',darkness:0.12,
   mapW:52,mapH:32,rooms:{count:10,min:5,max:9},
   enemies:[{type:'guard',count:5,hp:60},{type:'scientist',count:4,hp:30}],
   items:[{type:'bat',count:1},{type:'health',count:3,amount:40},{type:'mystery',count:2}],
   boss:null,decos:['operating_table','syringe','straitjacket','computer','electrode','barrel'],decoChance:0.07},
  // 5: Hillary Server Farm — industrial concrete, blue LEDs
  {outdoor:false,tileStyle:'serverfarm',wallColor:'#2a2a3a',floorColor:'#181822',wallHi:'#3a3a4a',floorHi:'#22222e',darkness:0.15,
   mapW:52,mapH:36,rooms:{count:6,min:7,max:14},
   enemies:[{type:'guard',count:5,hp:65}],
   items:[{type:'health',count:3,amount:50},{type:'mystery',count:1}],
   boss:{type:'hillary',name:'HILLARY CLINTON',hp:280,speed:1.8,damage:18,size:36},
   decos:['server','server','cable','computer','led_strip','crate','ventilation'],decoChance:0.09},
  // 6: Illuminati Temple — gold-black marble, symbols
  {outdoor:false,tileStyle:'temple',wallColor:'#1a1a00',floorColor:'#0f0f0a',wallHi:'#2a2a10',floorHi:'#1a1a10',darkness:0.3,
   mapW:54,mapH:34,rooms:{count:11,min:5,max:9},
   enemies:[{type:'elite',count:6,hp:85},{type:'cultist',count:5,hp:55}],
   items:[{type:'health',count:4,amount:45},{type:'mystery',count:3}],
   boss:null,decos:['eye','pentagram','candle','altar','pillar','inverted_cross','pyramid'],decoChance:0.08},
  // 7: Epstein Mansion — dark wood, medieval luxury
  {outdoor:false,tileStyle:'mansion',wallColor:'#3a2515',floorColor:'#2a1a0a',wallHi:'#4a3520',floorHi:'#352010',darkness:0.15,
   mapW:54,mapH:34,rooms:{count:11,min:6,max:10},
   enemies:[{type:'guard',count:6,hp:70},{type:'elite',count:4,hp:85}],
   items:[{type:'health',count:4,amount:40},{type:'mystery',count:2}],
   boss:null,decos:['painting','candle','fireplace','bookshelf','chandelier','rug'],decoChance:0.06},
  // 8: Trump Dance Hall — gold everything, diamonds
  {outdoor:false,tileStyle:'goldhall',wallColor:'#6a5500',floorColor:'#3a2a00',wallHi:'#8a7520',floorHi:'#4a3a10',darkness:0.08,
   mapW:52,mapH:36,rooms:{count:6,min:8,max:15},
   enemies:[{type:'guard',count:5,hp:65}],
   items:[{type:'health',count:3,amount:60},{type:'mystery',count:2}],
   boss:{type:'trump',name:'DONALD TRUMP',hp:380,speed:2.0,damage:25,size:40},
   decos:['diamond','gold_pillar','chandelier','painting','gold_statue','candle'],decoChance:0.07},
  // 9: P Diddy Party — club, neon, disco (BRIGHTER now)
  {outdoor:false,tileStyle:'club',wallColor:'#1a1030',floorColor:'#100820',wallHi:'#2a1a40',floorHi:'#1a1030',darkness:0.08,
   mapW:52,mapH:36,rooms:{count:6,min:7,max:14},
   enemies:[{type:'partygoer',count:5,hp:60},{type:'guard',count:2,hp:70}],
   items:[{type:'gun',count:1},{type:'health',count:3,amount:50},{type:'mystery',count:2}],
   boss:{type:'pdiddy',name:'P DIDDY',hp:320,speed:2.4,damage:20,size:36},
   decos:['disco_ball','baby_oil','cocaine_line','speaker','neon_light','dancer','candle'],decoChance:0.08},
  // 10: Gates Clinic — sterile white/blue, medical
  {outdoor:false,tileStyle:'clinic',wallColor:'#d8d8e8',floorColor:'#e8e8f0',wallHi:'#c8c8d8',floorHi:'#dddde8',darkness:0.03,
   mapW:52,mapH:36,rooms:{count:6,min:7,max:14},
   enemies:[{type:'scientist',count:5,hp:35},{type:'guard',count:4,hp:65}],
   items:[{type:'health',count:3,amount:50},{type:'mystery',count:2}],
   boss:{type:'gates',name:'BILL GATES',hp:300,speed:2.0,damage:20,size:34},
   decos:['syringe','computer','hospital_bed','iv_drip','biohazard','pill_bottle'],decoChance:0.07},
  // 11: Jungle — dense tropical
  {outdoor:true,tileStyle:'jungle',wallColor:'#0a3a0a',floorColor:'#1a4a1a',wallHi:'#0a2a0a',floorHi:'#2a5a2a',darkness:0.15,
   mapW:56,mapH:36,rooms:{count:10,min:6,max:10},
   enemies:[{type:'tribal',count:7,hp:60},{type:'cannibal',count:4,hp:65}],
   items:[{type:'health',count:4,amount:35},{type:'mystery',count:3}],
   boss:null,decos:['flower','mushroom','stone','bones','vine','fern'],decoChance:0.07},
  // 12: Coast — sand & surf
  {outdoor:true,tileStyle:'coast',wallColor:'#c2a050',floorColor:'#e8d080',wallHi:'#b09040',floorHi:'#d8c070',darkness:0.05,
   coast:true,mapW:58,mapH:34,rooms:{count:10,min:6,max:10},
   enemies:[{type:'guard',count:7,hp:75},{type:'elite',count:4,hp:90}],
   items:[{type:'katana',count:1},{type:'health',count:4,amount:40},{type:'mystery',count:2}],
   boss:null,decos:['shell','stone','crate','driftwood','seaweed','palm_stump'],decoChance:0.05},
  // 13: Dock — wooden piers, water, boats
  {outdoor:true,tileStyle:'dock',wallColor:'#3a2a1a',floorColor:'#5a4a30',wallHi:'#4a3a2a',floorHi:'#6a5a40',darkness:0.1,
   coast:true,mapW:56,mapH:34,rooms:{count:11,min:6,max:9},
   enemies:[{type:'guard',count:8,hp:80},{type:'elite',count:5,hp:95}],
   items:[{type:'shotgun',count:1},{type:'health',count:4,amount:50},{type:'ammo',count:3,amount:15},{type:'mystery',count:2}],
   boss:null,decos:['container','container','crate','barrel','anchor','rope_coil','boat','boat','lantern'],decoChance:0.08},
  // 14: Great Escape — dock pier area, boat escape
  {outdoor:true,tileStyle:'escape_dock',wallColor:'#1a0808',floorColor:'#4a3a28',wallHi:'#2a1010',floorHi:'#5a4a38',darkness:0.2,
   coast:true,mapW:54,mapH:36,rooms:{count:6,min:8,max:15},
   enemies:[{type:'elite',count:6,hp:90},{type:'cannibal',count:4,hp:70}],
   items:[{type:'health',count:4,amount:60},{type:'ammo',count:3,amount:20},{type:'mystery',count:2}],
   boss:{type:'epstein',name:'ZOMBI-EPSTEIN',hp:500,speed:1.8,damage:30,size:44},
   decos:['container','container','boat','boat','crate','barrel','anchor','rope_coil','lantern'],decoChance:0.08},
];
// Level state cache for backtracking
let levelStateCache={};

// ======================== AUDIO ENGINE ========================
const AudioCtx=window.AudioContext||window.webkitAudioContext;
let actx=null;
function ensureAudio(){if(!actx)actx=new AudioCtx();}
function playTone(freq,dur,vol,type){
  ensureAudio();if(!actx)return;
  const o=actx.createOscillator(),g=actx.createGain();
  o.type=type||'square';o.frequency.value=freq;
  g.gain.setValueAtTime(vol||0.08,actx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001,actx.currentTime+dur);
  o.connect(g);g.connect(actx.destination);
  o.start();o.stop(actx.currentTime+dur);
}
function sfxHit(){playTone(220,0.08,0.12,'sawtooth');playTone(120,0.06,0.1,'square');}
function sfxAttack(wep){
  switch(wep){
    case'fists':playTone(180,0.06,0.1,'square');playTone(140,0.04,0.08,'sawtooth');break;
    case'knife':playTone(800,0.04,0.1,'sawtooth');playTone(1200,0.03,0.06,'sine');break;
    case'bat':playTone(150,0.1,0.14,'square');playTone(100,0.08,0.1,'sawtooth');break;
    case'katana':playTone(1000,0.06,0.1,'sawtooth');playTone(600,0.08,0.08,'sine');playTone(1400,0.03,0.05,'sine');break;
    default:playTone(400,0.06,0.08,'square');break;
  }
}
function sfxGun(){playTone(100,0.12,0.18,'sawtooth');playTone(60,0.15,0.14,'square');}
function sfxShotgun(){playTone(80,0.15,0.2,'sawtooth');playTone(50,0.18,0.16,'square');playTone(120,0.1,0.12,'sawtooth');}
function sfxPickup(){playTone(600,0.08,0.1,'sine');playTone(900,0.1,0.08,'sine');}
function sfxPickupWeapon(wep){
  sfxPickup();
  switch(wep){
    case'knife':playTone(1200,0.06,0.08,'sawtooth');break;
    case'bat':playTone(200,0.1,0.1,'square');break;
    case'katana':playTone(1000,0.08,0.1,'sine');playTone(1500,0.06,0.06,'sine');break;
    case'gun':playTone(300,0.06,0.08,'square');playTone(500,0.04,0.06,'sine');break;
    case'shotgun':playTone(200,0.08,0.1,'square');playTone(100,0.1,0.08,'sawtooth');break;
  }
}
function sfxDeath(){playTone(200,0.3,0.12,'sawtooth');playTone(100,0.5,0.1,'square');}
function sfxEnemyDeath(){playTone(300,0.06,0.08,'square');playTone(150,0.1,0.06,'sawtooth');}
function sfxBossDie(){playTone(600,0.15,0.1,'sine');playTone(800,0.2,0.1,'sine');playTone(1000,0.25,0.08,'sine');}
function sfxStep(){playTone(80+Math.random()*40,0.04,0.02,'triangle');}
let stepTimer=0;

// Background music using oscillators
let musicPlaying=false,musicOscs=[],currentMusicType='explore';
// Algorithmic music: pentatonic scale generation with swing feel
const SCALES={
  minor:[0,3,5,7,10],  // A minor pentatonic
  major:[0,2,4,7,9],   // C major pentatonic
  blues:[0,3,5,6,7,10],// blues scale
  phrygian:[0,1,5,7,8],// dark/exotic
};
function genMelody(root,scale,len,seed){
  const notes=[];let s=seed||42;
  function prng(){s=(s*1103515245+12345)&0x7fffffff;return(s>>16)/32767;}
  let prev=0;
  for(let i=0;i<len;i++){
    const step=Math.floor(prng()*scale.length);
    const octave=Math.floor(prng()*2);
    prev=step; // keep melodic contour
    notes.push(root*Math.pow(2,octave)*(Math.pow(2,scale[step]/12)));
  }
  return notes;
}
const MUSIC_THEMES={
  explore:{notes:genMelody(110,SCALES.minor,16,42),tempo:700,wave:'triangle',vol:0.03,dur:0.7,swing:0},
  hillary:{notes:genMelody(130.81,SCALES.phrygian,16,666),tempo:420,wave:'triangle',vol:0.035,dur:0.38,swing:0.1},
  trump:{notes:genMelody(174.61,SCALES.major,16,45),tempo:300,wave:'square',vol:0.03,dur:0.25,swing:0.15},
  pdiddy:{notes:genMelody(98,SCALES.blues,16,808),tempo:220,wave:'square',vol:0.035,dur:0.18,swing:0.25},
  gates:{notes:genMelody(196,SCALES.major,16,99),tempo:500,wave:'sine',vol:0.03,dur:0.45,swing:0},
  epstein:{notes:genMelody(65.41,SCALES.phrygian,16,13),tempo:600,wave:'triangle',vol:0.04,dur:0.55,swing:0.1},
};
function startMusic(type){
  type=type||'explore';
  ensureAudio();if(!actx)return;
  if(musicPlaying&&currentMusicType===type)return;
  stopMusic();
  musicPlaying=true;currentMusicType=type;
  const theme=MUSIC_THEMES[type]||MUSIC_THEMES.explore;
  let idx=0;
  function playNote(freq,vol,dur,wave){
    const o=actx.createOscillator(),g=actx.createGain();
    o.type=wave;o.frequency.value=freq;
    g.gain.setValueAtTime(vol,actx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001,actx.currentTime+dur);
    o.connect(g);g.connect(actx.destination);
    o.start();o.stop(actx.currentTime+dur);
  }
  function playNext(){
    if(!musicPlaying||currentMusicType!==type)return;
    const note=theme.notes[idx%theme.notes.length];
    playNote(note,theme.vol,theme.dur,theme.wave);
    // Bass on beats 0,4,8,12 for groovy feel
    if(idx%4===0)playNote(note*0.5,0.02,theme.dur*0.5,'sine');
    // Diddy gets extra funky: hi-hat clicks + chord stabs
    if(type==='pdiddy'){
      playNote(8000+Math.random()*2000,0.01,0.03,'square'); // hi-hat
      if(idx%2===0)playNote(note*1.5,0.015,theme.dur*0.3,'triangle'); // chord
      if(idx%8===4)playNote(note*2,0.02,theme.dur*0.2,'sine'); // stab
    }
    idx++;
    const swing=theme.swing||0;
    const delay=theme.tempo*(1+(idx%2===0?swing:-swing*0.5));
    musicOscs.push(setTimeout(playNext,delay));
  }
  playNext();
}
function stopMusic(){
  musicPlaying=false;
  musicOscs.forEach(t=>{if(typeof t==='number')clearTimeout(t);});
  musicOscs=[];currentMusicType='';
}

// ======================== UTILITIES ========================
function rand(a,b){return Math.floor(Math.random()*(b-a+1))+a;}
function dist(x1,y1,x2,y2){const dx=x2-x1,dy=y2-y1;return Math.sqrt(dx*dx+dy*dy);}
function lerp(a,b,t){return a+(b-a)*t;}
function clamp(v,lo,hi){return v<lo?lo:v>hi?hi:v;}
function solid(t){return t==='W'||t==='#'||t==='~';}
function tileAt(g,tx,ty){if(ty<0||ty>=g.length||tx<0||tx>=g[0].length)return'W';return g[ty][tx];}
function canMove(x,y,w,h,g){
  const p=2,l=Math.floor((x+p)/T),r=Math.floor((x+w-p-1)/T),
        t=Math.floor((y+p)/T),b=Math.floor((y+h-p-1)/T);
  for(let ty=t;ty<=b;ty++)for(let tx=l;tx<=r;tx++)if(solid(tileAt(g,tx,ty)))return false;
  return true;
}
// LOS check that actually stops at walls (used for attacks AND detection)
function hasLOS(x1,y1,x2,y2,g){
  const dx=x2-x1,dy=y2-y1,d=Math.sqrt(dx*dx+dy*dy);
  if(d<1)return true;
  const steps=Math.ceil(d/8);
  const sx=dx/steps,sy=dy/steps;
  let cx=x1,cy=y1;
  for(let i=0;i<steps;i++){
    cx+=sx;cy+=sy;
    if(solid(tileAt(g,Math.floor(cx/T),Math.floor(cy/T))))return false;
  }
  return true;
}

// ======================== MAP GENERATOR ========================
function genMap(cfg,seed){
  const{mapW:W,mapH:H,outdoor,rooms:rc,boss,decos,decoChance,coast}=cfg;
  // Seeded PRNG for consistent layouts
  let _s=seed||Math.floor(Math.random()*999999);
  function srand(){_s=(_s*1103515245+12345)&0x7fffffff;return(_s>>16)/32767;}
  function srand_int(a,b){return Math.floor(srand()*(b-a+1))+a;}
  const wt=outdoor?'#':'W', ft=outdoor?',':'.';
  const grid=[];
  for(let y=0;y<H;y++)grid.push(new Array(W).fill(wt));
  // Rooms
  const rooms=[];
  for(let att=0;att<800&&rooms.length<rc.count;att++){
    const rw=srand_int(rc.min,rc.max),rh=srand_int(rc.min,Math.min(rc.max,rw+2));
    const rx=srand_int(2,W-rw-2),ry=srand_int(2,H-rh-2);
    let ok=true;
    for(const r of rooms)if(rx<r.x+r.w+2&&rx+rw+2>r.x&&ry<r.y+r.h+2&&ry+rh+2>r.y){ok=false;break;}
    if(!ok)continue;
    rooms.push({x:rx,y:ry,w:rw,h:rh,cx:rx+Math.floor(rw/2),cy:ry+Math.floor(rh/2)});
  }
  if(rooms.length<2){rooms.push({x:2,y:2,w:6,h:6,cx:5,cy:5});rooms.push({x:W-10,y:H-10,w:6,h:6,cx:W-7,cy:H-7});}
  // Carve rooms
  for(const r of rooms)for(let y=r.y;y<r.y+r.h;y++)for(let x=r.x;x<r.x+r.w;x++)grid[y][x]=ft;
  // Chamfer room corners (45-degree cuts)
  for(const r of rooms){
    const ch=Math.min(2,Math.floor(Math.min(r.w,r.h)/3));
    for(let i=0;i<ch;i++){
      const fy=r.y+i,ly=r.y+r.h-1-i;
      for(let j=0;j<ch-i;j++){
        grid[fy][r.x+j]=wt;grid[fy][r.x+r.w-1-j]=wt;
        grid[ly][r.x+j]=wt;grid[ly][r.x+r.w-1-j]=wt;
      }
    }
  }
  // Sort
  rooms.sort((a,b)=>(a.cx+a.cy*2)-(b.cx+b.cy*2));
  // Corridors
  for(let i=0;i<rooms.length-1;i++)carvePath(grid,rooms[i].cx,rooms[i].cy,rooms[i+1].cx,rooms[i+1].cy,ft);
  for(let i=0;i<rooms.length-2;i++)if(srand()<0.2)carvePath(grid,rooms[i].cx,rooms[i].cy,rooms[srand_int(i+2,rooms.length-1)].cx,rooms[srand_int(i+2,rooms.length-1)].cy,ft);
  // Doors (indoor only)
  if(!outdoor)addDoors(grid,ft);
  // Start & exit
  const sr=rooms[0],er=rooms[rooms.length-1];
  grid[sr.cy][sr.cx]='S'; grid[er.cy][er.cx]='X';
  // Coast water
  if(coast){for(let x=0;x<W;x++){grid[0][x]='~';grid[1][x]='~';grid[H-1][x]='~';grid[H-2][x]='~';}}
  // Decorations
  const dm=new Map();
  if(decos&&decos.length){
    for(const r of rooms){
      if(decos.includes('pentagram')&&r.w>=5&&r.h>=5&&srand()<0.5)dm.set(r.cx+','+r.cy,'pentagram');
      for(let y=r.y;y<r.y+r.h;y++)for(let x=r.x;x<r.x+r.w;x++){
        if(grid[y][x]!==ft||dm.has(x+','+y))continue;
        if(srand()<decoChance)dm.set(x+','+y,decos[srand_int(0,decos.length-1)]);
      }
    }
  }
  // Enemies
  const enemies=[];
  const eRooms=rooms.slice(1,boss?rooms.length-1:rooms.length);
  if(cfg.enemies)for(const ec of cfg.enemies)for(let i=0;i<ec.count;i++){
    const rm=eRooms[rand(0,eRooms.length-1)];if(!rm)continue;
    enemies.push({type:ec.type,x:rand(rm.x+1,rm.x+rm.w-2),y:rand(rm.y+1,rm.y+rm.h-2),hp:ec.hp,patrol:[[rm.x+1,rm.y+1],[rm.x+rm.w-2,rm.y+rm.h-2]]});
  }
  // Items
  const items=[];
  const iRooms=rooms.slice(1);
  if(cfg.items)for(const ic of cfg.items)for(let i=0;i<ic.count;i++){
    const rm=iRooms[rand(0,iRooms.length-1)];if(!rm)continue;
    items.push({type:ic.type,x:rand(rm.x+1,rm.x+rm.w-2),y:rand(rm.y+1,rm.y+rm.h-2),amount:ic.amount||0});
  }
  let bd=null;
  if(boss)bd={...boss,x:er.cx,y:er.cy};
  return{grid,rooms,enemies,items,bossData:bd,decoMap:dm,startRoom:sr,exitRoom:er};
}
function carvePath(g,x1,y1,x2,y2,ft){
  let cx=x1,cy=y1;
  while(cx!==x2){cx+=cx<x2?1:-1;if(cy>=0&&cy<g.length&&cx>=0&&cx<g[0].length)g[cy][cx]=ft;if(cy+1<g.length)g[cy+1][cx]=ft;}
  while(cy!==y2){cy+=cy<y2?1:-1;if(cy>=0&&cy<g.length&&cx>=0&&cx<g[0].length)g[cy][cx]=ft;if(cx+1<g[0].length)g[cy][cx+1]=ft;}
}
function addDoors(g,ft){
  for(let y=2;y<g.length-2;y++)for(let x=2;x<g[0].length-2;x++){
    if(g[y][x]!==ft)continue;
    const u=g[y-1][x],d=g[y+1][x],l=g[y][x-1],r=g[y][x+1];
    if(solid(u)&&solid(d)&&!solid(l)&&!solid(r)&&Math.random()<0.3)g[y][x]='D';
    else if(solid(l)&&solid(r)&&!solid(u)&&!solid(d)&&Math.random()<0.3)g[y][x]='D';
  }
}

// ======================== INPUT ========================
const keys={};
window.addEventListener('keydown',e=>{keys[e.key.toLowerCase()]=true;});
window.addEventListener('keyup',e=>{keys[e.key.toLowerCase()]=false;});
document.querySelectorAll('[data-key]').forEach(b=>{
  b.addEventListener('touchstart',e=>{e.preventDefault();keys[b.dataset.key]=true;});
  b.addEventListener('touchend',e=>{e.preventDefault();keys[b.dataset.key]=false;});
});
// Mouse input
window.addEventListener('mousemove',e=>{mouseX=e.clientX;mouseY=e.clientY;});
window.addEventListener('mousedown',e=>{if(e.button===0)mouseDown=true;});
window.addEventListener('mouseup',e=>{if(e.button===0)mouseDown=false;});
// Gamepad polling (done each frame)
function pollGamepad(){
  const gps=navigator.getGamepads?navigator.getGamepads():[];
  for(const gp of gps){
    if(!gp)continue;
    gamepadActive=true;
    const deadzone=0.25;
    const lx=Math.abs(gp.axes[0])>deadzone?gp.axes[0]:0;
    const ly=Math.abs(gp.axes[1])>deadzone?gp.axes[1]:0;
    keys._padLX=lx;keys._padLY=ly;
    keys._padA=gp.buttons[0]&&gp.buttons[0].pressed;
    keys._padB=gp.buttons[1]&&gp.buttons[1].pressed;
    keys._padX=gp.buttons[2]&&gp.buttons[2].pressed;
    keys._padRB=gp.buttons[5]&&gp.buttons[5].pressed;
    return;
  }
  gamepadActive=false;
  keys._padLX=0;keys._padLY=0;keys._padA=false;keys._padB=false;keys._padX=false;keys._padRB=false;
}

// ======================== PARTICLES ========================
class Particle{
  constructor(x,y,c,vx,vy,life,sz){this.x=x;this.y=y;this.c=c;this.vx=vx;this.vy=vy;this.life=life;this.ml=life;this.sz=sz||3;}
  update(dt){this.x+=this.vx*dt;this.y+=this.vy*dt;this.vx*=0.93;this.vy*=0.93;this.life-=dt;}
  draw(ctx,cam){ctx.globalAlpha=Math.max(0,this.life/this.ml);ctx.fillStyle=this.c;ctx.fillRect(this.x-cam.x-this.sz/2,this.y-cam.y-this.sz/2,this.sz,this.sz);ctx.globalAlpha=1;}
}
class FloatText{
  constructor(x,y,t,c){this.x=x;this.y=y;this.t=t;this.c=c;this.life=1;this.vy=-40;}
  update(dt){this.y+=this.vy*dt;this.life-=dt;}
  draw(ctx,cam){ctx.globalAlpha=Math.max(0,this.life);ctx.fillStyle=this.c;ctx.font='bold 14px monospace';ctx.textAlign='center';ctx.fillText(this.t,this.x-cam.x,this.y-cam.y);ctx.globalAlpha=1;}
}
class Projectile{
  constructor(x,y,vx,vy,dmg,type){this.x=x;this.y=y;this.vx=vx;this.vy=vy;this.dmg=dmg;this.type=type||'email';this.alive=true;this.life=3;}
  update(dt,g){this.x+=this.vx*dt;this.y+=this.vy*dt;this.life-=dt;if(this.life<=0)this.alive=false;if(solid(tileAt(g,Math.floor(this.x/T),Math.floor(this.y/T))))this.alive=false;}
  draw(ctx,cam){if(!this.alive)return;const sx=this.x-cam.x,sy=this.y-cam.y;
    if(this.type==='email'){ctx.fillStyle='#fff';ctx.fillRect(sx-5,sy-3,10,6);ctx.strokeStyle='#aaa';ctx.beginPath();ctx.moveTo(sx-5,sy-3);ctx.lineTo(sx,sy+1);ctx.lineTo(sx+5,sy-3);ctx.stroke();}
    else if(this.type==='syringe'){ctx.fillStyle='#88f';ctx.fillRect(sx-2,sy-6,4,12);ctx.fillStyle='#f44';ctx.fillRect(sx-1,sy-7,2,3);}
  }
}

// ======================== PLAYER ========================
class Player{
  constructor(x,y){
    this.x=x*T+(T-PLAYER_SIZE)/2;this.y=y*T+(T-PLAYER_SIZE)/2;
    this.w=PLAYER_SIZE;this.h=PLAYER_SIZE;
    this.hp=100;this.maxHp=100;this.weapon='fists';this.ammo=0;
    this.inv=new Set(['fists']);this.dir={x:0,y:1};
    this.atkT=0;this.hurtT=0;this.sprint=false;this.moving=false;this.alive=true;
    this.animT=0;this.animF=0;
  }
  cx(){return this.x+this.w/2;} cy(){return this.y+this.h/2;}
  update(dt,g,cam){
    if(!this.alive)return;
    this.atkT=Math.max(0,this.atkT-dt*1000);this.hurtT=Math.max(0,this.hurtT-dt*1000);
    this.spdBuff=Math.max(0,(this.spdBuff||0)-dt);
    this.dmgBuff=Math.max(0,(this.dmgBuff||0)-dt);
    this.slowDebuff=Math.max(0,(this.slowDebuff||0)-dt);
    let dx=0,dy=0;
    if(keys.w||keys.arrowup)dy=-1;if(keys.s||keys.arrowdown)dy=1;
    if(keys.a||keys.arrowleft)dx=-1;if(keys.d||keys.arrowright)dx=1;
    // Gamepad movement
    if(keys._padLX)dx+=keys._padLX;
    if(keys._padLY)dy+=keys._padLY;
    this.sprint=!!(keys.shift||keys._padRB);let spdMul=this.sprint?SPRINT_MULT:1;
    if(this.spdBuff>0)spdMul*=1.4;
    if(this.slowDebuff>0)spdMul*=0.5;
    const spd=PLAYER_SPEED*spdMul;
    this.moving=dx!==0||dy!==0;
    if(this.moving){
      const mag=Math.sqrt(dx*dx+dy*dy);if(mag>1){dx/=mag;dy/=mag;}
      // Direction for keyboard: use movement dir; for mouse: mouse overrides
      if(CONTROL_SCHEME==='keyboard'){
        if(Math.abs(dx)>=Math.abs(dy))this.dir={x:Math.sign(dx),y:0}; else this.dir={x:0,y:Math.sign(dy)};
      }
      const nx=this.x+dx*spd,ny=this.y+dy*spd;
      if(canMove(nx,this.y,this.w,this.h,g))this.x=nx;
      if(canMove(this.x,ny,this.w,this.h,g))this.y=ny;
      stepTimer+=dt;
      if(stepTimer>0.25){stepTimer=0;sfxStep();}
    }
    // Mouse aim: 8-way snapping
    if(CONTROL_SCHEME==='mouse'&&cam){
      const mx=mouseX-(this.cx()-cam.x),my=mouseY-(this.cy()-cam.y);
      if(Math.abs(mx)>5||Math.abs(my)>5){
        const angle=Math.atan2(my,mx);
        const snap=Math.round(angle/(Math.PI/4));
        const dirs=[[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]];
        const di=(snap%8+8)%8;
        this.dir={x:dirs[di][0],y:dirs[di][1]};
      }
    }
    this.animT+=dt;if(this.animT>0.15){this.animT=0;this.animF=(this.animF+1)%4;}
  }
  attack(g){
    if(!this.alive||this.atkT>0)return null;
    const w=WEAPONS[this.weapon];
    if(w.ranged&&this.ammo<=0)return null;
    if(w.ranged){this.ammo--;if(this.weapon==='shotgun')sfxShotgun();else sfxGun();}else sfxAttack(this.weapon);
    this.atkT=w.cd;
    return{ox:this.cx(),oy:this.cy(),dx:this.dir.x,dy:this.dir.y,range:w.range,damage:w.dmg,ranged:w.ranged,grid:g};
  }
  takeDamage(d){if(this.hurtT>0)return;this.hp-=d;this.hurtT=300;sfxHit();if(this.hp<=0){this.hp=0;this.alive=false;sfxDeath();}}
  switchW(i){const n=WEAPON_SLOTS[i];if(n&&this.inv.has(n))this.weapon=n;}
  draw(ctx,cam){
    const sx=this.x-cam.x,sy=this.y-cam.y,cx=sx+this.w/2,cy=sy+this.h/2;
    const h=this.hurtT>0,bob=this.moving?Math.sin(this.animT*30)*1:0;
    // Hair
    ctx.fillStyle=h?'#f44':'#FF69B4';
    ctx.beginPath();ctx.ellipse(cx,cy-6,9,10,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=h?'#f44':'#FF1493';
    ctx.fillRect(cx-9,cy-2,3,11);ctx.fillRect(cx+6,cy-2,3,11);
    // Face
    ctx.fillStyle=h?'#faa':'#FFE0BD';
    ctx.beginPath();ctx.ellipse(cx,cy-4,7,8,0,0,Math.PI*2);ctx.fill();
    // Eyes
    ctx.fillStyle='#4488FF';
    ctx.beginPath();ctx.ellipse(cx-3,cy-5,2.2,2.8,0,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.ellipse(cx+3,cy-5,2.2,2.8,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#fff';
    ctx.beginPath();ctx.arc(cx-2.5,cy-6,0.9,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(cx+3.5,cy-6,0.9,0,Math.PI*2);ctx.fill();
    // Mouth
    ctx.fillStyle='#f88';ctx.fillRect(cx-1,cy+1,2,1);
    // Body
    ctx.fillStyle=h?'#f44':'#3344AA';ctx.fillRect(cx-5,cy+6+bob,10,8);
    ctx.fillStyle='#fff';ctx.fillRect(cx-4,cy+6+bob,8,2);
    ctx.fillStyle='#2233AA';ctx.fillRect(cx-6,cy+13+bob,12,3);
    ctx.fillStyle='#FFE0BD';ctx.fillRect(cx-3,cy+15+bob,2,4);ctx.fillRect(cx+1,cy+15+bob,2,4);
    // Draw fists or weapon
    const wep=this.weapon;
    const dirX=this.dir.x,dirY=this.dir.y;
    const handOff=8;
    if(wep==='fists'){
      // Draw two fists clearly
      const fistR=5;
      const atkPunch=this.atkT>WEAPONS.fists.cd*0.5?8:0;
      const perp={x:-dirY,y:dirX};
      // Left fist
      ctx.fillStyle=h?'#faa':'#FFE0BD';
      ctx.beginPath();ctx.arc(cx+dirX*(handOff+atkPunch)+perp.x*5,cy+dirY*(handOff+atkPunch)+perp.y*5,fistR,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle='#c8a882';ctx.lineWidth=1;ctx.stroke();
      // Right fist
      ctx.fillStyle=h?'#faa':'#FFE0BD';
      ctx.beginPath();ctx.arc(cx+dirX*(handOff+atkPunch)-perp.x*5,cy+dirY*(handOff+atkPunch)-perp.y*5,fistR,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle='#c8a882';ctx.lineWidth=1;ctx.stroke();
    } else {
      // Draw actual weapon sprites instead of emoji
      ctx.save();
      const ang=Math.atan2(dirY,dirX);
      ctx.translate(cx+dirX*12,cy+dirY*12);
      ctx.rotate(ang);
      switch(wep){
        case'knife':
          ctx.fillStyle='#ccc';ctx.fillRect(-1,-7,2,14); // blade
          ctx.fillStyle='#840';ctx.fillRect(-2,5,4,3); // handle
          break;
        case'bat':
          ctx.fillStyle='#c8a060';ctx.fillRect(-2,-10,4,18);
          ctx.fillStyle='#b8904a';ctx.fillRect(-3,-10,6,4);
          break;
        case'katana':
          ctx.fillStyle='#eee';ctx.fillRect(-1,-12,2,22); // long blade
          ctx.fillStyle='#d4af37';ctx.fillRect(-3,8,6,2); // guard
          ctx.fillStyle='#442';ctx.fillRect(-2,10,4,4); // handle
          break;
        case'gun':
          ctx.fillStyle='#555';ctx.fillRect(-2,-3,12,5); // barrel
          ctx.fillStyle='#444';ctx.fillRect(-2,2,5,5); // grip
          break;
        case'shotgun':
          ctx.fillStyle='#666';ctx.fillRect(-3,-3,16,4); // barrel
          ctx.fillStyle='#553';ctx.fillRect(-3,1,8,4); // stock
          break;
      }
      ctx.restore();
    }
    // Attack flash: show weapon RANGE + per-weapon effect
    if(this.atkT>WEAPONS[wep].cd*0.5){
      const w=WEAPONS[wep];
      const ang=Math.atan2(dirY,dirX);
      if(w.ranged){
        if(wep==='shotgun'){
          // Shotgun: cone spread
          ctx.fillStyle='rgba(255,200,0,0.15)';
          ctx.beginPath();ctx.moveTo(cx,cy);
          ctx.lineTo(cx+Math.cos(ang-0.3)*w.range,cy+Math.sin(ang-0.3)*w.range);
          ctx.lineTo(cx+Math.cos(ang+0.3)*w.range,cy+Math.sin(ang+0.3)*w.range);
          ctx.closePath();ctx.fill();
          ctx.strokeStyle='rgba(255,255,0,0.5)';ctx.lineWidth=2;
          ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+dirX*w.range,cy+dirY*w.range);ctx.stroke();
        } else {
          // Pistol: bright tracer
          ctx.strokeStyle='rgba(255,255,0,0.7)';ctx.lineWidth=2;
          ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+dirX*w.range,cy+dirY*w.range);ctx.stroke();
          ctx.fillStyle='rgba(255,200,0,0.6)';ctx.beginPath();ctx.arc(cx+dirX*20,cy+dirY*20,4,0,Math.PI*2);ctx.fill();
        }
      } else {
        // Per-melee-weapon effects
        switch(wep){
          case'fists':{
            // Impact circles
            ctx.strokeStyle='rgba(255,255,255,0.5)';ctx.lineWidth=3;
            ctx.beginPath();ctx.arc(cx+dirX*w.range*0.8,cy+dirY*w.range*0.8,8,0,Math.PI*2);ctx.stroke();
            break;}
          case'knife':{
            // Quick slash line
            ctx.strokeStyle='rgba(200,200,255,0.7)';ctx.lineWidth=2;
            ctx.beginPath();ctx.arc(cx,cy,w.range,ang-0.3,ang+0.3);ctx.stroke();
            break;}
          case'bat':{
            // Wide heavy swing
            ctx.strokeStyle='rgba(200,150,80,0.6)';ctx.lineWidth=5;
            ctx.beginPath();ctx.arc(cx,cy,w.range,ang-0.8,ang+0.8);ctx.stroke();
            ctx.strokeStyle='rgba(255,200,100,0.3)';ctx.lineWidth=10;
            ctx.beginPath();ctx.arc(cx,cy,w.range*0.8,ang-0.6,ang+0.6);ctx.stroke();
            break;}
          case'katana':{
            // Sharp double slash
            ctx.strokeStyle='rgba(200,220,255,0.8)';ctx.lineWidth=2;
            ctx.beginPath();ctx.arc(cx,cy,w.range,ang-0.5,ang+0.5);ctx.stroke();
            ctx.strokeStyle='rgba(150,200,255,0.5)';ctx.lineWidth=1;
            ctx.beginPath();ctx.arc(cx,cy,w.range*0.7,ang+0.2,ang-0.7,true);ctx.stroke();
            // Sparkle
            ctx.fillStyle='rgba(200,220,255,0.6)';ctx.beginPath();ctx.arc(cx+dirX*w.range,cy+dirY*w.range,3,0,Math.PI*2);ctx.fill();
            break;}
        }
      }
    }
  }
}

// ======================== ENEMY ========================
const ELOOK={
  cultist:{body:'#660066',head:'#440044',eye:'#f00',hood:true},
  cannibal:{body:'#442200',head:'#663300',eye:'#ff0',teeth:true},
  guard:{body:'#333344',head:'#222',eye:'#0f0',helmet:true},
  scientist:{body:'#aac',head:'#eee',eye:'#f0f',glasses:true},
  elite:{body:'#880000',head:'#1a1a1a',eye:'#f40',beret:true},
  tribal:{body:'#553311',head:'#774422',eye:'#ff8',paint:true},
  partygoer:{body:'#ffffff',head:'#8B4513',eye:'#000',shades:true},
};
class Enemy{
  constructor(cfg,g){
    this.type=cfg.type;this.x=cfg.x*T+(T-ENEMY_SIZE)/2;this.y=cfg.y*T+(T-ENEMY_SIZE)/2;
    this.w=ENEMY_SIZE;this.h=ENEMY_SIZE;this.hp=cfg.hp||40;this.maxHp=this.hp;
    this.patrol=cfg.patrol.map(p=>({x:p[0]*T+T/2,y:p[1]*T+T/2}));
    this.pi=0;this.state='patrol';this.atkT=0;this.stunT=0;this.lostT=0;this.hurtT=0;
    this.alive=true;this.g=g;
    this.speed=(cfg.speed||1.4)*(this.type==='elite'?1.2:this.type==='partygoer'?1.3:1);
    this.damage=this.type==='elite'?18:this.type==='guard'?15:this.type==='scientist'?8:this.type==='partygoer'?14:12;
    this.alert=0;this.dir={x:0,y:1};
  }
  cx(){return this.x+this.w/2;}cy(){return this.y+this.h/2;}
  update(dt,p){
    if(!this.alive)return;
    this.atkT=Math.max(0,this.atkT-dt*1000);this.hurtT=Math.max(0,this.hurtT-dt*1000);
    this.stunT=Math.max(0,this.stunT-dt*1000);this.alert=Math.max(0,this.alert-dt);
    if(this.stunT>0)return;
    const ex=this.cx(),ey=this.cy(),px=p.cx(),py=p.cy(),d=dist(ex,ey,px,py);
    const det=p.sprint?DETECTION_SPRINT:DETECTION;
    switch(this.state){
      case'patrol':{
        const tg=this.patrol[this.pi];
        if(dist(ex,ey,tg.x,tg.y)<8)this.pi=(this.pi+1)%this.patrol.length;
        else this.moveTo(tg.x,tg.y,this.speed*0.5);
        if(d<det&&p.alive&&hasLOS(ex,ey,px,py,this.g)){this.state='chase';this.alert=1;}
        break;}
      case'chase':{
        if(!p.alive){this.state='patrol';break;}
        if(d<26)this.state='attack';
        else this.moveTo(px,py,this.speed);
        if(d>det*1.5||!hasLOS(ex,ey,px,py,this.g)){this.lostT+=dt;if(this.lostT>3){this.state='patrol';this.lostT=0;}}
        else this.lostT=0;break;}
      case'attack':{
        if(!p.alive){this.state='patrol';break;}
        if(d>34)this.state='chase';
        else if(this.atkT<=0){p.takeDamage(this.damage);this.atkT=ENEMY_CD;}
        break;}
    }
  }
  moveTo(tx,ty,spd){
    const dx=tx-this.cx(),dy=ty-this.cy(),d=Math.sqrt(dx*dx+dy*dy);
    if(d<1)return;const mx=(dx/d)*spd,my=(dy/d)*spd;
    this.dir={x:Math.sign(dx),y:Math.sign(dy)};
    const canX=canMove(this.x+mx,this.y,this.w,this.h,this.g);
    const canY=canMove(this.x,this.y+my,this.w,this.h,this.g);
    if(canX&&canY){this.x+=mx;this.y+=my;this._stuckT=0;return;}
    if(canX){this.x+=mx;this._stuckT=0;return;}
    if(canY){this.y+=my;this._stuckT=0;return;}
    // Stuck: try sliding along wall in preferred perpendicular direction
    this._stuckT=(this._stuckT||0)+1;
    // Try 4 perpendicular slides with increasing offset
    const slides=[spd,-spd,spd*1.5,-spd*1.5];
    for(const s of slides){
      if(canMove(this.x+s,this.y,this.w,this.h,this.g)){this.x+=s;return;}
      if(canMove(this.x,this.y+s,this.w,this.h,this.g)){this.y+=s;return;}
    }
    // If very stuck (>30 frames), try diagonal escape
    if(this._stuckT>30){
      const diags=[[spd,spd],[-spd,spd],[spd,-spd],[-spd,-spd]];
      for(const[ddx,ddy] of diags){
        if(canMove(this.x+ddx,this.y+ddy,this.w,this.h,this.g)){this.x+=ddx;this.y+=ddy;this._stuckT=0;return;}
      }
    }
  }
  takeDamage(d){this.hp-=d;this.hurtT=200;this.stunT=150;if(this.hp<=0){this.hp=0;this.alive=false;currentScore+=10;sfxEnemyDeath();}else{this.state='chase';this.alert=1;}}
  draw(ctx,cam){
    if(!this.alive)return;
    const sx=this.x-cam.x,sy=this.y-cam.y,cx=sx+this.w/2,cy=sy+this.h/2;
    const lk=ELOOK[this.type]||ELOOK.cultist,h=this.hurtT>0;
    ctx.fillStyle=h?'#f00':lk.body;ctx.fillRect(cx-8,cy-3,16,16);
    ctx.fillStyle=h?'#f44':lk.head;ctx.beginPath();ctx.arc(cx,cy-7,7,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=lk.eye;ctx.fillRect(cx-4,cy-9,3,2);ctx.fillRect(cx+1,cy-9,3,2);
    if(lk.hood){ctx.fillStyle='#440044';ctx.beginPath();ctx.moveTo(cx-8,cy-3);ctx.lineTo(cx,cy-16);ctx.lineTo(cx+8,cy-3);ctx.fill();}
    if(lk.teeth){ctx.fillStyle='#fff';ctx.fillRect(cx-2,cy-4,2,2);ctx.fillRect(cx+1,cy-4,2,2);}
    if(lk.helmet){ctx.fillStyle='#222';ctx.fillRect(cx-7,cy-14,14,5);}
    if(lk.glasses){ctx.strokeStyle='#333';ctx.lineWidth=1;ctx.strokeRect(cx-5,cy-10,4,3);ctx.strokeRect(cx+1,cy-10,4,3);}
    if(lk.beret){ctx.fillStyle='#800';ctx.beginPath();ctx.ellipse(cx,cy-13,8,3,0,0,Math.PI*2);ctx.fill();}
    if(lk.paint){ctx.fillStyle='#f00';ctx.fillRect(cx-6,cy-8,2,4);ctx.fillRect(cx+4,cy-8,2,4);}
    if(lk.shades){ctx.fillStyle='#000';ctx.fillRect(cx-6,cy-10,12,3);ctx.fillStyle='#222';ctx.fillRect(cx-5,cy-10,4,2);ctx.fillRect(cx+1,cy-10,4,2);}
    if(this.hp<this.maxHp){ctx.fillStyle='#300';ctx.fillRect(cx-10,cy-18,20,3);ctx.fillStyle='#f00';ctx.fillRect(cx-10,cy-18,20*(this.hp/this.maxHp),3);}
    if(this.alert>0){ctx.globalAlpha=this.alert;ctx.fillStyle='#ff0';ctx.font='bold 14px monospace';ctx.textAlign='center';ctx.fillText('!',cx,cy-22);ctx.globalAlpha=1;}
  }
}

// ======================== BOSS ========================
class Boss{
  constructor(cfg,g){
    this.type=cfg.type;this.name=cfg.name;
    this.x=cfg.x*T+(T-cfg.size)/2;this.y=cfg.y*T+(T-cfg.size)/2;
    this.w=cfg.size;this.h=cfg.size;this.hp=cfg.hp;this.maxHp=cfg.hp;
    this.speed=cfg.speed||1.8;this.damage=cfg.damage||25;
    this.alive=true;this.g=g;
    this.atkT=0;this.hurtT=0;this.stunT=0;this.chargeT=0;this.charging=false;this.chargeDir={x:0,y:0};
    this.specT=0;this.teleT=0;this.shoutT=0;this.shoutTxt='';this.animT=0;this.projT=0;
  }
  cx(){return this.x+this.w/2;}cy(){return this.y+this.h/2;}
  phase(){const p=this.hp/this.maxHp;if(this.type==='epstein')return p>0.6?0:p>0.3?1:2;return p>0.5?0:1;}
  shouts(){
    const S={
      hillary:['"Delete! Delete!"','"What difference does it make?!"','"I don\'t recall…"','"It was personal emails!"'],
      trump:['"You\'re fired!"','"Nobody escapes me!"','"Tremendous power!"','"Make this island great!"','"Believe me, you\'re done!"'],
      pdiddy:['"Let\'s go! Party time!"','"Nobody leaves my party!"','"Bad Boy for life!"','"Feel the beat!"'],
      gates:['"Time for your booster!"','"Trust the science!"','"Windows is updating…"','"Microchip activated!"'],
      epstein:['"I didn\'t kill myself!"','"The island never dies!"','"You know too much!"','"HAHAHA!"'],
    };return S[this.type]||['"…"'];
  }
  doShout(){if(this.shoutT<=0){const s=this.shouts();this.shoutTxt=s[rand(0,s.length-1)];this.shoutT=4000;}}
  update(dt,player,proj){
    if(!this.alive||!player.alive)return;
    this.atkT=Math.max(0,this.atkT-dt*1000);this.hurtT=Math.max(0,this.hurtT-dt*1000);
    this.stunT=Math.max(0,this.stunT-dt*1000);this.chargeT=Math.max(0,this.chargeT-dt*1000);
    this.specT=Math.max(0,this.specT-dt*1000);this.teleT=Math.max(0,this.teleT-dt*1000);
    this.shoutT=Math.max(0,this.shoutT-dt*1000);this.projT=Math.max(0,this.projT-dt*1000);
    this.animT+=dt;if(this.stunT>0)return;
    const px=player.cx(),py=player.cy(),d=dist(this.cx(),this.cy(),px,py),ph=this.phase();
    switch(this.type){
      case'hillary':this.aiHillary(dt,px,py,d,ph,proj);break;
      case'trump':this.aiTrump(dt,px,py,d,ph,player);break;
      case'pdiddy':this.aiPDiddy(dt,px,py,d,ph,player);break;
      case'gates':this.aiGates(dt,px,py,d,ph,proj);break;
      case'epstein':this.aiEpstein(dt,px,py,d,ph,player);break;
    }
  }
  aiHillary(dt,px,py,d,ph,proj){
    const ang=this.animT*(ph===0?1.5:2.5),r=ph===0?130:100;
    this.moveTo(px+Math.cos(ang)*r,py+Math.sin(ang)*r,this.speed*(ph===0?1:1.5));
    if(this.projT<=0){
      const dx=px-this.cx(),dy=py-this.cy(),dd=Math.sqrt(dx*dx+dy*dy)||1;
      proj.push(new Projectile(this.cx(),this.cy(),(dx/dd)*180,(dy/dd)*180,this.damage,'email'));
      if(ph===1){const a=Math.atan2(dy,dx);
        proj.push(new Projectile(this.cx(),this.cy(),Math.cos(a+0.4)*180,Math.sin(a+0.4)*180,this.damage,'email'));
        proj.push(new Projectile(this.cx(),this.cy(),Math.cos(a-0.4)*180,Math.sin(a-0.4)*180,this.damage,'email'));}
      this.projT=ph===0?1500:900;this.doShout();
    }
  }
  aiTrump(dt,px,py,d,ph,player){
    if(this.charging){
      const nx=this.x+this.chargeDir.x*this.speed*3.5,ny=this.y+this.chargeDir.y*this.speed*3.5;
      if(!canMove(nx,ny,this.w,this.h,this.g)){this.charging=false;this.stunT=700;return;}
      this.x=nx;this.y=ny;this.chargeT-=16;
      if(this.chargeT<=0)this.charging=false;
      if(d<this.w/2+10){player.takeDamage(this.damage+10);this.charging=false;this.atkT=BOSS_CD;}
      return;
    }
    if(d<36&&this.atkT<=0){player.takeDamage(this.damage);this.atkT=BOSS_CD;this.doShout();}
    if(this.chargeT<=0&&d>70){
      this.charging=true;this.chargeT=1200;
      const dx=px-this.cx(),dy=py-this.cy(),dd=Math.sqrt(dx*dx+dy*dy)||1;
      this.chargeDir={x:dx/dd,y:dy/dd};this.doShout();
    }
    this.speed=ph===0?2.0:2.8;this.moveTo(px,py,this.speed);
  }
  aiPDiddy(dt,px,py,d,ph,player){
    if(ph===0){
      const a=this.animT*2;this.moveTo(px+Math.cos(a)*110,py+Math.sin(a)*110,this.speed);
      if(this.specT<=0&&d<150){this.moveTo(px,py,this.speed*3);this.specT=2000;this.doShout();
        if(d<36){player.takeDamage(this.damage);this.atkT=BOSS_CD;}}
    }else{this.speed=3.0;this.moveTo(px,py,this.speed);
      if(d<36&&this.atkT<=0){player.takeDamage(this.damage+5);this.atkT=400;this.doShout();}}
  }
  aiGates(dt,px,py,d,ph,proj){
    if(d>100)this.moveTo(px,py,this.speed*1.5);else if(d<60)this.moveTo(this.cx()*2-px,this.cy()*2-py,this.speed);
    if(this.projT<=0){
      const dx=px-this.cx(),dy=py-this.cy(),dd=Math.sqrt(dx*dx+dy*dy)||1;
      proj.push(new Projectile(this.cx(),this.cy(),(dx/dd)*200,(dy/dd)*200,this.damage,'syringe'));
      if(ph===1)proj.push(new Projectile(this.cx(),this.cy(),(dx/dd)*200+40,(dy/dd)*200+40,this.damage,'syringe'));
      this.projT=ph===0?1200:700;this.doShout();
    }
  }
  aiEpstein(dt,px,py,d,ph,player){
    if(ph===2&&this.teleT<=0){
      const a=Math.random()*Math.PI*2,td=80+Math.random()*60;
      const nx=px+Math.cos(a)*td-this.w/2,ny=py+Math.sin(a)*td-this.h/2;
      if(canMove(nx,ny,this.w,this.h,this.g)){this.x=nx;this.y=ny;}
      this.teleT=2500;this.doShout();
    }
    this.moveTo(px,py,ph===0?1.5:ph===1?2.2:2.8);
    if(d<40&&this.atkT<=0){player.takeDamage(this.damage+(ph===2?10:0));this.atkT=ph===2?400:BOSS_CD;this.doShout();}
  }
  moveTo(tx,ty,spd){
    const dx=tx-this.cx(),dy=ty-this.cy(),d=Math.sqrt(dx*dx+dy*dy);if(d<1)return;
    const mx=(dx/d)*spd,my=(dy/d)*spd;
    if(canMove(this.x+mx,this.y,this.w,this.h,this.g))this.x+=mx;
    if(canMove(this.x,this.y+my,this.w,this.h,this.g))this.y+=my;
  }
  takeDamage(d){this.hp-=d;this.hurtT=200;this.stunT=80;sfxHit();if(this.hp<=0){this.hp=0;this.alive=false;sfxBossDie();currentScore+=100;}}
  draw(ctx,cam){
    if(!this.alive)return;
    const sx=this.x-cam.x,sy=this.y-cam.y,cx=sx+this.w/2,cy=sy+this.h/2,h=this.hurtT>0;
    switch(this.type){
      case'hillary':this.dHillary(ctx,cx,cy,h);break;case'trump':this.dTrump(ctx,cx,cy,h);break;
      case'pdiddy':this.dPDiddy(ctx,cx,cy,h);break;case'gates':this.dGates(ctx,cx,cy,h);break;
      case'epstein':this.dEpstein(ctx,cx,cy,h);break;
    }
    // Boss shout text: fade slowly over 2.5s, bigger font
    if(this.shoutT>0){ctx.globalAlpha=Math.min(1,this.shoutT/1500);ctx.fillStyle='#ff0';ctx.font='bold 16px monospace';ctx.textAlign='center';ctx.fillText(this.shoutTxt,cx,cy-this.h/2-28);ctx.globalAlpha=1;}
  }
  dTrump(ctx,cx,cy,h){
    ctx.fillStyle=h?'#f44':'#1a1a5a';ctx.fillRect(cx-16,cy-3,32,26);ctx.fillStyle='#c00';ctx.fillRect(cx-2,cy-1,4,24);
    ctx.fillStyle=h?'#f88':'#FFD0A0';ctx.beginPath();ctx.arc(cx,cy-12,12,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#FFB800';ctx.beginPath();ctx.ellipse(cx,cy-21,14,7,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#4477CC';ctx.fillRect(cx-6,cy-14,4,3);ctx.fillRect(cx+2,cy-14,4,3);
    ctx.strokeStyle='#a05020';ctx.lineWidth=2;ctx.beginPath();ctx.arc(cx,cy-5,4,0.2,Math.PI-0.2);ctx.stroke();
    if(this.charging){ctx.strokeStyle='rgba(255,200,0,0.6)';ctx.lineWidth=3;ctx.beginPath();ctx.arc(cx,cy,this.w/2+5,0,Math.PI*2);ctx.stroke();}
  }
  dHillary(ctx,cx,cy,h){
    ctx.fillStyle=h?'#f44':'#2244aa';ctx.fillRect(cx-14,cy-3,28,24);
    ctx.fillStyle=h?'#f88':'#FFD8C0';ctx.beginPath();ctx.arc(cx,cy-12,11,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#D4C570';ctx.beginPath();ctx.ellipse(cx,cy-18,12,6,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#446';ctx.fillRect(cx-5,cy-14,4,3);ctx.fillRect(cx+1,cy-14,4,3);
    ctx.strokeStyle='#FFD700';ctx.lineWidth=2;ctx.beginPath();ctx.arc(cx,cy-2,9,0.3,Math.PI-0.3);ctx.stroke();
  }
  dPDiddy(ctx,cx,cy,h){
    ctx.fillStyle=h?'#f44':'#fff';ctx.fillRect(cx-13,cy-3,26,22);
    ctx.fillStyle=h?'#c64':'#8B4513';ctx.beginPath();ctx.arc(cx,cy-12,10,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#222';ctx.beginPath();ctx.ellipse(cx,cy-19,9,4,0,Math.PI,Math.PI*2);ctx.fill();
    ctx.fillStyle='#000';ctx.fillRect(cx-10,cy-18,8,4);ctx.fillRect(cx+2,cy-18,8,4);
    ctx.strokeStyle='#FFD700';ctx.lineWidth=2;ctx.beginPath();ctx.arc(cx,cy-1,8,0.3,Math.PI-0.3);ctx.stroke();
  }
  dGates(ctx,cx,cy,h){
    ctx.fillStyle=h?'#f44':'#6688aa';ctx.fillRect(cx-12,cy-3,24,22);
    ctx.fillStyle=h?'#f88':'#FFD8C0';ctx.beginPath();ctx.arc(cx,cy-12,10,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#664';ctx.beginPath();ctx.ellipse(cx,cy-18,9,4,0,Math.PI,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#333';ctx.lineWidth=1.5;ctx.strokeRect(cx-7,cy-15,6,4);ctx.strokeRect(cx+1,cy-15,6,4);
    ctx.fillStyle='#88f';ctx.fillRect(cx+14,cy-6,3,14);ctx.fillStyle='#f44';ctx.fillRect(cx+13,cy-8,5,3);
  }
  dEpstein(ctx,cx,cy,h){
    const ph=this.phase();
    if(ph===2){ctx.fillStyle='rgba(0,255,0,'+(0.1+Math.sin(this.animT*4)*0.1)+')';ctx.beginPath();ctx.arc(cx,cy,this.w/2+8,0,Math.PI*2);ctx.fill();}
    // Suit body
    ctx.fillStyle=h?'#f44':'#1a1a2a';ctx.fillRect(cx-18,cy-5,36,28);
    // Grey/green zombie face
    ctx.fillStyle=h?'#f66':'#6a8a6a';ctx.beginPath();ctx.arc(cx,cy-14,13,0,Math.PI*2);ctx.fill();
    // Grey hair (not Cartman-style)
    ctx.fillStyle='#888';ctx.beginPath();ctx.ellipse(cx,cy-22,12,7,0,Math.PI,Math.PI*2);ctx.fill();
    ctx.fillRect(cx-12,cy-18,4,8);ctx.fillRect(cx+8,cy-18,4,8);
    // Receding hairline: forehead visible
    ctx.fillStyle=h?'#f66':'#6a8a6a';ctx.beginPath();ctx.ellipse(cx,cy-18,8,4,0,Math.PI,Math.PI*2);ctx.fill();
    // Red eyes
    ctx.fillStyle='#f00';ctx.fillRect(cx-5,cy-16,4,3);ctx.fillRect(cx+1,cy-16,4,3);
    // Dark grimace
    ctx.fillStyle='#333';ctx.beginPath();ctx.arc(cx,cy-8,5,0.3,Math.PI-0.3);ctx.stroke();
    // Zombie marks
    ctx.fillStyle='rgba(0,100,0,0.3)';ctx.fillRect(cx-8,cy-12,3,4);ctx.fillRect(cx+5,cy-10,3,3);
  }
}

// ======================== ITEM ========================
class Item{
  constructor(cfg){this.type=cfg.type;this.x=cfg.x*T+T/2;this.y=cfg.y*T+T/2;this.amount=cfg.amount||0;this.collected=false;this.anim=Math.random()*6;}
  update(dt){this.anim+=dt*3;}
  draw(ctx,cam){
    if(this.collected)return;
    const sx=this.x-cam.x,sy=this.y-cam.y+Math.sin(this.anim)*3;
    ctx.save();ctx.translate(sx,sy);
    // Dark background circle for visibility
    ctx.fillStyle='rgba(0,0,0,0.6)';ctx.beginPath();ctx.arc(0,0,10,0,Math.PI*2);ctx.fill();
    // Bright pulsing outline
    const pulse=0.6+0.4*Math.sin(this.anim*2);
    const glows={health:'#0f0',knife:'#fff',bat:'#fa0',katana:'#f0f',gun:'#ff0',shotgun:'#f80',ammo:'#da0'};
    ctx.strokeStyle=glows[this.type]||'#fff';ctx.globalAlpha=pulse;ctx.lineWidth=2;
    ctx.beginPath();ctx.arc(0,0,11,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;
    // Icon
    switch(this.type){
      case'health':ctx.fillStyle='#0f0';ctx.fillRect(-5,-2,10,4);ctx.fillRect(-2,-5,4,10);break;
      case'knife':ctx.fillStyle='#ddd';ctx.fillRect(-1,-7,3,10);ctx.fillStyle='#840';ctx.fillRect(-2,2,5,3);break;
      case'bat':ctx.fillStyle='#ca8';ctx.fillRect(-2,-8,4,14);ctx.fillRect(-3,-8,6,4);break;
      case'katana':ctx.fillStyle='#eee';ctx.fillRect(-1,-10,2,16);ctx.fillStyle='#d4af37';ctx.fillRect(-3,5,6,2);break;
      case'gun':ctx.fillStyle='#666';ctx.fillRect(-6,-2,12,5);ctx.fillRect(-1,2,3,4);break;
      case'shotgun':ctx.fillStyle='#777';ctx.fillRect(-8,-2,16,4);ctx.fillRect(-1,1,3,4);break;
      case'ammo':ctx.fillStyle='#da0';ctx.fillRect(-4,-3,8,6);ctx.fillStyle='#000';ctx.font='7px monospace';ctx.textAlign='center';ctx.fillText('A',0,3);break;
      case'mystery':const mt=performance.now()/300;ctx.fillStyle='rgba(200,0,200,'+(0.5+Math.sin(mt)*0.3)+')';ctx.beginPath();ctx.arc(0,0,9,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff';ctx.font='bold 14px monospace';ctx.textAlign='center';ctx.fillText('?',0,5);break;
    }
    ctx.restore();
  }
}

// ======================== DECORATIONS ========================
function drawDeco(ctx,sx,sy,type){
  const cx=sx+T/2,cy=sy+T/2;
  switch(type){
    case'pentagram':
      ctx.strokeStyle='rgba(200,0,0,0.6)';ctx.lineWidth=1.5;ctx.beginPath();
      for(let i=0;i<5;i++){const a=(i*4*Math.PI/5)-Math.PI/2,x=cx+Math.cos(a)*12,y=cy+Math.sin(a)*12;i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}
      ctx.closePath();ctx.stroke();ctx.beginPath();ctx.arc(cx,cy,13,0,Math.PI*2);ctx.stroke();break;
    case'candle':ctx.fillStyle='#ddc';ctx.fillRect(cx-1,cy+2,3,6);ctx.fillStyle='#fa0';ctx.beginPath();ctx.ellipse(cx+0.5,cy,2,3,0,0,Math.PI*2);ctx.fill();break;
    case'blood':ctx.fillStyle='rgba(120,0,0,0.5)';ctx.beginPath();ctx.ellipse(cx,cy,5,3,0.5,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(cx+4,cy-2,2,0,Math.PI*2);ctx.fill();break;
    case'bones':ctx.strokeStyle='rgba(200,200,180,0.5)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx-5,cy-3);ctx.lineTo(cx+5,cy+3);ctx.stroke();ctx.beginPath();ctx.moveTo(cx+5,cy-3);ctx.lineTo(cx-5,cy+3);ctx.stroke();break;
    case'skull':ctx.fillStyle='rgba(200,200,180,0.5)';ctx.beginPath();ctx.arc(cx,cy,4,0,Math.PI*2);ctx.fill();ctx.fillStyle='rgba(0,0,0,0.5)';ctx.fillRect(cx-2,cy-2,2,2);ctx.fillRect(cx+1,cy-2,2,2);break;
    case'torch':ctx.fillStyle='#654';ctx.fillRect(cx-1,cy-4,3,10);ctx.fillStyle='#fa0';ctx.beginPath();ctx.ellipse(cx+0.5,cy-5,3,4,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#ff6';ctx.beginPath();ctx.arc(cx+0.5,cy-5,1.5,0,Math.PI*2);ctx.fill();break;
    case'chain':ctx.strokeStyle='rgba(150,150,150,0.4)';ctx.lineWidth=1;for(let i=0;i<4;i++){ctx.beginPath();ctx.ellipse(cx,cy-6+i*4,2,3,0,0,Math.PI*2);ctx.stroke();}break;
    case'hook':ctx.strokeStyle='rgba(150,150,150,0.5)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx,cy-8);ctx.lineTo(cx,cy+2);ctx.arc(cx+3,cy+2,3,Math.PI,0,true);ctx.stroke();break;
    case'crack':ctx.strokeStyle='rgba(80,80,80,0.4)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(cx-4,cy-6);ctx.lineTo(cx,cy);ctx.lineTo(cx+3,cy+5);ctx.stroke();break;
    case'altar':ctx.fillStyle='rgba(60,20,20,0.6)';ctx.fillRect(cx-8,cy-2,16,8);ctx.fillStyle='rgba(80,30,30,0.6)';ctx.fillRect(cx-9,cy-4,18,4);break;
    case'computer':ctx.fillStyle='rgba(80,80,80,0.5)';ctx.fillRect(cx-5,cy-4,10,7);ctx.fillStyle='rgba(0,180,0,0.4)';ctx.fillRect(cx-4,cy-3,8,5);ctx.fillStyle='rgba(60,60,60,0.5)';ctx.fillRect(cx-4,cy+3,8,2);break;
    case'syringe':ctx.fillStyle='rgba(150,150,200,0.4)';ctx.fillRect(cx-1,cy-5,2,10);ctx.fillStyle='rgba(0,100,200,0.3)';ctx.fillRect(cx-1,cy-5,2,4);break;
    case'barrel':ctx.fillStyle='rgba(100,60,20,0.4)';ctx.beginPath();ctx.ellipse(cx,cy,6,8,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='rgba(80,80,80,0.3)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(cx-6,cy-2);ctx.lineTo(cx+6,cy-2);ctx.stroke();ctx.beginPath();ctx.moveTo(cx-6,cy+2);ctx.lineTo(cx+6,cy+2);ctx.stroke();break;
    case'crate':ctx.fillStyle='rgba(100,70,30,0.4)';ctx.fillRect(cx-6,cy-6,12,12);ctx.strokeStyle='rgba(80,50,10,0.4)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(cx-6,cy-6);ctx.lineTo(cx+6,cy+6);ctx.stroke();ctx.beginPath();ctx.moveTo(cx+6,cy-6);ctx.lineTo(cx-6,cy+6);ctx.stroke();break;
    case'painting':ctx.fillStyle='rgba(120,80,30,0.3)';ctx.fillRect(cx-7,cy-5,14,10);ctx.fillStyle='rgba(60,90,120,0.3)';ctx.fillRect(cx-5,cy-3,10,6);break;
    case'eye':ctx.strokeStyle='rgba(200,200,0,0.5)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(cx-8,cy);ctx.quadraticCurveTo(cx,cy-6,cx+8,cy);ctx.quadraticCurveTo(cx,cy+6,cx-8,cy);ctx.stroke();ctx.fillStyle='rgba(200,200,0,0.4)';ctx.beginPath();ctx.arc(cx,cy,2,0,Math.PI*2);ctx.fill();break;
    case'pillar':ctx.fillStyle='rgba(150,150,140,0.3)';ctx.fillRect(cx-4,cy-10,8,20);ctx.fillStyle='rgba(170,170,160,0.3)';ctx.fillRect(cx-5,cy-11,10,3);ctx.fillRect(cx-5,cy+8,10,3);break;
    case'cobweb':ctx.strokeStyle='rgba(200,200,200,0.2)';ctx.lineWidth=0.5;for(let i=0;i<4;i++){const a=i*Math.PI/4;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(a)*10,cy+Math.sin(a)*10);ctx.stroke();}break;
    case'flower':ctx.fillStyle='rgba(200,50,50,0.4)';ctx.beginPath();ctx.arc(cx,cy,3,0,Math.PI*2);ctx.fill();ctx.fillStyle='rgba(50,150,50,0.3)';ctx.fillRect(cx-0.5,cy+2,1,5);break;
    case'mushroom':ctx.fillStyle='rgba(200,50,50,0.4)';ctx.beginPath();ctx.ellipse(cx,cy-2,4,3,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='rgba(200,200,150,0.3)';ctx.fillRect(cx-1,cy,2,4);break;
    case'stone':ctx.fillStyle='rgba(120,120,110,0.3)';ctx.beginPath();ctx.ellipse(cx,cy,5,3,0.3,0,Math.PI*2);ctx.fill();break;
    case'shell':ctx.fillStyle='rgba(230,220,200,0.4)';ctx.beginPath();ctx.arc(cx,cy,3,0,Math.PI*2);ctx.fill();break;
    case'server':ctx.fillStyle='rgba(30,30,50,0.8)';ctx.fillRect(cx-6,cy-10,12,20);ctx.strokeStyle='rgba(60,60,80,0.6)';ctx.strokeRect(cx-6,cy-10,12,20);for(let i=0;i<5;i++){const h=(cx*7+cy*13+i*31)%3;ctx.fillStyle=h===0?'rgba(0,255,0,0.7)':h===1?'rgba(0,100,255,0.5)':'rgba(255,100,0,0.4)';ctx.fillRect(cx-3,cy-8+i*3.5,2,1.5);}ctx.fillStyle='rgba(60,60,80,0.4)';ctx.fillRect(cx+1,cy-7,3,1);ctx.fillRect(cx+1,cy-3,3,1);break;
    case'cable':ctx.strokeStyle='rgba(0,150,200,0.35)';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(cx-8,cy-4);ctx.quadraticCurveTo(cx,cy+6,cx+8,cy-2);ctx.stroke();ctx.strokeStyle='rgba(200,50,0,0.3)';ctx.beginPath();ctx.moveTo(cx-6,cy+2);ctx.quadraticCurveTo(cx+2,cy-5,cx+7,cy+4);ctx.stroke();break;
    // New decos
    case'inverted_cross':ctx.strokeStyle='rgba(200,0,0,0.6)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx,cy-8);ctx.lineTo(cx,cy+8);ctx.stroke();ctx.beginPath();ctx.moveTo(cx-5,cy+3);ctx.lineTo(cx+5,cy+3);ctx.stroke();break;
    case'niche_skull':ctx.fillStyle='rgba(50,45,35,0.5)';ctx.fillRect(cx-6,cy-6,12,12);ctx.fillStyle='rgba(30,28,20,0.6)';ctx.fillRect(cx-4,cy-4,8,8);ctx.fillStyle='rgba(200,200,180,0.6)';ctx.beginPath();ctx.arc(cx,cy,3,0,Math.PI*2);ctx.fill();ctx.fillStyle='rgba(0,0,0,0.7)';ctx.fillRect(cx-2,cy-1,1.5,1.5);ctx.fillRect(cx+0.5,cy-1,1.5,1.5);break;
    case'coffin':ctx.fillStyle='rgba(60,40,20,0.5)';ctx.fillRect(cx-4,cy-8,8,16);ctx.strokeStyle='rgba(40,25,10,0.5)';ctx.strokeRect(cx-4,cy-8,8,16);ctx.strokeStyle='rgba(80,60,30,0.3)';ctx.beginPath();ctx.moveTo(cx-2,cy-3);ctx.lineTo(cx+2,cy-3);ctx.stroke();ctx.beginPath();ctx.moveTo(cx,cy-5);ctx.lineTo(cx,cy-1);ctx.stroke();break;
    case'meat':ctx.fillStyle='rgba(150,30,30,0.6)';ctx.beginPath();ctx.ellipse(cx,cy,4,6,0.3,0,Math.PI*2);ctx.fill();ctx.fillStyle='rgba(200,180,160,0.4)';ctx.fillRect(cx-1,cy-7,2,3);break;
    case'severed_head':ctx.fillStyle='rgba(200,170,140,0.5)';ctx.beginPath();ctx.arc(cx,cy,5,0,Math.PI*2);ctx.fill();ctx.fillStyle='rgba(0,0,0,0.5)';ctx.fillRect(cx-3,cy-2,2,1.5);ctx.fillRect(cx+1,cy-2,2,1.5);ctx.fillStyle='rgba(150,0,0,0.6)';ctx.beginPath();ctx.arc(cx,cy+2,2,0,Math.PI);ctx.fill();ctx.fillStyle='rgba(100,0,0,0.4)';ctx.beginPath();ctx.ellipse(cx,cy+6,4,2,0,0,Math.PI*2);ctx.fill();break;
    case'pan':ctx.fillStyle='rgba(60,60,60,0.5)';ctx.beginPath();ctx.ellipse(cx,cy,6,5,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='rgba(50,50,50,0.4)';ctx.fillRect(cx+5,cy-1,7,2);break;
    case'blood_drip':ctx.fillStyle='rgba(120,0,0,0.4)';ctx.fillRect(cx-1,cy-10,2,6);ctx.beginPath();ctx.arc(cx,cy-3,2,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(cx,cy+2,1.5,0,Math.PI*2);ctx.fill();break;
    case'operating_table':ctx.fillStyle='rgba(150,150,160,0.4)';ctx.fillRect(cx-8,cy-3,16,6);ctx.fillStyle='rgba(130,130,140,0.4)';ctx.fillRect(cx-7,cy+3,3,4);ctx.fillRect(cx+4,cy+3,3,4);ctx.fillStyle='rgba(100,0,0,0.2)';ctx.fillRect(cx-4,cy-2,8,3);break;
    case'straitjacket':ctx.fillStyle='rgba(200,200,180,0.4)';ctx.fillRect(cx-4,cy-6,8,12);ctx.strokeStyle='rgba(120,120,100,0.4)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(cx-4,cy);ctx.lineTo(cx-8,cy+3);ctx.stroke();ctx.beginPath();ctx.moveTo(cx+4,cy);ctx.lineTo(cx+8,cy+3);ctx.stroke();break;
    case'electrode':ctx.fillStyle='rgba(100,100,100,0.5)';ctx.fillRect(cx-1,cy-7,2,14);ctx.fillStyle='rgba(255,255,0,0.4)';ctx.beginPath();ctx.arc(cx,cy-7,2,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(cx,cy+7,2,0,Math.PI*2);ctx.fill();break;
    case'led_strip':ctx.fillStyle='rgba(0,0,0,0.3)';ctx.fillRect(cx-10,cy-1,20,2);for(let i=0;i<5;i++){const hue=(cx*3+i*50)%360;ctx.fillStyle='hsla('+hue+',80%,60%,0.5)';ctx.fillRect(cx-9+i*4,cy-1,2,2);}break;
    case'ventilation':ctx.fillStyle='rgba(60,60,70,0.5)';ctx.fillRect(cx-7,cy-4,14,8);for(let i=0;i<4;i++){ctx.fillStyle='rgba(30,30,40,0.6)';ctx.fillRect(cx-6+i*4,cy-3,2,6);}break;
    case'pyramid':ctx.strokeStyle='rgba(200,200,0,0.4)';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(cx,cy-10);ctx.lineTo(cx-8,cy+6);ctx.lineTo(cx+8,cy+6);ctx.closePath();ctx.stroke();ctx.fillStyle='rgba(200,200,0,0.3)';ctx.beginPath();ctx.arc(cx,cy-2,2,0,Math.PI*2);ctx.fill();break;
    case'fireplace':ctx.fillStyle='rgba(60,30,15,0.5)';ctx.fillRect(cx-8,cy-6,16,12);ctx.fillStyle='rgba(30,15,5,0.6)';ctx.fillRect(cx-6,cy-4,12,8);ctx.fillStyle='rgba(255,100,0,0.5)';ctx.beginPath();ctx.ellipse(cx,cy,4,3,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='rgba(255,200,0,0.4)';ctx.beginPath();ctx.arc(cx,cy-1,2,0,Math.PI*2);ctx.fill();break;
    case'bookshelf':ctx.fillStyle='rgba(60,35,15,0.5)';ctx.fillRect(cx-7,cy-8,14,16);for(let i=0;i<3;i++){ctx.fillStyle='rgba(40,20,10,0.4)';ctx.fillRect(cx-6,cy-6+i*5,12,1);const colors=['rgba(120,30,30,0.4)','rgba(30,60,120,0.4)','rgba(30,100,30,0.4)','rgba(100,80,30,0.4)'];for(let j=0;j<4;j++){ctx.fillStyle=colors[(i+j)%4];ctx.fillRect(cx-5+j*3,cy-5+i*5,2,4);}}break;
    case'chandelier':ctx.strokeStyle='rgba(180,150,50,0.4)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(cx,cy-10);ctx.lineTo(cx,cy-4);ctx.stroke();ctx.beginPath();ctx.moveTo(cx-6,cy-4);ctx.lineTo(cx+6,cy-4);ctx.stroke();ctx.fillStyle='rgba(255,200,50,0.5)';ctx.beginPath();ctx.arc(cx-5,cy-2,1.5,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(cx,cy-2,1.5,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(cx+5,cy-2,1.5,0,Math.PI*2);ctx.fill();break;
    case'rug':ctx.fillStyle='rgba(120,30,30,0.25)';ctx.fillRect(cx-10,cy-7,20,14);ctx.strokeStyle='rgba(150,120,40,0.3)';ctx.strokeRect(cx-9,cy-6,18,12);break;
    case'diamond':const t2=performance.now()/400;ctx.fillStyle='rgba(150,220,255,'+(0.4+Math.sin(t2)*0.2)+')';ctx.beginPath();ctx.moveTo(cx,cy-5);ctx.lineTo(cx+4,cy);ctx.lineTo(cx,cy+5);ctx.lineTo(cx-4,cy);ctx.closePath();ctx.fill();ctx.strokeStyle='rgba(200,240,255,0.5)';ctx.stroke();break;
    case'gold_pillar':ctx.fillStyle='rgba(180,150,30,0.5)';ctx.fillRect(cx-4,cy-10,8,20);ctx.fillStyle='rgba(200,170,40,0.5)';ctx.fillRect(cx-5,cy-11,10,3);ctx.fillRect(cx-5,cy+8,10,3);break;
    case'gold_statue':ctx.fillStyle='rgba(180,150,30,0.5)';ctx.fillRect(cx-3,cy-2,6,8);ctx.beginPath();ctx.arc(cx,cy-5,4,0,Math.PI*2);ctx.fill();ctx.fillStyle='rgba(200,170,40,0.4)';ctx.fillRect(cx-5,cy+5,10,2);break;
    case'disco_ball':const dt2=performance.now()/200;ctx.fillStyle='rgba(200,200,200,0.4)';ctx.beginPath();ctx.arc(cx,cy,6,0,Math.PI*2);ctx.fill();for(let i=0;i<6;i++){const a=dt2*0.5+i*Math.PI/3;ctx.strokeStyle='hsla('+(i*60)+',80%,70%,0.3)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(a)*14,cy+Math.sin(a)*14);ctx.stroke();}break;
    case'baby_oil':ctx.fillStyle='rgba(200,180,100,0.4)';ctx.fillRect(cx-3,cy-5,6,10);ctx.fillStyle='rgba(180,160,80,0.5)';ctx.fillRect(cx-2,cy-7,4,3);ctx.fillStyle='rgba(220,200,120,0.3)';ctx.beginPath();ctx.ellipse(cx+2,cy+6,4,2,0.3,0,Math.PI*2);ctx.fill();break;
    case'cocaine_line':ctx.fillStyle='rgba(240,240,240,0.5)';ctx.fillRect(cx-8,cy-0.5,16,1);ctx.fillRect(cx-6,cy+2,12,1);ctx.fillStyle='rgba(220,220,220,0.3)';ctx.beginPath();ctx.ellipse(cx+10,cy+1,2,3,0,0,Math.PI*2);ctx.fill();break;
    case'speaker':ctx.fillStyle='rgba(30,30,30,0.6)';ctx.fillRect(cx-6,cy-8,12,16);ctx.strokeStyle='rgba(50,50,50,0.5)';ctx.beginPath();ctx.arc(cx,cy-3,4,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(cx,cy+3,3,0,Math.PI*2);ctx.stroke();break;
    case'neon_light':const nc=(cx*7+cy*13)%3;ctx.strokeStyle=nc===0?'rgba(255,0,200,0.5)':nc===1?'rgba(0,200,255,0.5)':'rgba(255,100,0,0.5)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx-8,cy);ctx.lineTo(cx+8,cy);ctx.stroke();break;
    case'dancer':ctx.fillStyle='rgba(200,150,100,0.4)';ctx.beginPath();ctx.arc(cx,cy-6,3,0,Math.PI*2);ctx.fill();ctx.fillStyle='rgba(200,50,100,0.4)';ctx.fillRect(cx-3,cy-3,6,8);ctx.fillStyle='rgba(200,150,100,0.3)';ctx.fillRect(cx-1,cy+5,2,4);ctx.fillRect(cx+1,cy+5,2,4);break;
    case'hospital_bed':ctx.fillStyle='rgba(200,200,210,0.4)';ctx.fillRect(cx-8,cy-3,16,6);ctx.fillStyle='rgba(180,180,190,0.4)';ctx.fillRect(cx-9,cy-4,3,8);ctx.fillRect(cx+6,cy-4,3,8);ctx.fillStyle='rgba(220,220,230,0.3)';ctx.fillRect(cx-6,cy-2,12,2);break;
    case'iv_drip':ctx.strokeStyle='rgba(150,150,160,0.4)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(cx,cy-10);ctx.lineTo(cx,cy+4);ctx.stroke();ctx.fillStyle='rgba(200,200,220,0.4)';ctx.fillRect(cx-2,cy-10,4,6);ctx.fillStyle='rgba(100,200,100,0.3)';ctx.fillRect(cx-1,cy-8,2,3);break;
    case'biohazard':ctx.strokeStyle='rgba(255,200,0,0.5)';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(cx,cy,7,0,Math.PI*2);ctx.stroke();ctx.beginPath();for(let i=0;i<3;i++){const a=i*Math.PI*2/3-Math.PI/2;ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(a)*6,cy+Math.sin(a)*6);}ctx.stroke();break;
    case'pill_bottle':ctx.fillStyle='rgba(200,120,50,0.4)';ctx.fillRect(cx-3,cy-4,6,8);ctx.fillStyle='rgba(220,220,220,0.4)';ctx.fillRect(cx-3,cy-6,6,3);ctx.fillStyle='rgba(200,200,200,0.3)';ctx.beginPath();ctx.arc(cx+2,cy+5,1.5,0,Math.PI*2);ctx.fill();break;
    case'vine':ctx.strokeStyle='rgba(30,100,20,0.4)';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(cx-3,cy-10);ctx.quadraticCurveTo(cx+4,cy,cx-2,cy+10);ctx.stroke();ctx.fillStyle='rgba(40,120,20,0.3)';ctx.beginPath();ctx.ellipse(cx+2,cy-3,3,2,0.5,0,Math.PI*2);ctx.fill();break;
    case'fern':ctx.fillStyle='rgba(30,100,30,0.4)';for(let i=0;i<3;i++){ctx.beginPath();ctx.ellipse(cx-3+i*3,cy-2+i*2,2,5,0.3*i,0,Math.PI*2);ctx.fill();}break;
    case'driftwood':ctx.fillStyle='rgba(120,100,70,0.3)';ctx.save();ctx.translate(cx,cy);ctx.rotate(0.4);ctx.fillRect(-8,-2,16,3);ctx.restore();break;
    case'seaweed':ctx.strokeStyle='rgba(30,100,60,0.4)';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(cx,cy+8);ctx.quadraticCurveTo(cx-3,cy,cx+1,cy-8);ctx.stroke();ctx.beginPath();ctx.moveTo(cx+2,cy+6);ctx.quadraticCurveTo(cx+5,cy,cx+2,cy-5);ctx.stroke();break;
    case'palm_stump':ctx.fillStyle='rgba(100,70,30,0.4)';ctx.fillRect(cx-3,cy-4,6,8);ctx.fillStyle='rgba(80,50,20,0.3)';ctx.beginPath();ctx.arc(cx,cy-4,4,0,Math.PI*2);ctx.fill();break;
    case'anchor':ctx.strokeStyle='rgba(100,100,110,0.5)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx,cy-8);ctx.lineTo(cx,cy+4);ctx.stroke();ctx.beginPath();ctx.arc(cx,cy+4,4,0,Math.PI);ctx.stroke();ctx.beginPath();ctx.moveTo(cx-4,cy-4);ctx.lineTo(cx+4,cy-4);ctx.stroke();break;
    case'rope_coil':ctx.strokeStyle='rgba(160,130,80,0.4)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(cx,cy,5,0,Math.PI*1.7);ctx.stroke();ctx.beginPath();ctx.arc(cx,cy,3,0.5,Math.PI*1.5);ctx.stroke();break;
    case'boat':ctx.fillStyle='rgba(100,70,30,0.5)';ctx.beginPath();ctx.moveTo(cx-10,cy);ctx.lineTo(cx-8,cy+5);ctx.lineTo(cx+8,cy+5);ctx.lineTo(cx+10,cy);ctx.closePath();ctx.fill();ctx.fillStyle='rgba(200,200,200,0.4)';ctx.fillRect(cx-1,cy-8,2,10);ctx.fillStyle='rgba(200,200,200,0.3)';ctx.beginPath();ctx.moveTo(cx+1,cy-8);ctx.lineTo(cx+8,cy-3);ctx.lineTo(cx+1,cy-1);ctx.fill();break;
    case'lantern':ctx.fillStyle='rgba(60,60,60,0.4)';ctx.fillRect(cx-2,cy-5,4,8);ctx.fillStyle='rgba(255,180,50,0.4)';ctx.beginPath();ctx.arc(cx,cy-1,2.5,0,Math.PI*2);ctx.fill();break;
    case'container':{
      // Large cargo/shipping container
      const cc=['rgba(180,40,40,0.5)','rgba(40,80,160,0.5)','rgba(40,140,40,0.5)','rgba(180,120,30,0.5)'];
      ctx.fillStyle=cc[(cx*3+cy*7)%cc.length];ctx.fillRect(cx-12,cy-7,24,14);
      ctx.strokeStyle='rgba(0,0,0,0.3)';ctx.lineWidth=1;ctx.strokeRect(cx-12,cy-7,24,14);
      // Corrugation lines
      ctx.strokeStyle='rgba(0,0,0,0.15)';
      for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(cx-10+i*5,cy-6);ctx.lineTo(cx-10+i*5,cy+6);ctx.stroke();}
      // Door handles
      ctx.fillStyle='rgba(200,200,200,0.4)';ctx.fillRect(cx+8,cy-2,2,4);
      break;}
  }
}

// ======================== TILE RENDERER ========================
function drawWall(ctx,sx,sy,tx,ty,lvl){
  const s=lvl.tileStyle;
  ctx.fillStyle=lvl.wallColor;ctx.fillRect(sx,sy,T,T);
  // Per-level wall detail
  switch(s){
    case'dungeon':ctx.fillStyle='rgba(0,0,0,0.2)';ctx.fillRect(sx,sy,T,2);ctx.fillRect(sx,sy,2,T);ctx.fillStyle='rgba(255,255,255,0.04)';ctx.fillRect(sx+T-2,sy,2,T);if((tx+ty)%4===0){ctx.fillStyle='rgba(0,0,0,0.1)';ctx.fillRect(sx+8,sy+4,4,2);}break;
    case'ritual':ctx.fillStyle='rgba(80,0,0,0.15)';ctx.fillRect(sx,sy,T,T);ctx.fillStyle='rgba(0,0,0,0.2)';ctx.fillRect(sx,sy,T,2);break;
    case'catacombs':ctx.fillStyle=(tx+ty)%2===0?lvl.wallHi:lvl.wallColor;ctx.fillRect(sx,sy,T,T);ctx.strokeStyle='rgba(0,0,0,0.15)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(sx+T/2,sy+2,T/2-2,0,Math.PI);ctx.stroke();if((tx*3+ty*7)%5===0){ctx.fillStyle='rgba(180,170,140,0.15)';ctx.beginPath();ctx.arc(sx+T/2,sy+T/2,4,0,Math.PI*2);ctx.fill();}break;
    case'kitchen':ctx.fillStyle=lvl.wallColor;ctx.fillRect(sx,sy,T,T);ctx.fillStyle='rgba(100,0,0,0.1)';if((tx+ty)%3===0)ctx.fillRect(sx+4,sy+8,8,2);ctx.fillStyle='rgba(200,200,200,0.06)';ctx.fillRect(sx,sy+T-2,T,2);break;
    case'lab':ctx.fillStyle=lvl.wallColor;ctx.fillRect(sx,sy,T,T);ctx.fillStyle='rgba(200,200,200,0.08)';ctx.fillRect(sx,sy+T/2-0.5,T,1);ctx.fillStyle='rgba(0,0,0,0.1)';ctx.fillRect(sx,sy,T,1);break;
    case'serverfarm':ctx.fillStyle=lvl.wallColor;ctx.fillRect(sx,sy,T,T);ctx.fillStyle='rgba(0,80,150,0.08)';ctx.fillRect(sx,sy,T,T);ctx.fillStyle='rgba(0,0,0,0.15)';ctx.fillRect(sx,sy,T,1);ctx.fillRect(sx,sy,1,T);if((tx*5+ty*3)%7===0){ctx.fillStyle='rgba(0,150,255,0.15)';ctx.fillRect(sx+T-3,sy+6,2,2);}break;
    case'temple':ctx.fillStyle=lvl.wallColor;ctx.fillRect(sx,sy,T,T);ctx.fillStyle='rgba(180,150,0,0.06)';ctx.fillRect(sx,sy,T,T);ctx.fillStyle='rgba(0,0,0,0.2)';ctx.fillRect(sx,sy,T,2);if((tx+ty)%6===0){ctx.strokeStyle='rgba(200,200,0,0.12)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(sx+T/2,sy+T/2,5,0,Math.PI*2);ctx.stroke();}break;
    case'mansion':ctx.fillStyle=(tx+ty)%2===0?lvl.wallHi:lvl.wallColor;ctx.fillRect(sx,sy,T,T);ctx.fillStyle='rgba(0,0,0,0.15)';ctx.fillRect(sx,sy,T,2);ctx.fillRect(sx,sy,2,T);ctx.fillStyle='rgba(200,160,80,0.05)';ctx.fillRect(sx+T-2,sy,2,T);if((tx*3+ty*5)%7===0){ctx.fillStyle='rgba(60,30,10,0.12)';ctx.fillRect(sx+6,sy+6,T-12,T-12);}break;
    case'goldhall':ctx.fillStyle=lvl.wallColor;ctx.fillRect(sx,sy,T,T);ctx.fillStyle='rgba(255,215,0,0.12)';ctx.fillRect(sx,sy,T,T);ctx.fillStyle='rgba(255,255,200,0.06)';ctx.fillRect(sx+T-2,sy,2,T);ctx.fillRect(sx,sy+T-2,T,2);if((tx+ty)%3===0){ctx.fillStyle='rgba(255,215,0,0.08)';ctx.beginPath();ctx.arc(sx+T/2,sy+T/2,3,0,Math.PI*2);ctx.fill();}break;
    case'club':ctx.fillStyle=lvl.wallColor;ctx.fillRect(sx,sy,T,T);const hue=(tx*40+ty*60+performance.now()/50)%360;ctx.fillStyle='hsla('+hue+',60%,30%,0.08)';ctx.fillRect(sx,sy,T,T);break;
    case'clinic':ctx.fillStyle=lvl.wallColor;ctx.fillRect(sx,sy,T,T);ctx.fillStyle='rgba(0,0,0,0.04)';ctx.fillRect(sx,sy+T-1,T,1);ctx.fillStyle='rgba(100,150,200,0.06)';ctx.fillRect(sx,sy+T/2,T,1);break;
    case'dock':case'escape_dock':ctx.fillStyle=lvl.wallColor;ctx.fillRect(sx,sy,T,T);ctx.fillStyle='rgba(0,0,0,0.15)';ctx.fillRect(sx,sy,T,2);ctx.fillStyle='rgba(200,180,140,0.06)';if((tx)%2===0)ctx.fillRect(sx+4,sy+4,T-8,2);break;
    default:ctx.fillStyle='rgba(0,0,0,0.2)';ctx.fillRect(sx,sy,T,2);ctx.fillRect(sx,sy,2,T);ctx.fillStyle='rgba(255,255,255,0.05)';ctx.fillRect(sx+T-2,sy,2,T);break;
  }
}
function drawFloor(ctx,sx,sy,tx,ty,lvl){
  const s=lvl.tileStyle;
  ctx.fillStyle=lvl.floorColor;ctx.fillRect(sx,sy,T,T);
  switch(s){
    case'dungeon':if((tx+ty)%2===0){ctx.fillStyle='rgba(255,255,255,0.02)';ctx.fillRect(sx,sy,T,T);}if((tx*7+ty*3)%11===0){ctx.fillStyle='rgba(0,0,0,0.05)';ctx.fillRect(sx+8,sy+12,6,4);}break;
    case'ritual':ctx.fillStyle='rgba(80,0,0,0.05)';ctx.fillRect(sx,sy,T,T);if((tx+ty)%2===0){ctx.fillStyle='rgba(0,0,0,0.04)';ctx.fillRect(sx,sy,T,T);}break;
    case'catacombs':if((tx+ty)%2===0)ctx.fillStyle=lvl.floorHi;ctx.fillRect(sx,sy,T,T);ctx.strokeStyle='rgba(0,0,0,0.08)';ctx.lineWidth=0.5;ctx.strokeRect(sx+1,sy+1,T-2,T-2);if((tx*5+ty)%9===0){ctx.fillStyle='rgba(180,170,130,0.1)';ctx.beginPath();ctx.arc(sx+16,sy+16,2,0,Math.PI*2);ctx.fill();}break;
    case'kitchen':ctx.fillStyle=(tx+ty)%2===0?lvl.floorHi:lvl.floorColor;ctx.fillRect(sx,sy,T,T);if((tx*3+ty*7)%5===0){ctx.fillStyle='rgba(100,0,0,0.15)';ctx.beginPath();ctx.ellipse(sx+16,sy+16,5,3,tx*0.5,0,Math.PI*2);ctx.fill();}ctx.strokeStyle='rgba(0,0,0,0.06)';ctx.lineWidth=0.5;ctx.strokeRect(sx,sy,T,T);break;
    case'lab':ctx.fillStyle=(tx+ty)%2===0?lvl.floorHi:lvl.floorColor;ctx.fillRect(sx,sy,T,T);ctx.strokeStyle='rgba(0,0,0,0.06)';ctx.lineWidth=0.5;ctx.strokeRect(sx,sy,T,T);if((tx*3+ty)%8===0){ctx.fillStyle='rgba(0,0,0,0.04)';ctx.fillRect(sx+6,sy+6,T-12,T-12);}break;
    case'serverfarm':ctx.fillStyle=lvl.floorColor;ctx.fillRect(sx,sy,T,T);if((tx)%3===0){ctx.fillStyle='rgba(0,60,120,0.06)';ctx.fillRect(sx,sy,2,T);}if((tx+ty)%2===0){ctx.fillStyle='rgba(0,0,0,0.03)';ctx.fillRect(sx,sy,T,T);}break;
    case'temple':ctx.fillStyle=(tx+ty)%2===0?lvl.floorHi:lvl.floorColor;ctx.fillRect(sx,sy,T,T);ctx.fillStyle='rgba(180,150,0,0.03)';ctx.fillRect(sx,sy,T,T);if((tx+ty)%4===0){ctx.strokeStyle='rgba(180,150,0,0.08)';ctx.lineWidth=0.5;ctx.strokeRect(sx+4,sy+4,T-8,T-8);}break;
    case'mansion':ctx.fillStyle=(tx+ty)%2===0?lvl.floorHi:lvl.floorColor;ctx.fillRect(sx,sy,T,T);ctx.strokeStyle='rgba(100,60,20,0.08)';ctx.lineWidth=0.5;ctx.strokeRect(sx,sy,T,T);break;
    case'goldhall':ctx.fillStyle=(tx+ty)%2===0?lvl.floorHi:lvl.floorColor;ctx.fillRect(sx,sy,T,T);ctx.fillStyle='rgba(255,215,0,0.06)';ctx.fillRect(sx,sy,T,T);if((tx+ty)%3===0){ctx.fillStyle='rgba(255,255,200,0.04)';ctx.beginPath();ctx.arc(sx+T/2,sy+T/2,T/3,0,Math.PI*2);ctx.fill();}break;
    case'club':ctx.fillStyle=lvl.floorColor;ctx.fillRect(sx,sy,T,T);if((tx+ty)%2===0){const hue2=(tx*50+ty*70)%360;ctx.fillStyle='hsla('+hue2+',50%,20%,0.08)';ctx.fillRect(sx,sy,T,T);}break;
    case'clinic':ctx.fillStyle=(tx+ty)%2===0?lvl.floorHi:lvl.floorColor;ctx.fillRect(sx,sy,T,T);ctx.strokeStyle='rgba(0,0,0,0.03)';ctx.lineWidth=0.5;ctx.strokeRect(sx,sy,T,T);break;
    case'dock':case'escape_dock':ctx.fillStyle=(tx%2===0)?lvl.floorHi:lvl.floorColor;ctx.fillRect(sx,sy,T,T);ctx.fillStyle='rgba(0,0,0,0.05)';ctx.fillRect(sx,sy+T/2,T,1);break;
    default:if((tx+ty)%2===0){ctx.fillStyle='rgba(255,255,255,0.02)';ctx.fillRect(sx,sy,T,T);}break;
  }
}
function drawTile(ctx,sx,sy,tx,ty,tile,lvl,exitUnlocked){
  switch(tile){
    case'W':drawWall(ctx,sx,sy,tx,ty,lvl);break;
    case'#':
      ctx.fillStyle=lvl.floorColor;ctx.fillRect(sx,sy,T,T);
      ctx.fillStyle='#2a1a0a';ctx.fillRect(sx+12,sy+16,8,16);
      ctx.fillStyle='#1a5a1a';ctx.beginPath();ctx.arc(sx+16,sy+14,12,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#0a4a0a';ctx.beginPath();ctx.arc(sx+14,sy+12,8,0,Math.PI*2);ctx.fill();break;
    case'~':
      ctx.fillStyle='#1a3a6a';ctx.fillRect(sx,sy,T,T);
      const wv=Math.sin((tx+ty)*0.5+performance.now()/600)*3;
      ctx.fillStyle='rgba(100,180,255,0.3)';ctx.fillRect(sx,sy+14+wv,T,4);ctx.fillRect(sx+8,sy+6-wv,T-8,3);
      ctx.fillStyle='rgba(60,140,200,0.15)';ctx.fillRect(sx+2,sy+20+wv*0.5,T-4,2);break;
    case',':
      ctx.fillStyle=lvl.floorColor;ctx.fillRect(sx,sy,T,T);
      if((tx+ty)%3===0){ctx.fillStyle='rgba(0,80,0,0.3)';ctx.fillRect(sx+4,sy+4,3,8);}
      if((tx*7+ty*13)%5===0){ctx.fillStyle='rgba(80,120,0,0.2)';ctx.fillRect(sx+16,sy+12,2,6);}break;
    case'D':
      drawFloor(ctx,sx,sy,tx,ty,lvl);
      ctx.fillStyle='#654321';ctx.fillRect(sx+4,sy+2,T-8,T-4);
      ctx.fillStyle='#8B6914';ctx.fillRect(sx+6,sy+4,T-12,T-8);
      ctx.fillStyle='#da0';ctx.fillRect(sx+T-10,sy+T/2-2,3,4);break;
    case'X':
      drawFloor(ctx,sx,sy,tx,ty,lvl);
      if(exitUnlocked){
        const gl=0.5+0.5*Math.sin(performance.now()/300);
        ctx.fillStyle='rgba(0,255,0,'+(0.15+gl*0.25)+')';ctx.fillRect(sx,sy,T,T);
        ctx.strokeStyle='#0f0';ctx.lineWidth=2;ctx.strokeRect(sx+2,sy+2,T-4,T-4);
        ctx.fillStyle='#0f0';ctx.font='bold 9px monospace';ctx.textAlign='center';ctx.fillText(t('exit'),sx+T/2,sy+T/2+3);
      }else{
        ctx.fillStyle='rgba(255,0,0,0.25)';ctx.fillRect(sx,sy,T,T);
        ctx.strokeStyle='#f00';ctx.lineWidth=2;ctx.strokeRect(sx+2,sy+2,T-4,T-4);
        ctx.fillStyle='#f00';ctx.font='bold 7px monospace';ctx.textAlign='center';
        const killTxt=t('killAll')||'KILL ALL!';
        ctx.fillText(killTxt,sx+T/2,sy+T/2+3);
      }break;
    case'S':default:drawFloor(ctx,sx,sy,tx,ty,lvl);break;
  }
}

// ======================== THE GAME ========================
class Game{
  constructor(){
    this.canvas=document.getElementById('game');this.ctx=this.canvas.getContext('2d');
    this.state='controls';this.lvl=0;this.player=null;this.enemies=[];this.boss=null;
    this.items=[];this.particles=[];this.floats=[];this.projectiles=[];
    this.grid=[];this.decoMap=new Map();this.cam={x:0,y:0};this.shake=0;this.lastTime=0;
    this.exitUnlocked=true;
    this.savedWpn='fists';this.savedAmmo=0;this.savedHp=100;this.savedInv=new Set(['fists']);
    this.prevLevelState=null; // for backtracking
    this.resize();window.addEventListener('resize',()=>this.resize());
  }
  resize(){this.canvas.width=window.innerWidth;this.canvas.height=window.innerHeight;}
  init(){
    this.showBox('controlBox');this.lastTime=performance.now();
    requestAnimationFrame(t=>this.loop(t));
    // Control scheme buttons
    const ctrlKB=document.getElementById('ctrlKB');
    const ctrlMouse=document.getElementById('ctrlMouse');
    if(ctrlKB)ctrlKB.onclick=()=>{CONTROL_SCHEME='keyboard';this.showBox('langBox');};
    if(ctrlMouse)ctrlMouse.onclick=()=>{CONTROL_SCHEME='mouse';this.showBox('langBox');};
    // Language buttons
    document.getElementById('langFI').onclick=()=>{LANG='fi';ensureAudio();this.goMenu();};
    document.getElementById('langEN').onclick=()=>{LANG='en';ensureAudio();this.goMenu();};
    window.addEventListener('keydown',e=>{
      if(e.key==='Enter'){ensureAudio();this.onEnter();}
      if((e.key===' '||keys._padA)&&this.state==='playing'){e.preventDefault();this.doAttack();}
      if(e.key.toLowerCase()==='e'&&this.state==='playing')this.doPickup();
      const n=parseInt(e.key);
      if(n>=1&&n<=6&&this.state==='playing'&&this.player)this.player.switchW(n-1);
      // DEV: N = skip level
      if(e.key.toLowerCase()==='n'&&(this.state==='playing'||this.state==='levelIntro')){this.devSkip();}
    });
    // Dev skip button
    const skipBtn=document.getElementById('devSkip');
    if(skipBtn)skipBtn.onclick=()=>this.devSkip();
  }
  goMenu(){
    this.state='menu';
    document.getElementById('menuSubtitle').textContent=t('subtitle');
    document.getElementById('menuDesc').textContent=t('menuDesc');
    document.getElementById('menuControls').textContent=t('controls');
    document.getElementById('menuPrompt').textContent=t('pressEnter');
    this.showBox('menuBox');
  }
  onEnter(){
    switch(this.state){
      case'controls':break; // buttons only\n      case'lang':break; // buttons only
      case'menu':this.lvl=0;this.savedWpn='fists';this.savedAmmo=0;this.savedHp=100;this.savedInv=new Set(['fists']);currentScore=0;levelStateCache={};this.showLevelIntro();startMusic('explore');break;
      case'levelIntro':this.startLevel();break;
      case'dead':this.startLevel();break;
      case'victory':stopMusic();this.goMenu();break;
    }
  }
  showLevelIntro(){
    this.state='levelIntro';
    const l=t('levels')[this.lvl];
    document.getElementById('levelTitle').textContent=l.name;
    document.getElementById('levelDesc').textContent=l.desc;
    document.getElementById('levelPrompt').textContent=t('continuePrompt');
    this.showBox('levelBox');
  }
  startLevel(fromCache){
    const cfg=LEVEL_CFG[this.lvl];
    // Check cache for revisiting previous levels
    if(fromCache&&levelStateCache[this.lvl]){
      const cached=levelStateCache[this.lvl];
      this.grid=cached.grid;this.decoMap=cached.decoMap;
      this.enemies=cached.enemies;this.boss=cached.boss;
      this.items=cached.items;this.projectiles=[];
      this.particles=[];this.floats=[];this.shake=0;
      const sr=cached.startRoom;
      this.player=new Player(sr.cx,sr.cy);
      this.player.weapon=this.savedWpn;this.player.ammo=this.savedAmmo;
      this.player.hp=this.savedHp;this.player.maxHp=100;this.player.inv=new Set(this.savedInv);
      // Recalculate exit unlock
      const allDead=this.enemies.every(e=>!e.alive)&&(!this.boss||!this.boss.alive);
      this.exitUnlocked=allDead;
      if(this.boss&&this.boss.alive)startMusic(this.boss.type); else startMusic('explore');
      this.state='playing';this.hideOverlay();
      document.getElementById('hud').className='show';
      return;
    }
    // Seeded random for consistent enemy placement
    const seed=this.lvl*31337;
    const gen=genMap(cfg,seed);
    this.grid=gen.grid;this.decoMap=gen.decoMap;
    this.particles=[];this.floats=[];this.projectiles=[];this.shake=0;
    const sr=gen.startRoom;
    this.player=new Player(sr.cx,sr.cy);
    this.player.weapon=this.savedWpn;this.player.ammo=this.savedAmmo;
    this.player.hp=this.savedHp;this.player.maxHp=100;this.player.inv=new Set(this.savedInv);
    if(WEAPONS[this.player.weapon].ranged&&this.player.ammo<=0)this.player.ammo=10;
    // Scale enemy HP for later levels
    const hpScale=1+this.lvl*0.08;
    this.enemies=gen.enemies.map(e=>{e.hp=Math.round(e.hp*hpScale);const en=new Enemy(e,this.grid);en.maxHp=en.hp;return en;});
    this.boss=gen.bossData?new Boss(gen.bossData,this.grid):null;
    // Exit locked: must kill ALL enemies (and boss if present)
    this.exitUnlocked=false;
    this.items=gen.items.map(i=>new Item(i));
    // Cache this level state
    levelStateCache[this.lvl]={grid:this.grid,decoMap:this.decoMap,enemies:this.enemies,boss:this.boss,items:this.items,startRoom:sr};
    if(this.boss)startMusic(this.boss.type); else startMusic('explore');
    this.state='playing';this.hideOverlay();
    document.getElementById('hud').className='show';
  }
  doAttack(){
    if(!this.player||!this.player.alive)return;
    const atk=this.player.attack(this.grid);if(!atk)return;
    let{ox,oy,dx,dy,range,damage,ranged,grid}=atk;
    // Damage buff from mystery pickup
    if(this.player.dmgBuff>0)damage=Math.round(damage*1.5);
    // particles
    for(let i=0;i<4;i++)this.particles.push(new Particle(ox+dx*12,oy+dy*12,ranged?'#ff0':'#fff',(Math.random()-0.5)*80+dx*60,(Math.random()-0.5)*80+dy*60,0.25,2));
    if(ranged)for(let i=0;i<6;i++){const t=i/6;this.particles.push(new Particle(ox+dx*range*t,oy+dy*range*t,'#ff8',0,0,0.15,2));}
    // HIT CHECK — requires LOS (no hitting through walls!)
    const hitCheck=(ex,ey,ew)=>{
      if(!hasLOS(ox,oy,ex,ey,grid))return false; // WALL CHECK
      if(ranged){
        const hw=ew/2+8;
        for(let i=0;i<range;i+=4){
          const px=ox+dx*i,py=oy+dy*i;
          if(solid(tileAt(grid,Math.floor(px/T),Math.floor(py/T))))break; // stop at wall
          if(dist(px,py,ex,ey)<hw)return true;
        }
        return false;
      }
      return dist(ox+dx*range,oy+dy*range,ex,ey)<range+ew/2;
    };
    for(const e of this.enemies){
      if(!e.alive)continue;
      if(hitCheck(e.cx(),e.cy(),e.w)){e.takeDamage(damage);this.spawnBlood(e.cx(),e.cy());this.floats.push(new FloatText(e.cx(),e.cy()-10,'-'+damage,'#f44'));this.shake=0.08;}
    }
    if(this.boss&&this.boss.alive){
      if(hitCheck(this.boss.cx(),this.boss.cy(),this.boss.w)){
        this.boss.takeDamage(damage);this.spawnBlood(this.boss.cx(),this.boss.cy());
        this.floats.push(new FloatText(this.boss.cx(),this.boss.cy()-10,'-'+damage,'#f44'));this.shake=0.12;
        if(!this.boss.alive){
          this.exitUnlocked=true;
          this.floats.push(new FloatText(this.boss.cx(),this.boss.cy()-30,t('bossDown'),'#0f0'));
          for(let i=0;i<30;i++)this.particles.push(new Particle(this.boss.cx(),this.boss.cy(),['#f00','#ff0','#f80','#fff'][rand(0,3)],(Math.random()-0.5)*300,(Math.random()-0.5)*300,1.5,4));
          startMusic('explore'); // Switch back to explore music after boss dies
        }
      }
    }
  }
  spawnBlood(x,y){for(let i=0;i<6;i++)this.particles.push(new Particle(x,y,'#a00',(Math.random()-0.5)*120,(Math.random()-0.5)*120,0.5,3));}
  doPickup(){
    if(!this.player||!this.player.alive)return;
    const px=this.player.cx(),py=this.player.cy();
    for(const it of this.items){
      if(it.collected||dist(px,py,it.x,it.y)>PICKUP_R)continue;
      it.collected=true;sfxPickup();
      switch(it.type){
        case'health':this.player.hp=Math.min(this.player.maxHp,this.player.hp+it.amount);this.floats.push(new FloatText(it.x,it.y-10,'+'+it.amount+' HP','#0f0'));break;
        case'ammo':this.player.ammo+=it.amount;this.floats.push(new FloatText(it.x,it.y-10,'+'+it.amount+' AMMO','#da0'));break;
        case'mystery':{
          // Random good or bad effect
          const goods=t('mysteryGood'),bads=t('mysteryBad');
          if(Math.random()<0.6){
            const gi=rand(0,goods.length-1);
            switch(gi){
              case 0:this.player.hp=Math.min(this.player.maxHp,this.player.hp+25);break;
              case 1:this.player.spdBuff=8;break;
              case 2:this.player.dmgBuff=10;break;
              case 3:this.player.ammo+=15;break;
            }
            this.floats.push(new FloatText(it.x,it.y-10,goods[gi],'#0ff'));currentScore+=5;
          } else {
            const bi=rand(0,bads.length-1);
            switch(bi){
              case 0:this.player.hp=Math.max(1,this.player.hp-20);break;
              case 1:this.player.slowDebuff=6;break;
              case 2:this.player.ammo=Math.max(0,this.player.ammo-10);break;
            }
            this.floats.push(new FloatText(it.x,it.y-10,bads[bi],'#f0f'));this.shake=0.1;
          }
          break;}
        default:this.player.inv.add(it.type);this.player.weapon=it.type;
          if(WEAPONS[it.type].ranged&&this.player.ammo<20)this.player.ammo+=20;
          sfxPickupWeapon(it.type);
          this.floats.push(new FloatText(it.x,it.y-10,wName(it.type)+'!','#ff0'));break;
      }
    }
  }
  update(dt){
    if(this.state!=='playing')return;
    pollGamepad();
    // Mouse attack
    if(CONTROL_SCHEME==='mouse'&&mouseDown){this.doAttack();mouseDown=false;}
    // Gamepad attack
    if(keys._padA)this.doAttack();
    if(keys._padX)this.doPickup();
    this.player.update(dt,this.grid,this.cam);
    for(const e of this.enemies)e.update(dt,this.player);
    if(this.boss)this.boss.update(dt,this.player,this.projectiles);
    for(const it of this.items)it.update(dt);
    for(const p of this.projectiles){p.update(dt,this.grid);if(p.alive&&dist(p.x,p.y,this.player.cx(),this.player.cy())<14){this.player.takeDamage(p.dmg);p.alive=false;this.shake=0.1;}}
    this.projectiles=this.projectiles.filter(p=>p.alive);
    this.particles=this.particles.filter(p=>{p.update(dt);return p.life>0;});
    this.floats=this.floats.filter(f=>{f.update(dt);return f.life>0;});
    this.shake*=0.9;
    // Boss melee zone
    if(this.boss&&this.boss.alive){
      const bd=dist(this.boss.cx(),this.boss.cy(),this.player.cx(),this.player.cy());
      if(bd<this.boss.w/2+8&&this.boss.atkT<=0){
        if(this.boss.type==='trump'&&this.boss.charging){this.player.takeDamage(this.boss.damage+10);this.boss.charging=false;this.boss.atkT=BOSS_CD;}
        else if(this.boss.type==='pdiddy'&&this.boss.phase()===1){this.player.takeDamage(this.boss.damage+5);this.boss.atkT=400;}
      }
    }
    // Check kill-all exit condition
    const allEnemiesDead=this.enemies.every(e=>!e.alive);
    const bossCleared=!this.boss||!this.boss.alive;
    if(allEnemiesDead&&bossCleared)this.exitUnlocked=true;
    // Exit
    if(this.exitUnlocked&&this.player.alive){
      const tx=Math.floor(this.player.cx()/T),ty=Math.floor(this.player.cy()/T);
      if(tileAt(this.grid,tx,ty)==='X')this.completeLevel();
    }
    // Back entrance: go back to previous level
    if(this.player.alive&&this.lvl>0){
      const tx=Math.floor(this.player.cx()/T),ty=Math.floor(this.player.cy()/T);
      if(tileAt(this.grid,tx,ty)==='S'&&this.player.moving){
        // Check if actually at edge
        const sr=this.grid[ty][tx];
        if(tx<=1||ty<=1||tx>=this.grid[0].length-2||ty>=this.grid.length-2){
          this.savedWpn=this.player.weapon;this.savedAmmo=this.player.ammo;
          this.savedHp=this.player.hp;this.savedInv=new Set(this.player.inv);
          this.lvl--;
          this.startLevel(true);
        }
      }
    }
    // Death
    if(!this.player.alive){
      this.state='dead';document.getElementById('hud').className='';
      document.getElementById('deathTitle').textContent=t('deathTitle');
      const msgs=t('deathMsgs');document.getElementById('deathMsg').textContent=msgs[rand(0,msgs.length-1)];
      document.getElementById('deathPrompt').textContent=t('retryPrompt');
      this.showBox('deathBox');
    }
    // Camera
    this.cam.x=lerp(this.cam.x,this.player.cx()-this.canvas.width/2,0.1);
    this.cam.y=lerp(this.cam.y,this.player.cy()-this.canvas.height/2,0.1);
    const mw=this.grid[0].length*T,mh=this.grid.length*T;
    this.cam.x=clamp(this.cam.x,0,Math.max(0,mw-this.canvas.width));
    this.cam.y=clamp(this.cam.y,0,Math.max(0,mh-this.canvas.height));
  }
  completeLevel(){
    this.savedWpn=this.player.weapon;this.savedAmmo=this.player.ammo;
    this.savedHp=this.player.hp;this.savedInv=new Set(this.player.inv);
    currentScore+=50+this.lvl*10;
    this.lvl++;
    if(this.lvl>=LEVEL_CFG.length){
      this.state='victory';document.getElementById('hud').className='';
      document.getElementById('bossHp').className='boss-hp-container';
      document.getElementById('victoryTitle').textContent=t('victoryTitle');
      document.getElementById('victoryDesc').textContent=t('victoryDesc');
      document.getElementById('victoryThanks').textContent=t('victoryThanks');
      document.getElementById('victoryPrompt').textContent=t('replayPrompt');
      if(currentScore>highScore){highScore=currentScore;localStorage.setItem('epstein_highscore',String(highScore));}
      document.getElementById('victoryScore').textContent=t('score')+': '+currentScore+(currentScore>=highScore?' ('+t('hiScore')+'!)':'');
      this.showBox('victoryBox');stopMusic();
    }else this.showLevelIntro();
  }
  render(){
    const ctx=this.ctx,w=this.canvas.width,h=this.canvas.height;
    ctx.clearRect(0,0,w,h);
    if(this.state!=='playing'&&this.state!=='dead'){
      ctx.fillStyle='#0a0a0a';ctx.fillRect(0,0,w,h);
      this.drawPentagram(ctx,w/2,h/2,Math.min(w,h)*0.35,'rgba(100,0,0,0.15)');return;
    }
    const lvl=LEVEL_CFG[this.lvl];
    ctx.save();
    if(this.shake>0.01)ctx.translate((Math.random()-0.5)*this.shake*20,(Math.random()-0.5)*this.shake*20);
    const stx=Math.floor(this.cam.x/T),sty=Math.floor(this.cam.y/T);
    const etx=Math.ceil((this.cam.x+w)/T),ety=Math.ceil((this.cam.y+h)/T);
    for(let ty=sty;ty<=ety;ty++)for(let tx=stx;tx<=etx;tx++){
      const sx=tx*T-this.cam.x,sy=ty*T-this.cam.y;
      drawTile(ctx,sx,sy,tx,ty,tileAt(this.grid,tx,ty),lvl,this.exitUnlocked);
      const dk=tx+','+ty;if(this.decoMap.has(dk))drawDeco(ctx,sx,sy,this.decoMap.get(dk));
    }
    for(const it of this.items)it.draw(ctx,this.cam);
    for(const e of this.enemies)e.draw(ctx,this.cam);
    if(this.boss)this.boss.draw(ctx,this.cam);
    if(this.player)this.player.draw(ctx,this.cam);
    for(const p of this.projectiles)p.draw(ctx,this.cam);
    for(const p of this.particles)p.draw(ctx,this.cam);
    for(const f of this.floats)f.draw(ctx,this.cam);
    // Darkness
    if(lvl.darkness>0){
      const px=this.player.cx()-this.cam.x,py=this.player.cy()-this.cam.y,r=this.player.sprint?200:150;
      const g=ctx.createRadialGradient(px,py,r*0.3,px,py,r);
      g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,'+lvl.darkness+')');
      ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
    }
    ctx.restore();
    this.renderHUD(ctx,w,h);
  }
  renderHUD(ctx,w,h){
    if(!this.player)return;
    const hpPct=this.player.hp/this.player.maxHp;
    const hpBar=document.getElementById('healthBar');
    hpBar.style.width=(hpPct*100)+'%';
    hpBar.style.background=hpPct>0.5?'#0f0':hpPct>0.25?'#ff0':'#f00';
    document.getElementById('hudLevel').textContent=t('levels')[this.lvl].name;
    document.getElementById('hudWeapon').textContent=wName(this.player.weapon);
    document.getElementById('hudAmmo').textContent=WEAPONS[this.player.weapon].ranged?'Ammo: '+this.player.ammo:'';
    // Score + enemies remaining
    const alive=this.enemies.filter(e=>e.alive).length+(this.boss&&this.boss.alive?1:0);
    const scoreEl=document.getElementById('hudScore');
    if(scoreEl)scoreEl.textContent=t('score')+': '+currentScore+(highScore>0?' | '+t('hiScore')+': '+highScore:'');
    const enemyEl=document.getElementById('hudEnemies');
    if(enemyEl)enemyEl.textContent=alive>0?'\u2620 '+alive:'';
    if(enemyEl)enemyEl.style.color=alive===0?'#0f0':'#f88';
    const bc=document.getElementById('bossHp');
    if(this.boss&&this.boss.alive){
      bc.className='boss-hp-container show';
      document.getElementById('bossName').textContent=this.boss.name;
      document.getElementById('bossHpBar').style.width=(this.boss.hp/this.boss.maxHp*100)+'%';
    }else bc.className='boss-hp-container';
    // Weapon bar
    const slotW=58,slotH=34,gap=4,total=6*(slotW+gap)-gap;
    const bx=(w-total)/2,by=h-slotH-14;
    for(let i=0;i<6;i++){
      const wn=WEAPON_SLOTS[i],has=this.player.inv.has(wn),act=this.player.weapon===wn;
      const sx=bx+i*(slotW+gap);
      ctx.fillStyle=act?'rgba(50,50,0,0.85)':'rgba(0,0,0,0.7)';ctx.fillRect(sx,by,slotW,slotH);
      ctx.strokeStyle=act?'#ff0':has?'#666':'#333';ctx.lineWidth=act?2:1;ctx.strokeRect(sx,by,slotW,slotH);
      ctx.globalAlpha=has?1:0.3;
      ctx.fillStyle='#888';ctx.font='9px monospace';ctx.textAlign='center';ctx.fillText(''+(i+1),sx+slotW/2,by+11);
      ctx.fillStyle=act?'#ff0':'#ccc';ctx.font='10px monospace';ctx.fillText(has?wName(wn):'---',sx+slotW/2,by+26);
      ctx.globalAlpha=1;
    }
  }
  drawPentagram(ctx,cx,cy,r,c){
    ctx.strokeStyle=c;ctx.lineWidth=2;ctx.beginPath();
    for(let i=0;i<5;i++){const a=(i*4*Math.PI/5)-Math.PI/2,x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r;i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}
    ctx.closePath();ctx.stroke();ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.stroke();
  }
  devSkip(){
    if(this.state==='levelIntro'){this.startLevel();setTimeout(()=>this.devSkip(),100);return;}
    if(this.state!=='playing')return;
    this.savedWpn=this.player?this.player.weapon:'fists';this.savedAmmo=this.player?this.player.ammo:0;
    this.savedHp=100;this.savedInv=this.player?new Set(this.player.inv):new Set(['fists']);
    this.lvl++;
    if(this.lvl>=LEVEL_CFG.length){this.lvl=0;}
    this.showLevelIntro();
  }
  showBox(id){document.getElementById('overlay').className='active';document.querySelectorAll('#overlay .box').forEach(b=>b.className='box');document.getElementById(id).className='box show';}
  hideOverlay(){document.getElementById('overlay').className='';document.querySelectorAll('#overlay .box').forEach(b=>b.className='box');}
  loop(now){const dt=Math.min((now-this.lastTime)/1000,0.05);this.lastTime=now;this.update(dt);this.render();requestAnimationFrame(t=>this.loop(t));}
}
window.addEventListener('load',()=>{
  if(location.search.includes('dev'))document.body.classList.add('dev');
  new Game().init();
});
})();
