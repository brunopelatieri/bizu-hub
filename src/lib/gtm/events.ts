/**
 * Eventos customizados para Google Analytics 4 (via GTM)
 *
 * window.dataLayer é injetado automaticamente pelo GTM script.
 * Use essas funções pra rastrear conversões e comportamento do usuário.
 */

export type DataLayerEvent = {
  event: string;
  [key: string]: unknown;
};

/**
 * Push evento para o dataLayer do GTM.
 * Valida se GTM está carregado antes de chamar.
 */
export function trackEvent(event: DataLayerEvent) {
  if (typeof window === "undefined") return;
  if (!window.dataLayer) return;

  window.dataLayer.push(event);
}

/**
 * Rastrear envio de formulário de contato.
 * Disparado quando o form é submetido COM SUCESSO.
 */
export function trackContactFormSubmission(data: {
  name: string;
  email: string;
}) {
  trackEvent({
    event: "generate_lead",
    event_category: "form",
    event_label: "contact_form",
    user_name: data.name,
    user_email: data.email,
  });
}

/**
 * Rastrear erro no formulário de contato.
 */
export function trackContactFormError(error: string) {
  trackEvent({
    event: "form_error",
    event_category: "form",
    event_label: "contact_form",
    error_message: error,
  });
}

/**
 * Rastrear visualização de página.
 * GA4 já rastreia automaticamente via GTM, mas use pra eventos customizados.
 */
export function trackPageView(props: {
  page_title: string;
  page_path: string;
}) {
  trackEvent({
    event: "page_view",
    page_title: props.page_title,
    page_path: props.page_path,
  });
}

/**
 * Rastrear clique em botão de CTA principal.
 */
export function trackCTAClick(label: string) {
  trackEvent({
    event: "click",
    event_category: "cta",
    event_label: label,
  });
}

/**
 * Rastrear clique em link externo.
 */
export function trackExternalLink(url: string, label: string) {
  trackEvent({
    event: "click",
    event_category: "external_link",
    event_label: label,
    external_url: url,
  });
}

/**
 * Rastrear scrolling (profundidade da página).
 * Use sparingly — GA4 já rastreia automaticamente.
 */
export function trackScroll(percentage: number) {
  trackEvent({
    event: "scroll",
    scroll_depth: percentage,
  });
}

declare global {
  interface Window {
    dataLayer: DataLayerEvent[];
  }
}
