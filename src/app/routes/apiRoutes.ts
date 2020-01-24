import { createRouter } from 'unicore';

import { baseController } from 'app/controllers/api/genericControllers';
import { hello } from 'app/services/helloService';

const router = createRouter();

router.all('/hello', baseController(hello));

export default router;
