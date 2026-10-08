export type FieldErrors = Partial<Record<string, string>>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim())
}

/** Mirrors the backend rule: Password::min(8)->letters()->numbers(). */
export function passwordError(value: string): string | undefined {
  if (value.length < 8) return 'Use at least 8 characters.'
  if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) return 'Include both letters and numbers.'
  return undefined
}

/** Random temporary password that satisfies passwordError(). */
export function generatePassword(): string {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz'
  const digits = '23456789'
  const pick = (chars: string) => chars[crypto.getRandomValues(new Uint32Array(1))[0] % chars.length]
  const body = Array.from({ length: 9 }, () => pick(letters + digits)).join('')
  return `${pick(letters)}${body}${pick(digits)}${pick(digits)}`
}

/** Adds https:// when the user types a bare domain, so it passes Laravel's url rule. */
export function normalizeUrl(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) return ''
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

export function isUrl(value: string): boolean {
  try {
    const url = new URL(normalizeUrl(value))
    return url.hostname.includes('.')
  } catch {
    return false
  }
}

/** Returns the first step index that contains one of the errored fields. */
export function firstStepWithError(
  stepFields: ReadonlyArray<ReadonlyArray<string>>,
  errors: FieldErrors,
): number {
  const index = stepFields.findIndex((fields) => fields.some((f) => errors[f]))
  return index === -1 ? stepFields.length - 1 : index
}
