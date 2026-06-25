# GTM + GA4 — Checklist de Implementação

## ✅ Código

- [x] `src/lib/gtm/config.ts` — configuração centralizada
- [x] `src/lib/gtm/events.ts` — helper de eventos
- [x] `src/components/gtm/google-tag-manager.tsx` — componente injetor
- [x] `src/root.tsx` — GoogleTagManager integrado
- [x] `src/components/contact/contact-form.tsx` — tracking de conversão
- [x] `.env.example` — documentado VITE_GTM_ID

## 🔐 Variáveis de Ambiente

### Desenvolvimento
- [x] `.env.local` — `VITE_GTM_ID=GTM-KXX8MMKS`

### Produção (Docker build)
- [x] `scripts/docker-build.mjs` — passa `--build-arg VITE_GTM_ID=GTM-KXX8MMKS`
- [x] `Dockerfile` — `ARG VITE_GTM_ID` + `ENV VITE_GTM_ID=$VITE_GTM_ID`

> ⚠️ `VITE_*` são embutidos no bundle em **build time** — não configurar em runtime no Portainer.

## 🚀 Deploy

```bash
npm run dev          # Teste localmente
npm run build        # Build de produção
npm run start        # Teste build localmente
npm run docker:push  # Push para produção
```

## 📊 Verificação Google

### Google Tag Manager
1. [x] Container criado — `GTM-KXX8MMKS`
2. [x] GA4 Configuration Tag adicionada
3. [x] Tag publicada
4. [ ] Preview Mode — validar após próximo deploy

### Google Analytics 4
1. [x] Propriedade GA4 criada
2. [x] GA4 ID copiado para GTM
3. [ ] Dados em tempo real — aguardar 24-48h
4. [ ] Conversão `generate_lead` rastreada em "Eventos"

## 🔍 QA Local

```bash
# No browser DevTools (F12 → Console):
window.dataLayer
# Deve retornar array com eventos

# Quando form de contato é enviado:
# Procure por evento "generate_lead" no console ou GA4 Tempo Real
```

## 📝 Documentação

- `GTM_SETUP.md` — Guia passo-a-passo (leia ANTES de configurar)
- `GTM_CHECKLIST.md` — Este arquivo

## ⏱️ Timeline Esperada

- **Agora (código):** ✅ Completo
- **Setup Google:** 15-30min
- **Deploy produção:** ~5min
- **Dados em GA4:** 24-48h
- **Analytics úteis:** 1-2 semanas (precisa de volume)

---

**Status:** ✅ Ativo em produção (`GTM-KXX8MMKS`). Aguardando volume de dados no GA4 (24-48h).
