import { ErrorRequestHandler, Express, RequestHandler } from 'express';
import * as functions from 'firebase-functions';
import { createServer } from 'unicore';
import config from './config';
import * as routes from './config/routes';

// Create a Cloud Function handler based on Express' Request handler.
// This utilizes already defined express request handlers and routers, which
// can then be used as a CF handler.
export const cloudify = (handler: RequestHandler | ErrorRequestHandler) => {
    // TODO: Types. Wait until Unicore fixes server type.
    const app = (createServer() as any) as Express;
    app.use(handler);
    return functions.region(config.functions.region).https.onRequest(app);
};

// Each export defines a single function.
// Separating functions can be useful, because referenced dependecies may have
// impact on CF cold start. The more modules you use, the longer the CF takes
// to start. See https://mikhail.io/serverless/coldstarts/gcp/
export const api = cloudify(routes.api);
export const hello = cloudify(routes.defaultRootHandler);
export const healthz = cloudify(routes.healthz);
