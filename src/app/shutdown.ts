import logger from './logger'
import server from '../server'

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
const shutdown = (event: string, force = false, exitCode = 0) => async ({
  error,
  signal,
}: {
  error?: Error
  signal?: NodeJS.Signals
}) => {
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
    // Shutdown HTTP server
    await server.destroy()
    // Close connections to Databases etc.
    await Promise.all([
      //   knex.destroy(),
      //   redis.quit().catch((error: any) => {
      //     logger.error(error)
      //     redis.disconnect()
      //   }),
    ])
    logger.flush()
  } catch (error) {
    logger.error(error)
    process.exit(2)
  }
  logger.info('Server shutdown gracefully')
}

export const prepareForGracefulShutdown = () => {
  process.on('uncaughtException', error => {
    void shutdown('uncaughtException', true, 1)({ error })
  })
  process.on('SIGINT', signal => {
    void shutdown('SIGINT')({ signal })
  })
  process.on('SIGTERM', signal => {
    void shutdown('SIGTERM')({ signal })
  })
}
