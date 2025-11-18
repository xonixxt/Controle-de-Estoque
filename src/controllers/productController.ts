import { Request, Response } from 'express';
import Product from '../models/Product';
import { AuthRequest } from '../middlewares/auth';

export const listProducts = async (req: AuthRequest, res: Response) => {
  try {
    
    const user = req.user;
    // Se o requester for admin, ele pode opcionalmente filtrar por owner via query param
    if (user && user.role === 'admin') {
      const ownerFilter = (req.query && (req.query.owner as string)) || null;
      const q: any = {};
      if (ownerFilter) q.owner = ownerFilter;
      const products = await Product.find(q);
      return res.json(products);
    }
    if (!user) return res.status(401).json({ message: 'Token não fornecido' });
    const products = await Product.find({ owner: user.id });
    return res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

export const getProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Produto não encontrado' });
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Token não fornecido' });
    if (product.owner && product.owner.toString() !== user.id && user.role !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { name, price, quantity, sku } = req.body;
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Token não fornecido' });
    
      const normalize = (s: string) =>
        s
          .toString()
          .trim()
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/\s+/g, ' ');
    const normalizedName = normalize(name || '');
    
    let existing = null as any;
    if (normalizedName) {
      existing = await Product.findOne({ normalizedName, owner: user.id });
    }

    if (existing) {
      
      existing.name = name || existing.name;
      existing.price = typeof price === 'number' ? price : existing.price;
      const addQty = typeof quantity === 'number' ? quantity : 0;
      existing.quantity = (existing.quantity || 0) + addQty;
      
      if (sku) existing.sku = sku;
      await existing.save();
      const populated = await Product.findById(existing._id);
      return res.json(populated);
    }

    const product = new Product({ name, normalizedName, price, quantity, sku, owner: user.id });
    await product.save();
    const populated = await Product.findById(product._id);
    res.status(201).json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, price, quantity, sku } = req.body;
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Token não fornecido' });

    const update: any = { ...req.body };

    
    if (typeof name === 'string' && name.trim() !== '') {
      const normalize = (s: string) =>
        s
          .toString()
          .trim()
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/\s+/g, ' ');
      update.normalizedName = normalize(name);
    }

    

    
    const existing = await Product.findById(id);
    if (!existing) return res.status(404).json({ message: 'Produto não encontrado' });
    if (existing.owner && existing.owner.toString() !== user.id && user.role !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    const updated = await Product.findByIdAndUpdate(id, update, { new: true });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Token não fornecido' });
    const existing = await Product.findById(id);
    if (!existing) return res.status(404).json({ message: 'Produto não encontrado' });
    if (existing.owner && existing.owner.toString() !== user.id && user.role !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    await Product.findByIdAndDelete(id);
    res.json({ message: 'Produto removido' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

export default { listProducts, getProduct, createProduct, updateProduct, deleteProduct };
