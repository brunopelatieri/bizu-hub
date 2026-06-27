/** Escapa `%`, `_` e `\` para uso seguro em padrões ILIKE. */
export function escapeIlike(input: string): string {
  return input.replace(/[%_\\]/g, "\\$&");
}
