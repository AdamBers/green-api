import { parsePhoneNumberFromString } from 'libphonenumber-js/min';

export function normalizePhone(value: string): string | undefined {
  const phone = parsePhoneNumberFromString(value.trim());
  return phone?.isValid() ? phone.number : undefined;
}

export function formatPhone(value: string): string {
  return parsePhoneNumberFromString(value)?.formatInternational() ?? value;
}
