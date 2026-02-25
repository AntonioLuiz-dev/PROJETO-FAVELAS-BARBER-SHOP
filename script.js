// ===== CONFIGURAÇÃO GOOGLE CALENDAR API =====
const GOOGLE_CONFIG = {
    // ⚠️ SUBSTITUA ESTAS INFORMAÇÕES APÓS CONFIGURAR NO GOOGLE CLOUD CONSOLE
    API_KEY: 'SUA_API_KEY_AQUI',
    CLIENT_ID: 'SEU_CLIENT_ID_AQUI.apps.googleusercontent.com',
    CALENDAR_ID: 'primary', // ou ID específico do calendário
    DISCOVERY_DOCS: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
    SCOPES: 'https://www.googleapis.com/auth/calendar.events'
};

// Estado da autenticação
let gapiInited = false;
let gisInited = false;
let tokenClient = null;
let isSignedIn = false;

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

// ===== Smooth scroll =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const id = a.getAttribute('href');
        if (!id || id === '#') return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();

        a.classList.add('nav-clicked');
        setTimeout(() => a.classList.remove('nav-clicked'), 400);

        document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active-link'));
        if (a.closest('.nav-links')) a.classList.add('active-link');

        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        smoothScrollTo(top, 700);

        navLinks?.classList.remove('active');
        const icon = menuToggle?.querySelector('i');
        if (icon) {
            icon.classList.remove('bx-x');
            icon.classList.add('bx-menu');
        }
    });
});

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

// ===== Marca link ativo ao rolar =====
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
let ctx = { profissional: null, wa: null };
let agendamentoContexto = {
    nomeCliente: '',
    email: '', // NOVO: para enviar convite
    produtos: [],
    totalProdutos: 0,
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
    { nome: 'Acabamento', valor: 20.00, duracao: 30 },
    { nome: 'Barba', valor: 40.00, duracao: 30 },
    { nome: 'Corte + Barba', valor: 75.00, duracao: 60 },
    { nome: 'Corte Maquina', valor: 40.00, duracao: 45 },
    { nome: 'Corte Tesoura', valor: 50.00, duracao: 60 },
    { nome: 'Corte Infantil', valor: 50.00, duracao: 45 },
    { nome: 'Sobrancelha', valor: 25.00, duracao: 15 },
    { nome: 'Luzes', valor: 100.00, duracao: 120 },
    // ... resto dos serviços com duração estimada em minutos
];

const toBRL = (n) => (Number(n) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// ===== Helpers de modal =====
function abrirModal(id) {
    const el = document.getElementById(id);
    if (el) { 
        el.style.display = 'flex'; 
        el.removeAttribute('aria-hidden');
        
        setTimeout(() => {
            const focusable = el.querySelector('input, button, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (focusable) focusable.focus();
        }, 100);
    }
}

function fecharModal(id) {
    const el = document.getElementById(id);
    if (el) { 
        el.style.display = 'none'; 
        el.setAttribute('aria-hidden', 'true'); 
    }
}
window.fecharModal = fecharModal;

// ===== GOOGLE CALENDAR API - INICIALIZAÇÃO =====

// Carrega a biblioteca GAPI
function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}

async function initializeGapiClient() {
    try {
        await gapi.client.init({
            apiKey: GOOGLE_CONFIG.API_KEY,
            discoveryDocs: GOOGLE_CONFIG.DISCOVERY_DOCS,
        });
        gapiInited = true;
        console.log('✅ Google Calendar API iniciada');
        maybeEnableButtons();
    } catch (error) {
        console.error('❌ Erro ao inicializar GAPI:', error);
    }
}

// Carrega a biblioteca GIS
function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CONFIG.CLIENT_ID,
        scope: GOOGLE_CONFIG.SCOPES,
        callback: '', // definido em tempo de execução
    });
    gisInited = true;
    console.log('✅ Google Identity Services iniciado');
    maybeEnableButtons();
}

function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        console.log('✅ Sistema pronto para agendamentos');
    }
}

// Autenticar com Google (chamado automaticamente quando necessário)
function handleAuthClick() {
    return new Promise((resolve, reject) => {
        tokenClient.callback = async (resp) => {
            if (resp.error !== undefined) {
                reject(resp);
                return;
            }
            isSignedIn = true;
            console.log('✅ Autenticado com Google');
            resolve();
        };

        if (gapi.client.getToken() === null) {
            tokenClient.requestAccessToken({ prompt: 'consent' });
        } else {
            tokenClient.requestAccessToken({ prompt: '' });
        }
    });
}

// ===== GOOGLE CALENDAR API - FUNÇÕES =====

/**
 * Busca eventos ocupados para uma data específica
 */
async function buscarHorariosOcupados(data, profissional) {
    if (!isSignedIn) {
        await handleAuthClick();
    }

    try {
        const dataObj = new Date(data + 'T00:00:00');
        const timeMin = new Date(dataObj);
        timeMin.setHours(9, 0, 0, 0); // Início: 9h
        
        const timeMax = new Date(dataObj);
        timeMax.setHours(22, 0, 0, 0); // Fim: 22h

        const response = await gapi.client.calendar.events.list({
            calendarId: GOOGLE_CONFIG.CALENDAR_ID,
            timeMin: timeMin.toISOString(),
            timeMax: timeMax.toISOString(),
            showDeleted: false,
            singleEvents: true,
            orderBy: 'startTime',
        });

        const events = response.result.items || [];
        const horariosOcupados = new Set();

        events.forEach(event => {
            if (event.start.dateTime) {
                const startTime = new Date(event.start.dateTime);
                const hora = `${String(startTime.getHours()).padStart(2, '0')}:${String(startTime.getMinutes()).padStart(2, '0')}`;
                horariosOcupados.add(hora);
            }
        });

        console.log('📅 Horários ocupados:', Array.from(horariosOcupados));
        return horariosOcupados;

    } catch (error) {
        console.error('❌ Erro ao buscar eventos:', error);
        alert('Erro ao consultar agenda. Por favor, tente novamente.');
        return new Set();
    }
}

/**
 * Cria evento no Google Calendar
 */
async function criarEventoCalendar(data, hora, nomeCliente, email, servico, produtos, total, telefone) {
    if (!isSignedIn) {
        await handleAuthClick();
    }

    try {
        // Monta data/hora de início
        const [horaNum, minNum] = hora.split(':').map(Number);
        const startDateTime = new Date(data + 'T00:00:00');
        startDateTime.setHours(horaNum, minNum, 0, 0);

        // Calcula duração (padrão 60 min)
        const duracao = servico.duracao || 60;
        const endDateTime = new Date(startDateTime);
        endDateTime.setMinutes(endDateTime.getMinutes() + duracao);

        // Monta descrição
        let descricao = `Cliente: ${nomeCliente}\n`;
        descricao += `Telefone: ${telefone}\n`;
        descricao += `\nServiço: ${servico.nome}`;
        if (servico.valor) {
            descricao += ` - ${toBRL(servico.valor)}`;
        }
        
        if (produtos.length > 0) {
            descricao += `\n\nProdutos:\n`;
            produtos.forEach(p => {
                descricao += `• ${p.nome} - ${toBRL(p.preco)}\n`;
            });
        }
        
        if (total > 0) {
            descricao += `\n💰 TOTAL: ${toBRL(total)}`;
        }

        descricao += `\n\n✂️ Agendamento via site Favela's Barber Shop`;

        // Cria o evento
        const event = {
            summary: `${servico.nome} - ${nomeCliente}`,
            description: descricao,
            start: {
                dateTime: startDateTime.toISOString(),
                timeZone: 'America/Sao_Paulo',
            },
            end: {
                dateTime: endDateTime.toISOString(),
                timeZone: 'America/Sao_Paulo',
            },
            attendees: email ? [{ email: email }] : [],
            reminders: {
                useDefault: false,
                overrides: [
                    { method: 'popup', minutes: 24 * 60 }, // 1 dia antes
                    { method: 'popup', minutes: 60 },      // 1 hora antes
                ],
            },
            colorId: '2', // Verde
        };

        const request = await gapi.client.calendar.events.insert({
            calendarId: GOOGLE_CONFIG.CALENDAR_ID,
            resource: event,
            sendUpdates: 'all', // Envia convite por email
        });

        console.log('✅ Evento criado:', request.result);
        return request.result;

    } catch (error) {
        console.error('❌ Erro ao criar evento:', error);
        throw error;
    }
}

// ===== FLUXO DE AGENDAMENTO =====

// 1️⃣ Modal Nome + Email
const nomeClienteInput = document.getElementById('nomeCliente');
const emailClienteInput = document.getElementById('emailCliente'); // NOVO campo no HTML

document.getElementById('btnClienteContinuar')?.addEventListener('click', () => {
    const nome = (nomeClienteInput.value || '').trim();
    const email = (emailClienteInput?.value || '').trim();
    
    if (!nome) { 
        alert('Por favor, digite seu nome para continuar.'); 
        nomeClienteInput.focus();
        return; 
    }
    
    agendamentoContexto.nomeCliente = nome;
    agendamentoContexto.email = email;
    fecharModal('modalCliente');
    abrirModalServico();
});

// 2️⃣ Modal Serviço (mesmo código anterior)
const servicoDisplay = document.getElementById('servicoDisplay');
const servicoLista = document.getElementById('servicoLista');
const servicoCancelar = document.getElementById('servicoCancelar');
const servicoConfirmarWpp = document.getElementById('servicoConfirmarWpp');
const svcSearch = document.getElementById('svcSearch');
let svcFilterText = "";
const norm = (s) => (s || "").normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

function getFilteredServicos() {
    const base = SERVICOS.slice(1);
    if (!svcFilterText.trim()) return base;
    const f = norm(svcFilterText);
    return base.filter(s => norm(s.nome).includes(f));
}

function renderListaServicos() {
    const items = getFilteredServicos();
    
    if (items.length === 0) {
        servicoLista.innerHTML = '<div style="padding: 20px; text-align: center; color: #999;">Nenhum serviço encontrado</div>';
        return;
    }
    
    servicoLista.innerHTML = items.map((s) => {
        const checked = agendamentoContexto.servico?.nome === s.nome ? 'checked' : '';
        const sub = `<div class="svc-muted">${s.valor != null ? toBRL(s.valor) : 'Valor a consultar'}</div>`;
        
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

function abrirModalServico() {
    svcFilterText = "";
    if (svcSearch) svcSearch.value = "";
    renderListaServicos();
    abrirModal('servicoModal');
}

servicoDisplay?.addEventListener('click', abrirModalServico);
servicoCancelar?.addEventListener('click', () => fecharModal('servicoModal'));
svcSearch?.addEventListener('input', (e) => { svcFilterText = e.target.value || ""; renderListaServicos(); });

servicoConfirmarWpp?.addEventListener('click', () => {
    const sel = servicoLista.querySelector('input[name="svc"]:checked');
    if (!sel) { 
        alert('Por favor, selecione um serviço.'); 
        return; 
    }
    
    const s = SERVICOS.find(x => x.nome === sel.value);
    if (!s || s.placeholder) { 
        alert('Por favor, selecione um serviço válido.'); 
        return; 
    }
    
    agendamentoContexto.servico = { ...s };
    
    if (servicoDisplay) {
        servicoDisplay.value = s.valor != null 
            ? `${s.nome} — ${toBRL(s.valor)}` 
            : `${s.nome} — Valor a consultar`;
    }
    
    fecharModal('servicoModal');
    abrirModalProdutos();
});

// 3️⃣ Modal Produtos (mesmo código anterior)
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
        
        const jaSelecionado = agendamentoContexto.produtos.some(pr => pr.nome === p.nome);
        if (jaSelecionado) card.classList.add('active');
        
        card.innerHTML = `
            <div class="p-name">${p.nome}</div>
            <div class="p-price">${toBRL(p.preco)}</div>
            <small class="muted">Toque para ${jaSelecionado ? 'remover' : 'selecionar'}</small>
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
        cardEl.querySelector('.muted').textContent = 'Toque para selecionar';
    } else {
        agendamentoContexto.produtos.push({ nome: item.nome, preco: item.preco });
        cardEl.classList.add('active');
        cardEl.querySelector('.muted').textContent = 'Toque para remover';
    }
    
    agendamentoContexto.totalProdutos = agendamentoContexto.produtos.reduce((s, it) => s + (it.preco || 0), 0);
    prodTotalSpan.textContent = toBRL(agendamentoContexto.totalProdutos);
}

function abrirModalProdutos() {
    const totalAtual = agendamentoContexto.produtos.reduce((s, it) => s + (it.preco || 0), 0);
    agendamentoContexto.totalProdutos = totalAtual;
    prodTotalSpan.textContent = toBRL(totalAtual);
    renderProdutos();
    abrirModal('modalProdutos');
}

btnProdutosPular?.addEventListener('click', () => { 
    agendamentoContexto.produtos = [];
    agendamentoContexto.totalProdutos = 0;
    fecharModal('modalProdutos'); 
    abrirModalAgendamento();
});

btnProdutosContinuar?.addEventListener('click', () => { 
    fecharModal('modalProdutos'); 
    abrirModalAgendamento();
});

// 4️⃣ Modal Agendamento COM GOOGLE CALENDAR
const dataInput = document.getElementById('data');
const horaSelect = document.getElementById('hora');

function gerarIntervalos(inicio = '09:00', fim = '22:00', passoMin = 60) {
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
    const lista = gerarIntervalos('09:00', '22:00', 60);
    horaSelect.innerHTML = `<option value="">Selecione um horário</option>` +
        lista.map(h => `<option>${h}</option>`).join('');
}

async function carregarHorariosDisponiveis() {
    if (!dataInput?.value || !ctx.profissional) {
        console.log("⚠️ Data ou profissional não definidos");
        return;
    }
    
    console.log("🔍 Consultando Google Calendar...");
    horaSelect.disabled = true;
    horaSelect.innerHTML = '<option value="">Carregando...</option>';
    
    try {
        // Busca no Google Calendar
        const ocupados = await buscarHorariosOcupados(dataInput.value, ctx.profissional);
        
        // Regenera lista completa
        fillHorasForProf();
        
        // Marca ocupados
        let totalOcupados = 0;
        for (const opt of horaSelect.options) {
            if (!opt.value) continue;
            
            if (ocupados.has(opt.value)) {
                opt.disabled = true;
                opt.classList.add('reservado');
                opt.style.color = '#999';
                opt.textContent = `${opt.value} - Ocupado`;
                totalOcupados++;
            }
        }
        
        horaSelect.disabled = false;
        console.log(`✅ ${totalOcupados} horário(s) ocupado(s)`);
        
    } catch (error) {
        console.error('❌ Erro:', error);
        fillHorasForProf();
        horaSelect.disabled = false;
        alert('Não foi possível carregar os horários. Tente novamente.');
    }
}

dataInput?.addEventListener('change', carregarHorariosDisponiveis);

function getDataMinima() {
    const hoje = new Date();
    const horaAtual = hoje.getHours();
    
    if (horaAtual >= 20) {
        hoje.setDate(hoje.getDate() + 1);
    }
    
    const y = hoje.getFullYear();
    const m = String(hoje.getMonth() + 1).padStart(2, "0");
    const d = String(hoje.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

function abrirModalAgendamento() {
    dataInput.min = getDataMinima();
    dataInput.value = "";
    fillHorasForProf();
    horaSelect.value = "";
    
    const display = document.getElementById('servicoDisplay');
    if (display && agendamentoContexto.servico) {
        display.value = agendamentoContexto.servico.valor != null
            ? `${agendamentoContexto.servico.nome} — ${toBRL(agendamentoContexto.servico.valor)}`
            : `${agendamentoContexto.servico.nome} — Valor a consultar`;
    }
    
    abrirModal('modal');
}

// Botões dos profissionais
document.querySelectorAll('.openModalBtn').forEach(btn => {
    btn.addEventListener('click', () => {
        ctx.profissional = btn.dataset.pro || 'Thiago';
        ctx.wa = btn.dataset.wa || '5521986020031';
        
        agendamentoContexto = {
            nomeCliente: '',
            email: '',
            produtos: [],
            totalProdutos: 0,
            servico: null
        };
        
        if (nomeClienteInput) nomeClienteInput.value = '';
        if (emailClienteInput) emailClienteInput.value = '';
        if (servicoDisplay) servicoDisplay.value = '';
        
        abrirModal('modalCliente');
    });
});

// ===== Confirmar agendamento COM GOOGLE CALENDAR =====
const confirmarBtn = document.getElementById('confirmarBtn');

confirmarBtn?.addEventListener('click', async () => {
    const data = dataInput?.value;
    const hora = horaSelect?.value;
    
    if (!data || !hora) { 
        alert("Por favor, selecione data e horário."); 
        return; 
    }
    
    if (!agendamentoContexto.servico) { 
        alert("Por favor, selecione o serviço primeiro."); 
        fecharModal('modal');
        abrirModalServico();
        return; 
    }
    
    if (!agendamentoContexto.nomeCliente) {
        alert("Nome do cliente não informado.");
        return;
    }
    
    confirmarBtn.disabled = true;
    const originalText = confirmarBtn.textContent;
    confirmarBtn.textContent = "Agendando...";

    try {
        // Calcula total
        const totalServico = agendamentoContexto.servico.valor || 0;
        const totalGeral = totalServico + agendamentoContexto.totalProdutos;
        
        // CRIA EVENTO NO GOOGLE CALENDAR
        await criarEventoCalendar(
            data,
            hora,
            agendamentoContexto.nomeCliente,
            agendamentoContexto.email,
            agendamentoContexto.servico,
            agendamentoContexto.produtos,
            totalGeral,
            ctx.wa
        );

        // Formata data
        const dataBR = new Date(`${data}T00:00:00`).toLocaleDateString('pt-BR', { 
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });

        // Monta mensagem WhatsApp
        let mensagem = `✅ *AGENDAMENTO CONFIRMADO* 🎉\n\n`;
        mensagem += `━━━━━━━━━━━━━━━━━━━━\n`;
        mensagem += `👤 *Cliente:* ${agendamentoContexto.nomeCliente}\n`;
        mensagem += `━━━━━━━━━━━━━━━━━━━━\n\n`;
        mensagem += `📅 *Data:* ${dataBR}\n`;
        mensagem += `🕐 *Horário:* ${hora}\n`;
        mensagem += `💈 *Profissional:* ${ctx.profissional}\n\n`;
        mensagem += `✂️ *SERVIÇO*\n${agendamentoContexto.servico.nome}\n`;
        
        if (agendamentoContexto.servico.valor != null) {
            mensagem += `💰 Valor: ${toBRL(agendamentoContexto.servico.valor)}\n`;
        }
        
        if (agendamentoContexto.produtos.length > 0) {
            mensagem += `\n🛍️ *PRODUTOS*\n`;
            agendamentoContexto.produtos.forEach(p => {
                mensagem += `   • ${p.nome} - ${toBRL(p.preco)}\n`;
            });
            mensagem += `\n💳 *Subtotal Produtos:* ${toBRL(agendamentoContexto.totalProdutos)}\n`;
        }
        
        if (totalGeral > 0) {
            mensagem += `\n━━━━━━━━━━━━━━━━━━━━\n`;
            mensagem += `💵 *TOTAL:* ${toBRL(totalGeral)}\n`;
            mensagem += `━━━━━━━━━━━━━━━━━━━━\n`;
        }
        
        mensagem += `\n✅ *Agendamento confirmado automaticamente*\n`;
        mensagem += `📧 Você receberá um convite por email\n`;
        mensagem += `📱 O evento já está na sua agenda Google\n`;
        mensagem += `\n📍 R. das Árvores - Fragoso, Magé - RJ\n`;
        mensagem += `\n_Agendamento via site Favela's Barber Shop_`;

        // Abre WhatsApp
        const url = `https://wa.me/${ctx.wa}?text=${encodeURIComponent(mensagem)}`;
        window.open(url, "_blank");

        fecharModal('modal');
        
        alert(`✅ AGENDAMENTO CONFIRMADO!\n\n📅 ${dataBR}\n🕐 ${hora}\n\n✉️ Você receberá um convite por email.\n📱 O evento já está no Google Calendar!`);
        
        const reviewBtn = document.getElementById('btnAvaliarGoogle');
        if (reviewBtn) reviewBtn.href = GOOGLE_REVIEW_URL;
        setTimeout(() => abrirModal('modalAvaliacao'), 400);

        console.log("✅ Agendamento confirmado!");

    } catch (err) {
        console.error("[ERRO]", err);
        alert("Não foi possível confirmar o agendamento. Verifique sua conexão e tente novamente.");
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

// ===== Carrega APIs do Google =====
window.gapiLoaded = gapiLoaded;
window.gisLoaded = gisLoaded;

console.log("✅ Sistema carregado - Aguardando Google APIs...");