// Extends express request interface for app-required types
declare namespace Express {
    export interface Request {
        user?: any;
        i18n?: any;
        context?: any;
    }
}
