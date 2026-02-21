// ===== Navegação mobile =====
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle?.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = menuToggle.querySelector('i');
    navLinks.classList.contains('active')
        ? icon.classList.replace('bx-menu', 'bx-x')
        : icon.classList.replace('bx-x', 'bx-menu');
});

// ===== Smooth scroll com efeito de clique nos links do nav =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const id = a.getAttribute('href');
        if (!id || id === '#') return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();

        // Efeito visual de clique
        a.classList.add('nav-clicked');
        setTimeout(() => a.classList.remove('nav-clicked'), 400);

        // Marca link ativo no nav
        document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active-link'));
        if (a.closest('.nav-links')) a.classList.add('active-link');

        // Scroll suave com easing
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        smoothScrollTo(top, 700);

        // Fecha menu mobile
        navLinks?.classList.remove('active');
        const icon = menuToggle?.querySelector('i');
        if (icon) {
            icon.classList.remove('bx-x');
            icon.classList.add('bx-menu');
        }
    });
});

// ===== Função de scroll suave com easing manual =====
function smoothScrollTo(targetY, duration) {
    const startY = window.pageYOffset;
    const distance = targetY - startY;
    let startTime = null;

    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function step(currentTime) {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        window.scrollTo(0, startY + distance * easeInOutCubic(progress));
        if (elapsed < duration) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
}

// ===== Marca link ativo ao rolar a página =====
const sections = document.querySelectorAll('section[id], div[id]');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (window.pageYOffset >= sectionTop) current = section.getAttribute('id');
    });
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active-link');
        if (link.getAttribute('href') === `#${current}`) link.classList.add('active-link');
    });
}, { passive: true });

// ===== Estado =====
let ctx = { profissional: null, wa: null, colecao: 'agendamentos' };
let agendamentoContexto = {
    nomeCliente: '',
    produtos: [],
    totalProdutos: 0,
    raclub: { status: 'nao' },
    servico: null
};

// ===== Constantes =====
const GOOGLE_REVIEW_URL = 'https://search.google.com/local/writereview?placeid=ChIJ0U-7l3sIqgARy3pnKRJHjBk';

const PRODUTOS = [
    { nome: "Pomada Líquida DA Force MEN", preco: 39.99 },
    { nome: "Leave-in", preco: 39.99 },
    { nome: "Tônico Capilar Dom Pelo", preco: 49.99 },
    { nome: "Balm Para Barba", preco: 39.99 },
    { nome: "Pomada Modeladora - Efeito Teia", preco: 34.99 },
    { nome: "Pomada Modeladora - Efeito Seco", preco: 34.99 },
];

const SERVICOS = [
    { nome: 'Selecionar...', valor: null, placeholder: true },
    { nome: 'Acabamento', valor: 20.00 },
    { nome: 'Maquina e Tesoura', valor: 40.00 },
    { nome: 'Corte Maquina', valor: 40.00 },
    { nome: 'Corte Tesoura', valor: 50.00 },
    { nome: 'Alisamento Americano', valor: 40.00 },
    { nome: 'Corte Infantil', valor: 50.00 },
    { nome: 'Blindado', valor: 60.00 },
    { nome: 'Corte + Barba + Alisamento Prime', valor: 150.00 },
    { nome: 'Corte e Escova', valor: 70.00 },
    { nome: 'Corte Fantasia', valor: 60.00 },
    { nome: 'Barba + Sobrancelha', valor: 55.00 },
    { nome: 'Corte + Barba + Sobrancelha', valor: 90.00 },
    { nome: 'Corte + Alisamento Prime', valor: 95.00 },
    { nome: 'Corte + Progressiva', valor: 115.00 },
    { nome: 'Corte + Sobrancelha', valor: 65.00 },
    { nome: 'Corte + Feminino', valor: 70.00 },
    { nome: 'Matizar', valor: 30.00 },
    { nome: 'Progressiva', valor: 70.00 },
    { nome: 'Taper Fade', valor: 40.00 },
    { nome: 'Navalhado', valor: 45.00 },
    { nome: 'Alisamento + Corte + Barba + Pigmentação + Sobrancelha', valor: 230.00 },
    { nome: 'Alisamento Prime + Corte + Pigmentação + Sobrancelha', valor: 175.00 },
    { nome: 'Alisamento Prime + Corte Maquina + Barba', valor: 140.00 },
    { nome: 'Alisamento Prime + Corte Tesoura', valor: 125.00 },
    { nome: 'Alisamento Prime + Corte Tesoura + Barba', valor: 160.00 },
    { nome: 'Alisamento Prime + Navalhado', valor: 120.00 },
    { nome: 'Alisamento Prime + Navalhado + Barba', valor: 145.00 },
    { nome: 'Aplicação de Coloração', valor: 45.00 },
    { nome: 'Barba + Acabamento', valor: 55.00 },
    { nome: 'Barba + Hidratação', valor: 55.00 },
    { nome: 'Barba + Pigmentação', valor: 60.00 },
    { nome: 'Barba + Limpeza de Pele', valor: 65.00 },
    { nome: 'Botox + Navalhado + Barba', valor: 110.00 },
    { nome: 'Botox Prime + Corte Maquina + Barba', valor: 120.00 },
    { nome: 'Botox Prime + Corte Tesoura + Barba', valor: 130.00 },
    { nome: 'Corte + Barba + Limpeza de Pele', valor: 120.00 },
    { nome: 'Corte + Barba', valor: 75.00 },
    { nome: 'Corte + Hidratação + Escova', valor: 65.00 },
    { nome: 'Corte + Alisamento Americano', valor: 75.00 },
    { nome: 'Corte + Alisamento Prime + Sobrancelha', valor: 130.00 },
    { nome: 'Corte + Barba + Alisamento Americano', valor: 100.00 },
    { nome: 'Corte + Barba + Botox Prime', valor: 120.00 },
    { nome: 'Corte + Barba + Sobrancelha + Botox Prime', valor: 160.00 },
    { nome: 'Corte + Barba + Limpeza de Pele + Sobrancelha + Pigmentação Capilar', valor: 145.00 },
    { nome: 'Corte + Botox + Sobrancelha', valor: 110.00 },
    { nome: 'Corte + Botox Prime', valor: 105.00 },
    { nome: 'Corte + Luzes', valor: 115.00 },
    { nome: 'Corte + Luzes + Sobrancelha', valor: 140.00 },
    { nome: 'Corte + Luzes + Progressiva', valor: 165.00 },
    { nome: 'Corte + Pigmentação + Barba', valor: 100.00 },
    { nome: 'Barba', valor: 40.00 },
    { nome: 'Sobrancelha', valor: 25.00 },
    { nome: 'Luzes', valor: 100.00 },
    { nome: 'Corte Sensorial', valor: null },
];

const toBRL = (n) => (Number(n) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// ===== Helpers de modal =====
function abrirModal(id) {
    const el = document.getElementById(id);
    if (el) { el.style.display = 'flex'; el.setAttribute('aria-hidden', 'false'); }
}
function fecharModal(id) {
    const el = document.getElementById(id);
    if (el) { el.style.display = 'none'; el.setAttribute('aria-hidden', 'true'); }
}
window.fecharModal = fecharModal;

// ===== Persistência (RA Club) =====
function salvarContextoSessao() {
    try {
        sessionStorage.setItem('agendamentoCtx', JSON.stringify(agendamentoContexto));
        sessionStorage.setItem('ctx', JSON.stringify(ctx));
    } catch { }
}
function restaurarContextoSessao() {
    try {
        const c1 = sessionStorage.getItem('agendamentoCtx');
        const c2 = sessionStorage.getItem('ctx');
        if (c1) agendamentoContexto = JSON.parse(c1);
        if (c2) ctx = JSON.parse(c2);
    } catch { }
}
function tentarRetomarPosCheckout() {
    const flag = sessionStorage.getItem('raclubCheckoutRedirect');
    if (flag === '1') {
        sessionStorage.removeItem('raclubCheckoutRedirect');
        restaurarContextoSessao();
        if (ctx?.colecao && ctx?.profissional) {
            agendamentoContexto.raclub = { status: 'assinar_link' };
            fecharModal('modalRAClub');
            abrirModalAgendamento();
        }
    }
}
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') tentarRetomarPosCheckout();
});

// ===== Fluxo Nome → Produtos → RA Club → Agendamento =====
const nomeClienteInput = document.getElementById('nomeCliente');
document.getElementById('btnClienteContinuar')?.addEventListener('click', () => {
    const nome = (nomeClienteInput.value || '').trim();
    if (!nome) { alert('Digite seu nome para continuar.'); return; }
    agendamentoContexto.nomeCliente = nome;
    fecharModal('modalCliente');
    abrirModalProdutos();
});

// Produtos
const produtosContainer = document.getElementById('produtosContainer');
const prodTotalSpan = document.getElementById('prodTotal');
const btnProdutosPular = document.getElementById('btnProdutosPular');
const btnProdutosContinuar = document.getElementById('btnProdutosContinuar');

function renderProdutos() {
    produtosContainer.innerHTML = '';
    PRODUTOS.forEach((p, i) => {
        const card = document.createElement('div');
        card.className = 'prod-card';
        card.dataset.index = i;
        card.innerHTML = `
            <div class="p-name">${p.nome}</div>
            <div class="p-price">${toBRL(p.preco)}</div>
            <small class="muted">Toque para selecionar</small>
        `;
        card.addEventListener('click', () => toggleProduto(i, card));
        produtosContainer.appendChild(card);
    });
}
function toggleProduto(index, cardEl) {
    const item = PRODUTOS[index];
    const exists = agendamentoContexto.produtos.find(pr => pr.nome === item.nome);
    if (exists) {
        agendamentoContexto.produtos = agendamentoContexto.produtos.filter(pr => pr.nome !== item.nome);
        cardEl.classList.remove('active');
    } else {
        agendamentoContexto.produtos.push({ nome: item.nome, preco: item.preco });
        cardEl.classList.add('active');
    }
    agendamentoContexto.totalProdutos = agendamentoContexto.produtos.reduce((s, it) => s + (it.preco || 0), 0);
    prodTotalSpan.textContent = toBRL(agendamentoContexto.totalProdutos);
}
function abrirModalProdutos() {
    agendamentoContexto.produtos = [];
    agendamentoContexto.totalProdutos = 0;
    prodTotalSpan.textContent = toBRL(0);
    renderProdutos();
    abrirModal('modalProdutos');
}
btnProdutosPular?.addEventListener('click', () => { fecharModal('modalProdutos'); abrirModalRAClub(); });
btnProdutosContinuar?.addEventListener('click', () => { fecharModal('modalProdutos'); abrirModalRAClub(); });

// RA Club
const btnRAJaMembro = document.getElementById('btnRAJaMembro');
const btnRANao = document.getElementById('btnRANao');
const btnRAAssinar = document.getElementById('btnRAAssinar');
function abrirModalRAClub() { abrirModal('modalRAClub'); }
btnRAJaMembro?.addEventListener('click', () => {
    agendamentoContexto.raclub = { status: 'membro' };
    fecharModal('modalRAClub');
    abrirModalAgendamento();
});
btnRANao?.addEventListener('click', () => {
    agendamentoContexto.raclub = { status: 'nao' };
    fecharModal('modalRAClub');
    abrirModalAgendamento();
});
if (btnRAAssinar) {
    const RA_CLUB_CHECKOUT_URL = btnRAAssinar.getAttribute('href') || '';
    btnRAAssinar.addEventListener('click', () => {
        agendamentoContexto.raclub = { status: 'assinar_link' };
        salvarContextoSessao();
        sessionStorage.setItem('raclubCheckoutRedirect', '1');
        if (!RA_CLUB_CHECKOUT_URL || RA_CLUB_CHECKOUT_URL === '#') {
            alert('Link de checkout não configurado.');
        }
    });
}

// Agendamento (data/hora)
const dataInput = document.getElementById('data');
const horaSelect = document.getElementById('hora');

function gerarIntervalos(inicio = '09:00', fim = '18:00', passoMin = 60) {
    const out = [];
    let [h, m] = inicio.split(':').map(Number);
    const [hF, mF] = fim.split(':').map(Number);
    while (h < hF || (h === hF && m <= mF)) {
        out.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
        m += passoMin;
        while (m >= 60) { m -= 60; h += 1; }
    }
    return out;
}
function fillHorasForProf() {
    const lista = gerarIntervalos('09:00', '18:00', 60);
    horaSelect.innerHTML = `<option value="">Selecione um horário</option>` +
        lista.map(h => `<option>${h}</option>`).join('');
}
function resetSelectVisual() {
    for (const opt of horaSelect.options) {
        if (!opt.value) continue;
        opt.disabled = false;
        opt.classList.remove('reservado');
    }
}
function abrirModalAgendamento() {
    const hoje = new Date();
    const y = hoje.getFullYear();
    const m = String(hoje.getMonth() + 1).padStart(2, "0");
    const d = String(hoje.getDate()).padStart(2, "0");
    dataInput.min = `${y}-${m}-${d}`;
    dataInput.value = "";
    fillHorasForProf();
    horaSelect.value = "";
    resetSelectVisual();
    const display = document.getElementById('servicoDisplay');
    display.value = agendamentoContexto.servico
        ? `${agendamentoContexto.servico.nome}${agendamentoContexto.servico.valor != null ? ' — ' + toBRL(agendamentoContexto.servico.valor) : ''}`
        : '';
    abrirModal('modal');
}

// Botões dos profissionais
document.querySelectorAll('.openModalBtn').forEach(btn => {
    btn.addEventListener('click', () => {
        ctx.profissional = btn.dataset.pro || 'Profissional';
        ctx.wa = btn.dataset.wa || '5521986020031';
        ctx.colecao = 'agendamentos';
        agendamentoContexto = {
            nomeCliente: '',
            produtos: [],
            totalProdutos: 0,
            raclub: { status: 'nao' },
            servico: null
        };
        if (nomeClienteInput) nomeClienteInput.value = '';
        salvarContextoSessao();
        abrirModal('modalCliente');
    });
});

// ===== Firebase =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getFirestore,
    doc, getDoc, setDoc, serverTimestamp,
    collection, query, where, getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
    getAuth, signInAnonymously, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDgaoVZK-5TF5xDFulLISridU9IXbmEYgg",
    authDomain: "barbearia-agenda-fe2a7.firebaseapp.com",
    projectId: "barbearia-agenda-fe2a7",
    storageBucket: "barbearia-agenda-fe2a7.firebasestorage.app",
    messagingSenderId: "876658896099",
    appId: "1:876658896099:web:6a361416ed84fd636f29d6",
    measurementId: "G-NJ4ETW1TNZ"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const auth = getAuth(app);
signInAnonymously(auth).catch((e) => console.error("Anon auth error:", e));
onAuthStateChanged(auth, (user) => console.log("Auth user:", user ? user.uid : null));

const confirmarBtn = document.getElementById('confirmarBtn');
const toKey = (ymd, hhmm, profSlug) => `ag_${ymd}_${hhmm}_${profSlug}`;
const normalizeHora = (h) => (h || "").padStart(5, "0");
const diaProfKey = (ymd, prof) => `${ymd}#${prof}`;
const profToSlug = (nome) =>
    (nome || 'barbeiro')
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .toLowerCase().replace(/\s+/g, '_');

async function getReservasByDate(ymd, profissional) {
    const slug = profToSlug(profissional);
    const q = query(
        collection(db, 'agendamentos'),
        where("diaProf", "==", diaProfKey(ymd, slug))
    );
    const snap = await getDocs(q);
    const horasOcupadas = new Set();
    snap.forEach(d => { if (d.data()?.hora) horasOcupadas.add(d.data().hora); });
    return horasOcupadas;
}

async function carregarIndisponiveis() {
    if (!dataInput?.value) return;
    resetSelectVisual();
    try {
        const horas = await getReservasByDate(dataInput.value, ctx.profissional);
        for (const opt of horaSelect.options) {
            if (!opt.value) continue;
            const ocupado = horas.has(opt.value);
            opt.disabled = ocupado;
            opt.classList.toggle('reservado', ocupado);
            if (ocupado && horaSelect.value === opt.value) horaSelect.value = '';
        }
    } catch (e) {
        console.error("Erro ao carregar horários:", e);
        alert("Não foi possível consultar os horários agora. Tente novamente.");
    }
}
dataInput?.addEventListener('change', carregarIndisponiveis);

// ===== Modal de Serviço =====
const servicoDisplay = document.getElementById('servicoDisplay');
const servicoLista = document.getElementById('servicoLista');
const servicoCancelar = document.getElementById('servicoCancelar');
const servicoConfirmarWpp = document.getElementById('servicoConfirmarWpp');
const svcSearch = document.getElementById('svcSearch');
let svcFilterText = "";
const norm = (s) => (s || "").normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

function getFilteredServicos() {
    const base = SERVICOS.slice(1);
    if (!svcFilterText.trim()) return [SERVICOS[0], ...base];
    const f = norm(svcFilterText);
    return [SERVICOS[0], ...base.filter(s => norm(s.nome).includes(f))];
}
function renderListaServicos() {
    const items = getFilteredServicos();
    servicoLista.innerHTML = items.map((s) => {
        const checked = agendamentoContexto.servico
            ? (agendamentoContexto.servico.nome === s.nome ? 'checked' : '')
            : (s.placeholder ? 'checked' : '');
        const sub = s.placeholder
            ? ''
            : `<div class="svc-muted">${s.valor != null ? toBRL(s.valor) : 'Valor a consultar'}</div>`;
        return `
            <label class="svc-row" data-nome="${s.nome}">
                <div class="svc-left">
                    <div class="svc-name">${s.nome}</div>${sub}
                </div>
                <input class="svc-radio" type="radio" name="svc" value="${s.nome}" ${checked} />
            </label>`;
    }).join('');
    servicoLista.querySelectorAll('.svc-row').forEach(row => {
        row.addEventListener('click', () => {
            const radio = row.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
        });
    });
}
function abrirServico() {
    svcFilterText = "";
    if (svcSearch) svcSearch.value = "";
    renderListaServicos();
    abrirModal('servicoModal');
}
servicoDisplay?.addEventListener('click', abrirServico);
servicoCancelar?.addEventListener('click', () => fecharModal('servicoModal'));
svcSearch?.addEventListener('input', (e) => { svcFilterText = e.target.value || ""; renderListaServicos(); });

servicoConfirmarWpp?.addEventListener('click', () => {
    const sel = servicoLista.querySelector('input[name="svc"]:checked');
    if (!sel) { alert('Selecione um serviço.'); return; }
    const s = SERVICOS.find(x => x.nome === sel.value);
    if (!s || s.placeholder) { alert('Selecione um serviço válido.'); return; }
    agendamentoContexto.servico = { nome: s.nome, valor: s.valor };
    servicoDisplay.value = s.valor != null ? `${s.nome} — ${toBRL(s.valor)}` : `${s.nome} — Valor a consultar`;
    fecharModal('servicoModal');
});

// ===== Confirmar agendamento =====
confirmarBtn?.addEventListener('click', async () => {
    const data = dataInput?.value;
    const hora = horaSelect?.value;
    if (!data || !hora) { alert("Selecione data e horário."); return; }
    if (!agendamentoContexto.servico) { alert("Selecione o serviço."); abrirServico(); return; }
    if (!ctx.wa) { alert("Profissional não definido."); return; }

    confirmarBtn.disabled = true;
    const originalText = confirmarBtn.textContent;
    confirmarBtn.textContent = "Reservando...";

    try {
        const hhmm = normalizeHora(hora);
        const profSlug = profToSlug(ctx.profissional);
        const ref = doc(db, 'agendamentos', toKey(data, hhmm, profSlug));

        const checkSnap = await getDoc(ref);
        if (checkSnap.exists()) {
            await carregarIndisponiveis();
            alert("Este horário já foi reservado. Por favor, escolha outro.");
            return;
        }

        const isRaClub = agendamentoContexto?.raclub?.status === 'membro';

        await setDoc(ref, {
            dataISO: data,
            hora: hhmm,
            profissional: profSlug,
            diaProf: diaProfKey(data, profSlug),
            barbeiroNome: ctx.profissional,
            clienteNome: agendamentoContexto.nomeCliente || null,
            cliente: agendamentoContexto.nomeCliente || null,
            servico: agendamentoContexto.servico?.nome || null,
            valor: agendamentoContexto.servico?.valor ?? 0,
            servicoNome: agendamentoContexto.servico?.nome || null,
            servicoValor: agendamentoContexto.servico?.valor ?? null,
            produtos: agendamentoContexto.produtos || [],
            totalProdutos: agendamentoContexto.totalProdutos || 0,
            raclub: agendamentoContexto.raclub || { status: 'nao' },
            raclubMembro: isRaClub,
            clienteTipo: isRaClub ? 'raclub' : 'cliente',
            tags: isRaClub ? ['raclub'] : [],
            bloqueado: false,
            pagamentoForma: "",
            createdAt: serverTimestamp()
        });

        try { await carregarIndisponiveis(); } catch (e) { console.warn("Falhou recarregar indisponíveis:", e); }

        const dataBR = new Date(`${data}T00:00:00`).toLocaleDateString('pt-BR');
        const servicoTxt = agendamentoContexto.servico
            ? `Serviço: ${agendamentoContexto.servico.nome}${agendamentoContexto.servico.valor != null ? ' (' + toBRL(agendamentoContexto.servico.valor) + ')' : ''}\n`
            : '';

        let produtosTxt = "Sem produtos adicionais";
        if (agendamentoContexto.produtos.length) {
            const list = agendamentoContexto.produtos.map(p => `${p.nome} (${toBRL(p.preco)})`).join(', ');
            produtosTxt = `Produtos: ${list} | Total: ${toBRL(agendamentoContexto.totalProdutos)}`;
        }

        let raclubTxt = "RA Club: Não";
        if (agendamentoContexto.raclub.status === 'membro') raclubTxt = "RA Club: Já sou membro ✅";
        else if (agendamentoContexto.raclub.status === 'assinar_link') raclubTxt = "RA Club: Quero assinar (via link)";

        const mensagem =
            `Olá! Sou ${agendamentoContexto.nomeCliente}${isRaClub ? " (RA Club ✅)" : ""}.
Agendamento Confirmado com ${ctx.profissional} para o dia ${dataBR} às ${hhmm}.
${servicoTxt}${produtosTxt}
${raclubTxt}`;

        const url = `https://wa.me/${ctx.wa}?text=${encodeURIComponent(mensagem)}`;
        window.open(url, "_blank");

        fecharModal('modal');
        const reviewBtn = document.getElementById('btnAvaliarGoogle');
        if (reviewBtn) reviewBtn.href = GOOGLE_REVIEW_URL;
        setTimeout(() => abrirModal('modalAvaliacao'), 400);

    } catch (err) {
        console.error("[RESERVA]", err);
        alert("Não foi possível concluir a reserva. Tente novamente.");
    } finally {
        confirmarBtn.disabled = false;
        confirmarBtn.textContent = originalText || "Agendar";
    }
});

// Fechar modal clicando fora
window.addEventListener('click', (e) => {
    document.querySelectorAll('.modal').forEach(m => {
        if (e.target === m) fecharModal(m.id);
    });
});

tentarRetomarPosCheckout();