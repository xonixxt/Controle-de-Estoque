import mongoose from 'mongoose';
import dotenv from 'dotenv';

// mongodb-memory-server is only needed for tests; import lazily when required
let mongoMemoryServer: any = null;

dotenv.config();

export const connectDatabase = async () => {
  try {
    if (process.env.NODE_ENV === 'test') {
      // use in-memory MongoDB for tests
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create();
      const uri = mongoMemoryServer.getUri();
      console.log('Usando MongoMemoryServer para testes');
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 30000 } as any);
      return;
    }

    const mongoUri = process.env.MONGODB_URI || '';
    if (!mongoUri) {
      throw new Error('MONGODB_URI ausente');
    }

    const parsed = new URL(mongoUri);
    const dbName = parsed.pathname?.replace('/', '') || '(default)';
    console.log(`Conectando ao host ${parsed.host} db ${dbName}`);

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 30000,
    } as any);

    console.log('Database conectado com sucesso');
  } catch (error) {
    console.error('Erro ao conectar no banco:', error);
    // In test environment, rethrow so tests can handle failures
    if (process.env.NODE_ENV === 'test') throw error;
    process.exit(1);
  }
};

export const closeDatabase = async () => {
  try {
    await mongoose.disconnect();
    if (mongoMemoryServer) {
      await mongoMemoryServer.stop();
      mongoMemoryServer = null;
    }
  } catch (error) {
    console.error('Erro ao desconectar o banco:', error);
  }
};
