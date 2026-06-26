import { parsePhoneNumberFromString } from "libphonenumber-js";

export const MOBILE_PHONE_ERROR = "Informe um número de celular válido.";

/**
 * Validates E.164 mobile numbers only.
 *
 * Rejects FIXED_LINE and FIXED_LINE_OR_MOBILE. Numbering plans such as NANP
 * (US/Canada) often return FIXED_LINE_OR_MOBILE because the plan does not
 * distinguish mobile from landline — users in those regions may be rejected
 * even with a real mobile number. This is an accepted trade-off to avoid
 * storing landlines.
 */
export function isValidMobileE164(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;

  const parsed = parsePhoneNumberFromString(trimmed);
  if (!parsed?.isValid()) return false;

  const type = parsed.getType();
  if (type === "MOBILE") return true;

  if (type === "FIXED_LINE" || type === "FIXED_LINE_OR_MOBILE") {
    return false;
  }

  return false;
}
