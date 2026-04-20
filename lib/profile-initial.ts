/** Single-letter avatar fallback from display name or email. */
export function getProfileInitialLetter(
  fullName: string | null | undefined,
  email: string | null | undefined
): string {
  const name = fullName?.trim()
  if (name && name.length > 0) {
    return name.charAt(0).toUpperCase()
  }
  const e = email?.trim()
  if (e && e.length > 0) {
    return e.charAt(0).toUpperCase()
  }
  return '?'
}
