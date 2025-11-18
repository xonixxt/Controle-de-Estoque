import User from '../models/User';

/**
 * Garante que exista uma conta admin no banco ao iniciar o servidor.
 * Lê `ADMIN_EMAIL` e `ADMIN_PASSWORD` do ambiente; se não estiverem definidos,
 * usa valores padrão (úteis para desenvolvimento). Se o usuário já existir,
 * garante `role='admin'` e opcionalmente atualiza a senha se `ADMIN_PASSWORD` foi fornecida.
 */
export async function ensureAdmin() {
  try {
    const email = process.env.ADMIN_EMAIL || 'admin@example.com';
    const password = process.env.ADMIN_PASSWORD || 'SenhaForte123';

    const existing = await User.findOne({ email });
    if (existing) {
      let changed = false;
      if (existing.role !== 'admin') {
        existing.role = 'admin';
        changed = true;
      }
      if (process.env.ADMIN_PASSWORD) {
        existing.password = password;
        changed = true;
      }
      if (changed) {
        await existing.save();
        console.log('Conta admin atualizada:', email);
      } else {
        console.log('Conta admin já existe:', email);
      }
      return;
    }

    const u = new User({ name: 'Admin', email, password, role: 'admin' });
    await u.save();
    console.log('Conta admin criada:', email);
  } catch (err) {
    console.error('Erro ao garantir admin:', err);
  }
}

export default ensureAdmin;
