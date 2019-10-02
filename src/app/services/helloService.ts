import { HttpContext } from 'app/controllers/utils/httpContext';

export const hello = (_params: any, context: HttpContext) => {
    return { hello: 'World', payload: context.payload };
};

export const sum = (...xs: number[]) => xs.reduce((a, b) => a + b, 0);
