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
let ctx = { profissional: null, wa: null };
let agendamentoContexto = {
    nomeCliente: '',
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

// ===== Fluxo: Nome → Serviço → Produtos → RA Club → Agendamento =====

// 1️⃣ Modal Nome
const nomeClienteInput = document.getElementById('nomeCliente');
document.getElementById('btnClienteContinuar')?.addEventListener('click', () => {
    const nome = (nomeClienteInput.value || '').trim();
    if (!nome) { 
        alert('Por favor, digite seu nome para continuar.'); 
        nomeClienteInput.focus();
        return; 
    }
    agendamentoContexto.nomeCliente = nome;
    fecharModal('modalCliente');
    abrirModalServico();
});

// 2️⃣ Modal Serviço
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

servicoCancelar?.addEventListener('click', () => {
    if (!agendamentoContexto.servico) {
        fecharModal('servicoModal');
        alert('É necessário selecionar um serviço para continuar.');
        return;
    }
    fecharModal('servicoModal');
});

svcSearch?.addEventListener('input', (e) => { 
    svcFilterText = e.target.value || ""; 
    renderListaServicos(); 
});

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
    
    agendamentoContexto.servico = { nome: s.nome, valor: s.valor };
    
    if (servicoDisplay) {
        servicoDisplay.value = s.valor != null 
            ? `${s.nome} — ${toBRL(s.valor)}` 
            : `${s.nome} — Valor a consultar`;
    }
    
    fecharModal('servicoModal');
    abrirModalProdutos();
});

// 3️⃣ Modal Produtos
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
    abrirModalAgendamento(); // Vai direto para agendamento
});

btnProdutosContinuar?.addEventListener('click', () => { 
    fecharModal('modalProdutos'); 
    abrirModalAgendamento(); // Vai direto para agendamento
});

// 4️⃣ Modal RA Club - REMOVIDO (não é mais usado)

// 5️⃣ Modal Agendamento (data/hora) + Controle de Horários
const dataInput = document.getElementById('data');
const horaSelect = document.getElementById('hora');

// ===== SISTEMA DE CONTROLE DE HORÁRIOS (LocalStorage) =====
const STORAGE_KEY = 'barbearia_agendamentos';

// Salvar agendamento no localStorage
function salvarAgendamento(data, hora, profissional, clienteNome, servico) {
    try {
        const agendamentos = getAgendamentos();
        const key = `${data}_${hora}_${profissional}`;
        
        agendamentos[key] = {
            data,
            hora,
            profissional,
            clienteNome,
            servico,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(agendamentos));
        console.log("✅ Agendamento salvo localmente:", key);
        return true;
    } catch (error) {
        console.error("❌ Erro ao salvar agendamento:", error);
        return false;
    }
}

// Buscar todos os agendamentos
function getAgendamentos() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : {};
    } catch (error) {
        console.error("❌ Erro ao ler agendamentos:", error);
        return {};
    }
}

// Verificar se horário está ocupado
function horarioEstaOcupado(data, hora, profissional) {
    const agendamentos = getAgendamentos();
    const key = `${data}_${hora}_${profissional}`;
    return agendamentos.hasOwnProperty(key);
}

// Buscar horários ocupados para uma data e profissional
function getHorariosOcupados(data, profissional) {
    const agendamentos = getAgendamentos();
    const ocupados = [];
    
    Object.keys(agendamentos).forEach(key => {
        const ag = agendamentos[key];
        if (ag.data === data && ag.profissional === profissional) {
            ocupados.push(ag.hora);
        }
    });
    
    return ocupados;
}

// Limpar agendamentos antigos (mais de 30 dias)
function limparAgendamentosAntigos() {
    try {
        const agendamentos = getAgendamentos();
        const hoje = new Date();
        let removidos = 0;
        
        Object.keys(agendamentos).forEach(key => {
            const ag = agendamentos[key];
            const dataAg = new Date(ag.data + 'T00:00:00');
            const diffDias = Math.floor((hoje - dataAg) / (1000 * 60 * 60 * 24));
            
            if (diffDias > 30) {
                delete agendamentos[key];
                removidos++;
            }
        });
        
        if (removidos > 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(agendamentos));
            console.log(`🧹 ${removidos} agendamento(s) antigo(s) removido(s)`);
        }
    } catch (error) {
        console.error("❌ Erro ao limpar agendamentos antigos:", error);
    }
}

// Executa limpeza ao carregar
limparAgendamentosAntigos();

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

function carregarHorariosDisponiveis() {
    if (!dataInput?.value || !ctx.profissional) {
        console.log("⚠️ Data ou profissional não definidos");
        return;
    }
    
    console.log("🔍 Verificando horários disponíveis para:", dataInput.value, ctx.profissional);
    
    // Reseta todos os horários
    for (const opt of horaSelect.options) {
        if (!opt.value) continue;
        opt.disabled = false;
        opt.classList.remove('reservado');
        opt.style.color = '';
    }
    
    // Marca horários ocupados
    const ocupados = getHorariosOcupados(dataInput.value, ctx.profissional);
    console.log("⏰ Horários ocupados:", ocupados);
    
    let totalOcupados = 0;
    for (const opt of horaSelect.options) {
        if (!opt.value) continue;
        
        if (ocupados.includes(opt.value)) {
            opt.disabled = true;
            opt.classList.add('reservado');
            opt.style.color = '#999';
            opt.textContent = `${opt.value} - Ocupado`;
            totalOcupados++;
            
            // Se o horário selecionado ficou ocupado, limpa a seleção
            if (horaSelect.value === opt.value) {
                horaSelect.value = '';
            }
        }
    }
    
    if (totalOcupados > 0) {
        console.log(`✅ ${totalOcupados} horário(s) marcado(s) como ocupado(s)`);
    } else {
        console.log("✅ Todos os horários disponíveis!");
    }
}

// Adiciona listener para atualizar quando mudar a data
dataInput?.addEventListener('change', carregarHorariosDisponiveis);

function getDataMinima() {
    const hoje = new Date();
    const horaAtual = hoje.getHours();
    
    // Se já passou das 20h, define data mínima para amanhã
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
    
    // Adiciona aviso sobre confirmação manual
    const modalTitle = document.querySelector('#modal h2');
    if (modalTitle && !document.getElementById('avisoConfirmacao')) {
        const aviso = document.createElement('div');
        aviso.id = 'avisoConfirmacao';
        aviso.style.cssText = `
            background: #fff3cd;
            border: 1px solid #ffc107;
            border-radius: 8px;
            padding: 12px;
            margin: 10px 0;
            display: flex;
            align-items: start;
            gap: 10px;
            font-size: 0.9rem;
            color: #856404;
            line-height: 1.5;
        `;
        aviso.innerHTML = `
            <i class='bx bx-info-circle' style='font-size: 1.3rem; margin-top: 2px;'></i>
            <div>
                <strong>⏳ Aguarde confirmação</strong><br>
                Após enviar, aguarde a confirmação do horário pelo WhatsApp. 
                O barbeiro verificará a disponibilidade e confirmará seu agendamento.
            </div>
        `;
        modalTitle.after(aviso);
    }
    
    abrirModal('modal');
}

// Botões dos profissionais (iniciar fluxo)
document.querySelectorAll('.openModalBtn').forEach(btn => {
    btn.addEventListener('click', () => {
        ctx.profissional = btn.dataset.pro || 'Thiago';
        ctx.wa = btn.dataset.wa || '5521986020031';
        
        agendamentoContexto = {
            nomeCliente: '',
            produtos: [],
            totalProdutos: 0,
            servico: null
        };
        
        if (nomeClienteInput) nomeClienteInput.value = '';
        if (servicoDisplay) servicoDisplay.value = '';
        
        const confirmar = confirm(
            "📋 PROCESSO DE AGENDAMENTO\n\n" +
            "✅ Preencha seus dados e preferências\n" +
            "✅ Enviaremos sua solicitação via WhatsApp\n" +
            "⏳ Aguarde a CONFIRMAÇÃO do barbeiro\n\n" +
            "O barbeiro verificará a disponibilidade e confirmará seu horário.\n\n" +
            "Deseja continuar?"
        );
        
        if (confirmar) {
            abrirModal('modalCliente');
        }
    });
});

// ===== Confirmar agendamento (COM CONTROLE DE HORÁRIOS) =====
const confirmarBtn = document.getElementById('confirmarBtn');

confirmarBtn?.addEventListener('click', () => {
    const data = dataInput?.value;
    const hora = horaSelect?.value;
    
    // Validações
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
        alert("Nome do cliente não informado. Reinicie o agendamento.");
        return;
    }
    
    if (!ctx.wa) { 
        alert("Profissional não definido."); 
        return; 
    }

    // ⚠️ VERIFICAÇÃO DE CONFLITO - IMPORTANTE!
    if (horarioEstaOcupado(data, hora, ctx.profissional)) {
        alert("⚠️ Este horário acabou de ser reservado por outro cliente!\n\nPor favor, escolha outro horário.");
        carregarHorariosDisponiveis(); // Atualiza a lista
        return;
    }

    // Desabilita botão para evitar cliques duplos
    confirmarBtn.disabled = true;
    const originalText = confirmarBtn.textContent;
    confirmarBtn.textContent = "Preparando...";

    try {
        // Formata a data em português
        const dataBR = new Date(`${data}T00:00:00`).toLocaleDateString('pt-BR', { 
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });

        // Monta mensagem WhatsApp COMPLETA e PROFISSIONAL
        let mensagem = `🔔 *SOLICITAÇÃO DE AGENDAMENTO* 📋\n\n`;
        mensagem += `━━━━━━━━━━━━━━━━━━━━\n`;
        mensagem += `👤 *Cliente:* ${agendamentoContexto.nomeCliente}\n`;
        mensagem += `━━━━━━━━━━━━━━━━━━━━\n\n`;
        
        mensagem += `📅 *Data Solicitada:* ${dataBR}\n`;
        mensagem += `🕐 *Horário Solicitado:* ${hora}\n`;
        mensagem += `💈 *Profissional:* ${ctx.profissional}\n\n`;
        
        mensagem += `✂️ *SERVIÇO SOLICITADO*\n`;
        mensagem += `${agendamentoContexto.servico.nome}\n`;
        if (agendamentoContexto.servico.valor != null) {
            mensagem += `💰 Valor: ${toBRL(agendamentoContexto.servico.valor)}\n`;
        } else {
            mensagem += `💰 Valor: A consultar\n`;
        }
        
        if (agendamentoContexto.produtos.length > 0) {
            mensagem += `\n🛍️ *PRODUTOS ADICIONAIS*\n`;
            agendamentoContexto.produtos.forEach(p => {
                mensagem += `   • ${p.nome}\n     ${toBRL(p.preco)}\n`;
            });
            mensagem += `\n💳 *Subtotal Produtos:* ${toBRL(agendamentoContexto.totalProdutos)}\n`;
        }
        
        // Total geral
        const totalServico = agendamentoContexto.servico.valor || 0;
        const totalGeral = totalServico + agendamentoContexto.totalProdutos;
        
        if (totalGeral > 0) {
            mensagem += `\n━━━━━━━━━━━━━━━━━━━━\n`;
            mensagem += `💵 *VALOR TOTAL:* ${toBRL(totalGeral)}\n`;
            mensagem += `━━━━━━━━━━━━━━━━━━━━\n`;
        }
        
        mensagem += `\n⏳ *AGUARDANDO CONFIRMAÇÃO*\n`;
        mensagem += `Por favor, confirme a disponibilidade deste horário.\n`;
        
        mensagem += `\n📍 *ENDEREÇO*\n`;
        mensagem += `R. das Árvores - Fragoso\n`;
        mensagem += `Magé - RJ, 25935-426\n`;
        
        mensagem += `\n_Solicitação via site Favela's Barber Shop_`;
        mensagem += `\n_${new Date().toLocaleString('pt-BR')}_`;

        // Abre WhatsApp
        const url = `https://wa.me/${ctx.wa}?text=${encodeURIComponent(mensagem)}`;
        
        console.log("✅ Abrindo WhatsApp...");
        console.log("📱 Mensagem:", mensagem);
        
        window.open(url, "_blank");

        // Fecha modal de agendamento
        fecharModal('modal');
        
        // Mostra mensagem de sucesso COM AVISO
        alert(`✅ Solicitação enviada com sucesso!\n\n📱 Você será redirecionado para o WhatsApp.\n\n⏳ IMPORTANTE: Aguarde a confirmação do barbeiro sobre a disponibilidade do horário.\n\n📅 Horário solicitado:\n${dataBR} às ${hora}`);
        
        // Abre modal de avaliação
        const reviewBtn = document.getElementById('btnAvaliarGoogle');
        if (reviewBtn) reviewBtn.href = GOOGLE_REVIEW_URL;
        setTimeout(() => abrirModal('modalAvaliacao'), 400);

        console.log("✅ Agendamento enviado com sucesso!");

    } catch (err) {
        console.error("[ERRO AO ENVIAR]", err);
        alert("Não foi possível enviar o agendamento. Tente novamente.");
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

console.log("✅ Sistema de agendamento carregado (Versão WhatsApp + Controle de Horários)");
console.log("📊 Total de agendamentos salvos:", Object.keys(getAgendamentos()).length);

// ===== PAINEL ADMINISTRATIVO (OPCIONAL - Para visualizar agendamentos) =====
// Cole isso no console do navegador para ver todos os agendamentos:
// localStorage.getItem('barbearia_agendamentos')

// Para limpar todos os agendamentos (CUIDADO!):
// localStorage.removeItem('barbearia_agendamentos')

// Para ver agendamentos de forma organizada:
window.verAgendamentos = function() {
    const agendamentos = getAgendamentos();
    if (Object.keys(agendamentos).length === 0) {
        console.log("📭 Nenhum agendamento encontrado");
        return;
    }
    
    console.log("📅 AGENDAMENTOS SALVOS:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    // Agrupa por data
    const porData = {};
    Object.values(agendamentos).forEach(ag => {
        if (!porData[ag.data]) porData[ag.data] = [];
        porData[ag.data].push(ag);
    });
    
    // Ordena por data
    Object.keys(porData).sort().forEach(data => {
        const dataBR = new Date(data + 'T00:00:00').toLocaleDateString('pt-BR', { 
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
        console.log(`\n📆 ${dataBR}`);
        
        // Ordena por hora
        porData[data].sort((a, b) => a.hora.localeCompare(b.hora)).forEach(ag => {
            console.log(`   🕐 ${ag.hora} - ${ag.clienteNome} (${ag.profissional})`);
            console.log(`      ✂️ ${ag.servico}`);
        });
    });
    
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`📊 Total: ${Object.keys(agendamentos).length} agendamento(s)`);
};

// Para cancelar um agendamento específico:
window.cancelarAgendamento = function(data, hora, profissional) {
    const agendamentos = getAgendamentos();
    const key = `${data}_${hora}_${profissional}`;
    
    if (agendamentos[key]) {
        delete agendamentos[key];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(agendamentos));
        console.log("✅ Agendamento cancelado:", key);
        console.log("📊 Agendamentos restantes:", Object.keys(agendamentos).length);
    } else {
        console.log("❌ Agendamento não encontrado:", key);
    }
};

console.log("\n💡 DICAS:");
console.log("   • Digite verAgendamentos() no console para ver todos os agendamentos");
console.log("   • Digite cancelarAgendamento('2026-02-25', '14:00', 'Thiago') para cancelar");
console.log("   • Os agendamentos ficam salvos no navegador do cliente");