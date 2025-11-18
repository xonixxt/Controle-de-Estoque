import { Router } from 'express';
import { body } from 'express-validator';
import requireAuth from '../middlewares/auth';
import * as stockCtrl from '../controllers/stockController';

const router = Router();

router.get('/', requireAuth, stockCtrl.listMovements);
router.post('/', requireAuth, [
  body('product').notEmpty().withMessage('Produto é obrigatório'),
  body('type').isIn(['entrada','saida']).withMessage('Tipo inválido'),
  body('quantity').isInt({ gt: 0 }).withMessage('Quantidade deve ser maior que zero'),
], stockCtrl.createMovement);

export default router;
