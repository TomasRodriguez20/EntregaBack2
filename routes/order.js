import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { createOrder } from '../controllers/createOrder.js';

const router = Router();

router.post('/create', requireAuth, createOrder);
router.get('/confirmation/:orderId', requireAuth, async (req, res) => {
  const order = await Order.findById(req.params.orderId);
  if (!order) return res.status(404).send('Orden no encontrada');
  res.render('order-confirmation', { order, user: req.user });
});

export default router;
