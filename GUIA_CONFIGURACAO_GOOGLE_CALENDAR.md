# 📅 GUIA COMPLETO - Integração Google Calendar API

## 🎯 O Que Este Guia Vai Te Ensinar

Você vai configurar o sistema para:
- ✅ Consultar horários livres em tempo real
- ✅ Criar eventos automaticamente no Google Calendar
- ✅ Enviar convites por email para clientes
- ✅ Sincronizar em todos os dispositivos
- ✅ Impossibilitar conflitos de horário

**Tempo estimado:** 20-30 minutos  
**Dificuldade:** Média  
**Custo:** GRÁTIS

---

## 📋 PRÉ-REQUISITOS

Antes de começar, você precisa ter:

- [ ] Conta Google (Gmail)
- [ ] Google Calendar configurado
- [ ] Navegador atualizado (Chrome, Firefox, Edge)
- [ ] Acesso ao código-fonte do site

---

## 🚀 PASSO A PASSO COMPLETO

### **ETAPA 1: Criar Projeto no Google Cloud Console**

#### 1.1 - Acessar o Console

1. Abra: https://console.cloud.google.com/
2. Faça login com sua conta Google
3. Aceite os Termos de Serviço (se aparecer)

#### 1.2 - Criar Novo Projeto

1. Clique no **seletor de projeto** no topo (próximo ao logo do Google Cloud)
2. Clique em **"NOVO PROJETO"**
3. Preencha:
   - **Nome do projeto:** `Barbearia Agendamento`
   - **Localização:** deixe como está
4. Clique em **"CRIAR"**
5. Aguarde alguns segundos até o projeto ser criado
6. Selecione o projeto recém-criado no seletor

---

### **ETAPA 2: Ativar Google Calendar API**

#### 2.1 - Acessar Biblioteca de APIs

1. No menu lateral esquerdo, clique em **"APIs e Serviços"** > **"Biblioteca"**
2. Na busca, digite: `Google Calendar API`
3. Clique no resultado **"Google Calendar API"**
4. Clique em **"ATIVAR"**
5. Aguarde a ativação (alguns segundos)

✅ **Checkpoint:** Você deve ver "API ativada" em verde

---

### **ETAPA 3: Criar Credenciais (API Key)**

#### 3.1 - Gerar API Key

1. No menu lateral, vá em **"APIs e Serviços"** > **"Credenciais"**
2. Clique em **"+ CRIAR CREDENCIAIS"** no topo
3. Selecione **"Chave de API"**
4. Uma chave será gerada automaticamente

#### 3.2 - Restringir a API Key (IMPORTANTE!)

1. Clique em **"RESTRINGIR CHAVE"** no popup
2. Ou clique no ícone de lápis ao lado da chave criada
3. Em **"Nome da chave de API"**, coloque: `Barbearia Web Key`
4. Em **"Restrições de aplicativo"**, selecione:
   - ☑️ **Referenciadores HTTP (sites)**
5. Clique em **"ADICIONAR UM ITEM"**
6. Digite o seu domínio:
   ```
   https://seusite.com.br/*
   ```
   (Se ainda não tem domínio, coloque `*` por enquanto e restrinja depois)

7. Em **"Restrições de API"**, selecione:
   - ☑️ **Restringir chave**
   - Marque apenas: **Google Calendar API**

8. Clique em **"SALVAR"**

📋 **ANOTE A API KEY** - você vai precisar dela!

---

### **ETAPA 4: Configurar Tela de Consentimento OAuth**

#### 4.1 - Configurar Tela de Consentimento

1. No menu lateral, vá em **"APIs e Serviços"** > **"Tela de consentimento OAuth"**
2. Selecione **"Externo"**
3. Clique em **"CRIAR"**

#### 4.2 - Preencher Informações do Aplicativo

**Página 1 - Informações do app:**
- **Nome do aplicativo:** `Favela's Barber Shop - Agendamento`
- **E-mail de suporte do usuário:** seu email
- **Logotipo do aplicativo:** (opcional, pode pular)
- **Domínio do aplicativo:** (opcional por enquanto)
- **E-mail do desenvolvedor:** seu email
- Clique em **"SALVAR E CONTINUAR"**

**Página 2 - Escopos:**
- Clique em **"ADICIONAR OU REMOVER ESCOPOS"**
- Na busca, digite: `calendar`
- Marque: **`.../auth/calendar.events`** (Visualizar e editar eventos)
- Clique em **"ATUALIZAR"**
- Clique em **"SALVAR E CONTINUAR"**

**Página 3 - Usuários de teste:**
- Clique em **"+ ADICIONAR USUÁRIOS"**
- Adicione o email da conta Google que vai gerenciar a agenda
- Clique em **"ADICIONAR"**
- Clique em **"SALVAR E CONTINUAR"**

**Página 4 - Resumo:**
- Revise as informações
- Clique em **"VOLTAR PARA PAINEL"**

---

### **ETAPA 5: Criar Client ID (OAuth 2.0)**

#### 5.1 - Criar Credenciais OAuth

1. Vá em **"APIs e Serviços"** > **"Credenciais"**
2. Clique em **"+ CRIAR CREDENCIAIS"**
3. Selecione **"ID do cliente OAuth"**

#### 5.2 - Configurar o Client ID

1. **Tipo de aplicativo:** Selecione **"Aplicativo da Web"**
2. **Nome:** `Barbearia Web Client`
3. **Origens JavaScript autorizadas:**
   - Clique em **"+ ADICIONAR URI"**
   - Adicione: `https://seusite.com.br`
   - (Se testar localmente, adicione também: `http://localhost:8000`)

4. **URIs de redirecionamento autorizados:**
   - Clique em **"+ ADICIONAR URI"**
   - Adicione: `https://seusite.com.br`

5. Clique em **"CRIAR"**

📋 **COPIE O CLIENT ID** - você vai precisar!

Exemplo: `123456789-abc123def456.apps.googleusercontent.com`

---

### **ETAPA 6: Configurar o Código do Site**

#### 6.1 - Atualizar o HTML

Adicione estas linhas **ANTES** do `</body>` no `index.html`:

```html
<!-- Google Calendar API -->
<script async defer src="https://apis.google.com/js/api.js" onload="gapiLoaded()"></script>
<script async defer src="https://accounts.google.com/gsi/client" onload="gisLoaded()"></script>
```

#### 6.2 - Adicionar Campo de Email no Modal do Nome

No modal `modalCliente`, adicione:

```html
<div id="modalCliente" class="modal" aria-hidden="true">
    <div class="modal-content" role="dialog" aria-modal="true">
        <span class="close" onclick="fecharModal('modalCliente')">&times;</span>
        <h2>Qual o seu nome?</h2>
        <input type="text" id="nomeCliente" placeholder="Digite seu nome" required />
        
        <!-- NOVO CAMPO DE EMAIL -->
        <label for="emailCliente">Email (opcional):</label>
        <input type="email" id="emailCliente" placeholder="seu@email.com" />
        <small class="muted">Para receber convite no Google Calendar</small>
        
        <button type="button" id="btnClienteContinuar">Continuar</button>
    </div>
</div>
```

#### 6.3 - Atualizar Configurações no JavaScript

No arquivo `script.js`, procure por:

```javascript
const GOOGLE_CONFIG = {
    API_KEY: 'SUA_API_KEY_AQUI',
    CLIENT_ID: 'SEU_CLIENT_ID_AQUI.apps.googleusercontent.com',
    CALENDAR_ID: 'primary',
    ...
};
```

Substitua:
- `SUA_API_KEY_AQUI` → Cole sua API Key
- `SEU_CLIENT_ID_AQUI` → Cole seu Client ID

---

### **ETAPA 7: Testar a Integração**

#### 7.1 - Teste Local (Opcional)

Se quiser testar antes de colocar no ar:

1. Instale um servidor local:
   ```bash
   # Python
   python -m http.server 8000
   
   # Node.js
   npx http-server -p 8000
   ```

2. Acesse: `http://localhost:8000`
3. Adicione `http://localhost:8000` nas Origens JavaScript (passo 5.2)

#### 7.2 - Fazer um Teste Completo

1. Acesse o site
2. Clique em "Agende Seu Horário"
3. Preencha nome e email
4. Selecione serviço
5. Selecione data
6. **Aguarde carregar horários** (alguns segundos)
7. Selecione horário disponível
8. Clique em "Agendar"
9. **Autorize o acesso** quando solicitado pelo Google
10. Confirme o agendamento

#### 7.3 - Verificar se Funcionou

✅ **Evento foi criado no Google Calendar**
- Abra: https://calendar.google.com
- Você deve ver o evento criado

✅ **Cliente recebeu convite por email** (se informou)
- Verifique a caixa de entrada

✅ **Horário ficou bloqueado**
- Tente agendar novamente o mesmo horário
- Deve aparecer como "Ocupado"

---

## 🎯 COMANDOS ÚTEIS (Console do Navegador)

### Ver Eventos da Agenda

```javascript
// Cola no console (F12)
async function verEventos() {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 7);
    
    const response = await gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: hoje.toISOString(),
        timeMax: amanha.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
    });
    
    console.table(response.result.items.map(e => ({
        data: new Date(e.start.dateTime).toLocaleString('pt-BR'),
        titulo: e.summary,
        descricao: e.description
    })));
}

verEventos();
```

---

## 🐛 SOLUÇÃO DE PROBLEMAS

### **Erro: "API key not valid"**

**Causa:** API Key incorreta ou não restrita corretamente

**Solução:**
1. Verifique se copiou a API Key completa
2. Confirme que Google Calendar API está nas restrições
3. Aguarde alguns minutos (pode demorar para propagar)

---

### **Erro: "Access blocked: This app's request is invalid"**

**Causa:** Domínio não autorizado ou Client ID incorreto

**Solução:**
1. Adicione seu domínio nas "Origens JavaScript autorizadas"
2. Verifique o Client ID no código
3. Certifique-se que está acessando pelo domínio correto

---

### **Erro: "The API returned an error: Error: Request had insufficient authentication scopes"**

**Causa:** Escopo do OAuth incompleto

**Solução:**
1. Vá em "Tela de consentimento OAuth" > "Escopos"
2. Adicione: `.../auth/calendar.events`
3. Refaça a autorização (limpe cookies se necessário)

---

### **Erro: "gapiLoaded is not defined"**

**Causa:** Script do Google não carregou

**Solução:**
1. Verifique se adicionou as tags `<script>` no HTML
2. Verifique se está com internet
3. Tente recarregar a página

---

### **Horários não carregam**

**Causa:** Permissão não concedida ou erro de autenticação

**Solução:**
1. Abra o console (F12)
2. Veja se há erros vermelhos
3. Tente limpar cache e cookies
4. Recarregue e autorize novamente

---

## 📊 MONITORAMENTO

### Como Ver Quantos Agendamentos Foram Feitos

1. Acesse: https://console.cloud.google.com/
2. Vá em **"APIs e Serviços"** > **"Painel"**
3. Clique em **"Google Calendar API"**
4. Veja gráficos de uso

---

## 💰 CUSTOS

**Google Calendar API é GRÁTIS até:**
- 1.000.000 de requisições por dia
- 100 requisições por segundo

Para uma barbearia, isso é **MAIS do que suficiente**.

Você pode fazer milhares de agendamentos por dia sem pagar nada.

---

## 🔒 SEGURANÇA

### Boas Práticas

✅ **Sempre restrinja a API Key** ao seu domínio  
✅ **Adicione apenas usuários de confiança** na lista de teste  
✅ **Não compartilhe suas credenciais** publicamente  
✅ **Monitore o uso** no Google Cloud Console  

---

## 🎓 PRÓXIMOS PASSOS

Após configurar, você pode:

1. **Publicar o app** (tirar de modo teste)
   - Necessário se tiver mais de 100 usuários
   - Requer verificação do Google

2. **Adicionar mais calendários**
   - Para múltiplos barbeiros
   - Cada um com seu calendário

3. **Personalizar eventos**
   - Cores diferentes por tipo de serviço
   - Lembretes customizados

---

## 📞 SUPORTE

**Precisa de ajuda?**

- Documentação oficial: https://developers.google.com/calendar/api
- Status das APIs: https://status.cloud.google.com/

---

## ✅ CHECKLIST FINAL

Antes de colocar no ar, confirme:

- [ ] API Key configurada e restrita
- [ ] Client ID configurado
- [ ] Domínio adicionado nas origens autorizadas
- [ ] Tela de consentimento configurada
- [ ] Código atualizado com as credenciais
- [ ] Scripts do Google adicionados no HTML
- [ ] Campo de email adicionado no modal
- [ ] Testado em ambiente local ou produção
- [ ] Evento criado com sucesso no Calendar
- [ ] Horário bloqueou corretamente

---

**🎉 PARABÉNS! Seu sistema está integrado com Google Calendar!**

Agora você tem um sistema **100% profissional** com:
- ✅ Zero conflitos de horário
- ✅ Sincronização automática
- ✅ Lembretes para clientes
- ✅ Agenda sempre atualizada

**Valor agregado ao projeto: +R$ 800-1000** 🚀