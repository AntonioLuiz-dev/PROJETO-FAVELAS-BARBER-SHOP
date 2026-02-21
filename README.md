# ✂️ Favela's Barber Shop — Site Oficial

> Site institucional com sistema de agendamento online integrado ao WhatsApp e Firebase.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black)

---

## 📋 Sobre o projeto

Site desenvolvido para a **Favela's Barber Shop**, localizada em Magé - RJ. O objetivo é oferecer uma presença digital profissional com um fluxo de agendamento simples e direto, sem depender de aplicativos ou plataformas de terceiros — tudo via WhatsApp.

O cliente acessa o site, escolhe o serviço, seleciona data e horário, e o agendamento é confirmado automaticamente no Firestore e enviado via mensagem ao barbeiro.

---

## ✨ Funcionalidades

- **Agendamento online** com verificação de horários em tempo real via Firestore
- **Prevenção de overbooking** — horário bloqueado imediatamente após confirmação
- **Fluxo guiado** em etapas: nome, produtos opcionais, clube de assinatura e horário
- **Integração com WhatsApp** — mensagem completa gerada automaticamente ao confirmar
- **Catálogo de serviços** com busca por nome e preços
- **Vitrine de serviços** com fotos e valores
- **Depoimentos** de clientes
- **Mapa** com localização em largura total
- **Avaliação no Google** sugerida após agendamento
- **Scroll suave** com easing personalizado (`easeInOutCubic`) via `requestAnimationFrame`
- **Header fixo** com links ativos conforme seção visível e efeito de clique animado
- **Botão flutuante do WhatsApp**
- Layout totalmente responsivo para mobile, tablet e desktop

---

## 🗂️ Estrutura de arquivos

```
/
├── index.html          # Estrutura da página e modais
├── style.css           # Estilos, responsividade e animações
├── script.js           # Lógica de agendamento, Firebase e navegação
└── assets/
    ├── FAVELA'S BARBERSHOP.png
    ├── barbeiro1.png
    ├── corte1.png ... corte6.png
    ├── corte-infantil.png
    ├── corte-maquina.png
    ├── corte-tesoura.png
    └── logo-autismo1.jpeg
```

---

## 🔄 Fluxo de agendamento

```
Clique em "Agende Seu Horário"
        ↓
  Modal: nome do cliente
        ↓
  Modal: produtos opcionais
        ↓
  Modal: clube de assinatura (RA Club)
        ↓
  Modal: data + horário + serviço
        ↓
  Verifica disponibilidade no Firestore
        ↓
  Salva agendamento no Firestore
        ↓
  Abre WhatsApp com mensagem completa
        ↓
  Sugere avaliação no Google
```

---

## 🔥 Firebase — estrutura do Firestore

Coleção: `agendamentos`

| Campo | Tipo | Descrição |
|---|---|---|
| `dataISO` | string | Data no formato `YYYY-MM-DD` |
| `hora` | string | Horário no formato `HH:MM` |
| `profissional` | string | Slug do barbeiro (ex: `rodrigo`) |
| `diaProf` | string | Chave composta `YYYY-MM-DD#slug` usada para query sem índice |
| `barbeiroNome` | string | Nome de exibição do barbeiro |
| `clienteNome` | string | Nome informado pelo cliente |
| `servico` | string | Nome do serviço escolhido |
| `valor` | number | Valor do serviço em reais |
| `produtos` | array | Produtos adicionais selecionados |
| `totalProdutos` | number | Soma dos produtos |
| `raclubMembro` | boolean | Se o cliente é membro do clube |
| `clienteTipo` | string | `raclub` ou `cliente` |
| `bloqueado` | boolean | Controle manual de bloqueio |
| `pagamentoForma` | string | Forma de pagamento (preenchido no painel) |
| `createdAt` | timestamp | Data/hora de criação |

### Regras de segurança recomendadas

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /agendamentos/{id} {
      allow read, write: if request.auth != null;
    }
  }
}
```

> O site utiliza autenticação anônima (`signInAnonymously`) para satisfazer a regra `request.auth != null` sem exigir login do usuário.

---

## ⚙️ Como rodar localmente

Como o `script.js` usa `import` (ES Modules), o arquivo precisa ser servido por um servidor HTTP — abrir o `index.html` direto no browser não funciona.

**Opção 1 — VS Code (recomendado)**

Instale a extensão **Live Server** e clique em `Go Live` no rodapé do editor.

**Opção 2 — Node.js**

```bash
npx serve .
```

**Opção 3 — Python**

```bash
python -m http.server 3000
```

Acesse `http://localhost:3000` no browser.

---

## 🎨 Personalização

### Trocar barbeiro ou número do WhatsApp

No `index.html`, localize o botão de agendamento e edite os atributos `data-pro` e `data-wa`:

```html
<button class="button-contact openModalBtn"
    data-pro="NomeDoBareiro"
    data-wa="55219XXXXXXXX"
    data-col="agendamentos">
    Agende Seu Horário
</button>
```

### Adicionar ou remover serviços

No `script.js`, edite o array `SERVICOS`:

```js
{ nome: 'Nome do Serviço', valor: 99.00 },
```

Para serviços com valor a consultar, use `valor: null`.

### Alterar horários disponíveis

No `script.js`, edite a chamada de `gerarIntervalos`:

```js
// gerarIntervalos(inicio, fim, passoEmMinutos)
gerarIntervalos('09:00', '20:00', 60)
```

### Cores e identidade visual

No `style.css`, edite as variáveis no `:root`:

```css
:root {
    --primary-color: #C5A049;   /* dourado */
    --secondary-color: #040f1a; /* azul escuro */
}
```

---

## 📍 Informações da barbearia

| | |
|---|---|
| **Endereço** | R. das Árvores - Fragoso, Magé - RJ, 25935-426 |
| **Telefone** | (21) 98602-0031 |
| **Horário** | Terça a Domingo: 9h às 22h |
| **Instagram** | [@favelasbarbershop](https://www.instagram.com/favelasbarbershop) |
| **Facebook** | [Favela's Barbershop](https://www.facebook.com/share/15bFHGqvEkY/) |

---

## 📄 Licença

Este projeto foi desenvolvido exclusivamente para a **Favela's Barber Shop**. Todos os direitos reservados © 2026.