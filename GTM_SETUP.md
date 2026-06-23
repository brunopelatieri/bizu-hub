# Google Tag Manager (GTM) + Google Analytics 4 (GA4) — Setup

**Data:** 2026-06-23  
**Status:** Pronto para configuração na conta Google

---

## Resumo

O projeto agora está integrado com **Google Tag Manager (GTM)** que injeta e gerencia **Google Analytics 4 (GA4)** automaticamente.

- ✅ Componente `GoogleTagManager` adicionado a `src/root.tsx`
- ✅ Eventos customizados em `src/lib/gtm/events.ts`
- ✅ Tracking de conversão no form de contato
- ✅ Variável de ambiente `VITE_GTM_ID` documentada

---

## Passo 1: Criar Container GTM

1. Acesse [Google Tag Manager](https://tagmanager.google.com/)
2. Selecione sua conta Google (a que tem permissão em brunogoulart.com.br)
3. Clique em **"Criar"** → **Novo Container**
4. Preencha:
   - **Nome do container:** `Bizu Hub — Bruno Goulart`
   - **Alvo do container:** Web
   - **URL do website:** `https://brunogoulart.com.br`
5. Clique em **"Criar"** e **aceite os Termos de Serviço**
6. Copie o **ID do container** (formato: `GTM-XXXXXXX`)

---

## Passo 2: Configurar GA4 no GTM

1. No GTM, clique em **"Variáveis"** (menu à esquerda)
2. Em **"Variáveis built-in"**, habilite:
   - `Google Analytics ID`
   - `Page URL`
   - `Page Title`
   - `Document Host`
3. Clique em **"Salvar"**

---

## Passo 3: Criar Google Analytics 4

1. Acesse [Google Analytics](https://analytics.google.com/)
2. Clique em **"Admin"** (ícone de engrenagem)
3. Selecione **"Criar propriedade"**
4. Preencha:
   - **Nome:** `Bizu Hub — brunogoulart.com.br`
   - **Timezone:** `America/Sao_Paulo`
   - **Moeda:** `BRL`
5. Selecione **Web** como plataforma
6. Preencha a URL: `https://brunogoulart.com.br`
7. Clique em **"Criar propriedade"**
8. Copie o **Google Analytics ID** (formato: `G-XXXXXXXXXX`)

---

## Passo 4: Conectar GA4 ao GTM

1. Volte para o GTM (Google Tag Manager)
2. Clique em **"Tags"** → **"Novo"**
3. Preencha:
   - **Nome da tag:** `GA4 — Page View`
   - **Tipo de tag:** Procure por **"Google Analytics: GA4 Configuration"**
   - **ID de medição:** Cole o `G-XXXXXXXXXX` do passo anterior
4. Em **Trigger**, selecione **"All Pages"**
5. Clique em **"Salvar"**

---

## Passo 5: Configurar no Projeto

### Desenvolvimento Local

1. Copie `.env.example` para `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edite `.env.local` e adicione:
   ```env
   VITE_GTM_ID=GTM-XXXXXXX
   ```
   (substitua `XXXXXXX` pelo ID copiado no Passo 1)

3. Reinicie o dev server:
   ```bash
   npm run dev
   ```

4. Abra o site em `http://localhost:5173` e teste no **Google Tag Manager Preview Mode**:
   - No GTM, clique em **"Preview"** e siga as instruções
   - Veja o dataLayer sendo populado em tempo real

### Produção (VPS/Portainer)

1. No Portainer, edite a stack de produção
2. Adicione variável ao container `app`:
   ```yaml
   environment:
     VITE_GTM_ID: "GTM-XXXXXXX"
   ```
3. Redeploy do stack
4. Aguarde ~24-48h pelo Google indexar os dados

---

## Passo 6: Publicar a Tag

1. No GTM, clique em **"Submeter"** (canto superior direito)
2. Preencha:
   - **Descrição da versão:** `Initial setup: GA4 configuration`
   - **Adicionar notas da versão:** `Connected to GA4 property G-XXXXXXXXXX`
3. Clique em **"Publicar"**

---

## Eventos Rastreados

O projeto rastreia automaticamente:

### Conversão de Contato
- **Evento:** `generate_lead`
- **Disparado:** Quando o formulário é enviado com sucesso
- **Dados:** nome, email
- **Uso:** Medir quantos leads entram por /contato

### Erros de Form
- **Evento:** `form_error`
- **Disparado:** Quando há erro de validação ou envio
- **Dados:** mensagem de erro

### Outros Eventos (usar em CTAs futuros)
- `trackCTAClick()` — botões principais
- `trackExternalLink()` — links para GitHub/LinkedIn/etc
- `trackPageView()` — entrada em página (GA4 já faz isso)

**Exemplo de uso em um componente:**
```tsx
import { trackCTAClick } from "@/lib/gtm/events";

export function MyComponent() {
  return (
    <button onClick={() => trackCTAClick("cta_fale_com_especialista")}>
      Fale com o Especialista
    </button>
  );
}
```

---

## Validação

### No Browser (DevTools)
1. Abra DevTools (`F12`)
2. Vá para **Console**
3. Digite: `window.dataLayer`
4. Você deve ver um array com eventos (se GTM está carregado)

### No GTM Preview Mode
1. No GTM, clique em **"Preview"**
2. Abra o site em nova aba
3. Uma aba de Preview abrirá mostrando o dataLayer em tempo real
4. Faça ações (preencha form, clique links) e veja os eventos

### No Google Analytics
1. Acesse Google Analytics
2. Vá para **"Tempo real"** (menu à esquerda)
3. Você deve ver visitantes chegando em 10-30 segundos
4. Em 24-48h, os dados de conversão aparecerão em **"Eventos"**

---

## Próximas Etapas

- [ ] Criar dashboard customizado no GA4 para visualizar conversões
- [ ] Configurar alertas de anomalias
- [ ] Linkar GA4 com Google Search Console (GSC)
- [ ] Adicionar tracking de scroll (profundidade)
- [ ] Integrar com Stripe quando billing estiver pronto

---

## Troubleshooting

### GTM não está carregando
- Verifique se `VITE_GTM_ID` está no `.env.local` (dev) ou variável de ambiente (produção)
- Verifique no console: `[GTM] Carregado com sucesso: GTM-XXXXXXX`

### Eventos não aparecem em GA4
- Aguarde 24-48h pelo Google processar os dados
- Verifique no GA4 → Tempo real → Eventos
- Se nada aparecer, volte ao GTM Preview Mode e veja se os eventos estão no dataLayer

### Hydration mismatch
- Improvável, pois GTM usa `useEffect` (só roda no cliente)
- Se ocorrer, é bug do próprio GTM — reporte ao suporte Google

---

## Referências

- [Google Tag Manager Docs](https://support.google.com/tagmanager)
- [GA4 Setup Guide](https://support.google.com/analytics)
- [React + GTM Best Practices](https://developers.google.com/analytics/devguides/collection/ga4)
