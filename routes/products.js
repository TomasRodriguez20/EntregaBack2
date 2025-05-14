import { Router } from 'express';
import * as productController from '../controllers/productController.js';
import { requireAuth } from '../middleware/auth.js';
import { adminOnly } from '../middleware/roleMiddleware.js';

const router = Router();

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

router.post('/', requireAuth, adminOnly, productController.createProduct);
router.put('/:id', requireAuth, adminOnly, productController.updateProduct);
router.delete('/:id', requireAuth, adminOnly, productController.deleteProduct);


export default router;