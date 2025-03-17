import { Router } from 'express';
import { YourController } from '../controllers/index';

const router = Router();
const yourController = new YourController();

router.get('/your-endpoint', yourController.getAll);
router.get('/your-endpoint/:id', yourController.getById);
router.post('/your-endpoint', yourController.create);
router.put('/your-endpoint/:id', yourController.update);
router.delete('/your-endpoint/:id', yourController.delete);

export default router;