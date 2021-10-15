import logger from './logger'

/**
 * Handles multiple shutdown calls
 */
let shuttingDown = false

/**
 * Gracefully closes all listeners
 *
 * Process exit codes:
 *  0 - shutdown (including force shutdown)
 *  1 - caused by uncaught exception
 *  2 - error during graceful shutdown
 */
const shutdown = (
  appShutdown: AppShutdown,
  event: string,
  force = false,
  exitCode = 0
) => async ({ error, signal }: { error?: Error; signal?: NodeJS.Signals }) => {
  logger.info(`Shutdown called! Event: ${event}, with exit code: ${exitCode}`)

  if (!error && !signal) return

  if (error) {
    logger.error(error)
    process.exit(exitCode)
  }
  if (signal && !['SIGINT', 'SIGTERM'].includes(signal)) {
    logger.error({ signal })
    process.exit(exitCode)
  }

  if (force) {
    process.exit(exitCode)
  }

  if (shuttingDown) {
    return
  }

  shuttingDown = true

  try {
    await appShutdown()
    logger.flush()
  } catch (error) {
    logger.error(error, 'Graceful shutdown failed. Force exiting.')
    process.exit(2)
  }
  logger.info('Server shutdown gracefully')
}

/** Close everything. Close HTTP server, close database connections etc. */
export type AppShutdown = () => Promise<void>

export const prepareForGracefulShutdown = (appShutdown: AppShutdown) => {
  process.on('uncaughtException', error => {
    void shutdown(appShutdown, 'uncaughtException', true, 1)({ error })
  })
  process.on('SIGINT', signal => {
    void shutdown(appShutdown, 'SIGINT')({ signal })
  })
  process.on('SIGTERM', signal => {
    void shutdown(appShutdown, 'SIGTERM')({ signal })
  })
}
