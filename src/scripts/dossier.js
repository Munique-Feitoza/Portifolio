'use strict';

/* ────────────────────────────────────────────────────────────────────────
 *  MUNUX DOSSIER & HUD CONTROLLER
 *  HUD Navigation, Audio Synthesizer, Mini-CLI Terminal,
 *  Certifications Vault, Technical Dispatches / Blog Engine
 * ──────────────────────────────────────────────────────────────────────── */

/* ─── 1. Web Audio Synthesizer (Relay / CRT Sound Effects) ─────────────── */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = localStorage.getItem('munux_sfx') === 'true';
  }

  init() {
    if (!this.ctx && typeof AudioContext !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('munux_sfx', this.enabled ? 'true' : 'false');
    if (this.enabled) {
      this.init();
      this.playBeep(880, 0.05, 'square');
    }
    return this.enabled;
  }

  playClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.03);
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.035);
  }

  playRelay() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.setValueAtTime(320, this.ctx.currentTime + 0.02);
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.07);
  }

  playBeep(freq = 440, duration = 0.08, type = 'sine') {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + duration + 0.01);
  }
}

const sfx = new SoundEngine();

/* ─── 2. Data: Certifications & Honors ─────────────────────────────────── */

const CERTIFICATIONS = [
  {
    id: 'ibm-z-advanced',
    badge: 'IBM · 2026',
    title: 'IBM Z Xplore – Advanced',
    issuer: 'IBM',
    year: '2026',
    category: 'Enterprise Mainframe & Automation',
    verified: true,
    hash: '0xIBM-ADV-984F7',
    summary: 'Competências avançadas em Enterprise COBOL, automação de infraestrutura z/OS com Ansible, gestão de datasets corporativos e isolamento de segurança.',
    details: 'Validação técnica oficial de proficiência em z/OS, desenvolvimento e execução de cargas em Enterprise COBOL, orquestração de playbooks Ansible integrados ao z/OS (IBM z/OS core collection), análise de logs de sistema (SYSLOG) e resolução de incidentes críticos em ambientes transacionais bancários.',
    skills: ['Enterprise COBOL', 'IBM z/OS', 'Ansible for z/OS', 'JCL', 'Datasets (PS/PDS)', 'RACF Security'],
    link: 'https://www.credly.com/organizations/ibm/badges'
  },
  {
    id: 'ibm-cobol-vscode',
    badge: 'IBM · 2026',
    title: 'Enterprise COBOL with VSCode',
    issuer: 'IBM',
    year: '2026',
    category: 'Modern Mainframe Tooling & DX',
    verified: true,
    hash: '0xCOBOL-VSC-E319A',
    summary: 'Desenvolvimento, compilação, testes e depuração de código Enterprise COBOL utilizando a suite moderna de ferramentas (Zowe CLI, VS Code e esteiras Git).',
    details: 'Domínio da esteira moderna de desenvolvimento para Mainframe IBM Z. Conexão via Zowe CLI a USS (Unix System Services) e JES, submissão automatizada de jobs JCL, depuração de programas COBOL com language servers e controle de versão moderno integrado a sistemas legados.',
    skills: ['Enterprise COBOL', 'Zowe CLI', 'VS Code', 'Git for Mainframe', 'JES & Jobs', 'USS'],
    link: 'https://www.credly.com/organizations/ibm/badges'
  },
  {
    id: 'ibm-z-concepts',
    badge: 'IBM · 2026',
    title: 'IBM Z Xplore – Concepts',
    issuer: 'IBM',
    year: '2026',
    category: 'Mainframe Architecture & Systems',
    verified: true,
    hash: '0xIBM-CON-55D12',
    summary: 'Fundamentos sólidos da arquitetura IBM Z, conceitos estruturais de z/OS, subsistemas Unix System Services (USS) e execução de JCL.',
    details: 'Compreensão aprofundada da filosofia de alta disponibilidade (99.999% uptime), hardware z16/zSystems, partições lógicas (LPARs), emulação Hercules, canais de E/S, catálogo de datasets e arquitetura de EBCDIC.',
    skills: ['IBM z/Architecture', 'z/OS Subsystems', 'JCL Fundamentals', 'ISPF', 'USS', 'EBCDIC'],
    link: 'https://www.credly.com/organizations/ibm/badges'
  },
  {
    id: 'hackersec-hcp',
    badge: 'HACKERSEC · 2026',
    title: 'HCP V2 — HackerSec Certified Pentester',
    issuer: 'HackerSec',
    year: '2026',
    category: 'Offensive Security & Infra Pentesting',
    verified: true,
    hash: '0xHCP-V2-77F8B',
    summary: 'Certificação prática comprovando habilidades avançadas em testes de invasão de infraestrutura de redes, quebra de controles e hardening defensivo.',
    details: 'Avaliação prática 100% prática (hands-on) em ambientes simulados de alta complexidade. Técnicas de reconhecimento, evasão de firewalls/WAF, exploração de vulnerabilidades em serviços de rede, escalação de privilégios em Linux/Windows e elaboração de relatórios técnicos de mitigação.',
    skills: ['Network Penetration Testing', 'Linux Hardening', 'Privilege Escalation', 'Exploitation', 'Web App Security', 'Threat Modeling'],
    link: 'https://hackersec.com/'
  },
  {
    id: 'hackersec-ctf-top2',
    badge: 'TOP 2 NACIONAL',
    title: 'Top 2 Overall Ranking — HackerSec CTF',
    issuer: 'HackerSec CTF Platform',
    year: '2025/2026',
    category: 'Competitive Binary & Reverse Engineering',
    verified: true,
    hash: '0xCTF-RANK2-FULL100',
    summary: '2º Lugar geral nacional com 100% de conclusão em todos os desafios avançados da plataforma (Engenharia Reversa, Exploração de Binários, Forense e Cripto).',
    details: 'Superação de desafios de nível expert envolvendo análise estática e dinâmica de binários ELF (GDB/Radare2), buffer overflow, ROP chains (Return-Oriented Programming), shellcode injection, esteganografia avançada e criptoanálise.',
    skills: ['Binary Exploitation', 'Reverse Engineering', 'GDB / Disassembly', 'ROP Chains', 'Memory Corruption', 'Cryptography'],
    link: 'https://hackersec.com/'
  },
  {
    id: 'nasa-spaceapps',
    badge: 'NASA · GLOBAL FINALIST',
    title: 'NASA Space Apps Challenge — Global Finalist',
    issuer: 'NASA Space Apps',
    year: '2025',
    category: 'Space Science & Real-time Telemetry',
    verified: true,
    hash: '0xNASA-TOP40-STELLAR',
    summary: '1º Lugar Regional (Santo André) e Top 40 Global entre milhares de equipes internacionais com o projeto Stellar Narrators (análise de clima espacial).',
    details: 'Concepção e desenvolvimento de uma plataforma de alta performance consumindo feeds de telemetria solar e clima espacial em tempo real diretamente das APIs da NASA e NOAA. Modelagem de dados para detecção precoce de tempestades geomagnéticas e seus impactos na rede elétrica e satélites.',
    skills: ['Real-time Telemetry', 'Distributed Data Processing', 'NASA Open APIs', 'Space Weather Modeling', 'System Reliability'],
    link: 'https://www.spaceappschallenge.org/'
  }
];

/* ─── 3. Data: Technical Dispatches / Blog ──────────────────────────────── */

const DISPATCHES = [
  {
    id: 'dispatch-001',
    ref: 'LOG-001 // ENTERPRISE SYSTEMS',
    date: '2026-10-18',
    readTime: '6 MIN READ',
    title: 'Por que o Mainframe z/OS e COBOL ainda dominam o mundo em 2026 (e o que aprendi programando neles)',
    summary: 'Esqueça os memes sobre "tecnologia jurássica". Quando o assunto é movimentar 70% dos dados financeiros do planeta com tolerância zero a falhas, o Mainframe não tem concorrente à altura. Veja como funciona na prática.',
    tags: ['IBM z/OS', 'COBOL', 'z/Architecture', 'ACID', 'JCL'],
    content: `
### O elefante na sala do sistema bancário mundial

É comum ouvir no ecossistema moderno de tecnologia: *"Por que os bancos simplesmente não reescrevem tudo em Go, Rust ou microsserviços na nuvem?"*

Quem faz essa pergunta geralmente nunca lidou com transações onde perder um único byte ou registrar um débito fora de ordem não significa apenas um bug — significa **violar regulações internacionais, paralisar compensações bancárias e causar bilhões em prejuízos**.

O hardware **IBM Z** e o sistema operacional **z/OS** foram desenhados com um propósito fundamental: **processamento de transações em tempo real com integridade estrita e disponibilidade contínua (o lendário 99.999% de uptime)**.

---

### 1. Representação Numérica no Silício: EBCDIC e COMP-3

No mundo x86 e linguagens modernas, números com casas decimais frequentemente sofrem com a imprecisão de ponto flutuante (\`float\` / \`double\`, padrão IEEE 754):

\`\`\`javascript
// Em JavaScript ou Python convencional:
0.1 + 0.2 === 0.3; // Retorna FALSE! Dá 0.30000000000000004
\`\`\`

Em sistemas de mainframe e **COBOL**, essa margem de erro simplesmente não existe. O formato **Packed Decimal (COMP-3)** codifica dois dígitos decimais em cada byte (4 bits por dígito), com o último nibble reservado para o sinal (\`C\` para positivo, \`D\` para negativo):

\`\`\`cobol
01  SALDO-CORRENTE    PIC S9(11)V99 COMP-3.
01  TAXA-TRANSACAO    PIC 9(03)V999 COMP-3.
\`\`\`

A instrução da CPU da **z/Architecture** executa a aritmética decimal diretamente nos circuitos do processador, garantindo precisão matemática absoluta em cada centavo transacionado.

---

### 2. O papel do JCL: O orquestrador definitivo de cargas em lote

Enquanto no Linux usamos cron jobs e orquestradores em contêineres, no z/OS o **JCL (Job Control Language)** especifica exatamente quais recursos, conjuntos de dados (datasets) e fitas virtuais um programa precisa antes mesmo de ser carregado na memória:

\`\`\`jcl
//PROCESSA JOB (ACCT),'MUNIQUE',CLASS=A,MSGCLASS=X
//STEP01   EXEC PGM=FINBATCH
//STEPLIB  DD   DSN=SYS2.COBOL.LOADLIB,DISP=SHR
//ENTRADA  DD   DSN=PROD.TRANS.DIARIA,DISP=SHR
//SAIDA    DD   DSN=PROD.SALDOS.CONSOL,
//              DISP=(NEW,CATLG,DELETE),
//              SPACE=(CYL,(50,10),RLSE)
//SYSOUT   DD   SYSOUT=*
\`\`\`

Se o arquivo de entrada não existir ou estiver em uso exclusivo por outro processo crítico, o sistema nem chega a alocar memória para o binário. O controle de concorrência é gerenciado diretamente pelo subsistema de E/S.

---

### 3. A Revolução do Zowe e VS Code

Durante meus estudos e certificações na **IBM (IBM Z Xplore Advanced e Enterprise COBOL with VSCode)**, a experiência que mais me fascinou foi a integração do Mainframe com o ferramental moderno.

Hoje não precisamos ficar restritos ao terminal 3270 verde e preto. Com o **Zowe CLI**, scripts automatizados com **Ansible** e extensões no VS Code, nós submetemos JCLs, inspecionamos spoolers JES e versionamos código COBOL exatamente com o mesmo fluxo ágil do Git contemporâneo.

> **Conclusão:** O Mainframe não é o passado. Ele é a espinha dorsal invisível da engenharia de missão crítica — e entendê-lo te transforma em um engenheiro muito mais rigoroso em qualquer outra stack.
    `
  },
  {
    id: 'dispatch-002',
    ref: 'LOG-002 // KERNEL ARCHITECTURE',
    date: '2026-09-24',
    readTime: '8 MIN READ',
    title: 'Construindo um Kernel x86 do Zero: Da BIOS ao Modo Protegido e Rust no_std',
    summary: 'O que acontece nos primeiros ciclos de clock após você pressionar o botão Power? Relato técnico de como projetei o MUNUX, um kernel educacional em C, Assembly e módulos críticos em Rust no_std.',
    tags: ['x86 Kernel', 'Assembly', 'Rust no_std', 'C99', 'Operating Systems'],
    content: `
### O silêncio antes do primeiro ciclo

Quando você liga o computador, a CPU não sabe o que é uma janela, um arquivo ou sequer memória virtual. Ela acorda em **Real Mode 16-bit**, comportando-se exatamente como o processador Intel 8086 de 1978.

Você tem acesso a apenas **1 MB de memória RAM**, sem proteção de memória, sem paginação e sem multitarefa. Se um ponteiro apontar para o endereço errado, a máquina simplesmente reinicia.

Foi para desmistificar essa caixa-preta que criei o projeto **MUNUX**.

---

### 1. O Bootloader de 512 bytes

O firmware da BIOS procura pelo primeiro setor do disco e verifica se os dois últimos bytes contêm a assinatura mágica \`0x55AA\`. Se contiver, ele copia esses 512 bytes para o endereço de memória \`0x7C00\` e pula a execução para lá.

Em Assembly NASM, as primeiras linhas do meu bootloader fazem o setup dos registradores de segmento e limpam as interrupções:

\`\`\`nasm
[BITS 16]
[ORG 0x7C00]

start:
    cli                     ; Desabilita interrupções externas
    xor ax, ax              ; Zera AX
    mov ds, ax              ; DS = 0x0000
    mov es, ax              ; ES = 0x0000
    mov ss, ax              ; Stack Segment = 0x0000
    mov sp, 0x7C00          ; Stack Pointer cresce para baixo a partir de 0x7C00
    sti                     ; Reabilita interrupções

    ; Habilita a linha A20 (para acessar além de 1MB de RAM)
    in al, 0x92
    or al, 2
    out 0x92, al
\`\`\`

---

### 2. Saltando para 32-bit Protected Mode

Para sair da limitação dos 16 bits, precisamos carregar a **GDT (Global Descriptor Table)**, que define os segmentos de código e dados da memória, e setar o bit PE (*Protection Enable*) no registrador de controle \`CR0\`:

\`\`\`nasm
    lgdt [gdt_descriptor]   ; Carrega ponteiro da GDT

    mov eax, cr0
    or eax, 0x1             ; Seta bit 0 (Protected Mode)
    mov cr0, eax

    jmp 0x08:init_pm        ; Salto longo (Far Jump) para limpar o pipeline de instruções!

[BITS 32]
init_pm:
    mov ax, 0x10            ; 0x10 = Seletor do segmento de dados na GDT
    mov ds, ax
    mov ss, ax
    mov es, ax
    mov esp, 0x90000        ; Novo topo da stack de 32 bits

    call kernel_main        ; Passa o bastão para nosso código em C / Rust!
\`\`\`

---

### 3. Rust em modo no_std no Kernel

A maior parte dos kernels antigos foi escrita puramente em C. No MUNUX, adotei uma estratégia híbrida: o setup de baixo nível e interrupções (IDT) em C e Assembly, e os subsistemas de manipulação de buffers e filas de mensagens em **Rust \`no_std\`**.

Sem a biblioteca padrão (\`std\`), não temos heap dinâmico nem alocador do sistema (\`malloc\` / \`Box\`), então cada estrutura precisa ter tamanho conhecido em tempo de compilação:

\`\`\`rust
#![no_std]
#![feature(core_intrinsics)]

use core::panic::PanicInfo;

#[panic_handler]
fn panic(_info: &PanicInfo) -> ! {
    // Escreve mensagem de pânico direto na memória de vídeo VGA (0xB8000)
    let vga_buffer = 0xB8000 as *mut u16;
    unsafe {
        *vga_buffer = 0x4F50; // 'P' vermelho brilhante
    }
    loop {}
}
\`\`\`

Construir um sistema operacional do zero muda completamente a sua relação com o software. Você para de ver o computador como uma entidade abstrata e passa a entender cada interrupção de relógio, cada chaveamento de contexto e cada linha de cache.
    `
  },
  {
    id: 'dispatch-003',
    ref: 'LOG-003 // DEFENSIVE & OFFENSIVE CYBER',
    date: '2026-08-11',
    readTime: '7 MIN READ',
    title: 'A Mentalidade Ofensiva na Engenharia de Baixo Nível: Lições do Top 2 no CTF da HackerSec',
    summary: 'Por que o melhor arquiteto de sistemas é aquele que sabe exatamente como quebrar binários. Como a experiência de resolver 100% dos desafios de um CTF nacional moldou minha visão de segurança defensiva.',
    tags: ['Pentest', 'Reverse Engineering', 'ELF Binaries', 'Memory Safety', 'CTF'],
    content: `
### Código defensivo não nasce de boas intenções; nasce do conhecimento do ataque

Na engenharia de software tradicional, segurança costuma ser tratada como um adendo: colocar um firewall, usar HTTPS e rodar um linter automatizado antes do deploy.

Porém, quando trabalhamos com linguagens compiladas nativas (C, C++, Assembly e até interoperabilidade FFI com Rust), os maiores perigos não estão em requisições HTTP maliciosas — estão na **gestão da memória, layout de stack frames e na forma como o compilador organiza as instruções no binário ELF**.

Atingir o **Top 2 Nacional com 100% de conclusão nos desafios do CTF da HackerSec** e obter a certificação **HCP V2 (HackerSec Certified Pentester)** não foi sobre "aprender ferramentas prontas". Foi sobre desmontar o software até o nível de instrução Assembly.

---

### 1. A anatomia de um Stack Buffer Overflow clássico

Considere uma função inocente em C:

\`\`\`c
void process_packet(const char *input) {
    char buffer[64];
    // PERIGO: strcpy não verifica limites de tamanho!
    strcpy(buffer, input);
}
\`\`\`

Na arquitetura x86_64, a pilha de execução armazena nesta ordem:
1. Variáveis locais (\`buffer\`)
2. Saved Frame Pointer (\`RBP\`)
3. **Endereço de Retorno (\`RIP\`)** — onde a CPU continuará a execução após a função terminar.

Se a entrada tiver 80 bytes em vez de 64, os últimos bytes sobrescrevem o registrador \`RIP\`. No mundo de CTF, o atacante manipula esse valor para forçar a CPU a saltar para uma cadeia de **ROP (Return-Oriented Programming)** ou para sua própria função não autorizada.

---

### 2. O que isso ensina ao engenheiro construtor?

Quando você passa madrugadas analisando binários no **GDB**, examinando registradores com \`x/20gx $rsp\` e identificando falhas de desalinhamento de ponteiros, você nunca mais escreve código de baixo nível da mesma forma:

* **Ponteiros e Slices:** Em Rust, o conceito de *ownership* e *borrow checker* elimina a maior parte das falhas de *use-after-free* e *buffer overflow* em tempo de compilação.
* **Isolamento de Processos via Seccomp:** Em daemons que rodam no Linux, usamos filtros \`seccomp\` para restringir quais syscalls o processo tem permissão de executar. Mesmo que um invasor obtenha execução de código, ele não consegue invocar \`execve\` para abrir um shell.
* **Princípio do Menor Privilégio:** Um processo de telemetria bare-metal nunca deve rodar como \`root\` a menos que precise interagir diretamente com registradores MSR de hardware — e mesmo assim, pode ter seus *capabilities* do Linux (\`CAP_SYS_RAWIO\`) restritos ao mínimo estrito.

---

### 3. A ponte entre Offensive e SRE / Resiliência

Segurança ofensiva e engenharia de confiabilidade (SRE) são dois lados da mesma moeda: ambas procuram os pontos cegos onde o sistema falha sob estresse não convencional.

Dominar as técnicas de ataque me tornou uma engenheira que não apenas constrói sistemas rápidos, mas sistemas que resistem a ataques adversariais e a condições extremas de ambiente.
    `
  }
];

/* ─── 4. View Controller (HUD & Modes) ─────────────────────────────────── */

function initViewController() {
  const btnDossier = document.getElementById('nav-btn-dossier');
  const btnCerts   = document.getElementById('nav-btn-certs');
  const btnBlog    = document.getElementById('nav-btn-blog');
  const btnBoard   = document.getElementById('nav-btn-board');
  const btnReturn  = document.getElementById('board-return-btn');
  const btnSfx     = document.getElementById('nav-btn-sfx');

  const viewDossier = document.getElementById('view-dossier');
  const viewBoard   = document.getElementById('view-board');

  function switchView(mode) {
    sfx.playRelay();
    if (mode === 'board') {
      viewDossier.classList.remove('active');
      viewBoard.classList.add('active');
      window.location.hash = '#board';
      document.body.classList.add('board-mode');
      if (typeof window.resumeBoardAnimation === 'function') {
        window.resumeBoardAnimation();
      }
    } else {
      viewBoard.classList.remove('active');
      viewDossier.classList.add('active');
      document.body.classList.remove('board-mode');
      if (typeof window.pauseBoardAnimation === 'function') {
        window.pauseBoardAnimation();
      }
    }
  }

  if (btnDossier) {
    btnDossier.addEventListener('click', () => {
      switchView('dossier');
      document.getElementById('sec-bio')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (btnCerts) {
    btnCerts.addEventListener('click', () => {
      switchView('dossier');
      document.getElementById('sec-certs')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (btnBlog) {
    btnBlog.addEventListener('click', () => {
      switchView('dossier');
      document.getElementById('sec-dispatches')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (btnBoard) {
    btnBoard.addEventListener('click', () => switchView('board'));
  }

  if (btnReturn) {
    btnReturn.addEventListener('click', () => switchView('dossier'));
  }

  if (btnSfx) {
    btnSfx.addEventListener('click', () => {
      const active = sfx.toggle();
      btnSfx.textContent = active ? '🔊 SFX: ON' : '🔈 SFX: OFF';
      btnSfx.classList.toggle('active', active);
    });
    btnSfx.textContent = sfx.enabled ? '🔊 SFX: ON' : '🔈 SFX: OFF';
    btnSfx.classList.toggle('active', sfx.enabled);
  }

  // Handle URL hash on load
  if (window.location.hash === '#board') {
    switchView('board');
  }
}

/* ─── 5. Render Certifications Vault ───────────────────────────────────── */

function renderCertifications() {
  const grid = document.getElementById('certs-grid');
  if (!grid) return;

  grid.innerHTML = CERTIFICATIONS.map((c, idx) => `
    <article class="cert-card" data-id="${c.id}" tabindex="0">
      <div class="cert-edge-pins" aria-hidden="true"></div>
      <header class="cert-head">
        <span class="cert-badge">${c.badge}</span>
        <span class="cert-hash">${c.hash}</span>
      </header>
      <div class="cert-body">
        <h3 class="cert-title">${c.title}</h3>
        <div class="cert-category">${c.category}</div>
        <p class="cert-summary">${c.summary}</p>
        <div class="cert-skills">
          ${c.skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}
        </div>
      </div>
      <footer class="cert-foot">
        <button class="btn-cert-inspect" data-id="${c.id}" type="button">▮ INSPECIONAR SPEC →</button>
        <span class="cert-status-led" title="Credencial Verificada"></span>
      </footer>
    </article>
  `).join('');

  grid.querySelectorAll('.btn-cert-inspect, .cert-card').forEach(el => {
    el.addEventListener('click', (e) => {
      const card = e.target.closest('.cert-card');
      if (!card) return;
      const cert = CERTIFICATIONS.find(item => item.id === card.dataset.id);
      if (cert) openCertModal(cert);
    });
  });
}

function openCertModal(cert) {
  sfx.playRelay();
  const modal = document.getElementById('cert-modal');
  if (!modal) return;

  document.getElementById('cm-title').textContent = cert.title;
  document.getElementById('cm-badge').textContent = cert.badge;
  document.getElementById('cm-hash').textContent = cert.hash;
  document.getElementById('cm-category').textContent = cert.category;
  document.getElementById('cm-summary').textContent = cert.summary;
  document.getElementById('cm-details').textContent = cert.details;
  
  const skillsContainer = document.getElementById('cm-skills');
  skillsContainer.innerHTML = cert.skills.map(s => `<span class="skill-tag">${s}</span>`).join('');

  const linkBtn = document.getElementById('cm-link');
  if (linkBtn) {
    linkBtn.href = cert.link;
  }

  modal.showModal();
}

/* ─── 6. Render Engineering Dispatches (Blog) ─────────────────────────── */

function renderDispatches() {
  const container = document.getElementById('dispatches-list');
  if (!container) return;

  container.innerHTML = DISPATCHES.map((d, idx) => `
    <article class="dispatch-card" id="${d.id}">
      <header class="dispatch-head">
        <div class="dispatch-meta">
          <span class="dispatch-ref">${d.ref}</span>
          <span class="dispatch-date">${d.date} · ${d.readTime}</span>
        </div>
        <h3 class="dispatch-title">${d.title}</h3>
        <p class="dispatch-summary">${d.summary}</p>
        <div class="dispatch-tags">
          ${d.tags.map(t => `<span class="dispatch-tag">#${t}</span>`).join('')}
        </div>
      </header>
      <div class="dispatch-actions">
        <button class="btn-read-dispatch" data-id="${d.id}" type="button">
          ▮ ABRIR LOG COMPLETO [EXPAND] →
        </button>
      </div>
    </article>
  `).join('');

  container.querySelectorAll('.btn-read-dispatch').forEach(btn => {
    btn.addEventListener('click', () => {
      const dispatch = DISPATCHES.find(item => item.id === btn.dataset.id);
      if (dispatch) openDispatchModal(dispatch);
    });
  });
}

function openDispatchModal(dispatch) {
  sfx.playRelay();
  const modal = document.getElementById('dispatch-modal');
  if (!modal) return;

  document.getElementById('dm-ref').textContent = dispatch.ref;
  document.getElementById('dm-date').textContent = `${dispatch.date} · ${dispatch.readTime}`;
  document.getElementById('dm-title').textContent = dispatch.title;

  // Simple Markdown parsing for headers, code blocks, bold, quotes
  const parsedContent = formatMarkdown(dispatch.content);
  document.getElementById('dm-body').innerHTML = parsedContent;

  modal.showModal();
}

function formatMarkdown(md) {
  let html = md.trim();

  // Code blocks ```lang ... ```
  html = html.replace(/```([a-z0-9_-]*)\n([\s\S]*?)```/gi, (match, lang, code) => {
    const escaped = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `<div class="code-block-wrapper"><div class="code-lang-label">${lang.toUpperCase() || 'CODE'}</div><pre class="code-block"><code>${escaped}</code></pre></div>`;
  });

  // Inline code `...`
  html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

  // Headers ###
  html = html.replace(/^### (.*$)/gim, '<h3 class="doc-h3">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="doc-h2">$1</h2>');

  // Blockquotes >
  html = html.replace(/^\> (.*$)/gim, '<blockquote class="doc-quote">$1</blockquote>');

  // Bold **...**
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // Paragraphs
  html = html.split('\n\n').map(p => {
    p = p.trim();
    if (!p) return '';
    if (p.startsWith('<h') || p.startsWith('<div') || p.startsWith('<blockquote') || p.startsWith('<pre')) {
      return p;
    }
    return `<p class="doc-p">${p.replace(/\n/g, '<br/>')}</p>`;
  }).join('\n');

  return html;
}

/* ─── 7. Mini Interactive CLI Terminal Emulator ────────────────────────── */

function initCliTerminal() {
  const cliInput  = document.getElementById('cli-input');
  const cliOutput = document.getElementById('cli-output');
  if (!cliInput || !cliOutput) return;

  const COMMANDS = {
    help: () => `
Comandos disponíveis no terminal MUNUX:
  [bio]         - Exibe o dossiê profissional de Munique Feitoza
  [certs]       - Lista as certificações e credenciais verificadas
  [blog]        - Lista os despachos técnicos e artigos de engenharia
  [read 1|2|3]  - Abre o despacho correspondente para leitura
  [pcb]         - Alterna para o modo de hardware interativo (Placa-mãe)
  [neofetch]    - Exibe o status da arquitetura do sistema
  [matrix]      - Executa sequência de rastreamento de pacotes
  [contact]     - Informações de contato e links diretos
  [clear]       - Limpa o terminal de comando
`,
    bio: () => `
OPERADOR: Munique Feitoza
PAPEL:    Software & Systems Engineer
FOCO:     Mainframe (IBM z/OS, COBOL, JCL) · Low-Level (Rust, C, Assembly) · Pentest (HCP V2) · SRE
RESUMO:   Engenheira solo e fundadora com histórico comprovado em sistemas de missão crítica,
          desenvolvimento de daemons bare-metal, testes de intrusão ofensivos (Top 2 CTF)
          e finalista global da NASA Space Apps 2025.
`,
    certs: () => CERTIFICATIONS.map((c, i) => `[${i+1}] ${c.title} (${c.issuer}, ${c.year}) -> ${c.hash}`).join('\n'),
    blog: () => DISPATCHES.map((d, i) => `[${i+1}] ${d.title} (${d.readTime})`).join('\n'),
    read: (arg) => {
      const idx = parseInt(arg, 10) - 1;
      if (DISPATCHES[idx]) {
        openDispatchModal(DISPATCHES[idx]);
        return `Abrindo despacho [${idx + 1}]: ${DISPATCHES[idx].title}...`;
      }
      return 'Uso: read 1, read 2 ou read 3';
    },
    pcb: () => {
      document.getElementById('nav-btn-board')?.click();
      return 'Chaveando barramento para CAMADA FÍSICA (PCB)...';
    },
    neofetch: () => `
   ___  __  __ _  _ _  _ _  _    OS:        MUNUX Bare-Metal 2.0
  |  \\/  ||  | || \\| || | || |   KERNEL:    Munux x86_64 / z/Architecture
  | |\\/| ||  |_|| .\` || |_|| |   UPTIME:    99.999%
  |_|  |_||____||_|\\_||____|_|   PACKAGES:  Rust, C99, COBOL, ASM, Python
                                 MEMORY:    64GB DDR5 ECC
                                 SECURITY:  HCP V2 / Top 2 CTF Nacional
                                 SPACE:     NASA Space Apps Global Finalist
`,
    matrix: () => {
      sfx.playBeep(1200, 0.15, 'square');
      return '01001101 01010101 01001110 01010101 01011000 // PACKET CAPTURE OK // LATENCY: 0.12ms';
    },
    contact: () => `
E-MAIL:   muniquefeitoz4@gmail.com
LINKEDIN: linkedin.com/in/munique-feitoza-77034b231/
GITHUB:   github.com/Munique-Feitoza
TEL:      +55 (21) 99408-9964
LOCAL:    Rio de Janeiro, RJ (Disponível para Remoto / Híbrido / Realocação)
`,
    clear: () => {
      cliOutput.innerHTML = '';
      return '';
    }
  };

  cliInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const raw = cliInput.value.trim();
      if (!raw) return;
      sfx.playClick();

      const [cmd, ...args] = raw.toLowerCase().split(/\s+/);
      const linePrompt = document.createElement('div');
      linePrompt.className = 'cli-line-prompt';
      linePrompt.innerHTML = `<span class="cli-ps1">munique@munux:~$</span> <span class="cli-user-cmd">${escapeHtml(raw)}</span>`;
      cliOutput.appendChild(linePrompt);

      let responseText = '';
      if (COMMANDS[cmd]) {
        responseText = COMMANDS[cmd](args.join(' '));
      } else {
        responseText = `Comando não reconhecido: "${cmd}". Digite 'help' para comandos.`;
      }

      if (responseText) {
        const lineResp = document.createElement('pre');
        lineResp.className = 'cli-line-resp';
        lineResp.textContent = responseText;
        cliOutput.appendChild(lineResp);
      }

      cliInput.value = '';
      cliOutput.scrollTop = cliOutput.scrollHeight;
    }
  });

  // Suggestion buttons
  document.querySelectorAll('.cli-chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.dataset.cmd;
      cliInput.value = cmd;
      cliInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    });
  });
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* ─── 8. Modal Close Buttons Setup ─────────────────────────────────────── */

function setupModalClosers() {
  ['cert-modal', 'dispatch-modal'].forEach(id => {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.querySelectorAll('.modal-close-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        sfx.playClick();
        modal.close();
      });
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        sfx.playClick();
        modal.close();
      }
    });
  });
}

/* ─── 9. DOM Ready Initialization ──────────────────────────────────────── */

function initDossier() {
  initViewController();
  renderCertifications();
  renderDispatches();
  initCliTerminal();
  setupModalClosers();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDossier);
} else {
  initDossier();
}
