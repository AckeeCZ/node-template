import { createRouter } from 'unicore';

import * as helloController from '../controllers/api/helloController';

const router = createRouter();

router.all('/hello', helloController.anyHello);

export default router;
