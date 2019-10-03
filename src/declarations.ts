// Typing for untyped variables
// Needs to be global-scoped in a non-module (module is something with at least one import/export)

declare module 'ackee-node-logger' {
    interface LogFunction {
        (message?: string): void;
        (object: any, message?: string): void;
    }
    export const debug: LogFunction;
    export const error: LogFunction;
    export const fatal: LogFunction; // Google Stack Driver note - log level 'critical'
    export const info: LogFunction;
    export const trace: LogFunction; // Google Stack Driver note - does not have 'trace' level
    export const warn: LogFunction;
}

// Extends express request interrface for app-required types
declare namespace Express {
    export interface Request {
        user?: any;
        i18n?: any;
        context?: any;
    }
}
