# Changelog — Bizu Hub

## 2026-06-23

### 🎯 Google Tag Manager + Google Analytics 4 (Implementado)

**Status:** Código completo, aguardando setup em Google

Adicionado:
- ✅ `src/lib/gtm/config.ts` — configuração centralizada
- ✅ `src/lib/gtm/events.ts` — 6 helpers de eventos
- ✅ `src/components/gtm/google-tag-manager.tsx` — injetor de script (SSR-safe)
- ✅ `GTM_SETUP.md` — guia passo-a-passo completo
- ✅ `GTM_CHECKLIST.md` — checklist de implementação
- ✅ Tracking de conversão no form de contato
- ✅ Variável `VITE_GTM_ID` em `.env.example` e `.env.local`

Próximo passo: Seguir `GTM_SETUP.md` para conectar à conta Google.

### 📦 Simplificação de Deploy (Documentação)

**Motivo:** Imagem Docker agora é pública no GitLab Container Registry — removido ruído sobre registry privada.

Simplificado:
- ✅ `deploy/README.md` — de 240 linhas para ~80 (prático)
- ✅ `deploy/PORTAINER.md` — de 180 para ~50 (setup inicial apenas)
- ✅ `deploy/PORTAINER-ATUALIZAR.md` — de 210 para ~70 (atualizar versão apenas)
- ✅ `AI_CONTEXT.md` — adicionada seção GTM/GA4
- ✅ `PROJECT_TECHNICAL_SPEC.md` — nova seção 17: GTM/GA4 (seções renumeradas)

Benefício: Deploy é agora 5 passos, não 30.

### 📝 Context Vivo Atualizado

- `AI_CONTEXT.md` — adicionada seção GTM (status atual)
- `PROJECT_TECHNICAL_SPEC.md` — seção 17 novamente GTM (seção 18+ renumeradas)
- `CLAUDE.md` — mantém referências atualizadas
- `MIGRATION_NOTES.md` — sem mudanças (histórico)

---

## Como Começar

### GTM + GA4
1. Leia `GTM_SETUP.md`
2. Crie container no Google Tag Manager
3. Conecte GA4
4. Adicione `VITE_GTM_ID` em `.env.local`
5. Teste: `npm run dev` → DevTools → `window.dataLayer`

### Deploy
1. Leia `deploy/README.md` (quick start)
2. Primeira vez: `deploy/PORTAINER.md`
3. Atualizações: `deploy/PORTAINER-ATUALIZAR.md`
