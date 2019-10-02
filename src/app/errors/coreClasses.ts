/**
 * Standard json error with possibility to add response code
 * @property {string} name Name of it
 * @extends Error
 */
export class HttpJsonError extends Error {
    /**
     * @param message Error message
     * @param status Status code for http response
     * @param errorCode Custom error code for i.e. mobile app error handling (like email is already taken)
     */
    constructor(
        public readonly status: number,
        public readonly message: string,
        public readonly errorCode: string = '',
        public readonly errorData?: object
    ) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = this.constructor.name;
    }

    public toJSON() {
        return {
            message: this.message,
            status: this.status,
            errorCode: this.errorCode,
            errorData: this.errorData,
            errorClass: this.constructor.name,
            stack: this.stack,
        };
    }
}
