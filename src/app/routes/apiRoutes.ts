import { createRouter } from 'unicore'

import { baseController } from '../controllers/api/genericControllers'
import { hello } from '../services/helloService'

const router = createRouter()

router.all('/hello', baseController(hello))

export default router
