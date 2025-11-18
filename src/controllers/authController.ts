import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Product from '../models/Product';

const jwtSecret = process.env.JWT_SECRET || 'secret';

export const register = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email já cadastrado' });

    const user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, { expiresIn: '1d' });
    return res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro no servidor' });
  }
};

export const login = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Credenciais inválidas' });

    const match = await user.comparePassword(password);
    if (!match) return res.status(400).json({ message: 'Credenciais inválidas' });

    const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, { expiresIn: '1d' });
    return res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro no servidor' });
  }
};

export const listUsers = async (req: any, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Token não fornecido' });
    if (user.role !== 'admin') return res.status(403).json({ message: 'Acesso negado' });

    const users = await User.find({}, { password: 0, __v: 0 }).lean();

    const results = await Promise.all(users.map(async (u: any) => {
      const count = await Product.countDocuments({ owner: u._id });
      return { id: u._id, name: u.name, email: u.email, role: u.role, productCount: count };
    }));

    return res.json(results);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro no servidor' });
  }
};

export const deleteUser = async (req: any, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Token não fornecido' });
    if (user.role !== 'admin') return res.status(403).json({ message: 'Acesso negado' });

    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'ID do usuário é necessário' });
    if (id === user.id) return res.status(400).json({ message: 'Não é possível deletar a própria conta' });

    const target = await User.findById(id);
    if (!target) return res.status(404).json({ message: 'Usuário não encontrado' });
    if (target.role === 'admin') return res.status(400).json({ message: 'Não é permitido excluir usuários com papel admin' });

    await User.findByIdAndDelete(id);

    // Remover produtos do usuário deletado
    await Product.deleteMany({ owner: id });

    return res.json({ message: 'Usuário e produtos associados removidos' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro no servidor' });
  }
};

export default { register, login, listUsers, deleteUser };
