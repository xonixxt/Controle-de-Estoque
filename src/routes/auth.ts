import { Router } from 'express';
import { body } from 'express-validator';
import authController from '../controllers/authController';
import requireAuth from '../middlewares/auth';

const router = Router();

router.post(
  '/register',
  [body('name').notEmpty(), body('email').isEmail(), body('password').isLength({ min: 6 })],
  authController.register
);

router.post('/login', [body('email').isEmail(), body('password').notEmpty()], authController.login);
router.get('/users', requireAuth, authController.listUsers as any);
router.delete('/users/:id', requireAuth, authController.deleteUser as any);

export default router;
