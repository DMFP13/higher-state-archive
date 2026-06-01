import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowUpRight, CirclePause, MousePointer2, Zap } from 'lucide-react';
import gsap from 'gsap';
import { createScene } from './scene.js';
import './styles.css';

const labelStory = [
  'Higher State was never just a record label. It was part of a moment.',
  'Founded in London in 1992 by Marc Dillon and Patrick Dickins, Higher State emerged from a city that was changing fast. The post-punk and New Romantic years had given way to acid house, pirate radio, warehouse parties and an entirely new nightlife culture. London had become one of the most exciting club cities in the world. Records moved through scenes before they moved through charts. DJs, promoters, record shops and dancefloors shaped reputations long before social media or streaming existed.',
  'Into that environment came Dillon & Dickins.',
  'What they built was never a conventional label. Higher State quickly evolved into a self-contained universe: Higher State, 99 North, 99 Degrees, Higher State Imports and an ever-expanding network of aliases including 99 Allstars, Sound Environment, Disco Biscuit, Spacebase, Upstate, DPD, Groovoid, Illicit and many more. To outsiders it looked like an entire movement of producers. In reality much of it was driven by the same two people operating from the centre of the storm.',
  'The records sounded different.',
  'At a time when much of the UK house scene was heavily influenced by US garage and New York vocal house, Dillon & Dickins developed a tougher, louder and more driving production style. The basslines were heavier. The drums hit harder. The records were engineered for big systems, crowded dancefloors and peak-time impact. Whether it was the rolling pressure of Sound Environment, the tougher energy of Disco Biscuit or the crossover club power of 99 Allstars, there was always movement in the grooves and weight in the low end.',
  'The alias strategy became part of the label mythology. One week it might be Spacebase, the next Upstate, then Sound Environment or Disco Biscuit. Different names, different aesthetics, different club moods - but all contributing to a wider Higher State identity. It gave the labels a scale and momentum that felt much larger than a boutique independent operation.',
  'And the records travelled.',
  'What started in London clubs quickly spread through distributors, DJs, compilation licensing and international house networks. Higher State releases found their way into record boxes and clubs across Europe, North America, Australia and Japan. Long before playlists and algorithms, tracks were being discovered through specialist record shops, import bins, pirate radio stations and word of mouth.',
  "By the mid-to-late 1990s, 99 North became the more outward-facing arm of the operation. It carried larger vocal records, crossover club releases and remix-heavy projects that connected directly with the exploding UK house and hard-house scenes. Tracks such as Luv Is All U Need, Soakin' Wet and Chemical Generation became fixtures of late-90s club culture, appearing on major DJ compilations and club collections alongside the sounds coming out of Trade, Sundissential and the wider British dance underground.",
  "99 Degrees developed a different reputation. Smaller, sharper and more specialist, it became home to artists including T-Total, Sweet Peach, Bounce, Orienta Rhythm and Tallulah. The presence of Tallulah - one of the defining figures of London's queer nightlife scene - reflected something that had always existed within the label family: a deep connection to club culture beyond music alone. These were records made for real nightlife communities, not simply commercial dance releases.",
  "As the catalogue expanded, so did the circle around it. Leee John, Kate Cameron, Rose Windross, Shannon, Shawn Christopher, MURK and FPI Project all became part of the wider story. Licensed releases, vocal collaborations and remix projects pushed the labels further into the international dance landscape while retaining their underground identity. The operation's first notable UK chart success arrived with FPI Project's Everybody (All Over The World), followed by further chart activity from Shawn Christopher and later crossover projects.",
  'At the same time Dillon & Dickins were building a second career through remix culture. Under both their own name and later the Illicit alias, they moved between underground club music and mainstream dance-pop with unusual ease. Their remix work connected them to artists including Todd Terry, Gala, Martha Wash, RuPaul, Kylie Minogue, Cher, Usher, Stevie Nicks, Alcazar, Cyndi Lauper, India.Arie and Etta James.',
  'The Illicit years opened another chapter. Long before mashups became mainstream, Dillon & Dickins were experimenting with unofficial edits, white labels and crossover club records. That culture eventually produced Cheeky Armada, a commercial reworking of their underground Sneaky Armada mashup, giving them a UK chart hit while retaining credibility inside the club world.',
  "The labels also left a visible mark on queer culture. Dillon & Dickins' Queers R Doin' It appeared through the Steers & Queers EP, while the Illicit remix of Etta James' Miss You later featured in Queer As Folk. These were not accidental connections. Higher State, 99 North and 99 Degrees existed within the same nightlife ecosystems that helped shape British house music itself.",
  'That is why the catalogue still resonates.',
  'Not because Higher State became a corporate dance giant. Not because every release was a chart record. But because the labels captured a specific period when independent music culture could still influence scenes around the world from a small London office. A time when record sleeves mattered. When aliases mattered. When DJs broke records rather than algorithms. When a mysterious logo on a white label could create a reputation overnight.',
  'Looking back now, Higher State feels less like a traditional record company and more like a map of an era: a network of clubs, record shops, pirate stations, DJs, vocalists, remixers, promoters and dancefloors connected through a shared obsession with house music.',
  'Higher State, 99 North and 99 Degrees were never simply labels.',
  'They were part of the infrastructure of British club culture.',
];

const legacyPassages = [
  'Higher State was never really about mainstream visibility. Its legacy lives somewhere more interesting: in record bags, white labels, DJ charts, scratched CD wallets, late-night compilations and club memories passed from one generation to another. The music travelled through pirate radio, Trade floors, afterhours sets, queer nightlife, hard-house circuits and crossover house culture long before algorithms decided what mattered.',
  'What began in the early 1990s as an underground London label built around aliases, studio experimentation and in-house remix culture gradually evolved into something far wider: a network of records, remixes and identities that connected Higher State, 99 North, 99 Degrees and later Illicit to the changing sound of British club music itself.',
  "The catalogue moved fluidly between deep house, vocal house, hard house, mashups, white labels and crossover club records. Along the way it intersected with figures from London's queer nightlife, major-label remix culture, Ibiza crossover house and the wider UK dance underground. Some records charted. Many didn't. But the important ones kept circulating - licensed, replayed, remixed and rediscovered across compilations, DJ mixes and dancefloors for decades afterwards.",
  'Today the surviving artefacts - vinyl sleeves, CD singles, promo photos, white labels, remix credits and fragmented digital archives - tell the story of a scene rather than simply a label. A world built before streaming, before social media and before dance music became fully corporate: where identity was created through aliases, records moved hand-to-hand, and reputation spread through clubs, record shops and word of mouth.',
  'Higher State endures because it captured a very specific cultural moment in UK dance music history - one where underground creativity, remix culture, queer nightlife and independent label energy all collided at exactly the right time.',
];

const legacySignals = [
  'Record bags',
  'White labels',
  'Pirate radio',
  'Trade floors',
  'Queer nightlife',
  'Hard-house circuits',
  'CD wallets',
  'Word of mouth',
];

const archiveWallAssets = [
  { src: '/archive-assets/distorted/archive-01.webp', fit: 'cover', depth: 'mid', x: 66, y: 12, w: 28, r: -7, s: 1.05, duration: 28, delay: -4 },
  { src: '/archive-assets/distorted/archive-02.webp', fit: 'cover', depth: 'back', x: 8, y: 18, w: 18, r: 8, s: 0.92, duration: 34, delay: -17 },
  { src: '/archive-assets/distorted/archive-03.webp', fit: 'cover', depth: 'front', x: 74, y: 64, w: 19, r: 5, s: 1.05, duration: 23, delay: -9 },
  { src: '/archive-assets/distorted/archive-04.webp', fit: 'cover', depth: 'mid', x: 36, y: 8, w: 24, r: -11, s: 0.96, duration: 31, delay: -13 },
  { src: '/archive-assets/distorted/archive-05.webp', fit: 'cover', depth: 'back', x: 82, y: 26, w: 15, r: -4, s: 0.9, duration: 37, delay: -20 },
  { src: '/archive-assets/distorted/archive-06.webp', fit: 'cover', depth: 'mid', x: 3, y: 58, w: 19, r: -9, s: 1.02, duration: 27, delay: -7 },
  { src: '/archive-assets/distorted/archive-07.webp', fit: 'contain', depth: 'front', x: 52, y: 44, w: 16, r: 12, s: 0.98, duration: 24, delay: -15 },
  { src: '/archive-assets/distorted/archive-08.webp', fit: 'cover', depth: 'back', x: 23, y: 70, w: 17, r: 6, s: 0.9, duration: 39, delay: -2 },
  { src: '/archive-assets/distorted/archive-09.webp', fit: 'contain', depth: 'front', x: 14, y: 38, w: 18, r: 4, s: 1.04, duration: 26, delay: -18 },
  { src: '/archive-assets/distorted/archive-10.webp', fit: 'contain', depth: 'mid', x: 58, y: 78, w: 16, r: -6, s: 0.95, duration: 33, delay: -11 },
  { src: '/archive-assets/distorted/archive-11.webp', fit: 'contain', depth: 'back', x: 42, y: 30, w: 15, r: 9, s: 0.88, duration: 36, delay: -23 },
  { src: '/archive-assets/distorted/archive-12.webp', fit: 'contain', depth: 'front', x: 87, y: 48, w: 17, r: -13, s: 1.03, duration: 25, delay: -5 },
  { src: '/archive-assets/distorted/archive-13.webp', fit: 'contain', depth: 'back', x: 31, y: 52, w: 13, r: -3, s: 0.86, duration: 41, delay: -29 },
  { src: '/archive-assets/distorted/archive-14.webp', fit: 'contain', depth: 'mid', x: 6, y: 82, w: 17, r: 10, s: 0.95, duration: 29, delay: -19 },
  { src: '/archive-assets/distorted/archive-15.webp', fit: 'cover', depth: 'back', x: 70, y: 88, w: 13, r: -8, s: 0.82, duration: 42, delay: -8 },
  { src: '/archive-assets/distorted/archive-16.webp', fit: 'contain', depth: 'front', x: 23, y: 7, w: 24, r: 3, s: 1.06, duration: 22, delay: -12 },
];

const discography = [
  {
    name: 'Higher State Records',
    code: 'HSD',
    note: 'The mothership: aliases, samplers, remixes and the original underground London run.',
    years: [
      {
        year: '1992',
        releases: [
          { cat: 'HSD 001', artist: 'Groovoid', title: 'Until U Drop EP' },
          { cat: 'HSD 002', artist: 'Mesozoik', title: 'The Future EP' },
          { cat: 'HSD 003', artist: 'Kartoid', title: 'Kartoid EP' },
          { cat: '12 HSD 04', artist: 'Dillon', title: 'Make It Take It' },
          { cat: '12 HSD 05', artist: 'Lafferty', title: 'Brand New Day' },
        ],
      },
      {
        year: '1993',
        releases: [
          { cat: '12 HSD 06', artist: 'Sound Environment', title: 'Natural High' },
          { cat: '12 HSD 07', artist: 'Crazy Prophylactic', title: 'Reach' },
          { cat: '12 HSD 08', artist: 'Disco Biscuit', title: 'Disco Biscuit' },
          { cat: '12 HSD 09', artist: 'Lentil Lovecake', title: "Don't Desert Me" },
          { cat: '12 HSD 10', artist: 'Sound Environment', title: 'Natural High (The Remixes)' },
          { cat: '12 HSD 11', artist: 'Spacebase', title: 'I Need You' },
          { cat: '12 HSD 12', artist: 'NASA', title: 'Secret' },
          { cat: '12 HSD 14', artist: 'Sound Environment', title: 'Feel So High' },
          { cat: '12 HSD 15', artist: 'Disco Biscuit', title: 'Disco Biscuit (Remixes)' },
        ],
      },
      {
        year: '1994',
        releases: [
          { cat: '12 HSD 16', artist: 'Lafferty', title: "Thinkin'bout" },
          { cat: '12 HSD 17', artist: 'On The Blag', title: 'Working Jocks E.P. Vol. 1' },
          { cat: '12 HSD 18', artist: 'Spacebase', title: 'Release' },
          { cat: '12 HSD 19', artist: 'Swag Bag', title: 'The Money EP' },
          { cat: '12 HSD 20', artist: 'European Express', title: 'Heaven' },
          { cat: '12 HSD 21', artist: 'Roller Coaster', title: 'My Geetar Hertz' },
          { cat: '12 HSD 22', artist: 'Sound Environment', title: 'Had Enough E.P.' },
          { cat: '12 HSD 22R', artist: 'Sound Environment', title: 'Had Enough E.P. (Rebound Remixes)' },
          { cat: '12 HSD 23', artist: 'Lentil Lovecake', title: 'Let Me See' },
        ],
      },
      {
        year: '1995',
        releases: [
          { cat: '12 HSD 24', artist: 'Various', title: 'Higher State Sampler' },
          { cat: '12 HSD 25', artist: 'Gorgeous Darlings', title: 'I Want U' },
          { cat: '12 HSD 26', artist: 'Upstate', title: 'I Get High' },
        ],
      },
      {
        year: '1996',
        releases: [
          { cat: '12 HSD 27', artist: 'Spacebase', title: 'Patience / Frustration' },
          { cat: '12 HSD 28', artist: 'Gorgeous Darlings', title: 'Boy U Take Me / Alright / Angel' },
          { cat: '12 HSD 29', artist: 'Crystal', title: 'Bring Me Luv' },
          { cat: '12 HSD 30', artist: 'Upstate', title: 'I Get High (Remixes)' },
          { cat: '12 HSD 31 / CD HSD 31', artist: 'Disco Biscuit', title: 'Disco Biscuit (Remixes)' },
        ],
      },
      {
        year: '1997',
        releases: [
          { cat: '12 HSD 32 / CD HSD 32', artist: 'Matter', title: "Don't U Want Some More" },
          { cat: '12 HSD 33 / CD HSD 33', artist: 'Naka', title: "That's It" },
          { cat: '12 HSD 34 / 12 HSD 34R / CD HSD 34', artist: 'Johnny X', title: 'Call On Me (Remixes)' },
        ],
      },
      { year: '1998', releases: [{ cat: '12 HSD 35 / CD HSD 35', artist: 'Spacebase', title: 'What Am I Gonna Do' }] },
      {
        year: '1999',
        releases: [
          { cat: '12 HSD 36', artist: 'Nature', title: 'Trumpet Gun - Feelin Higher' },
          { cat: '12 HSD 37', artist: 'Yosh Presents @-Large', title: 'Do You Feel It' },
        ],
      },
      {
        year: 'Digital Era',
        releases: [
          { cat: 'MP DND 009', artist: 'Dillon & Dickins', title: 'Digigen' },
          { cat: 'MP DND 010', artist: 'Dillon & Dickins feat. Rose Windross', title: 'Nite Moves' },
          { cat: 'MP DND 011', artist: 'Dillon & Dickins', title: 'Exquisite Illicit' },
        ],
      },
    ],
  },
  {
    name: 'Higher State Imports',
    code: 'HIMP',
    note: 'A short import thread: small, odd, crate-digging energy.',
    years: [
      { year: '1994', releases: [{ cat: '12 HIMP 1', artist: 'Cluedo', title: 'The White EP' }] },
      { year: '1995', releases: [{ cat: '12 HIMP 3', artist: 'Miss Stuck-Up', title: 'Stick Together' }] },
      { year: '1996', releases: [{ cat: '12 HIMP 4 / CD HIMP 4', artist: 'Johnny X', title: 'Call On Me' }] },
    ],
  },
  {
    name: '99 North',
    code: '99 NTH',
    note: 'The crossover arm: vocal hooks, compilation presence, big late-90s club momentum.',
    years: [
      {
        year: '1995',
        releases: [
          { cat: '99 NTH 01', artist: 'Various', title: 'Taster' },
          { cat: '99 NTH 02', artist: 'Sweet Peach', title: 'Disco F*ck / Hard Suck' },
          { cat: '99 NTH 03', artist: 'Doc Ximbi', title: 'African American' },
        ],
      },
      {
        year: '1996',
        releases: [
          { cat: '99 NTH 04', artist: 'Sweet Peach', title: 'Naked Fruit EP' },
          { cat: '99 NTH 05', artist: '99 Allstars', title: 'Allstars EP' },
          { cat: '99 NTH 06', artist: '99 Allstars', title: 'Allstars EP Vol. 2' },
          { cat: '99 NTH 07 / CD NTH 07', artist: 'DPD feat. Rose Windross', title: 'Sign Your Name / Problem Child' },
          { cat: '99 NTH 08 / CD NTH 08', artist: 'Ninety Nine Allstars', title: 'Luv Is All U Need' },
        ],
      },
      {
        year: '1997',
        releases: [
          { cat: '99 NTH 09 / CD NTH 09', artist: 'Blackout', title: 'Gotta Have Hope' },
          { cat: '99 NTH 10 / CD NTH 10', artist: 'Gold Dust Twins', title: 'Luver (All That I Wanted)' },
          { cat: '99 MCC 1 / CD MCC 1', artist: 'Ninety Nine Allstars', title: 'Metal Can Collection' },
        ],
      },
      {
        year: '1998',
        releases: [
          { cat: '99 NTH 11 / CD NTH 11', artist: 'Ninety Nine Allstars', title: "Soakin' Wet" },
          { cat: '99 NTH 12 / CD NTH 12', artist: 'Ninety Nine Allstars', title: 'Chemical Generation' },
          { cat: '99 NTH 13 / CD NTH 13', artist: 'MURK', title: 'Reach For Me' },
        ],
      },
      {
        year: '1999',
        releases: [
          { cat: '99 NTH 14 / CD NTH 14', artist: 'FPI Project', title: 'Everybody (All Over The World)' },
          { cat: '99 NTH 15 / CD NTH 15', artist: 'Dillon & Dickins', title: 'Steers & Queers EP' },
          { cat: '99 NTH 16 / 99 NTH 16R / CD NTH 16', artist: 'Shawn Christopher', title: 'Another Sleepless Night' },
          { cat: '99 NTH 17 / 99 NTH 17R / CD NTH 17', artist: 'FPI Project', title: 'Rich In Paradise / Going Back To My Roots' },
        ],
      },
      {
        year: '2000',
        releases: [
          { cat: '99 NTH 18', artist: 'M1', title: 'Electronic Funk' },
          { cat: '99 NTH 19', artist: 'Illicit feat. Shannon', title: 'Pulsation' },
          { cat: '99 NTH 20', artist: 'Dillon & Dickins', title: 'Stop The Groove' },
        ],
      },
      { year: '2001', releases: [{ cat: '99 NTH 21', artist: '99 Allstars', title: 'Space Sensation' }] },
    ],
  },
  {
    name: '99 Degrees',
    code: '99 DEG',
    note: 'The deeper sibling: tougher, specialist, stranger and more late-night.',
    years: [
      { year: '1997', releases: [{ cat: '99 DEG 1', artist: 'T-Total', title: 'The Groovaholic EP' }] },
      {
        year: '1998',
        releases: [
          { cat: '99 DEG 2 / CD DEG 2', artist: 'T-Total', title: 'The Dub Addict EP' },
          { cat: '99 DEG 3 / CD DEG 3', artist: 'Sweet Peach', title: 'Take U Up' },
          { cat: '99 DEG 4 / CD DEG 4', artist: 'T-Total feat. Paul Alexander', title: "Don'tchoowanna / Do It All Night" },
          { cat: '99 DEG 5 / CD DEG 5', artist: 'Tallulah', title: 'Gimmee Your Lovestick' },
          { cat: '99 DEG 6', artist: 'Bounce', title: 'Off Da Floor' },
        ],
      },
      {
        year: '1999',
        releases: [
          { cat: '99 DEG 7', artist: 'T-Total', title: 'The Looprication EP' },
          { cat: '99 DEG 8', artist: 'Zero Zero', title: 'New Aegean Movement EP' },
          { cat: '99 DEG 9', artist: 'Orienta Rhythm', title: 'Orienta Rhythm EP' },
        ],
      },
    ],
  },
];

const dillonDickinsMusicAndRemixology = {
  aliases: [
    '99 Allstars',
    'Crazy Prophylactic',
    'Dillon',
    'Disco Biscuit',
    'DPD',
    'European Express',
    'Gorgeous Darlings',
    'Groovoid',
    'Higher State',
    'Illicit',
    'Kartoid',
    'Lentil Love Cake',
    'Mesozoik',
    'Miss Stuck-Up',
    'NASA',
    'On The Blag',
    'Sleeze Queen',
    'Sound Environment',
    'Spacebase',
    'Swag Bag',
    'Upstate',
  ],
  remixologyByAlias: [
    {
      alias: '99 Allstars',
      releasesAndRemixes: ['Allstars EP', 'Allstars EP Vol. 2', 'Luv Is All U Need', "Soakin' Wet", 'Chemical Generation', 'Space Sensation / Loverman'],
      remixConnections: ['Tony De Vit', 'T-Total', 'Steve Thomas', 'Upstate', 'Dillon & Dickins'],
      notes: 'Flagship crossover project within the 99 North catalogue.',
    },
    { alias: 'Crazy Prophylactic', releasesAndRemixes: ['Reach'], notes: 'Early Higher State underground alias.' },
    { alias: 'Dillon', releasesAndRemixes: ['Make It Take It'], notes: 'One of the earliest direct Dillon aliases used on Higher State.' },
    { alias: 'Disco Biscuit', releasesAndRemixes: ['Disco Biscuit', 'Disco Biscuit (Remixes)'], notes: 'Harder club-oriented Higher State identity.' },
    {
      alias: 'DPD',
      releasesAndRemixes: ['Sign Your Name / Problem Child'],
      collaborators: ['Rose Windross'],
      notes: 'Soulful vocal-house crossover alias.',
    },
    { alias: 'European Express', releasesAndRemixes: ['Heaven'], notes: 'Short-lived Higher State alias.' },
    { alias: 'Gorgeous Darlings', releasesAndRemixes: ['I Want U', 'Boy U Take Me / Alright / Angel'], notes: 'More vocal-house oriented alias.' },
    { alias: 'Groovoid', releasesAndRemixes: ['Until U Drop EP'], notes: 'First documented Higher State release.' },
    {
      alias: 'Higher State',
      releasesAndRemixes: ['Trust'],
      remixes: ['Nootropic - Nu-Reality', 'Semper - Forever', 'The Numerical Value - Krazy Noise', "Happy Larry's Big Beat Orchestra - Lego Beat", 'Black River - Kill Dem Off'],
      notes: 'Used as both label identity and remix/production identity.',
    },
    {
      alias: 'Illicit',
      releasesAndRemixes: ['Pulsation', 'Cheeky Armada'],
      commercialRemixes: [
        'Madison Avenue - Who The Hell Are You',
        'Afro Medusa - Pasilda',
        'Kylie Minogue - Butterfly',
        'Cher - Song For The Lonely',
        'India.Arie - Brown Skin',
        'Alcazar - Crying At The Discoteque',
        'Enrique Iglesias - Escape',
        'Heather Small - Proud',
        'Etta James - Miss You',
        'Usher - U Remind Me',
        'Mary J. Blige - Family Affair',
        'Cyndi Lauper - Shine',
        'Girls Aloud - Some Kind Of Miracle',
        'Emma Bunton - Maybe',
        'Vengaboys - Cheekah Bow Bow',
        'Stevie Nicks - Planets Of The Universe',
      ],
      notes: 'Most commercially successful Dillon & Dickins remix identity.',
    },
    { alias: 'Kartoid', releasesAndRemixes: ['Kartoid EP'], notes: 'Early Higher State alias.' },
    { alias: 'Lentil Lovecake', releasesAndRemixes: ["Don't Desert Me", 'Let Me See'], notes: 'Experimental alias within the Higher State roster.' },
    { alias: 'Mesozoik', releasesAndRemixes: ['The Future EP'], notes: 'One of the first Higher State aliases.' },
    { alias: 'Miss Stuck-Up', releasesAndRemixes: ['Stick Together'], notes: 'Higher State Imports release.' },
    { alias: 'NASA', releasesAndRemixes: ['Secret'], notes: 'Short-lived Higher State alias.' },
    { alias: 'On The Blag', releasesAndRemixes: ['Working Jocks E.P. Vol. 1'], notes: 'Underground EP project.' },
    { alias: 'Sleeze Queen', releasesAndRemixes: [], notes: 'Documented alias but no verified release located in the accessible record.' },
    {
      alias: 'Sound Environment',
      releasesAndRemixes: ['Natural High', 'Natural High (The Remixes)', 'Feel So High', 'Had Enough E.P.', 'Had Enough E.P. (Rebound Remixes)'],
      notes: 'One of the defining early Higher State identities.',
    },
    {
      alias: 'Spacebase',
      releasesAndRemixes: ['I Need You', 'Release', 'Patience / Frustration', 'What Am I Gonna Do'],
      collaborators: ['Kate Cameron'],
      notes: 'Important melodic/vocal Higher State project.',
    },
    { alias: 'Swag Bag', releasesAndRemixes: ['The Money EP'], notes: 'Underground alias release.' },
    {
      alias: 'Upstate',
      releasesAndRemixes: ['I Get High', 'I Get High (Remixes)'],
      remixConnections: ['Chemical Generation'],
      notes: 'Likely represented the more uplifting/vocal-house remix aesthetic.',
    },
  ],
  remixes: [
    { year: 1993, remixAlias: 'Higher State', artist: 'Nootropic', title: 'Nu-Reality' },
    { year: 1994, remixAlias: 'Higher State', artist: 'Semper', title: 'Forever' },
    { year: 1994, remixAlias: 'Higher State', artist: 'The Numerical Value', title: 'Krazy Noise' },
    { year: 1994, remixAlias: 'Higher State', artist: "Happy Larry's Big Beat Orchestra", title: 'Lego Beat' },
    { year: 1995, remixAlias: 'Higher State', artist: 'Black River', title: 'Kill Dem Off' },
    { year: 1994, remixAlias: 'Dillon & Dickins', artist: 'Euphonix', title: 'Love Divine' },
    { year: 1995, remixAlias: 'Dillon & Dickins', artist: 'Natural Born Grooves', title: 'Forerunner' },
    { year: 1996, remixAlias: 'Dillon & Dickins', artist: "Movin' Melodies", title: 'Rollerblade' },
    { year: 1996, remixAlias: 'Dillon & Dickins', artist: 'Bizarre Inc', title: 'Playing With Knives' },
    { year: 1997, remixAlias: 'Dillon & Dickins', artist: 'Jimmy Somerville', title: 'Dark Sky' },
    { year: 1997, remixAlias: 'Dillon & Dickins', artist: 'United States of Erica', title: "I'm So Sick of Models" },
    { year: 1997, remixAlias: 'Dillon & Dickins', artist: 'Mood II Swing', title: 'All Night Long' },
    { year: 1997, remixAlias: 'Dillon & Dickins', artist: 'The Experts', title: "I'll Take You There" },
    { year: 1997, remixAlias: 'Dillon & Dickins', artist: 'Gifted', title: 'Do I' },
    { year: 1997, remixAlias: 'Dillon & Dickins', artist: 'Anthony & Georgio', title: 'Equilibrium' },
    { year: 1997, remixAlias: 'Dillon & Dickins', artist: 'Gala', title: 'Freed From Desire' },
    { year: 1997, remixAlias: 'Dillon & Dickins', artist: 'Spellbound', title: 'Heaven On Earth' },
    { year: 1997, remixAlias: 'Dillon & Dickins', artist: 'Kool World Productions', title: 'Invader' },
    { year: 1997, remixAlias: 'Dillon & Dickins', artist: 'Todd Terry Presents Shannon', title: "It's Over Love" },
    { year: 1997, remixAlias: 'Dillon & Dickins', artist: 'Martha Wash feat. RuPaul', title: "It's Raining Men" },
    { year: 1997, remixAlias: 'Dillon & Dickins', artist: 'Mad Moses', title: 'Panther Party' },
    { year: 1997, remixAlias: 'Dillon & Dickins', artist: 'Todd Terry', title: 'Ready For A New Day' },
    { year: 1997, remixAlias: 'Dillon & Dickins', artist: 'Blackout', title: 'Gotta Have Hope' },
    { year: 1998, remixAlias: 'Dillon & Dickins', artist: 'The Quest Project', title: 'Angel' },
    { year: 1998, remixAlias: 'Dillon & Dickins', artist: 'High Society', title: 'Feel The Love' },
    { year: 1998, remixAlias: 'Dillon & Dickins', artist: 'Discotecs', title: 'Playmate Puzzle' },
    { year: 1998, remixAlias: 'Dillon & Dickins', artist: 'Rachel McFarlane', title: 'Lover' },
    { year: 1998, remixAlias: 'Dillon & Dickins', artist: 'State Of Mind', title: 'This Is It' },
    { year: 1998, remixAlias: 'Dillon & Dickins', artist: 'Prophets Of Sound', title: 'High' },
    { year: 1998, remixAlias: 'Dillon & Dickins', artist: 'Dubstar', title: 'I Will Be Your Girlfriend' },
    { year: 1998, remixAlias: 'Dillon & Dickins', artist: 'The Taste Xperience feat. Natasha Pearl', title: 'Summersault' },
    { year: 1999, remixAlias: 'Dillon & Dickins', artist: 'Dirty Habit', title: 'Ready To Rock' },
    { year: 1999, remixAlias: 'Dillon & Dickins', artist: 'Turbo Funk', title: 'Strong' },
    { year: 1999, remixAlias: 'Dillon & Dickins', artist: 'Emiliana Torrini', title: 'To Be Free' },
    { year: 2000, remixAlias: 'Dillon & Dickins', artist: 'Vengaboys', title: 'Cheekah Bow Bow (That Computer Song)' },
    { year: 2000, remixAlias: 'Dillon & Dickins', artist: 'Dapa Doosa', title: 'Make It Right' },
    { year: 1998, remixAlias: 'Illicit', artist: 'The Grant Nelson Project feat. Jean McClain', title: 'Step 2 Me' },
    { year: 2000, remixAlias: 'Illicit', artist: 'Madison Avenue', title: 'Who The Hell Are You' },
    { year: 2000, remixAlias: 'Illicit', artist: 'Jazzy M', title: "Jazzin' The Way You Know" },
    { year: 2000, remixAlias: 'Illicit', artist: 'Afro Medusa', title: 'Pasilda' },
    { year: 2000, remixAlias: 'Illicit', artist: 'The Love Bite', title: 'Take Your Time' },
    { year: 2000, remixAlias: 'Illicit', artist: 'Red Snapper', title: 'The Rough & The Quick' },
    { year: 2000, remixAlias: 'Illicit', artist: 'Beatroute', title: 'Be Yourself' },
    { year: 2001, remixAlias: 'Illicit', artist: 'India.Arie', title: 'Brown Skin' },
    { year: 2001, remixAlias: 'Illicit', artist: 'Kylie Minogue', title: 'Butterfly' },
    { year: 2001, remixAlias: 'Illicit', artist: 'Alcazar', title: 'Crying At The Discoteque' },
    { year: 2001, remixAlias: 'Illicit', artist: 'Enrique Iglesias', title: 'Escape' },
    { year: 2001, remixAlias: 'Illicit', artist: 'Heather Small', title: 'Proud' },
    { year: 2001, remixAlias: 'Illicit', artist: 'Alizee', title: 'Gourmandises' },
    { year: 2001, remixAlias: 'Illicit', artist: 'Class A', title: 'Hit Me' },
    { year: 2001, remixAlias: 'Illicit', artist: 'Cher', title: 'Song For The Lonely' },
    { year: 2001, remixAlias: 'Illicit', artist: 'Viola', title: 'Little Girl' },
    { year: 2001, remixAlias: 'Illicit', artist: 'Dark Flower', title: 'Love Will Bring Us Back Together' },
    { year: 2001, remixAlias: 'Illicit', artist: 'Etta James', title: 'Miss You' },
    { year: 2001, remixAlias: 'Illicit', artist: 'Alizee', title: 'Moi... Lolita' },
    { year: 2001, remixAlias: 'Illicit', artist: 'Stevie Nicks', title: 'Planets Of The Universe' },
    { year: 2001, remixAlias: 'Illicit', artist: 'Sunkids', title: 'Rise Up' },
    { year: 2001, remixAlias: 'Illicit', artist: 'Honeyz', title: 'Talk To The Hand' },
    { year: 2001, remixAlias: 'Illicit', artist: 'Maxee', title: 'This Is Where I Wanna Be' },
    { year: 2001, remixAlias: 'Illicit', artist: "Hear'Say", title: 'Everybody' },
    { year: 2001, remixAlias: 'Illicit', artist: 'Kaci', title: 'Tu Amor' },
    { year: 2001, remixAlias: 'Illicit', artist: 'Usher', title: 'U Remind Me' },
    { year: 2001, remixAlias: 'Illicit', artist: 'Mary Griffin', title: 'Without You' },
    { year: 2001, remixAlias: 'Illicit', artist: 'Amber', title: 'Yes!' },
    { year: 2002, remixAlias: 'Illicit', artist: 'Lamya', title: 'Empires (Bring Me Men)' },
    { year: 2002, remixAlias: 'Illicit', artist: 'Heather Headley', title: 'He Is' },
    { year: 2002, remixAlias: 'Illicit', artist: 'S Club Juniors', title: 'New Direction' },
    { year: 2002, remixAlias: 'Illicit', artist: 'Jarvis Church', title: 'Shake It Off' },
    { year: 2002, remixAlias: 'Illicit', artist: 'Cyndi Lauper', title: 'Shine' },
    { year: 2002, remixAlias: 'Illicit', artist: 'Mary J. Blige', title: 'Family Affair' },
    { year: 2003, remixAlias: 'Illicit', artist: 'Alizee', title: "J'en ai marre!" },
    { year: 2003, remixAlias: 'Illicit', artist: 'S Club', title: "Love Ain't Gonna Wait For You" },
    { year: 2003, remixAlias: 'Illicit', artist: 'Emma Bunton', title: 'Maybe' },
    { year: 2003, remixAlias: 'Illicit', artist: 'Christina Christian', title: 'TNT' },
    { year: 2003, remixAlias: 'Illicit', artist: 'VS', title: 'Make It Hot' },
    { year: 2003, remixAlias: 'Illicit', artist: 'Girls Aloud', title: 'Some Kind Of Miracle' },
    { year: 2003, remixAlias: 'Illicit', artist: 'Lisa Scott-Lee', title: 'Too Far Gone' },
    { year: 2003, remixAlias: 'Illicit', artist: 'Good Sex Valdes', title: 'Want Your Wife' },
    { year: 2003, remixAlias: 'Illicit', artist: 'Thicke', title: 'When I Get You Alone' },
    { year: 2003, remixAlias: 'Illicit', artist: 'Zoe Birkett', title: 'Treat Me Like A Lady' },
    { year: 2003, remixAlias: 'Illicit', artist: 'Kym Marsh', title: 'Come On Over' },
  ],
};

const remixography = dillonDickinsMusicAndRemixology.remixes.map((remix) => ({
  ...remix,
  era: remix.remixAlias,
  remixers: [remix.remixAlias],
  label: remix.remixAlias === 'Illicit' ? 'External Remix' : remix.remixAlias,
  notes: `${remix.remixAlias} remix identity: ${remix.artist} - ${remix.title}.`,
  status: 'verified',
}));

const remixEras = [...new Set(remixography.map((remix) => remix.era))];

function countReleases(label) {
  return label.years.reduce((total, yearGroup) => total + yearGroup.releases.length, 0);
}

function firstRelease(label) {
  return { ...label.years[0].releases[0], year: label.years[0].year };
}

function releaseKey(release) {
  return `${release.cat}-${release.artist}-${release.title}`;
}

function inferFormat(cat, title) {
  if (cat.includes('CD') && cat.includes('12')) return '12-inch / CD';
  if (cat.includes('CD')) return 'CD';
  if (cat.startsWith('MP')) return title.includes('Exquisite') ? 'Digital album' : 'Digital EP';
  if (title.includes('EP') || title.includes('E.P.')) return 'EP';
  if (cat.startsWith('12')) return '12-inch';
  return 'Release';
}

function getReleaseDetails(release, label) {
  return {
    date: release.date || release.year || 'Date to verify',
    format: release.format || inferFormat(release.cat, release.title),
    notes:
      release.notes ||
      `${release.title} sits inside the ${label.name} run, part of the wider Dillon & Dickins label-family chronology.`,
    status: release.status || 'verified',
  };
}

function remixKey(remix) {
  return `${remix.era}-${remix.artist}-${remix.title}`;
}

function matchesSearch(item, query) {
  if (!query.trim()) return true;
  const haystack = Object.values(item)
    .flatMap((value) => (Array.isArray(value) ? value : [value]))
    .join(' ')
    .toLowerCase();
  return haystack.includes(query.trim().toLowerCase());
}

function flattenLabelReleases(label) {
  return label.years.flatMap((yearGroup) =>
    yearGroup.releases.map((release) => ({ ...release, year: yearGroup.year })),
  );
}

function filterLabelYears(label, query) {
  return label.years
    .map((yearGroup) => ({
      ...yearGroup,
      releases: yearGroup.releases.filter((release) =>
        matchesSearch({ ...release, year: yearGroup.year }, query),
      ),
    }))
    .filter((yearGroup) => yearGroup.releases.length > 0);
}

function moveSelection(items, current, getKey, direction) {
  if (!items.length) return current;
  const index = items.findIndex((item) => getKey(item) === getKey(current));
  const nextIndex = index === -1 ? 0 : (index + direction + items.length) % items.length;
  return items[nextIndex];
}

function ArchiveWall({ quality }) {
  const wallRef = useRef(null);

  useEffect(() => {
    const wall = wallRef.current;
    if (!wall) return undefined;

    let frameId = 0;
    const state = { x: 0, y: 0, scroll: 0 };

    const write = () => {
      wall.style.setProperty('--wall-x', state.x.toFixed(3));
      wall.style.setProperty('--wall-y', state.y.toFixed(3));
      wall.style.setProperty('--wall-scroll', state.scroll.toFixed(3));
      frameId = 0;
    };

    const schedule = () => {
      if (!frameId) frameId = requestAnimationFrame(write);
    };

    const onPointer = (event) => {
      state.x = (event.clientX / window.innerWidth - 0.5) * 2;
      state.y = (event.clientY / window.innerHeight - 0.5) * 2;
      schedule();
    };

    const onScroll = () => {
      const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
      state.scroll = window.scrollY / maxScroll;
      schedule();
    };

    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('scroll', onScroll);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div ref={wallRef} className={quality === 'low' ? 'archive-wall lite' : 'archive-wall'} aria-hidden="true">
      {archiveWallAssets.slice(0, quality === 'low' ? 6 : 10).map((asset, index) => (
        <figure
          className={`archive-wall-card ${asset.depth}`}
          key={asset.src}
          style={{
            '--card-x': `${asset.x}%`,
            '--card-y': `${asset.y}%`,
            '--card-w': `${asset.w}vw`,
            '--card-r': `${asset.r}deg`,
            '--card-s': asset.s,
            '--card-duration': `${asset.duration}s`,
            '--card-delay': `${asset.delay}s`,
            '--card-index': index,
          }}
        >
          <img src={asset.src} alt="" loading={index < 6 ? 'eager' : 'lazy'} decoding="async" style={{ objectFit: asset.fit }} />
        </figure>
      ))}
    </div>
  );
}

function App() {
  const canvasRef = useRef(null);
  const sceneApi = useRef(null);
  const [quality, setQuality] = useState('high');
  const [paused, setPaused] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState(discography[0]);
  const [selectedRelease, setSelectedRelease] = useState(firstRelease(discography[0]));
  const [selectedRemixEra, setSelectedRemixEra] = useState(remixEras[0]);
  const [selectedRemix, setSelectedRemix] = useState(remixography[0]);
  const [selectedAlias, setSelectedAlias] = useState(dillonDickinsMusicAndRemixology.remixologyByAlias[0]);
  const [archiveQuery, setArchiveQuery] = useState('');
  const [wallReady, setWallReady] = useState(false);

  const visibleLabelYears = filterLabelYears(selectedLabel, archiveQuery);
  const visibleReleases = visibleLabelYears.flatMap((yearGroup) =>
    yearGroup.releases.map((release) => ({ ...release, year: yearGroup.year })),
  );
  const visibleRemixes = remixography.filter((remix) =>
    archiveQuery.trim()
      ? matchesSearch(remix, archiveQuery)
      : remix.era === selectedRemixEra,
  );

  useEffect(() => {
    sceneApi.current = createScene(canvasRef.current);

    const onScroll = () => {
      const progress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      sceneApi.current.setScroll(Number.isFinite(progress) ? progress : 0);
    };

    const onPointer = (event) => {
      sceneApi.current.setPointer(event.clientX / window.innerWidth, event.clientY / window.innerHeight);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onPointer, { passive: true });
    onScroll();

    gsap.fromTo(
      '.intro-line',
      { y: 72, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.1, stagger: 0.12, ease: 'power4.out' },
    );

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointer);
      sceneApi.current?.destroy();
    };
  }, []);

  useEffect(() => {
    const startWall = () => setWallReady(true);
    const idleId = window.requestIdleCallback
      ? window.requestIdleCallback(startWall, { timeout: 900 })
      : window.setTimeout(startWall, 650);

    return () => {
      if (window.cancelIdleCallback && typeof idleId === 'number') {
        window.cancelIdleCallback(idleId);
      } else {
        window.clearTimeout(idleId);
      }
    };
  }, []);

  useEffect(() => {
    sceneApi.current?.setQuality(quality);
  }, [quality]);

  useEffect(() => {
    sceneApi.current?.setPaused(paused);
  }, [paused]);

  useEffect(() => {
    sceneApi.current?.setArchiveFocus({
      label: selectedLabel.name,
      alias: selectedAlias.alias,
      remixAlias: selectedRemixEra,
      releaseArtist: selectedRelease.artist,
      releaseTitle: selectedRelease.title,
      remixArtist: selectedRemix.artist,
    });
  }, [selectedLabel, selectedAlias, selectedRemixEra, selectedRelease, selectedRemix]);

  return (
    <>
      <canvas ref={canvasRef} className="webgl-canvas" aria-hidden="true" />
      {wallReady && <ArchiveWall quality={quality} />}
      <div className="grain" aria-hidden="true" />

      <header className="site-header">
        <a className="brand" href="#top" aria-label="Higher State Archive home">
          <span className="brand-mark">HS</span>
          <span>Higher State Archive</span>
        </a>
        <nav aria-label="Primary">
          <a href="#bio">Bio</a>
          <a href="#discography">Discography</a>
          <a href="#remixology">Remixology</a>
          <a href="#legacy">Legacy</a>
        </nav>
        <a className="talk-link" href="#discography">
          Enter the catalogue <ArrowUpRight size={16} />
        </a>
      </header>

      <main id="top">
        <section className="hero section">
          <div className="hero-copy">
            <p className="eyebrow intro-line">Have you got some? Do you want some?</p>
            <h1>
              <span className="intro-line">Dillon and Dickins</span>
              <span className="intro-line">Higher State</span>
              <span className="intro-line">99 North</span>
              <span className="intro-line">99 Degrees</span>
            </h1>
            <p className="hero-text intro-line">
              Higher State was a London house label and publishing company founded in 1992 by the
              DJ-production duo Dillon & Dickins, it operated a core label Higher State, two
              better-defined sublabels 99 North and 99 Degrees, and a short Higher State Imports
              sub-series.
            </p>
          </div>

          <div className="control-panel" aria-label="Experience controls">
            <button type="button" className={paused ? 'icon-button active' : 'icon-button'} onClick={() => setPaused(!paused)} aria-label={paused ? 'Resume motion' : 'Pause motion'}>
              {paused ? <Zap size={19} /> : <CirclePause size={19} />}
            </button>
            <button type="button" className={quality === 'high' ? 'quality active' : 'quality'} onClick={() => setQuality('high')}>
              High
            </button>
            <button type="button" className={quality === 'low' ? 'quality active' : 'quality'} onClick={() => setQuality('low')}>
              Lite
            </button>
          </div>

          <div className="scroll-cue">
            <MousePointer2 size={16} />
            <span>Move pointer. Scroll slowly.</span>
          </div>
        </section>

        <section className="archive-command" aria-label="Archive navigator">
          <nav aria-label="Archive sections">
            <a href="#bio">Story</a>
            <a href="#discography">Catalogue</a>
            <a href="#remixology">Remixology</a>
            <a href="#legacy">Legacy</a>
            <a href="#top">Top</a>
          </nav>
          <label>
            <span>Search archive</span>
            <input
              type="search"
              value={archiveQuery}
              onChange={(event) => setArchiveQuery(event.target.value)}
              placeholder="artist, title, alias, cat..."
            />
          </label>
        </section>

        <section id="bio" className="section story-section">
          <article className="story-panel">
            <div className="story-meta">
              <h2>Biography</h2>
              <span>1992</span>
              <span>London</span>
              <span>House / Garage / Club Culture</span>
            </div>
            <div className="story-copy">
              {labelStory.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>
        </section>

        <section id="discography" className="section discography-section">
          <div className="discography-header">
            <div>
              <p className="eyebrow">Catalogue map</p>
              <h2>Discography</h2>
            </div>
            <p>
              A label-family timeline across Higher State, 99 North, 99 Degrees and the Imports
              offshoot. Browse it like a crate: imprint first, year second, aliases everywhere.
            </p>
          </div>

          <div className="label-console">
            {discography.map((label) => {
              const selected = selectedLabel.name === label.name;
              return (
                <button
                  key={label.name}
                  type="button"
                  className={selected ? 'label-tab active' : 'label-tab'}
                  onClick={() => {
                    setSelectedLabel(label);
                    setSelectedRelease(firstRelease(label));
                  }}
                >
                  <span>{label.name}</span>
                  <strong>{countReleases(label)} releases</strong>
                </button>
              );
            })}
          </div>

          <div className="discography-panel">
            <aside className="catalogue-stats">
              <span>{selectedLabel.code}</span>
              <strong>{selectedLabel.name}</strong>
              <p>{selectedLabel.note}</p>
              <em>
                {archiveQuery ? `${visibleReleases.length} matches` : `${selectedLabel.years.length} active years mapped`}
              </em>
              <div className="sleeve-notes">
                <span>Sleeve notes</span>
                <strong>{selectedRelease.title}</strong>
                <dl>
                  <div>
                    <dt>Date</dt>
                    <dd>{getReleaseDetails(selectedRelease, selectedLabel).date}</dd>
                  </div>
                  <div>
                    <dt>Format</dt>
                    <dd>{getReleaseDetails(selectedRelease, selectedLabel).format}</dd>
                  </div>
                  <div>
                    <dt>Status</dt>
                    <dd>{getReleaseDetails(selectedRelease, selectedLabel).status}</dd>
                  </div>
                </dl>
                <p>{getReleaseDetails(selectedRelease, selectedLabel).notes}</p>
                <div className="browse-controls">
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedRelease(moveSelection(visibleReleases.length ? visibleReleases : flattenLabelReleases(selectedLabel), selectedRelease, releaseKey, -1))
                    }
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedRelease(moveSelection(visibleReleases.length ? visibleReleases : flattenLabelReleases(selectedLabel), selectedRelease, releaseKey, 1))
                    }
                  >
                    Next
                  </button>
                </div>
              </div>
            </aside>

            <div className="release-timeline">
              {visibleLabelYears.length === 0 && (
                <div className="empty-state">No catalogue matches. Try another artist, title, year or catalogue number.</div>
              )}
              {visibleLabelYears.map((yearGroup) => (
                <article className="year-block" key={`${selectedLabel.name}-${yearGroup.year}`}>
                  <div className="year-marker">
                    <span>{yearGroup.year}</span>
                    <small>{yearGroup.releases.length}</small>
                  </div>
                  <div className="release-grid">
                    {yearGroup.releases.map((release) => (
                      <button
                        type="button"
                        className={
                          releaseKey(selectedRelease) === releaseKey(release)
                            ? 'release-card active'
                            : 'release-card'
                        }
                        key={`${selectedLabel.name}-${yearGroup.year}-${release.cat}`}
                        onClick={() => setSelectedRelease({ ...release, year: yearGroup.year })}
                      >
                        <span>{release.cat}</span>
                        <strong>{release.artist}</strong>
                        <em>{release.title}</em>
                      </button>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="remixology" className="section discography-section remixology-section">
          <div className="discography-header">
            <div>
              <p className="eyebrow">Mix culture</p>
              <h2>Dillon and Dickins Remixology</h2>
            </div>
            <p>
              The remix trail shows how the Higher State world moved outward: from in-house alias
              versions to 99 North club packages, then into Illicit-era major-label commissions.
            </p>
          </div>

          <div className="alias-strip" aria-label="Dillon and Dickins aliases">
            {dillonDickinsMusicAndRemixology.remixologyByAlias.map((aliasRecord) => (
              <button
                key={aliasRecord.alias}
                type="button"
                data-alias={aliasRecord.alias}
                className={selectedAlias.alias === aliasRecord.alias ? 'active' : ''}
                onClick={() => setSelectedAlias(aliasRecord)}
              >
                {aliasRecord.alias}
              </button>
            ))}
          </div>

          <article className="alias-detail">
            <div>
              <span>Alias file</span>
              <strong>{selectedAlias.alias}</strong>
              <p>{selectedAlias.notes}</p>
            </div>
            <div className="alias-lists">
              <div>
                <span>Releases / Remixes</span>
                <p>{selectedAlias.releasesAndRemixes.length ? selectedAlias.releasesAndRemixes.join(' / ') : 'No verified release located'}</p>
              </div>
              {selectedAlias.remixConnections && (
                <div>
                  <span>Connections</span>
                  <p>{selectedAlias.remixConnections.join(' / ')}</p>
                </div>
              )}
              {selectedAlias.collaborators && (
                <div>
                  <span>Collaborators</span>
                  <p>{selectedAlias.collaborators.join(' / ')}</p>
                </div>
              )}
              {selectedAlias.remixes && (
                <div>
                  <span>Remixes</span>
                  <p>{selectedAlias.remixes.join(' / ')}</p>
                </div>
              )}
              {selectedAlias.commercialRemixes && (
                <div>
                  <span>Commercial remixes</span>
                  <p>{selectedAlias.commercialRemixes.join(' / ')}</p>
                </div>
              )}
            </div>
          </article>

          <div className="label-console remix-era-console">
            {remixEras.map((era) => {
              const selected = selectedRemixEra === era;
              const eraRemixes = remixography.filter((remix) => remix.era === era);
              return (
                <button
                  key={era}
                  type="button"
                  className={selected ? 'label-tab active' : 'label-tab'}
                  onClick={() => {
                    setSelectedRemixEra(era);
                    setSelectedRemix(eraRemixes[0]);
                  }}
                >
                  <span>{era}</span>
                  <strong>{eraRemixes.length} remixes</strong>
                </button>
              );
            })}
          </div>

          <div className="discography-panel remixology-panel">
            <aside className="catalogue-stats">
              <span>{selectedRemix.label}</span>
              <strong>{selectedRemixEra}</strong>
              <p>
                {selectedRemixEra === 'Illicit'
                  ? 'External remix commissions that pushed the Dillon & Dickins sound into broader pop and club circulation.'
                  : `${selectedRemixEra} remix identity: versions, aliases and DJ-tool extensions from the wider Dillon & Dickins catalogue.`}
              </p>
              <em>
                {archiveQuery
                  ? `${visibleRemixes.length} matches`
                  : `${remixography.filter((remix) => remix.era === selectedRemixEra).length} entries mapped`}
              </em>
              <div className="sleeve-notes">
                <span>Remix notes</span>
                <strong>{selectedRemix.title}</strong>
                <dl>
                  <div>
                    <dt>Year</dt>
                    <dd>{selectedRemix.year}</dd>
                  </div>
                  <div>
                    <dt>Remix</dt>
                    <dd>{selectedRemix.remixers.join(', ')}</dd>
                  </div>
                  <div>
                    <dt>Status</dt>
                    <dd>{selectedRemix.status}</dd>
                  </div>
                </dl>
                <p>{selectedRemix.notes}</p>
                <div className="browse-controls">
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedRemix(
                        moveSelection(
                          visibleRemixes.length
                            ? visibleRemixes
                            : remixography.filter((remix) => remix.era === selectedRemixEra),
                          selectedRemix,
                          remixKey,
                          -1,
                        ),
                      )
                    }
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedRemix(
                        moveSelection(
                          visibleRemixes.length
                            ? visibleRemixes
                            : remixography.filter((remix) => remix.era === selectedRemixEra),
                          selectedRemix,
                          remixKey,
                          1,
                        ),
                      )
                    }
                  >
                    Next
                  </button>
                </div>
              </div>
            </aside>

            <div className="release-timeline remix-grid">
              {visibleRemixes.length === 0 && (
                <div className="empty-state">No remix matches. Try another artist, title, alias or year.</div>
              )}
              {visibleRemixes.map((remix) => (
                  <button
                    key={remixKey(remix)}
                    type="button"
                    className={
                      remixKey(selectedRemix) === remixKey(remix)
                        ? 'release-card remix-card active'
                        : 'release-card remix-card'
                    }
                    onClick={() => setSelectedRemix(remix)}
                  >
                    <span>{remix.year}</span>
                    <strong>{remix.artist}</strong>
                    <em>{remix.title}</em>
                  </button>
                ))}
            </div>
          </div>
        </section>

        <section id="legacy" className="section legacy-section">
          <p className="eyebrow">Archive notes</p>
          <div className="legacy-headline">
            <h2>Legacy</h2>
            <p>{legacyPassages[0]}</p>
          </div>

          <div className="legacy-signal-strip" aria-label="Legacy transmission trail">
            {legacySignals.map((signal) => (
              <span key={signal}>{signal}</span>
            ))}
          </div>

          <article className="legacy-memory-stack">
            {legacyPassages.slice(1, -1).map((paragraph, index) => (
              <p className={`legacy-memory memory-${index + 1}`} key={paragraph}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                {paragraph}
              </p>
            ))}
          </article>

          <p className="legacy-closing">{legacyPassages[legacyPassages.length - 1]}</p>
        </section>

      </main>
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
