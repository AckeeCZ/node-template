import * as helloService from '../../services/helloService';
import { bindContext, pipeMiddleware, respond } from '../utils/controllerUtils';

export const anyHello = pipeMiddleware(
    bindContext,
    respond(({ context }) => helloService.hello(context.params, context))
);
