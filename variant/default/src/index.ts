import * as shutdown from './shutdown'
import { safeConfig } from './config'
import logger from './logger'

shutdown.prepareForGracefulShutdown(async () => {
  // Close HTTP server, close database etc.
})

logger.info(safeConfig, 'Configuration loaded')
