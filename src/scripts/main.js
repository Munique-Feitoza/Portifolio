'use strict';

/* ────────────────────────────────────────────────────────────────────────
 *  MUNUX MAINBOARD v1.0
 *  Boot BIOS sequence + static PCB render (canvas + DOM overlay)
 * ──────────────────────────────────────────────────────────────────────── */

const W = 1280;
const H = 800;

const C = {
  pcbBg:        '#0a3d2a',
  pcbBgDark:    '#062018',
  copper:       '#d4a857',
  copperBright: '#f0c879',
  copperDim:    '#8a6c30',
  solder:       '#a8aca8',
  solderDark:   '#4a4e4a',
  silk:         '#e8efe5',
  silkDim:      '#a8b0a5',
  amber:        '#ffb000',
  chipBody:     '#14140e',
  chipBevelTop: '#2a2a1f',
};

/* ─── Component data ──────────────────────────────────────────────────── */

const CPU = {
  id: 'cpu',
  cls: 'cpu',
  name: 'MUNIQUE FEITOZA',
  sub:  'JR. DEVELOPER',
  part: 'ads.grad · 2026.05 · rust/c/kotlin/linux',
  x: 460, y: 300, w: 360, h: 200,
  chamfer: 14,
  description: {
    pt: 'Desenvolvedora Júnior formando em Análise e Desenvolvimento de Sistemas (ADS) este mês (maio/2026). Foco low-level: distros Linux, software de sistema em Rust e C, automação JVM em Kotlin. Construtora por padrão — quando algo não existe ou quebra, eu escrevo do zero.',
    en: 'Junior Developer graduating in Systems Analysis & Development (ADS) this month (May 2026). Low-level focus: Linux distros, systems software in Rust and C, JVM automation in Kotlin. Builder by default — when something doesn’t exist or breaks, I write it from scratch.',
  },
  stack: ['Rust', 'C', 'Kotlin', 'Linux', 'JS/TS', 'Bash', 'Git'],
};

const RAM = {
  id: 'ram',
  cls: 'ram',
  name: 'OLLAMA · LOCAL LLM',
  sub:  'co-processor · 8GB',
  part: 'M-OLLAMA-01',
  x: 380, y: 40, w: 520, h: 70,
  description: {
    pt: 'Modelos de linguagem rodando 100% localmente via Ollama — código e dados internos da empresa nunca saem do meu hardware. Inferência self-hosted para cargas sensíveis, com escolha de modelo ajustada por tarefa (raciocínio vs. velocidade).',
    en: 'Large-language models running 100% locally via Ollama — internal company code and data never leave my hardware. Self-hosted inference for sensitive workloads, with model choice tuned per task (reasoning vs. speed).',
  },
  stack: ['Ollama', 'Llama', 'Mistral', 'Local-first AI'],
};

const CHIPS = [
  {
    id: 'munux-os',
    name: 'MUNUX',
    sub:  'Linux distro · C',
    part: 'IC-001 · v0.1',
    x: 80, y: 130, w: 260, h: 160,
    pins: 'right',
    url:  'https://github.com/Munique-Feitoza/Munux',
    description: {
      pt: 'Uma distribuição Linux que guia o usuário do nível iniciante ao avançado, com foco em aprendizado gradual e autonomia total. Construída do zero, com init próprio e ferramentas voltadas ao aprendizado.',
      en: 'A Linux distribution that guides the user from beginner to advanced level, with focus on gradual learning and full autonomy. Built from the ground up with custom init and learning-oriented tooling.',
    },
    stack: ['C', 'Linux Kernel', 'Bash', 'Init Systems'],
  },
  {
    id: 'munux-books',
    name: 'MUNUX-BOOKS',
    sub:  'ebook reader · Kotlin',
    part: 'IC-002 · v0.1',
    x: 940, y: 130, w: 260, h: 160,
    pins: 'left',
    url:  'https://github.com/Munique-Feitoza/Munux-Books',
    description: {
      pt: 'Leitor de EPUB e PDF para Android (Kotlin + Jetpack Compose), com foco em leitura confortável — tipografia ajustável, três temas, paginação com encaixe e memória de posição. Tem tradução automática de capítulos opcional, usando o provedor e a chave de API que você escolher.',
      en: 'EPUB and PDF reader for Android (Kotlin + Jetpack Compose), focused on comfortable reading — adjustable typography, three themes, snap pagination and reading-position memory. Includes optional automatic chapter translation using the provider and API key you choose.',
    },
    stack: ['Kotlin', 'Jetpack Compose', 'Android', 'EPUB/PDF'],
  },
  {
    id: 'reactive-workspace',
    name: 'REACTIVE-WS',
    sub:  'compositor · Rust',
    part: 'IC-003 · v0.2',
    x: 70, y: 330, w: 240, h: 140,
    pins: 'right',
    url:  'https://github.com/Munique-Feitoza/Munux-Reactive-Workspace',
    description: {
      pt: 'Workspace de janelas reativo e experimental — um compositor em Rust explorando layouts dinâmicos e primitivas de UI reativa na camada do gerenciador de janelas.',
      en: 'Experimental reactive window workspace — a Rust-based compositor exploring dynamic layouts and reactive UI primitives at the window-manager layer.',
    },
    stack: ['Rust', 'Compositor', 'Reactive UI'],
  },
  {
    id: 'stellar-narrators',
    name: 'STELLAR',
    sub:  'NASA team · HTML',
    part: 'IC-004 · 2024',
    x: 970, y: 330, w: 240, h: 140,
    pins: 'left',
    url:  'https://github.com/pancakehoneyb/Stellar-Narrators',
    description: {
      pt: 'Um time de cinco jovens mulheres apaixonadas por ciência e tecnologia. Misturamos código, design e criatividade para construir uma solução inovadora, intuitiva e mágica para o NASA Space Apps Challenge.',
      en: 'A team of five young women passionate about science and technology. We blend coding, design and creativity to build an innovative, intuitive and magical solution for NASA’s Space Apps Challenge.',
    },
    stack: ['HTML', 'CSS', 'JavaScript', 'NASA APIs'],
  },
  {
    id: 'obscura',
    name: 'OBSCURA',
    sub:  'stealth · Rust',
    part: 'IC-005 · v0.1',
    x: 70, y: 520, w: 240, h: 150,
    pins: 'right',
    url:  'https://github.com/Munique-Feitoza/Obscura',
    description: {
      pt: 'Toolkit experimental de stealth e anti-fingerprint em Rust — focado em privacidade e ofuscação de superfície contra observadores passivos de rede.',
      en: 'Experimental stealth & anti-fingerprint toolkit in Rust — focused on privacy and surface obfuscation against passive network observers.',
    },
    stack: ['Rust', 'Crypto', 'Network', 'Privacy'],
  },
  {
    id: 'server-controller',
    name: 'SERVER-CTRL',
    sub:  'orchestrator · Kotlin',
    part: 'IC-006 · v0.1',
    x: 970, y: 520, w: 240, h: 150,
    pins: 'left',
    url:  'https://github.com/Munique-Feitoza/server-controller',
    description: {
      pt: 'Orquestrador remoto de servidores com cliente em Kotlin — gerencia ciclo de deploy, monitoramento e automação SSH para frotas de serviços self-hosted.',
      en: 'Remote server orchestrator with a Kotlin client — manages deploy lifecycle, monitoring and SSH automation for fleets of self-hosted services.',
    },
    stack: ['Kotlin', 'Coroutines', 'SSH', 'Orchestration'],
  },
  {
    id: 'slack-tracker',
    name: 'SLACK-TRACKER',
    sub:  'observer · Rust',
    part: 'IC-007 · v0.1',
    x: 510, y: 600, w: 260, h: 120,
    pins: 'top',
    url:  'https://github.com/Munique-Feitoza/slack-tracker',
    description: {
      pt: 'Observador de workspace Slack em Rust — acompanha eventos em tempo real via WebSockets e produz relatórios de atividade estruturados.',
      en: 'Slack workspace observer in Rust — tracks events in real time via WebSockets and produces structured activity reports.',
    },
    stack: ['Rust', 'Slack API', 'WebSockets', 'JSON'],
  },
];

const CONTACT = {
  id: 'contact',
  name: 'J1 · DEBUG PORT',
  sub:  'contact header · 115200 baud',
  part: 'OPEN HEADER',
  description: {
    pt: 'Quer falar comigo? Cada pino do header tem seu protocolo — escolhe o canal abaixo.',
    en: 'Want to reach me? Each header pin has its own protocol — pick a channel below.',
  },
  contacts: [
    { label: 'GH',  protocol: 'github',   value: 'github.com/Munique-Feitoza',                 href: 'https://github.com/Munique-Feitoza' },
    { label: 'IN',  protocol: 'linkedin', value: 'linkedin.com/in/munique-feitoza-77034b231',  href: 'https://www.linkedin.com/in/munique-feitoza-77034b231/' },
    { label: 'SMTP', protocol: 'email',   value: 'muniquefeitoz4@gmail.com',                    href: 'mailto:muniquefeitoz4@gmail.com' },
  ],
};

const SKILLS = [
  { label: 'RUST',   x: 90,   y: 295, color: '#dea584' },
  { label: 'C',      x: 180,  y: 295, color: '#a8b9cc' },
  { label: 'LINUX',  x: 90,   y: 480, color: '#fcc624' },
  { label: 'KOTLIN', x: 180,  y: 480, color: '#7f52ff' },
  { label: 'HTML',   x: 970,  y: 295, color: '#e34c26' },
  { label: 'JS/TS',  x: 1060, y: 295, color: '#f7df1e' },
  { label: 'GIT',    x: 970,  y: 480, color: '#f1502f' },
  { label: 'BASH',   x: 1060, y: 480, color: '#4eaa25' },
];

const CAPS = [
  [40, 130], [1220, 130],
  [40, 350], [1220, 350],
  [40, 580], [1220, 580],
];

/* ─── Secondary peripherals (decorative chips with silk labels) ──────── */
const PERIPHERALS = [
  { name: 'U7·BIOS',     x: 160,  y: 50,  w: 110, h: 56, pins: 'all'  },
  { name: 'U8·NIC',      x: 1020, y: 50,  w: 140, h: 60, pins: 'all'  },
  { name: 'U9·AUDIO',    x: 80,   y: 685, w: 110, h: 48, pins: 'top'  },
  { name: 'U10·SIO',     x: 1090, y: 685, w: 110, h: 48, pins: 'top'  },
];

/* Background decorative dead-end traces (terminate in solder vias) */
const BG_TRACES = [
  [[460, 320], [430, 320], [430, 290]],
  [[460, 380], [410, 380], [410, 250]],
  [[820, 320], [850, 320], [850, 290]],
  [[820, 380], [870, 380], [870, 250]],
  [[480, 500], [480, 540], [430, 540], [430, 570]],
  [[800, 500], [800, 540], [850, 540], [850, 570]],
  [[640, 110], [640, 80],  [780, 80]],
  [[560, 110], [560, 80],  [430, 80]],
  [[40,  150], [40,  300], [60, 300]],
  [[40,  500], [40,  640]],
  [[1240, 150], [1240, 300], [1220, 300]],
  [[1240, 500], [1240, 640]],
  [[1180, 90], [1180, 130], [1210, 130]],
  [[270, 90],  [270, 130],  [310, 130]],
];

/* SMDs (small surface-mount resistors 'r' / capacitors 'c') */
const SMDS = [
  [430, 290, 'r'], [430, 320, 'c'], [430, 380, 'r'], [430, 420, 'c'], [430, 460, 'r'],
  [850, 290, 'c'], [850, 320, 'r'], [850, 380, 'c'], [850, 420, 'r'], [850, 460, 'c'],
  [490, 250, 'r'], [530, 250, 'c'], [570, 250, 'r'], [610, 250, 'c'],
  [650, 250, 'r'], [690, 250, 'c'], [730, 250, 'r'], [770, 250, 'c'],
  [490, 160, 'c'], [610, 160, 'r'], [730, 160, 'c'],
  [350, 150, 'r'], [350, 180, 'c'], [350, 230, 'r'], [350, 260, 'c'],
  [910, 150, 'c'], [910, 180, 'r'], [910, 230, 'c'], [910, 260, 'r'],
  [330, 360, 'r'], [330, 400, 'c'], [330, 440, 'r'],
  [930, 360, 'c'], [930, 400, 'r'], [930, 440, 'c'],
  [330, 540, 'r'], [330, 580, 'c'], [330, 620, 'r'],
  [930, 540, 'c'], [930, 580, 'r'], [930, 620, 'c'],
  [495, 580, 'r'], [535, 580, 'c'], [575, 580, 'r'],
  [695, 580, 'c'], [735, 580, 'r'], [775, 580, 'c'],
  [25, 200, 'r'], [25, 240, 'c'], [25, 400, 'r'], [25, 440, 'c'], [25, 660, 'r'], [25, 700, 'c'],
  [1245, 200, 'c'], [1245, 240, 'r'], [1245, 400, 'c'], [1245, 440, 'r'], [1245, 660, 'c'], [1245, 700, 'r'],
];

/* Inductors (VRM section + scattered) */
const INDUCTORS = [
  [378, 125], [378, 160], [378, 195],
  [882, 125], [882, 160], [882, 195],
  [1180, 115],
];

/* Testpoints — silver pads with TP-N silk label */
const TESTPOINTS = [
  ['TP1', 360,  130],
  ['TP2', 906,  130],
  ['TP3', 360,  680],
  ['TP4', 906,  680],
  ['TP5',  50,  500],
  ['TP6', 1230, 500],
  ['TP7', 600,  580],
  ['TP8', 420,  120],
];

/* Mounting holes (corners) */
const MOUNTS = [
  [42, 42], [W - 42, 42], [42, H - 42], [W - 42, H - 42],
];

/* Pin headers (USB / SATA / front-panel) */
const HEADERS = [
  { name: 'USB1', x: 360, y: 740, count: 9,  dir: 'h' },
  { name: 'JFP1', x: 660, y: 740, count: 10, dir: 'h' },
  { name: 'USB2', x: 810, y: 740, count: 9,  dir: 'h' },
];

/* CMOS coin-cell battery */
const BATTERY = { x: 1140, y: 760, r: 18, label: 'BT1·CR2032' };

/* Crystal oscillator */
const CRYSTAL = { x: 420, y: 200, w: 50, h: 16, label: 'Y1·14.318MHz' };

/* ─── Sprites (pixel-art bitmaps) ─────────────────────────────────────── */

/* 6×4 cardboard parcel — shared by all walkers that carry */
const BOX_PALETTE = { C: '#5a3a1c', D: '#a87642', T: '#d4a857' };
const BOX_FRAME = [
  'CCCCCC',
  'CDTTDC',
  'CDDDDC',
  'CCCCCC',
];

const SPRITES = {
  /* ─ Tux (Linux penguin) — MUNUX-OS ─────────────────────────────── */
  tux: {
    palette: { B: '#0a0a0a', W: '#fafafa', E: '#0a0a0a', O: '#ff8800' },
    frames: [
      [
        '................',
        '.....BBBBBB.....',
        '....BWWWWWWB....',
        '...BWWWWWWWWB...',
        '..BWWEEWWEEWWB..',
        '..BWWEEWWEEWWB..',
        '..BWWWWOOWWWWB..',
        '..BWWWOOOOWWWB..',
        '..BBWWWWWWWWBB..',
        '.BWWWWWWWWWWWWB.',
        '.BWWWWWWWWWWWWB.',
        '.BBWWWWWWWWWWBB.',
        '..BBWWWWWWWWBB..',
        '...BBBWWWWBBB...',
        '...OO......OO...',
        '...OOO....OOO...',
      ],
      [
        '................',
        '.....BBBBBB.....',
        '....BWWWWWWB....',
        '...BWWWWWWWWB...',
        '..BWWEEWWEEWWB..',
        '..BWWEEWWEEWWB..',
        '..BWWWWOOWWWWB..',
        '..BWWWOOOOWWWB..',
        '..BBWWWWWWWWBB..',
        '.BWWWWWWWWWWWWB.',
        '.BWWWWWWWWWWWWB.',
        '.BBWWWWWWWWWWBB.',
        '..BBWWWWWWWWBB..',
        '...BBBWWWWBBB...',
        '..OOO.......OO..',
        '..OOOO.....OOO..',
      ],
    ],
  },

  /* ─ Ferris (Rust crab) — REACTIVE-WS ──────────────────────────── */
  ferris: {
    palette: { O: '#d28445', B: '#0a0a0a', W: '#ffffff' },
    frames: [
      [
        '................',
        '................',
        '....B....B......',
        '....BW...BW.....',
        '....BB...BB.....',
        '.OOOOOOOOOOOO...',
        'OOOOOOOOOOOOOO..',
        'OOOOOOOOOOOOOOOO',
        'OOOOOOOOOOOOOOOO',
        '.OOOOOOOOOOOOOO.',
        '..OOOOOOOOOOOO..',
        '..B.B.B.B.B.B...',
        '................',
        '................',
        '................',
        '................',
      ],
      [
        '................',
        '................',
        '....B....B......',
        '....BW...BW.....',
        '....BB...BB.....',
        '.OOOOOOOOOOOO...',
        'OOOOOOOOOOOOOO..',
        'OOOOOOOOOOOOOOOO',
        'OOOOOOOOOOOOOOOO',
        '.OOOOOOOOOOOOOO.',
        '..OOOOOOOOOOOO..',
        '...B.B.B.B.B.B..',
        '................',
        '................',
        '................',
        '................',
      ],
    ],
  },

  /* ─ Hooded figure — OBSCURA (stealth) ─────────────────────────── */
  hooded: {
    palette: { H: '#1a1a2a', K: '#0a0a18', R: '#ff3030' },
    frames: [
      [
        '................',
        '.....HHHHHH.....',
        '....HHHHHHHH....',
        '...HHHHHHHHHH...',
        '...HHKKKKKKHH...',
        '...HKRKKKKRKH...',
        '...HKKKKKKKKH...',
        '...HHKKKKKKHH...',
        '....HHHHHHHH....',
        '....HHHHHHHH....',
        '....HHHHHHHH....',
        '....HHHHHHHH....',
        '....HHHHHHHH....',
        '....HHHHHHHH....',
        '.....HHHHHH.....',
        '......HHHH......',
      ],
      [
        '................',
        '.....HHHHHH.....',
        '....HHHHHHHH....',
        '...HHHHHHHHHH...',
        '...HHKKKKKKHH...',
        '...HKRKKKKRKH...',
        '...HKKKKKKKKH...',
        '...HHKKKKKKHH...',
        '....HHHHHHHH....',
        '....HHHHHHHH....',
        '....HHHHHHHH....',
        '....HHHHHHHH....',
        '....HHHHHHHH....',
        '.....HHHHHH.....',
        '....HHHHHHHH....',
        '.....HHHHHH.....',
      ],
    ],
  },

  /* ─ Book with legs — MUNUX-BOOKS ──────────────────────────────── */
  book: {
    palette: { K: '#3a2010', C: '#8b5a2b', T: '#d4a857', M: '#f0e8d0' },
    frames: [
      [
        '................',
        '................',
        '..KKKKKKKKKKK...',
        '..KCCCCCCCCCK...',
        '..KCTTTTTTTCK...',
        '..KCCCCCCCCCK...',
        '..KCMMMMMMMCK...',
        '..KCMMMMMMMCK...',
        '..KCMMMMMMMCK...',
        '..KCMMMMMMMCK...',
        '..KCCCCCCCCCK...',
        '..KKKKKKKKKKK...',
        '....K....K......',
        '....K....K......',
        '....K....K......',
        '...KK....KK.....',
      ],
      [
        '................',
        '................',
        '..KKKKKKKKKKK...',
        '..KCCCCCCCCCK...',
        '..KCTTTTTTTCK...',
        '..KCCCCCCCCCK...',
        '..KCMMMMMMMCK...',
        '..KCMMMMMMMCK...',
        '..KCMMMMMMMCK...',
        '..KCMMMMMMMCK...',
        '..KCCCCCCCCCK...',
        '..KKKKKKKKKKK...',
        '.....K..K.......',
        '....K....KK.....',
        '....KK....K.....',
        '...KK.....KK....',
      ],
    ],
  },

  /* ─ Rocket — STELLAR-NARRATORS (NASA) ─────────────────────────── */
  rocket: {
    palette: { W: '#fafafa', R: '#d44040', B: '#4a8de8', O: '#ff8800', Y: '#ffd000', K: '#1a1a1a' },
    frames: [
      [
        '.......WW.......',
        '......WWWW......',
        '......WRRW......',
        '......WRRW......',
        '.....WWRRWW.....',
        '.....WWRRWW.....',
        '.....WWBBWW.....',
        '.....WWBBWW.....',
        '.....WWRRWW.....',
        '.....WWRRWW.....',
        '.....WWRRWW.....',
        '....WWRRRRWW....',
        '...WW......WW...',
        '..WW........WW..',
        '....OOOOOOOO....',
        '.....YYYYYY.....',
      ],
      [
        '.......WW.......',
        '......WWWW......',
        '......WRRW......',
        '......WRRW......',
        '.....WWRRWW.....',
        '.....WWRRWW.....',
        '.....WWBBWW.....',
        '.....WWBBWW.....',
        '.....WWRRWW.....',
        '.....WWRRWW.....',
        '.....WWRRWW.....',
        '....WWRRRRWW....',
        '...WW......WW...',
        '..WW.OOOOOO.WW..',
        '...OOOOOOOOOO...',
        '....YYYYYYYY....',
      ],
    ],
  },

  /* ─ Droid — SERVER-CONTROLLER (Kotlin) ────────────────────────── */
  droid: {
    palette: { G: '#7a8a9a', D: '#3a4a5a', Y: '#ffd000', P: '#7f52ff', K: '#0a0a0a' },
    frames: [
      [
        '................',
        '.......G........',
        '.......G........',
        '......YYY.......',
        '.....GGGGG......',
        '....GGGGGGG.....',
        '....GYGKGYG.....',
        '....GGGGGGG.....',
        '.....GGGGG......',
        '....PPPPPPP.....',
        '...PPPPPPPPP....',
        '...PPPYYYPPP....',
        '....PPPPPPP.....',
        '.....PPPPP......',
        '.....G...G......',
        '....GG...GG.....',
      ],
      [
        '................',
        '.......G........',
        '.......G........',
        '......YYY.......',
        '.....GGGGG......',
        '....GGGGGGG.....',
        '....GYGKGYG.....',
        '....GGGGGGG.....',
        '.....GGGGG......',
        '....PPPPPPP.....',
        '...PPPPPPPPP....',
        '...PPPYYYPPP....',
        '....PPPPPPP.....',
        '.....PPPPP......',
        '.....G..GG......',
        '....GG...G......',
      ],
    ],
  },

  /* ─ Postman — SLACK-TRACKER ───────────────────────────────────── */
  postman: {
    palette: { B: '#0a0a0a', N: '#4a154b', W: '#f0f0f0', S: '#f4e6c0', E: '#0a0a0a', P: '#7a4a2a' },
    frames: [
      [
        '................',
        '.....BBBBB......',
        '....NNNNNNN.....',
        '....NNNNNNN.....',
        '.....SSSSS......',
        '....SSEESSEE....',
        '.....SSSSS......',
        '....NNNNNNN.....',
        '...NNPPPPPPN....',
        '...NNPPPPPPN....',
        '....NNNNNNN.....',
        '.....NNNNN......',
        '.....NNNNN......',
        '.....N...N......',
        '.....B...B......',
        '.....BB.BB......',
      ],
      [
        '................',
        '.....BBBBB......',
        '....NNNNNNN.....',
        '....NNNNNNN.....',
        '.....SSSSS......',
        '....SSEESSEE....',
        '.....SSSSS......',
        '....NNNNNNN.....',
        '...NNPPPPPPN....',
        '...NNPPPPPPN....',
        '....NNNNNNN.....',
        '.....NNNNN......',
        '.....NNNNN......',
        '.....NN.N.......',
        '.....BB..B......',
        '.....BB..BB.....',
      ],
    ],
  },

  /* ─ Bus — SYSTEM BUS (CPU↔RAM bundle), 14×22 vertical ─────────── */
  bus: {
    palette: { K: '#1a1a1a', Y: '#f7df1e', W: '#a8d0ff', T: '#d4a857', B: '#0a0a0a' },
    frames: [
      [
        '.....TTTT.....',
        '.....TTTT.....',
        '....KKKKKK....',
        '...KYYYYYYK...',
        '...KWWWWWWK...',
        '...KYYYYYYK...',
        'KK.KYYYYYYK.KK',
        '...KYYYYYYK...',
        '...KWWWWWWK...',
        '...KYYYYYYK...',
        '...KWWWWWWK...',
        '...KYYYYYYK...',
        '...KWWWWWWK...',
        '...KYYYYYYK...',
        '...KWWWWWWK...',
        '...KYYYYYYK...',
        '...KKKKKKKK...',
        '...KK....KK...',
        '....K....K....',
        '..............',
        '..............',
        '..............',
      ],
      [
        '.....TTTT.....',
        '.....TTTT.....',
        '....KKKKKK....',
        '...KYYYYYYK...',
        '...KWBWWBWK...',
        '...KYYYYYYK...',
        'KK.KYYYYYYK.KK',
        '...KYYYYYYK...',
        '...KWBWWWWK...',
        '...KYYYYYYK...',
        '...KWWWWBWK...',
        '...KYYYYYYK...',
        '...KWBWWWBK...',
        '...KYYYYYYK...',
        '...KWWBWWWK...',
        '...KYYYYYYK...',
        '...KKKKKKKK...',
        '....KK..KK....',
        '...KK....KK...',
        '..............',
        '..............',
        '..............',
      ],
    ],
  },
};

/* ─── Walker paths ────────────────────────────────────────────────────── */
/* `carry`: 'hands' = box in hands, 'top' = box above sprite, 'none' = no box.
 * `staggerMs`: initial pause so walkers desync on first frame.            */

const WALKER_PATHS = [
  { id: 'cpu-to-munux-os', points: [[460,340],[400,340],[400,210],[340,210]], sprite: 'tux',     speed: 55,  scale: 2, carry: 'hands', boxOffsetY: 9,   staggerMs: 0    },
  { id: 'cpu-to-reactive', points: [[460,400],[310,400]],                       sprite: 'ferris', speed: 70,  scale: 2, carry: 'hands', boxOffsetY: 6,   staggerMs: 400  },
  { id: 'cpu-to-obscura',  points: [[500,500],[500,595],[310,595]],            sprite: 'hooded', speed: 35,  scale: 2, carry: 'hands', boxOffsetY: 9,   staggerMs: 800  },
  { id: 'cpu-to-books',    points: [[820,340],[880,340],[880,210],[940,210]], sprite: 'book',   speed: 40,  scale: 2, carry: 'none',  boxOffsetY: 0,   staggerMs: 1200 },
  { id: 'cpu-to-stellar',  points: [[820,400],[970,400]],                       sprite: 'rocket', speed: 90,  scale: 2, carry: 'hands', boxOffsetY: 6,   staggerMs: 1600 },
  { id: 'cpu-to-server',   points: [[780,500],[780,595],[970,595]],            sprite: 'droid',  speed: 50,  scale: 2, carry: 'hands', boxOffsetY: 9,   staggerMs: 2000 },
  { id: 'cpu-to-slack',    points: [[640,500],[640,600]],                       sprite: 'postman',speed: 60,  scale: 2, carry: 'hands', boxOffsetY: 9,   staggerMs: 2400 },
  { id: 'system-bus',      points: [[665,300],[665,110]],                       sprite: 'bus',    speed: 100, scale: 2, carry: 'none',  boxOffsetY: 0,   staggerMs: 200  },
];

/* Traces from CPU edges to each chip (right-angle paths) */
const TRACES = [
  /* CPU left → MUNUX-OS */
  [[460, 340], [400, 340], [400, 210], [340, 210]],
  /* CPU left → REACTIVE-WS */
  [[460, 400], [310, 400]],
  /* CPU bottom-left → OBSCURA */
  [[500, 500], [500, 595], [310, 595]],
  /* CPU right → MUNUX-BOOKS */
  [[820, 340], [880, 340], [880, 210], [940, 210]],
  /* CPU right → STELLAR */
  [[820, 400], [970, 400]],
  /* CPU bottom-right → SERVER-CTRL */
  [[780, 500], [780, 595], [970, 595]],
  /* CPU bottom-center → SLACK-TRACKER */
  [[640, 500], [640, 600]],
];

/* ────────────────────────────────────────────────────────────────────────
 *  BOOT SEQUENCE
 * ──────────────────────────────────────────────────────────────────────── */

const BOOT_LINES = [
  { t: 0,    s: 'MUNUX BIOS v1.0  (c) 2026 Munique Feitoza' },
  { t: 120,  s: '════════════════════════════════════════════════════' },
  { t: 240,  s: '[OK] CPU detected ............ MUNIQ_FEITOZA @ jr.dev' },
  { t: 360,  s: '[OK] MEM test ................ OLLAMA_LOCAL  8GB OK' },
  { t: 460,  s: '[OK] BUS ..................... system-bus available' },
  { t: 560,  s: '[--] Mounting /chips ...' },
  { t: 640,  s: '      munux-os ............... OK' },
  { t: 720,  s: '      reactive-workspace ..... OK' },
  { t: 800,  s: '      obscura ................ OK' },
  { t: 880,  s: '      slack-tracker .......... OK' },
  { t: 960,  s: '      server-controller ...... OK' },
  { t: 1040, s: '      stellar-narrators ...... OK' },
  { t: 1120, s: '      munux-books ............ OK' },
  { t: 1240, s: '[OK] Booting MUNUX MAINBOARD v1.0' },
  { t: 1340, s: '════════════════════════════════════════════════════' },
];

const BOOT_HOLD_MS = 380;

function runBoot(onComplete) {
  const log   = document.getElementById('boot-log');
  const boot  = document.getElementById('boot');
  const board = document.getElementById('board');

  for (const line of BOOT_LINES) {
    setTimeout(() => {
      log.textContent += (log.textContent ? '\n' : '') + line.s;
    }, line.t);
  }

  const total = BOOT_LINES[BOOT_LINES.length - 1].t + BOOT_HOLD_MS;
  setTimeout(() => {
    boot.classList.add('gone');
    board.setAttribute('aria-hidden', 'false');
    board.classList.add('lit');
    if (onComplete) onComplete();
  }, total);
  setTimeout(() => boot.remove(), total + 900);
}

/* ────────────────────────────────────────────────────────────────────────
 *  CANVAS RENDERING
 * ──────────────────────────────────────────────────────────────────────── */

function setupCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width  = W * dpr;
  canvas.height = H * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.imageSmoothingEnabled = false;
  return ctx;
}

function drawBackground(ctx) {
  ctx.fillStyle = C.pcbBg;
  ctx.fillRect(0, 0, W, H);

  /* dot grid */
  ctx.fillStyle = '#073a26';
  for (let y = 16; y < H; y += 16) {
    for (let x = 16; x < W; x += 16) ctx.fillRect(x, y, 1, 1);
  }
  /* bigger dots */
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  for (let y = 40; y < H; y += 80) {
    for (let x = 40; x < W; x += 80) ctx.fillRect(x - 1, y - 1, 2, 2);
  }
  /* solder-mask noise */
  ctx.fillStyle = 'rgba(8,40,28,0.5)';
  for (let i = 0; i < 700; i++) {
    ctx.fillRect((Math.random() * W) | 0, (Math.random() * H) | 0, 1, 1);
  }
  /* center glow / outer darkening */
  const g = ctx.createRadialGradient(W/2, H/2, W*0.25, W/2, H/2, W*0.7);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(1, 'rgba(0,0,0,0.4)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
}

function drawSilkBorder(ctx) {
  /* outer + inner silk rails */
  ctx.strokeStyle = C.copper;
  ctx.lineWidth = 1;
  ctx.strokeRect(8.5, 8.5, W - 17, H - 17);

  ctx.strokeStyle = C.copperDim;
  ctx.lineWidth = 0.5;
  ctx.strokeRect(20.5, 20.5, W - 41, H - 41);

  /* corner fiducials */
  const fid = [[14, 14], [W-22, 14], [14, H-22], [W-22, H-22]];
  for (const [x, y] of fid) {
    ctx.fillStyle = C.silk;
    ctx.fillRect(x, y, 8, 8);
    ctx.fillStyle = C.pcbBg;
    ctx.fillRect(x+2, y+2, 4, 4);
  }

  /* top silk labels */
  ctx.fillStyle = C.silk;
  ctx.font = '10px JetBrains Mono, monospace';
  ctx.textBaseline = 'top';
  ctx.fillText('MUNUX', 64, 16);
  ctx.fillText('REV 1.0', 64, 28);
  ctx.fillText('JR. DEV · 2026.05', W - 196, 16);
  ctx.fillStyle = C.silkDim;
  ctx.font = '8px JetBrains Mono, monospace';
  ctx.fillText('FCC ID: MUNUX-2026 · PCB-ASSEMBLED-BR', W - 196, 28);

  /* (contact silk now rendered as DOM links in the overlay — see buildOverlay) */

  /* refdes labels for skill resistors */
  ctx.fillStyle = C.silkDim;
  ctx.font = '8px JetBrains Mono, monospace';
  ctx.fillText('R1', 80,  290);
  ctx.fillText('R2', 170, 290);
  ctx.fillText('R3', 80,  475);
  ctx.fillText('R4', 170, 475);
  ctx.fillText('R5', 960, 290);
  ctx.fillText('R6', 1050, 290);
  ctx.fillText('R7', 960, 475);
  ctx.fillText('R8', 1050, 475);
}

function drawTrace(ctx, points) {
  ctx.strokeStyle = C.copper;
  ctx.lineWidth = 5;
  ctx.lineJoin = 'round';
  ctx.lineCap  = 'round';
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.stroke();

  ctx.strokeStyle = C.copperBright;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.stroke();

  for (const [x, y] of points) drawVia(ctx, x, y);
}

function drawVia(ctx, x, y) {
  ctx.fillStyle = C.solderDark;
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = C.copper;
  ctx.beginPath();
  ctx.arc(x, y, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = C.pcbBgDark;
  ctx.beginPath();
  ctx.arc(x, y, 1.4, 0, Math.PI * 2);
  ctx.fill();
}

function drawChip(ctx, chip) {
  const { x, y, w, h } = chip;

  /* shadow */
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.fillRect(x + 3, y + 3, w, h);
  /* body */
  ctx.fillStyle = C.chipBody;
  ctx.fillRect(x, y, w, h);
  /* bevel highlight (top + left) */
  ctx.fillStyle = C.chipBevelTop;
  ctx.fillRect(x, y, w, 1);
  ctx.fillRect(x, y, 1, h);
  /* bevel shadow (bottom + right) */
  ctx.fillStyle = '#000';
  ctx.fillRect(x, y + h - 1, w, 1);
  ctx.fillRect(x + w - 1, y, 1, h);
  /* orientation dot */
  ctx.fillStyle = C.silkDim;
  ctx.beginPath();
  ctx.arc(x + 10, y + 10, 2.5, 0, Math.PI * 2);
  ctx.fill();

  drawChipPins(ctx, chip);
}

function drawChipPins(ctx, chip) {
  const { x, y, w, h, pins } = chip;
  const pinLen = 10;
  const pinW = 5;
  const sp = 18;
  ctx.fillStyle = C.solder;

  const drawSide = (side) => {
    if (side === 'left' || side === 'right') {
      const count = Math.max(2, Math.floor((h - 20) / sp));
      const startY = y + (h - (count - 1) * sp) / 2 - pinW / 2;
      for (let i = 0; i < count; i++) {
        const py = startY + i * sp;
        if (side === 'right') ctx.fillRect(x + w, py, pinLen, pinW);
        else                  ctx.fillRect(x - pinLen, py, pinLen, pinW);
      }
    } else {
      const count = Math.max(2, Math.floor((w - 20) / sp));
      const startX = x + (w - (count - 1) * sp) / 2 - pinW / 2;
      for (let i = 0; i < count; i++) {
        const px = startX + i * sp;
        if (side === 'top') ctx.fillRect(px, y - pinLen, pinW, pinLen);
        else                ctx.fillRect(px, y + h, pinW, pinLen);
      }
    }
  };

  if (pins === 'all') ['top','right','bottom','left'].forEach(drawSide);
  else drawSide(pins);
}

function drawCPU(ctx) {
  const { x, y, w, h, chamfer: ch } = CPU;

  /* shadow */
  ctx.fillStyle = 'rgba(0,0,0,0.65)';
  ctx.fillRect(x + 4, y + 4, w, h);

  /* chamfered body */
  ctx.fillStyle = '#1c1c14';
  ctx.beginPath();
  ctx.moveTo(x + ch,     y);
  ctx.lineTo(x + w - ch, y);
  ctx.lineTo(x + w,      y + ch);
  ctx.lineTo(x + w,      y + h - ch);
  ctx.lineTo(x + w - ch, y + h);
  ctx.lineTo(x + ch,     y + h);
  ctx.lineTo(x,          y + h - ch);
  ctx.lineTo(x,          y + ch);
  ctx.closePath();
  ctx.fill();

  /* copper die border */
  ctx.strokeStyle = C.copper;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x + 14, y + 14, w - 28, h - 28);
  ctx.strokeStyle = C.copperDim;
  ctx.lineWidth = 0.5;
  ctx.strokeRect(x + 20, y + 20, w - 40, h - 40);

  /* orientation dot */
  ctx.fillStyle = C.silk;
  ctx.beginPath();
  ctx.arc(x + 24, y + 24, 3, 0, Math.PI * 2);
  ctx.fill();

  /* PGA pins along the bottom edge */
  ctx.fillStyle = C.solder;
  const pgaCount = 16;
  const pgaSpace = (w - 40) / (pgaCount - 1);
  for (let i = 0; i < pgaCount; i++) {
    const px = x + 20 + i * pgaSpace - 2;
    ctx.fillRect(px, y + h - 4, 4, 4);
  }
}

function drawRAM(ctx) {
  const { x, y, w, h } = RAM;

  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.fillRect(x + 3, y + 3, w, h);

  ctx.fillStyle = '#0a3a26';
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = C.copper;
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);

  /* small chips on the DIMM */
  const modCount = 6;
  const modW = (w - 60) / modCount;
  for (let i = 0; i < modCount; i++) {
    const cx = x + 30 + i * modW;
    ctx.fillStyle = C.chipBody;
    ctx.fillRect(cx, y + 14, modW - 8, h - 32);
    ctx.fillStyle = C.chipBevelTop;
    ctx.fillRect(cx, y + 14, modW - 8, 1);
  }

  /* DIMM key notch */
  ctx.fillStyle = C.pcbBg;
  ctx.fillRect(x + w/2 - 8, y + h - 14, 16, 14);

  /* gold edge connector pins */
  ctx.fillStyle = C.copper;
  const pinCount = 40;
  const pinPitch = (w - 20) / pinCount;
  for (let i = 0; i < pinCount; i++) {
    const px = x + 10 + i * pinPitch;
    if (Math.abs(px - (x + w/2)) < 10) continue;
    ctx.fillRect(px, y + h - 5, pinPitch - 1.2, 5);
  }
}

function drawResistor(ctx, x, y, label, bandColor) {
  ctx.fillStyle = C.solder;
  ctx.fillRect(x - 10, y + 4, 10, 3);
  ctx.fillRect(x + 50, y + 4, 10, 3);

  ctx.fillStyle = '#c9b78a';
  ctx.fillRect(x, y, 50, 12);
  ctx.fillStyle = '#b39e6e';
  ctx.fillRect(x, y + 11, 50, 1);

  ctx.fillStyle = '#000';
  ctx.fillRect(x + 8, y, 3, 12);
  ctx.fillStyle = bandColor;
  ctx.fillRect(x + 16, y, 5, 12);
  ctx.fillStyle = '#000';
  ctx.fillRect(x + 27, y, 3, 12);
  ctx.fillStyle = bandColor;
  ctx.fillRect(x + 36, y, 5, 12);

  ctx.fillStyle = C.silk;
  ctx.font = 'bold 9px JetBrains Mono, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(label, x + 25, y + 18);
  ctx.textAlign = 'start';
}

function drawCapacitor(ctx, x, y) {
  ctx.fillStyle = C.solder;
  ctx.fillRect(x + 6, y - 5, 2, 6);
  ctx.fillRect(x + 18, y - 5, 2, 6);

  ctx.fillStyle = '#1a2a4a';
  ctx.beginPath();
  ctx.arc(x + 13, y + 6, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#3a4a6a';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(x + 13, y + 6, 12, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#a0c8ff';
  ctx.font = 'bold 10px JetBrains Mono, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('K', x + 13, y + 7);
  ctx.textAlign = 'start';
  ctx.textBaseline = 'alphabetic';
}

function drawHeaderPins(ctx, x, y, count) {
  for (let i = 0; i < count; i++) {
    ctx.fillStyle = C.solder;
    ctx.fillRect(x + i * 10, y, 6, 8);
    ctx.fillStyle = '#000';
    ctx.fillRect(x + i * 10 + 2, y + 2, 2, 4);
  }
}

function drawSMD(ctx, x, y, type) {
  if (type === 'r') {
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(x - 3, y - 1.5, 6, 3);
    ctx.fillStyle = C.solder;
    ctx.fillRect(x - 4, y - 1.5, 1, 3);
    ctx.fillRect(x + 3, y - 1.5, 1, 3);
  } else {
    ctx.fillStyle = '#d4b66a';
    ctx.fillRect(x - 2.5, y - 2, 5, 4);
    ctx.fillStyle = C.solder;
    ctx.fillRect(x - 3.5, y - 2, 1, 4);
    ctx.fillRect(x + 2.5, y - 2, 1, 4);
  }
}

function drawInductor(ctx, x, y) {
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.fillRect(x + 2, y + 2, 14, 14);
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(x, y, 14, 14);
  ctx.fillStyle = C.copperDim;
  ctx.fillRect(x, y, 14, 1);
  ctx.fillRect(x, y + 13, 14, 1);
  ctx.strokeStyle = C.silkDim;
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(x + 2,  y + 7);
  ctx.bezierCurveTo(x + 4, y + 3,  x + 6,  y + 11, x + 8, y + 7);
  ctx.bezierCurveTo(x + 10, y + 3, x + 12, y + 11, x + 14, y + 7);
  ctx.stroke();
}

function drawTestpoint(ctx, label, x, y) {
  ctx.fillStyle = C.solderDark;
  ctx.beginPath();
  ctx.arc(x, y, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = C.solder;
  ctx.beginPath();
  ctx.arc(x, y, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = C.silkDim;
  ctx.font = '8px JetBrains Mono, monospace';
  ctx.textBaseline = 'top';
  ctx.fillText(label, x + 6, y - 4);
}

function drawMountingHole(ctx, x, y) {
  ctx.fillStyle = C.solder;
  ctx.beginPath();
  ctx.arc(x, y, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = C.copperDim;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#020c07';
  ctx.beginPath();
  ctx.arc(x, y, 7, 0, Math.PI * 2);
  ctx.fill();
  /* tiny phillips cross — just a hint */
  ctx.strokeStyle = '#3a4540';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(x - 4, y); ctx.lineTo(x + 4, y);
  ctx.moveTo(x, y - 4); ctx.lineTo(x, y + 4);
  ctx.stroke();
}

function drawHeader(ctx, h) {
  const pitch = 8;
  const w = h.count * pitch + 4;
  const ht = 10;
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(h.x + 2, h.y + 2, w, ht);
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(h.x, h.y, w, ht);
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(h.x, h.y, w, 1);
  ctx.fillStyle = C.solder;
  for (let i = 0; i < h.count; i++) {
    ctx.fillRect(h.x + 2 + i * pitch + 1, h.y + 3, 2, 4);
  }
  ctx.fillStyle = C.silkDim;
  ctx.font = '8px JetBrains Mono, monospace';
  ctx.textBaseline = 'top';
  ctx.fillText(h.name, h.x, h.y + ht + 2);
}

function drawCMOSBattery(ctx, b) {
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.beginPath();
  ctx.arc(b.x + 2, b.y + 2, b.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#c8ccca';
  ctx.beginPath();
  ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#888';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = '#222';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(b.x - 6, b.y); ctx.lineTo(b.x + 6, b.y);
  ctx.moveTo(b.x, b.y - 6); ctx.lineTo(b.x, b.y + 6);
  ctx.stroke();
  ctx.fillStyle = '#444';
  ctx.font = 'bold 8px JetBrains Mono, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('+3V', b.x, b.y + b.r * 0.55);
  ctx.fillStyle = C.silkDim;
  ctx.fillText(b.label, b.x, b.y + b.r + 7);
  ctx.textAlign = 'start';
  ctx.textBaseline = 'alphabetic';
}

function drawCrystal(ctx, q) {
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(q.x + 2, q.y + 2, q.w, q.h);
  ctx.fillStyle = '#9aa5a8';
  ctx.fillRect(q.x, q.y, q.w, q.h);
  ctx.strokeStyle = '#5a6568';
  ctx.lineWidth = 1;
  ctx.strokeRect(q.x + 0.5, q.y + 0.5, q.w - 1, q.h - 1);
  ctx.fillStyle = '#5a6568';
  ctx.fillRect(q.x + 4, q.y + q.h / 2, q.w - 8, 1);
  ctx.fillStyle = C.solder;
  ctx.fillRect(q.x - 4, q.y + 4, 4, 3);
  ctx.fillRect(q.x + q.w, q.y + 4, 4, 3);
  ctx.fillStyle = C.silkDim;
  ctx.font = '8px JetBrains Mono, monospace';
  ctx.textBaseline = 'top';
  ctx.fillText(q.label, q.x - 6, q.y + q.h + 3);
}

function drawPeripheral(ctx, p) {
  const { x, y, w, h, pins, name } = p;
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(x + 2, y + 2, w, h);
  ctx.fillStyle = C.chipBody;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = C.chipBevelTop;
  ctx.fillRect(x, y, w, 1);
  ctx.fillRect(x, y, 1, h);
  ctx.fillStyle = '#000';
  ctx.fillRect(x, y + h - 1, w, 1);
  ctx.fillRect(x + w - 1, y, 1, h);
  ctx.fillStyle = C.silkDim;
  ctx.beginPath();
  ctx.arc(x + 7, y + 7, 1.8, 0, Math.PI * 2);
  ctx.fill();
  drawChipPins(ctx, { x, y, w, h, pins });
  ctx.fillStyle = C.silk;
  ctx.font = 'bold 9px JetBrains Mono, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(name, x + w / 2, y + h / 2);
  ctx.textAlign = 'start';
  ctx.textBaseline = 'alphabetic';
}

function drawBusBundle(ctx, fromX, toX, fromY, toY, count) {
  const span = toX - fromX;
  const step = count > 1 ? span / (count - 1) : 0;
  for (let i = 0; i < count; i++) {
    const x = fromX + i * step;
    ctx.strokeStyle = C.copper;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(x, fromY); ctx.lineTo(x, toY);
    ctx.stroke();
    ctx.strokeStyle = C.copperBright;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(x, fromY); ctx.lineTo(x, toY);
    ctx.stroke();
    drawVia(ctx, x, fromY);
    drawVia(ctx, x, toY);
  }
}

function drawDecorations(ctx) {
  for (const s of SKILLS)   drawResistor(ctx, s.x, s.y, s.label, s.color);
  for (const [x, y] of CAPS) drawCapacitor(ctx, x, y);

  /* DEBUG header pins, top-center silk-labeled */
  const hpY = 36;
  const hpX = W / 2 - 50;
  drawHeaderPins(ctx, hpX, hpY, 10);
  ctx.fillStyle = C.silk;
  ctx.font = '9px JetBrains Mono, monospace';
  ctx.textBaseline = 'top';
  ctx.fillText('J1·DEBUG', hpX, hpY + 12);
}

/* ────────────────────────────────────────────────────────────────────────
 *  Sprite drawing + walker system (fase 3)
 * ──────────────────────────────────────────────────────────────────────── */

function drawSprite(ctx, frame, x, y, scale, palette) {
  const xi = Math.round(x), yi = Math.round(y);
  for (let row = 0; row < frame.length; row++) {
    const line = frame[row];
    for (let col = 0; col < line.length; col++) {
      const ch = line[col];
      if (ch === '.' || ch === ' ') continue;
      const color = palette[ch];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(xi + col * scale, yi + row * scale, scale, scale);
    }
  }
}

function pathLength(points) {
  let len = 0;
  for (let i = 1; i < points.length; i++) {
    const dx = points[i][0] - points[i-1][0];
    const dy = points[i][1] - points[i-1][1];
    len += Math.hypot(dx, dy);
  }
  return len;
}

function posAtDistance(points, d) {
  if (d <= 0) return [points[0][0], points[0][1], 0, 0];
  let acc = 0;
  for (let i = 1; i < points.length; i++) {
    const dx = points[i][0] - points[i-1][0];
    const dy = points[i][1] - points[i-1][1];
    const segLen = Math.hypot(dx, dy);
    if (acc + segLen >= d) {
      const t = (d - acc) / segLen;
      return [
        points[i-1][0] + dx * t,
        points[i-1][1] + dy * t,
        dx / segLen,
        dy / segLen,
      ];
    }
    acc += segLen;
  }
  const last = points[points.length - 1];
  const prev = points[points.length - 2];
  const dx = last[0] - prev[0], dy = last[1] - prev[1];
  const segLen = Math.hypot(dx, dy);
  return [last[0], last[1], dx / segLen, dy / segLen];
}

function createWalker(def) {
  const spr = SPRITES[def.sprite];
  return {
    id:         def.id,
    sprite:     def.sprite,
    palette:    spr.palette,
    frames:     spr.frames,
    path:       def.points,
    totalLen:   pathLength(def.points),
    speed:      def.speed,
    scale:      def.scale ?? 2,
    carry:      def.carry ?? 'hands',
    boxOffsetY: def.boxOffsetY ?? 9,
    d:          0,
    dir:        1,
    carrying:   false,
    frame:      0,
    frameMs:    Math.random() * 160,
    pauseMs:    def.staggerMs ?? 0,
  };
}

function updateWalker(w, dt) {
  w.frameMs += dt;
  if (w.frameMs > 160) {
    w.frameMs = 0;
    w.frame = (w.frame + 1) % w.frames.length;
  }
  if (w.pauseMs > 0) {
    w.pauseMs -= dt;
    return;
  }
  w.d += w.speed * w.dir * (dt / 1000);
  if (w.d >= w.totalLen) {
    w.d = w.totalLen;
    w.pauseMs = 600;
    w.dir = -1;
    w.carrying = true;   /* picked up box at chip */
  } else if (w.d <= 0) {
    w.d = 0;
    w.pauseMs = 600;
    w.dir = 1;
    w.carrying = false;  /* dropped box at CPU */
  }
}

function drawWalker(ctx, w) {
  const [px, py] = posAtDistance(w.path, w.d);
  const scale = w.scale;
  const frame = w.frames[w.frame];
  const sw = frame[0].length * scale;
  const sh = frame.length * scale;

  const x = px - sw / 2;
  const y = py - sh / 2;

  /* soft shadow under feet */
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.beginPath();
  ctx.ellipse(px, py + sh / 2 - 2, sw / 2.4, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  drawSprite(ctx, frame, x, y, scale, w.palette);

  if (w.carrying && w.carry !== 'none') {
    const bw = BOX_FRAME[0].length * scale;
    const bh = BOX_FRAME.length * scale;
    const bx = px - bw / 2;
    const by = w.carry === 'top'
      ? y - bh - 1
      : y + w.boxOffsetY * scale;
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fillRect(Math.round(bx) + 1, Math.round(by) + 1, bw, bh);
    drawSprite(ctx, BOX_FRAME, bx, by, scale, BOX_PALETTE);
  }
}

/* ─── game loop ─────────────────────────────────────────────────────── */

const walkers = [];
let walkerCtx = null;
let animLastTime = 0;
let animRunning = false;

function startAnimation(canvas) {
  walkerCtx = setupCanvas(canvas);
  for (const def of WALKER_PATHS) walkers.push(createWalker(def));
  animRunning = true;
  requestAnimationFrame(animFrame);
}

function animFrame(now) {
  if (!animRunning) return;
  if (!animLastTime) animLastTime = now;
  let dt = now - animLastTime;
  animLastTime = now;
  if (dt > 80) dt = 80; /* clamp big tab-blur gaps */

  for (const w of walkers) updateWalker(w, dt);

  walkerCtx.clearRect(0, 0, W, H);
  for (const w of walkers) drawWalker(walkerCtx, w);

  requestAnimationFrame(animFrame);
}

function drawBoard(ctx) {
  drawBackground(ctx);
  drawSilkBorder(ctx);

  /* background dead-end decorative traces */
  for (const t of BG_TRACES) drawTrace(ctx, t);

  /* parallel bus bundle: CPU top ↔ RAM bottom (8 data lines) */
  drawBusBundle(ctx, 530, 800, 300, 110, 8);

  /* main project traces */
  for (const t of TRACES) drawTrace(ctx, t);

  /* SMDs scattered over traces */
  for (const [x, y, type] of SMDS) drawSMD(ctx, x, y, type);

  /* inductors (VRM section + NIC) */
  for (const [x, y] of INDUCTORS) drawInductor(ctx, x, y);

  /* legacy decorations: skill resistors + caps + J1 DEBUG header */
  drawDecorations(ctx);

  /* testpoints */
  for (const [label, x, y] of TESTPOINTS) drawTestpoint(ctx, label, x, y);

  /* secondary peripherals (BIOS, NIC, AUDIO, SUPER I/O) */
  for (const p of PERIPHERALS) drawPeripheral(ctx, p);

  /* battery, crystal, pin headers */
  drawCMOSBattery(ctx, BATTERY);
  drawCrystal(ctx, CRYSTAL);
  for (const h of HEADERS) drawHeader(ctx, h);

  /* main components on top */
  drawRAM(ctx);
  for (const ch of CHIPS) drawChip(ctx, ch);
  drawCPU(ctx);

  /* mounting holes — top-most layer */
  for (const [x, y] of MOUNTS) drawMountingHole(ctx, x, y);
}

/* ────────────────────────────────────────────────────────────────────────
 *  DOM OVERLAY (labels positioned over canvas chip bodies)
 * ──────────────────────────────────────────────────────────────────────── */

function buildOverlay() {
  const container = document.getElementById('chips');

  const place = (chip) => {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'chip ' + (chip.cls || '');
    el.style.left   = (chip.x / W * 100) + '%';
    el.style.top    = (chip.y / H * 100) + '%';
    el.style.width  = (chip.w / W * 100) + '%';
    el.style.height = (chip.h / H * 100) + '%';
    el.setAttribute('aria-label', chip.name + ' — ' + (chip.sub || ''));

    let html  = `<span class="chip-name">${chip.name}</span>`;
    if (chip.sub)  html += `<span class="chip-sub">${chip.sub}</span>`;
    if (chip.part) html += `<span class="chip-part">${chip.part}</span>`;
    el.innerHTML = html;

    el.addEventListener('click', (e) => {
      e.preventDefault();
      showDatasheet(chip);
    });
    container.appendChild(el);
  };

  place(CPU);
  place(RAM);
  for (const ch of CHIPS) place(ch);

  /* DEBUG port — clickable header above J1·DEBUG silk (top-center) */
  const dbg = document.createElement('button');
  dbg.type = 'button';
  dbg.className = 'debug-port';
  dbg.style.left   = ((W/2 - 54) / W * 100) + '%';
  dbg.style.top    = (34 / H * 100) + '%';
  dbg.style.width  = (108 / W * 100) + '%';
  dbg.style.height = (28 / H * 100) + '%';
  dbg.setAttribute('aria-label', 'J1 DEBUG port — abrir canais de contato');
  dbg.textContent = '';  /* invisible hitbox over silk */
  dbg.addEventListener('click', () => showDatasheet(CONTACT));
  container.appendChild(dbg);

  /* Silk-screen contact links at the bottom of the board (DOM, clickable) */
  const row = document.createElement('div');
  row.className = 'silk-contact-row';
  for (const c of CONTACT.contacts) {
    const a = document.createElement('a');
    a.className = 'silk-contact';
    a.href = c.href;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.setAttribute('aria-label', c.protocol + ' — ' + c.value);
    a.textContent = '● ' + c.value;
    row.appendChild(a);
  }
  container.appendChild(row);
}

/* ────────────────────────────────────────────────────────────────────────
 *  Datasheet panel (fase 5)
 * ──────────────────────────────────────────────────────────────────────── */

/* Renders a datasheet description that is either a plain string (legacy)
 * or a bilingual { pt, en } object, each language tagged. Uses textContent /
 * createTextNode only — no innerHTML — so the data can never inject markup. */
function renderDescription(el, desc) {
  el.textContent = '';
  if (!desc) return;
  if (typeof desc === 'string') { el.textContent = desc; return; }

  const LANGS = [['PT-BR', desc.pt], ['EN', desc.en]];
  for (const [lang, text] of LANGS) {
    if (!text) continue;
    const block = document.createElement('span');
    block.className = 'ds-desc-block';
    const tag = document.createElement('span');
    tag.className = 'ds-lang';
    tag.textContent = lang;
    block.append(tag, document.createTextNode(text));
    el.appendChild(block);
  }
}

function showDatasheet(chip) {
  const dialog   = document.getElementById('datasheet');
  const partEl   = document.getElementById('ds-part');
  const titleEl  = document.getElementById('ds-title');
  const subEl    = document.getElementById('ds-sub');
  const descEl   = document.getElementById('ds-desc');
  const stackEl  = document.getElementById('ds-stack');
  const linkEl   = document.getElementById('ds-link');
  const contacts = document.getElementById('ds-contacts');

  partEl.textContent  = chip.part || '';
  titleEl.textContent = chip.name;
  subEl.textContent   = chip.sub || '';
  renderDescription(descEl, chip.description);

  stackEl.innerHTML = '';
  for (const s of (chip.stack || [])) {
    const tag = document.createElement('span');
    tag.className = 'ds-tag';
    tag.textContent = s;
    stackEl.appendChild(tag);
  }

  if (chip.contacts && chip.contacts.length) {
    contacts.hidden = false;
    contacts.innerHTML = '';
    for (const c of chip.contacts) {
      const a = document.createElement('a');
      a.className = 'ds-contact';
      a.href = c.href;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.innerHTML =
        `<span class="ds-pin">${c.label}</span>` +
        `<span class="ds-contact-value">${c.value}</span>` +
        `<span class="ds-contact-arrow">→</span>`;
      contacts.appendChild(a);
    }
    stackEl.hidden = true;
    linkEl.style.display = 'none';
  } else {
    contacts.hidden = true;
    stackEl.hidden = false;
    if (chip.url && chip.url !== '#') {
      linkEl.href = chip.url;
      linkEl.style.display = '';
      linkEl.textContent = 'OPEN REPO →';
    } else if (chip.url === '#') {
      linkEl.style.display = '';
      linkEl.removeAttribute('href');
      linkEl.textContent = 'COMING SOON';
    } else {
      linkEl.style.display = 'none';
    }
  }

  if (typeof dialog.showModal === 'function') {
    dialog.showModal();
  } else {
    dialog.setAttribute('open', '');
  }
}

function hideDatasheet() {
  const dialog = document.getElementById('datasheet');
  if (typeof dialog.close === 'function' && dialog.open) dialog.close();
  else dialog.removeAttribute('open');
}

function setupDatasheet() {
  const dialog = document.getElementById('datasheet');
  document.getElementById('ds-close').addEventListener('click', hideDatasheet);
  dialog.addEventListener('click', (e) => {
    /* clicking the backdrop (the dialog element itself, not the article) closes */
    if (e.target === dialog) hideDatasheet();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dialog.open) hideDatasheet();
  });
}

/* ────────────────────────────────────────────────────────────────────────
 *  Mouse-parallax tilt on the board
 * ──────────────────────────────────────────────────────────────────────── */

function setupMouseTilt() {
  const frame = document.querySelector('.board-frame');
  if (!frame) return;
  let raf = null;
  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;

  const apply = () => {
    /* smooth approach for buttery feel */
    currentX += (targetX - currentX) * 0.12;
    currentY += (targetY - currentY) * 0.12;
    frame.style.transform =
      `perspective(2400px) rotateX(${currentX.toFixed(2)}deg) rotateY(${currentY.toFixed(2)}deg)`;
    if (Math.abs(targetX - currentX) > 0.01 || Math.abs(targetY - currentY) > 0.01) {
      raf = requestAnimationFrame(apply);
    } else {
      raf = null;
    }
  };

  window.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    targetX = -dy * 2.5;
    targetY =  dx * 2.5;
    if (!raf) raf = requestAnimationFrame(apply);
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    targetX = 0;
    targetY = 0;
    if (!raf) raf = requestAnimationFrame(apply);
  });
}

/* ────────────────────────────────────────────────────────────────────────
 *  MAIN
 * ──────────────────────────────────────────────────────────────────────── */

function main() {
  const pcbCanvas    = document.getElementById('pcb');
  const walkerCanvas = document.getElementById('walkers');
  const pcbCtx = setupCanvas(pcbCanvas);
  drawBoard(pcbCtx);

  buildOverlay();
  setupDatasheet();
  setupMouseTilt();
  runBoot(() => startAnimation(walkerCanvas));

  let lastDPR = window.devicePixelRatio;
  window.addEventListener('resize', () => {
    if (window.devicePixelRatio !== lastDPR) {
      lastDPR = window.devicePixelRatio;
      drawBoard(setupCanvas(pcbCanvas));
      if (animRunning) walkerCtx = setupCanvas(walkerCanvas);
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}
