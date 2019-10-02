import { compose, Middleware } from 'compose-middleware';
import { NextFunction, Request, Response } from 'express';
import { mapValues, omit, values } from 'lodash';
import httpContext from './httpContext';

type Handler = (req: Request, res: Response, next: NextFunction) => any;
type SimpleHandler = (req: Request, res: Response) => any;
type WriteResponse = (req: Request, res: Response, data?: any) => any;
const writeResponse: WriteResponse = (_req, res, data) => res.json(data);

const respond = (
    controllerHandler: SimpleHandler,
    statusCode = 200,
    respondFn: WriteResponse = writeResponse
): Handler => async (req, res, next) => {
    try {
        const result = await controllerHandler(req, res);
        res.status(statusCode);
        return respondFn(req, res, result);
    } catch (error) {
        next(error);
    }
};

const omitOrder = (o: any) => omit(o, ['order']);
const omitPagination = (o: any) => omit(o, ['limit', 'offset']);

const pipeMiddleware = (...middlewares: Array<Middleware<Request, Response>>) => compose(middlewares);

const bindContext = (req: Request, res: Response, next: NextFunction) => {
    req.context = httpContext({ req, res });
    next();
};

const meTranslate = (req: Request, res: Response, next: NextFunction) => {
    const context = req.context || httpContext({ req, res });

    if (!context.user) {
        return next();
    }

    const translate = (object: any): any =>
        mapValues(object, (value: any) => {
            if (Array.isArray(value)) {
                return values(translate(value));
            }
            return value === 'me' ? context.user.id : value;
        });

    req.params = translate(req.params);
    req.query = translate(req.query);

    next();
};

export { respond, omitOrder, omitPagination, pipeMiddleware, bindContext, meTranslate };
