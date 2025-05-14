import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { adminOnly } from '../middleware/roleMiddleware.js';

const router = Router();

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', adminOnly, userController.deleteUser);

router.post('/:id', async (req, res) => {
  try {
    await userController.updateUser(req, res);
    res.redirect('/profile?success=true');
  } catch (err) {
    console.error('Error al actualizar el usuario:', err);
    res.status(500).send('Error al actualizar el usuario');
  }
});


export default router;
