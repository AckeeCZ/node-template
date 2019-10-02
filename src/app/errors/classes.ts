import { E_CODES } from '.';
import * as coreErrors from './coreClasses';

type E_CODE = typeof E_CODES[keyof typeof E_CODES];

const apiErrorData = (error?: E_CODE, errorData?: object) => {
    const { message, code } = (error as any) || { message: '', code: '' };
    return [code, message, errorData] as [string, string, any];
};

/* tslint:disable:max-classes-per-file */
export class BadRequest extends coreErrors.HttpJsonError {
    constructor(error?: E_CODE, errorData?: object) {
        super(400, ...apiErrorData(error, errorData));
    }
}

export class NotAuthorized extends coreErrors.HttpJsonError {
    constructor(error?: E_CODE, errorData?: object) {
        super(403, ...apiErrorData(error, errorData));
    }
}

export class ValidationError extends coreErrors.HttpJsonError {
    constructor(error?: E_CODE, errorData?: object) {
        super(422, ...apiErrorData(error, errorData));
    }
}

export class NotAuthenticated extends coreErrors.HttpJsonError {
    constructor(error?: E_CODE, errorData?: object) {
        super(401, ...apiErrorData(error, errorData));
    }
}

export class NotFound extends coreErrors.HttpJsonError {
    constructor(error?: E_CODE, errorData?: object) {
        super(404, ...apiErrorData(error, errorData));
    }
}

export class ServerError extends coreErrors.HttpJsonError {
    constructor(error?: E_CODE, errorData?: object) {
        super(500, ...apiErrorData(error, errorData));
    }
}
