import { Request, Response } from 'express';
import { defaults, get } from 'lodash';

interface DefaultUser {
    id: any;
}

// Context for all incoming messages
export interface HttpContext<User = DefaultUser> {
    user?: User;
    limit: number;
    offset: number;
    pagination: {
        limit: number;
        offset: number;
    };
    order: string;
    locale?: string;
    params: {
        [key: string]: string;
    };
    payload: any;
}

const createPaginationContext = (req: Request) => {
    const defaultLimit = 10;
    const defaultOffset = 0;
    const parse = (x: string) => parseInt(get(req, `query.${x}`), 10);
    return {
        get limit() {
            return parse('limit') || defaultLimit;
        },
        get offset() {
            return parse('offset') || defaultOffset;
        },
    };
};

const createHttpContext = <User = DefaultUser>(httpContext: { req: Request; res: Response }): HttpContext<User> => {
    const { req } = httpContext;
    const pagination = createPaginationContext(req);
    return {
        get user() {
            return req.user;
        },
        get limit() {
            return pagination.limit;
        },
        get offset() {
            return pagination.offset;
        },
        get pagination() {
            return pagination;
        },
        get order() {
            return req.query.order;
        },
        get locale() {
            if (req && req.i18n) {
                return req.i18n.getLocale();
            }
            return null;
        },
        get params() {
            return defaults({}, req.headers, req.params, req.query);
        },
        get payload() {
            return req.body;
        },
    };
};

export default createHttpContext;
