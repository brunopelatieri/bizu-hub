/**
 * Componente Google Tag Manager
 *
 * Injecta o script de GTM no <head> do documento.
 * Deve ser renderizado apenas no cliente (usa typeof window).
 * Em SSR (React Router Framework Mode), é seguro pois não faz nada no server.
 *
 * Uso: coloque em src/root.tsx no <Layout /> ou <App />
 */

import { useEffect } from "react";
import { gtmConfig, isGTMEnabled } from "@/lib/gtm/config";

export function GoogleTagManager() {
  useEffect(() => {
    // Se GTM não está configurado, não fazer nada
    if (!isGTMEnabled()) {
      console.warn(
        "[GTM] VITE_GTM_ID não configurado. Google Tag Manager desabilitado.",
      );
      return;
    }

    // Se window.dataLayer já existe, GTM já foi carregado
    if (window.dataLayer) {
      return;
    }

    // Inicializar dataLayer
    window.dataLayer = window.dataLayer || [];

    function gtag(...args: unknown[]) {
      window.dataLayer.push(arguments);
    }

    // Configurar defaults
    gtag("js", new Date());
    gtag("config", gtmConfig.id);

    // Injetar script de GTM
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmConfig.id}`;

    const firstScript = document.getElementsByTagName("script")[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    } else {
      document.head.appendChild(script);
    }

    // Log em desenvolvimento
    if (gtmConfig.environment === "development") {
      console.log(`[GTM] Carregado com sucesso: ${gtmConfig.id}`);
    }
  }, []);

  return null;
}
