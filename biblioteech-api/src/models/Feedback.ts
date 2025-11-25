import mongoose, { Schema, Document } from 'mongoose';

// Define a interface para o TypeScript entender os campos
export interface IFeedback extends Document {
  texto: string;        // O que o utilizador escreveu
  topico: string;       // O tema identificado (Financeiro, Técnico, etc.)
  sentimento: string;   // Positivo, Negativo ou Neutro
  score: number;        // Nota de confiança (ex: 0.9)
  respostaBot: string;  // A resposta que foi enviada ao utilizador
  createdAt: Date;      // Data de criação
}

// Define o esquema para o MongoDB
const FeedbackSchema: Schema = new Schema({
  texto: { type: String, required: true },
  topico: { type: String, required: true },
  sentimento: { type: String, required: true },
  score: { type: Number, required: true },
  respostaBot: { type: String }, // Opcional, pois pode não haver resposta em alguns casos
  createdAt: { type: Date, default: Date.now }
});

// Exporta o modelo para ser usado no Controller
export default mongoose.model<IFeedback>('Feedback', FeedbackSchema);