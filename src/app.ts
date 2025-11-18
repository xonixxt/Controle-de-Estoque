import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import stockRoutes from './routes/stock';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'API de Controle de Estoque',
    version: '1.0.0',
    status: 'online'
  });
});

app.use('/api/products', productRoutes);
app.use('/api/stock', stockRoutes);

export default app;
