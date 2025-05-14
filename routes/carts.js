import { Router } from 'express';
import * as cartController from '../controllers/cartController.js';
import { authMiddleware } from '../middleware/auth.js';


const router = Router();

router.get('/:cid', cartController.getCartById);
router.post('/:cid/product/:pid', authMiddleware, cartController.addProductToCart);
router.delete('/:cid/product/:pid', authMiddleware, cartController.removeProductFromCart);


export default router;