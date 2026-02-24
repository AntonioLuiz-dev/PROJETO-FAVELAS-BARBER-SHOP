# 💈 Favela's Barber Shop - Sistema de Agendamento

<div align="center">

![Status](https://img.shields.io/badge/status-ativo-success.svg)
![Versão](https://img.shields.io/badge/versão-1.0.0-blue.svg)
![Licença](https://img.shields.io/badge/licença-MIT-green.svg)

**Sistema completo de agendamento online para barbearias com integração WhatsApp**

[Demo](#-demonstração) • [Instalação](#-instalação) • [Funcionalidades](#-funcionalidades) • [Documentação](#-documentação)

</div>

---

## 📋 Sobre o Projeto

Sistema de agendamento web moderno e responsivo desenvolvido especificamente para a **Favela's Barber Shop**. Permite que clientes agendem serviços de forma intuitiva, com controle de horários, seleção de produtos e integração direta com WhatsApp para confirmação.

🖼️ Preview do Projeto

<img src="https://github.com/AntonioLuiz-dev/PROJETO-BARBEARIA/blob/main/assets/mockup.png?raw=true" width="500px"/>

### 🎯 Problema Resolvido

- ❌ Agendamentos por telefone (linha ocupada)
- ❌ Conflitos de horários
- ❌ Falta de controle sobre serviços oferecidos
- ❌ Dificuldade em gerenciar produtos adicionais

### ✅ Solução Implementada

- ✅ Agendamento online 24/7
- ✅ Controle automático de horários ocupados
- ✅ Catálogo completo de serviços com preços
- ✅ Sistema de produtos adicionais
- ✅ Integração com WhatsApp para confirmação
- ✅ Interface moderna e responsiva

---

## 🚀 Funcionalidades

### 🎨 Interface do Usuário

- **Design Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **Navegação Suave**: Scroll animado entre seções
- **Menu Mobile**: Hamburger menu com animações
- **Feedback Visual**: Indicadores de progresso e estados

### 💼 Sistema de Agendamento

#### 📝 Fluxo de Agendamento (5 Etapas)

1. **Identificação do Cliente**
   - Nome completo
   - Validação de campos obrigatórios

2. **Seleção de Serviço** ✂️
   - 50+ serviços disponíveis
   - Busca em tempo real
   - Preços transparentes
   - Serviços especiais (Corte Sensorial)

3. **Produtos Adicionais** 🛍️
   - 6 produtos disponíveis
   - Seleção múltipla
   - Cálculo automático de total
   - Opção de pular

4. **RA Club - Programa de Fidelidade** ⭐
   - Identificação de membros VIP
   - Opção de assinatura
   - Benefícios exclusivos

5. **Data e Horário** 📅
   - Calendário interativo
   - Horários de 9h às 22h
   - Intervalos de 1 hora
   - Bloqueio automático de horários ocupados
   - Validação de conflitos

### 🔒 Controle de Horários

- **localStorage**: Persistência local de agendamentos
- **Verificação em Tempo Real**: Bloqueia horários já reservados
- **Prevenção de Conflitos**: Dupla verificação antes de confirmar
- **Limpeza Automática**: Remove agendamentos com mais de 30 dias
- **Feedback Visual**: Horários ocupados ficam em cinza

### 📱 Integração WhatsApp

#### Mensagem Profissional Formatada

```
🔔 NOVO AGENDAMENTO ✅

━━━━━━━━━━━━━━━━━━━━
👤 Cliente: João Silva
⭐ Status: Membro RA Club VIP
━━━━━━━━━━━━━━━━━━━━

📅 Data: quarta-feira, 26 de fevereiro de 2026
🕐 Horário: 14:00
💈 Profissional: Thiago

✂️ SERVIÇO SOLICITADO
Corte + Barba
💰 Valor: R$ 75,00

🛍️ PRODUTOS ADICIONAIS
   • Pomada Líquida DA Force MEN
     R$ 39,99

💳 Subtotal Produtos: R$ 39,99

━━━━━━━━━━━━━━━━━━━━
💵 VALOR TOTAL: R$ 114,99
━━━━━━━━━━━━━━━━━━━━

📍 ENDEREÇO
R. das Árvores - Fragoso
Magé - RJ, 25935-426

⚠️ IMPORTANTE
• Chegar 5 minutos antes
• Para remarcar, avisar com 24h
• Cancelamento sem taxa até 12h antes

_Agendamento via site Favela's Barber Shop_
```

### 🎁 Recursos Extras

- **Google Reviews**: Modal incentivando avaliações
- **Mapa Integrado**: Localização via Google Maps
- **Botão WhatsApp Flutuante**: Acesso rápido ao contato
- **Depoimentos**: Seção de avaliações de clientes
- **Links Sociais**: Instagram, Facebook e WhatsApp

---

## 🛠️ Tecnologias Utilizadas

### Frontend

- **HTML5**: Estrutura semântica
- **CSS3**: Animações e responsividade
- **JavaScript ES6+**: Lógica e interatividade
- **Google Fonts**: Tipografia (Poppins)
- **Boxicons**: Biblioteca de ícones

### Integrações

- **Google Maps API**: Localização da barbearia
- **WhatsApp Business API**: Confirmação de agendamentos
- **Google Reviews**: Sistema de avaliações

### Armazenamento

- **localStorage**: Persistência de agendamentos
- **sessionStorage**: Contexto de navegação

---

## 📦 Estrutura do Projeto

```
barbearia/
├── index.html              # Página principal
├── style.css               # Estilos globais e responsividade
├── script.js               # Lógica de agendamento e controle
├── assets/                 # Recursos estáticos
│   ├── logo.png           # Logotipo da barbearia
│   ├── corte1.png         # Imagem Acabamento
│   ├── corte2.png         # Imagem Barba
│   ├── corte3.png         # Imagem Máquina e Tesoura
│   ├── corte4.png         # Imagem Botox Prime
│   ├── corte5.png         # Imagem Sobrancelha
│   ├── corte6.png         # Imagem Luzes
│   ├── corte-infantil.png # Imagem Corte Infantil
│   ├── corte-tesoura.png  # Imagem Tesoura
│   ├── corte-maquina.png  # Imagem Máquina
│   ├── logo-autismo1.jpeg # Logo Corte Sensorial
│   └── barbeiro1.jpg      # Foto do profissional
└── README.md              # Documentação (este arquivo)
```

---

## 🚀 Instalação

### Pré-requisitos

- Servidor web (Apache, Nginx) ou
- Node.js com `http-server` ou
- Visual Studio Code com Live Server

### Instalação Rápida

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/favelas-barbershop.git

# 2. Entre na pasta
cd favelas-barbershop

# 3. Inicie um servidor local
# Opção A: Python
python -m http.server 8000

# Opção B: Node.js
npx http-server -p 8000

# Opção C: VS Code
# Clique com botão direito em index.html > "Open with Live Server"

# 4. Acesse no navegador
http://localhost:8000
```

### Configuração

#### 1. Atualizar Informações da Barbearia

**index.html** (linha ~33):
```html
<a href="#home" class="logo">
    <img src="./assets/SUALOGO.png" alt="logo" class="logo-img">
    Sua Barbearia
</a>
```

#### 2. Configurar WhatsApp

**index.html** (linha ~185):
```html
<button class="button-contact openModalBtn" 
        data-pro="NomeProfissional" 
        data-wa="5521999999999"  <!-- SEU NÚMERO -->
        data-col="agendamentos">
```

**script.js** (linha ~8):
```javascript
let ctx = { 
    profissional: null, 
    wa: '5521999999999' // SEU NÚMERO PADRÃO
};
```

#### 3. Atualizar Serviços

**script.js** (linha ~99-165):
```javascript
const SERVICOS = [
    { nome: 'Seu Serviço', valor: 50.00 },
    // Adicione mais serviços aqui
];
```

#### 4. Atualizar Produtos

**script.js** (linha ~90-97):
```javascript
const PRODUTOS = [
    { nome: "Seu Produto", preco: 39.99 },
    // Adicione mais produtos aqui
];
```

#### 5. Configurar Google Maps

**index.html** (linha ~216):
```html
<iframe src="https://www.google.com/maps/embed?pb=SEU_CODIGO_AQUI"
```

#### 6. Configurar Google Reviews

**script.js** (linha ~85):
```javascript
const GOOGLE_REVIEW_URL = 'SUA_URL_DO_GOOGLE_REVIEWS';
```

---

## 💻 Uso

### Para Clientes

1. Acesse o site da barbearia
2. Clique em **"Agende Seu Horário"**
3. Siga o fluxo de 5 etapas:
   - Digite seu nome
   - Escolha o serviço desejado
   - Adicione produtos (opcional)
   - Informe sobre RA Club
   - Selecione data e horário
4. Confirme e será redirecionado ao WhatsApp

### Para Administradores

#### Ver Agendamentos (Console do Navegador - F12)

```javascript
// Ver todos os agendamentos
verAgendamentos()

// Cancelar agendamento específico
cancelarAgendamento('2026-02-26', '14:00', 'Thiago')

// Ver dados brutos
localStorage.getItem('barbearia_agendamentos')

// Limpar TODOS os agendamentos (CUIDADO!)
localStorage.removeItem('barbearia_agendamentos')
```

#### Gerenciar Horários

Os horários ocupados são salvos automaticamente no navegador do cliente. Para controle centralizado, considere implementar Firebase (veja seção [Roadmap](#-roadmap)).

---

## 🎨 Personalização

### Cores (CSS Variables)

**style.css** (linha ~8):
```css
:root {
    --primary-color: #C5A049;      /* Dourado principal */
    --secondary-color: #040f1a;    /* Azul escuro */
    --text-dark: #C5A049;          /* Texto dourado */
    --text-light: #555555;         /* Texto cinza */
    --white: #ffffff;              /* Branco */
    --bg-light: #040f1a;           /* Fundo escuro */
}
```

### Horários de Funcionamento

**script.js** (linha ~457):
```javascript
function gerarIntervalos(inicio = '09:00', fim = '22:00', passoMin = 60) {
    // Ajuste os horários aqui
}
```

### Profissionais

Para adicionar mais profissionais, duplique o bloco em **index.html** (linha ~177):
```html
<div class="haircut">
    <img src="./assets/barbeiro2.jpg" alt="Maria">
    <div class="haircut-info">
        <strong>Maria</strong>
        <button class="button-contact openModalBtn" 
                data-pro="Maria" 
                data-wa="5521988888888">
            <i class='bx bx-calendar'></i> Agende Seu Horário
        </button>
    </div>
</div>
```

---

## 🔍 SEO e Performance

### Otimizações Implementadas

- ✅ HTML semântico com tags apropriadas
- ✅ Meta tags para redes sociais
- ✅ Imagens otimizadas
- ✅ CSS minificado
- ✅ JavaScript otimizado
- ✅ Lazy loading de imagens
- ✅ Cache de recursos

### Adicionar Meta Tags (Recomendado)

**index.html** (adicionar no `<head>`):
```html
<!-- SEO -->
<meta name="description" content="Agende seu horário na Favela's Barber Shop. Cortes masculinos, barba, luzes e muito mais. Atendimento de terça a domingo.">
<meta name="keywords" content="barbearia, corte masculino, barba, Magé, RJ">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:title" content="Favela's Barber Shop - Agendamento Online">
<meta property="og:description" content="Agende seu horário online de forma rápida e fácil">
<meta property="og:image" content="https://seusite.com/assets/logo.png">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Favela's Barber Shop">
<meta name="twitter:description" content="Agendamento online para sua barbearia favorita">
```

---

## 🐛 Solução de Problemas

### Horários não aparecem

**Problema**: Select de horários fica vazio

**Solução**:
```javascript
// Verifique se dataInput tem valor
console.log(dataInput.value);

// Force o carregamento
carregarHorariosDisponiveis();
```

### Horários não bloqueiam

**Problema**: Horários ocupados não ficam em cinza

**Solução**:
1. Abra Console (F12)
2. Digite: `verAgendamentos()`
3. Verifique se os agendamentos foram salvos
4. Limpe o cache se necessário

### WhatsApp não abre

**Problema**: Botão não redireciona

**Solução**:
1. Verifique o número no formato: `5521999999999`
2. Não use espaços, hífens ou parênteses
3. Código do país (55) + DDD (21) + Número (9 dígitos)

### Modal não abre

**Problema**: Clique não funciona

**Solução**:
```javascript
// Verifique se o elemento existe
console.log(document.getElementById('modal'));

// Teste manualmente
abrirModal('modal');
```

---

## 📱 Compatibilidade

### Navegadores Suportados

| Navegador | Versão Mínima | Status |
|-----------|---------------|--------|
| Chrome    | 90+           | ✅ Total |
| Firefox   | 88+           | ✅ Total |
| Safari    | 14+           | ✅ Total |
| Edge      | 90+           | ✅ Total |
| Opera     | 76+           | ✅ Total |
| Samsung Internet | 14+ | ✅ Total |

### Dispositivos Testados

- ✅ Desktop (1920x1080)
- ✅ Laptop (1366x768)
- ✅ Tablet (768x1024)
- ✅ Mobile (375x667)
- ✅ Mobile (414x896)

---

## 🚀 Roadmap

### Versão 1.0 (Atual) ✅

- [x] Sistema de agendamento completo
- [x] Controle de horários com localStorage
- [x] Integração WhatsApp
- [x] Interface responsiva
- [x] Catálogo de serviços e produtos

### Versão 1.1 (Próxima)

- [ ] Implementação Firebase para sincronização
- [ ] Painel administrativo web
- [ ] Sistema de notificações por email
- [ ] Histórico de clientes
- [ ] Relatórios de agendamentos

### Versão 2.0 (Futuro)

- [ ] App mobile nativo (React Native)
- [ ] Sistema de pagamento online
- [ ] Programa de fidelidade completo
- [ ] Lembretes automáticos (SMS/WhatsApp)
- [ ] Integração com Google Calendar
- [ ] Sistema de avaliação pós-atendimento

---

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Siga estas etapas:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

### Padrões de Código

- Use **2 espaços** para indentação
- Comente código complexo
- Siga nomenclatura camelCase para JavaScript
- Use kebab-case para classes CSS
- Teste em múltiplos navegadores

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

```
MIT License

Copyright (c) 2026 Favela's Barber Shop

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👥 Autores

**Desenvolvimento**
- Antonio Luiz

---

## 📞 Suporte

### Contato

- **WhatsApp**: (21) 98602-0031
- **Instagram**: [@favelasbarbershop](https://www.instagram.com/favelasbarbershop)
- **Facebook**: [Favela's Barbershop](https://www.facebook.com/share/15bFHGqvEkY)
- **Endereço**: R. das Árvores - Fragoso, Magé - RJ, 25935-426

### Reportar Bugs

Encontrou um bug? Abra uma [issue](https://github.com/seu-usuario/favelas-barbershop/issues) com:

- Descrição detalhada do problema
- Passos para reproduzir
- Navegador e versão
- Screenshots (se aplicável)
- Console logs (se houver erros)

---

## 🙏 Agradecimentos

- **Google Fonts** pela tipografia Poppins
- **Boxicons** pela biblioteca de ícones
- **Comunidade Open Source** pelas inspirações
- **Clientes da Favela's Barber Shop** pelo feedback valioso

---

<div align="center">

**⭐ Se este projeto foi útil, considere dar uma estrela!**

Feito com ❤️ e muito ☕ para a **Favela's Barber Shop**

[⬆ Voltar ao topo](#-favelas-barber-shop---sistema-de-agendamento)

</div>
