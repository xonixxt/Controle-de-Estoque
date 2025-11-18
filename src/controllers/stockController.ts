import { Request, Response } from 'express';
import mongoose from 'mongoose';
import StockMovement from '../models/StockMovement';
import Product from '../models/Product';

export const listMovements = async (req: Request, res: Response) => {
  const { product } = req.query;
  const filter: any = {};
  if (product) filter.product = product;
  const movements = await StockMovement.find(filter).populate('product').populate('user').sort({ createdAt: -1 });
  res.json(movements);
};

export const createMovement = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  try {
    const { product: productId, type, quantity, reason } = req.body;
    if (!productId || !type || !quantity) return res.status(400).json({ message: 'Campos faltando' });

    await session.withTransaction(async () => {
      const product = await Product.findById(productId).session(session);
      if (!product) throw new Error('Produto não encontrado');

      const qty = Number(quantity);
      if (type === 'saida' && product.quantity < qty) throw new Error('Quantidade insuficiente');

      product.quantity = type === 'entrada' ? product.quantity + qty : product.quantity - qty;
      if (product.quantity <= 0) {
        const movement = new StockMovement({
          product: productId,
          type,
          quantity: qty,
          user: (req as any).user?.id,
          reason,
        });
        await movement.save({ session });
        await Product.deleteOne({ _id: productId }).session(session);
        res.status(201).json(movement);
      } else {
        await product.save({ session });
        const movement = new StockMovement({
          product: productId,
          type,
          quantity: qty,
          user: (req as any).user?.id,
          reason,
        });
        await movement.save({ session });
        res.status(201).json(movement);
      }
    });
  } catch (err: any) {
    console.error(err);
    const msg = err.message || 'Erro no servidor';
    if (msg.includes('Quantidade insuficiente') || msg.includes('Produto não encontrado')) return res.status(400).json({ message: msg });
    res.status(500).json({ message: 'Erro no servidor' });
  } finally {
    session.endSession();
  }
};

export default { listMovements, createMovement };
