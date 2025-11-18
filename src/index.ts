import dotenv from 'dotenv';
import app from './app';
import { connectDatabase } from './config/database';
import { ensureAdmin } from './utils/initAdmin';

dotenv.config();

const port = process.env.PORT || 3000;

connectDatabase().then(async () => {
  // garante que exista um admin antes de iniciar o servidor
  await ensureAdmin();

  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
});
