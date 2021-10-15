import * as functions from 'firebase-functions'
import { safeConfig } from './config'
import logger from './logger'

logger.info(safeConfig, 'Configuration loaded')
