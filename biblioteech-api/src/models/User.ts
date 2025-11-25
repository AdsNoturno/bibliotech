import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// 1. Interface para tipagem
export interface IUser extends Document {
  name: string;
  email: string;
  password: string; // Senha já hasheada
  isVirtual: boolean;
  isAdmin: boolean; 
  matchPassword(enteredPassword: string): Promise<boolean>;
}

// 2. Esquema do Usuário
const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVirtual: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false } 
}, {
  timestamps: true, // Adiciona createdAt e updatedAt
});

// ----------------------------------------------------
// MIDDLEWARE (Hook Pre-Save)
// ----------------------------------------------------

// 3. Este hook roda ANTES de o documento ser salvo
UserSchema.pre<IUser>('save', async function (next) {
  // Se a senha não foi modificada, vá para o próximo middleware
  if (!this.isModified('password')) {
    next();
    return;
  }
  
  // Gera o salt (código aleatório para o hash)
  const salt = await bcrypt.genSalt(10);
  // Faz o hash da senha e a salva no objeto
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ----------------------------------------------------
// MÉTODOS
// ----------------------------------------------------

// 4. Método para comparar senhas no login
UserSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 5. Cria e exporta o modelo
const User = mongoose.model<IUser>('User', UserSchema);
export default User;