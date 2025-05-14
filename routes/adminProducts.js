import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { adminOnly } from '../middleware/roleMiddleware.js';
import * as productController from '../controllers/productController.js';

const router = Router();

router.get('/', requireAuth, adminOnly, productController.renderAdminProductList);
router.get('/new', requireAuth, adminOnly, productController.renderCreateProductForm);
router.post('/', requireAuth, adminOnly, productController.createProduct);
router.get('/:id/edit', requireAuth, adminOnly, productController.renderEditProductForm);
router.post('/:id', requireAuth, adminOnly, productController.updateProduct);
router.post('/:id/delete', requireAuth, adminOnly, productController.deleteProduct);

export default router;
