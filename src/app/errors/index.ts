// Assure code is same as key in the object
const checkErrors = <
  T extends { [X in keyof T]: { code: X; message: string } }
>(
  errors: T
) => errors

export const E_CODES = checkErrors({
  UNKNOWN: { code: 'UNKNOWN', message: 'Unknown error' },
} as const)
