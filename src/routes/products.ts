import { Router } from 'express';
import { body } from 'express-validator';
import requireAuth from '../middlewares/auth';
import * as productCtrl from '../controllers/productController';

const router = Router();

router.get('/', requireAuth, productCtrl.listProducts);
router.get('/:id', requireAuth, productCtrl.getProduct);
router.post('/', requireAuth, [
  body('name').notEmpty().withMessage('Nome é obrigatório'),
  body('price').isNumeric().withMessage('Preço deve ser numérico'),
  body('quantity').optional().isInt({ min: 0 }).withMessage('Quantidade deve ser um inteiro >= 0'),
], productCtrl.createProduct);

router.put('/:id', requireAuth, [
  body('name').optional().notEmpty().withMessage('Nome não pode ser vazio'),
  body('price').optional().isNumeric().withMessage('Preço deve ser numérico'),
  body('quantity').optional().isInt({ min: 0 }).withMessage('Quantidade deve ser um inteiro >= 0'),
], productCtrl.updateProduct);
router.delete('/:id', requireAuth, productCtrl.deleteProduct);

export default router;
