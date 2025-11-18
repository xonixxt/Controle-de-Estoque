
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const uri = process.env.MONGODB_URI || process.argv[2];
const adminEmail = process.env.ADMIN_EMAIL || process.argv[3];
const adminPassword = process.env.ADMIN_PASSWORD || process.argv[4];

if (!uri) {
  console.error('Forneça MONGODB_URI como variável de ambiente ou primeiro argumento');
  process.exit(1);
}
if (!adminEmail || !adminPassword) {
  console.error('Forneça ADMIN_EMAIL e ADMIN_PASSWORD via env ou args');
  console.error('Ex: node scripts/create_admin.js "<MONGODB_URI>" "admin@ex.com" "Senha123"');
  process.exit(1);
}

async function main() {
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: String,
  }, { timestamps: true });

  const User = mongoose.model('UserScript', userSchema, 'users');

  const hashed = await bcrypt.hash(adminPassword, 10);

  const existing = await User.findOne({ email: adminEmail });
  if (existing) {
    existing.password = hashed;
    existing.role = 'admin';
    existing.name = existing.name || 'Admin';
    await existing.save();
    console.log('Admin atualizado:', existing.email);
  } else {
    const u = new User({ name: 'Admin', email: adminEmail, password: hashed, role: 'admin' });
    await u.save();
    console.log('Admin criado:', adminEmail);
  }

  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
