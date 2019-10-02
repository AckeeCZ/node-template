import { mapValues } from 'lodash';

enum ErrorCodes {
    TEMPLATE_TEST = 'Unicorn cries',
    e0000 = "I'm a teapot",
    e2 = '',
}

// Type hacking for simplified error notation and code suggestions
export const E_CODES = (mapValues(
    ErrorCodes,
    (message: string, code: string): any => ({ message, code })
) as any) as typeof ErrorCodes;
