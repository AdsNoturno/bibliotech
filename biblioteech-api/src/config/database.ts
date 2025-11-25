import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("❌ ERRO: MONGO_URI está undefined!");
    process.exit(1);
  }
  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB conectado com sucesso!");
  } catch (err) {
    console.error("❌ Erro ao conectar ao MongoDB:", err);
    process.exit(1);
  }
}
