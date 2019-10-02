import { HttpJsonError } from 'app/errors/coreClasses';
import { NextFunction, Request, Response } from 'express';

const httpErrorResponder = (error: HttpJsonError, _req: Request, res: Response, _next: NextFunction) => {
    res.status(error.status || 500);
    const serializedError = error.toJSON
        ? { error: error.toJSON() }
        : { error: { ...error, message: error.message, stack: error.stack } };
    (res as any).out = serializedError;

    res.json(serializedError);
};

export default httpErrorResponder;
