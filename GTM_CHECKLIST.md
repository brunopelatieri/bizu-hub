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
```bash
cp .env.example .env.local
# Edite .env.local e adicione:
VITE_GTM_ID=GTM-XXXXXXX
```

### Produção (Portainer)
```yaml
environment:
  VITE_GTM_ID: "GTM-XXXXXXX"
```

## 🚀 Deploy

```bash
npm run dev          # Teste localmente
npm run build        # Build de produção
npm run start        # Teste build localmente
npm run docker:push  # Push para produção
```

## 📊 Verificação Google

### Google Tag Manager
1. [ ] Container criado
2. [ ] GA4 Configuration Tag adicionada
3. [ ] Tag publicada
4. [ ] Preview Mode funcionando

### Google Analytics 4
1. [ ] Propriedade GA4 criada
2. [ ] GA4 ID copiado para GTM
3. [ ] Dados em tempo real aparecendo
4. [ ] Conversão rastreada em "Eventos"

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

**Status:** Pronto para setup. Proceda com `GTM_SETUP.md`.
