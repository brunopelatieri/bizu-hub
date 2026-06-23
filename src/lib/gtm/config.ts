/**
 * Configuração do Google Tag Manager (GTM)
 * Variável: VITE_GTM_ID (exemplo: GTM-XXXXXXX)
 *
 * Conecta ao GTM que injeta Google Analytics 4 (GA4) automaticamente.
 * Em produção, use variável de ambiente ou .env.local em dev.
 */

export const GTM_ID = import.meta.env.VITE_GTM_ID || "";

export const isGTMEnabled = () => {
  return GTM_ID.length > 0;
};

export const gtmConfig = {
  id: GTM_ID,
  enabled: isGTMEnabled(),
  environment: import.meta.env.MODE || "development",
  domain: "brunogoulart.com.br",
} as const;
