import { NlpManager } from 'node-nlp';
import fs from 'fs';
import path from 'path';

// Caminho onde o modelo treinado será salvo
const MODEL_PATH = path.join(__dirname, '../../model.nlp');

class NlpService {
  private manager: any;

  constructor() {
    // Inicializa o gestor para português (pt)
    this.manager = new NlpManager({ languages: ['pt'], nlu: { useNoneFeature: true } });
    this.init();
  }

  async init() {
    // Se o modelo já existir, carrega-o. Caso contrário, treina um novo.
    if (fs.existsSync(MODEL_PATH)) {
      this.manager.load(MODEL_PATH);
      console.log('🧠 Modelo NLP carregado do ficheiro.');
    } else {
      await this.train();
    }
  }

  async train() {
    console.log('🧠 A iniciar treino da IA...');
    
    // --- INTENÇÃO: ACERVO (Livros, Biblioteca física) ---
    this.manager.addDocument('pt', 'o livro está rasgado', 'acervo');
    this.manager.addDocument('pt', 'faltam páginas no livro', 'acervo');
    this.manager.addDocument('pt', 'gostaria de sugerir um livro', 'acervo');
    this.manager.addDocument('pt', 'onde fica o livro de história', 'acervo');
    this.manager.addDocument('pt', 'livro muito velho', 'acervo');

    // --- INTENÇÃO: FINANCEIRO (Multas, Pagamentos) ---
    this.manager.addDocument('pt', 'a multa está muito cara', 'financeiro');
    this.manager.addDocument('pt', 'quero saber o valor da multa', 'financeiro');
    this.manager.addDocument('pt', 'como pago o boleto', 'financeiro');
    this.manager.addDocument('pt', 'tenho uma dívida pendente', 'financeiro');
    this.manager.addDocument('pt', 'cobrança errada', 'financeiro');

    // --- INTENÇÃO: TÉCNICO (Site, Login, Wi-Fi) ---
    this.manager.addDocument('pt', 'o site está lento', 'tecnico');
    this.manager.addDocument('pt', 'não consigo fazer login', 'tecnico');
    this.manager.addDocument('pt', 'esqueci a minha senha', 'tecnico');
    this.manager.addDocument('pt', 'o wifi não conecta', 'tecnico');
    this.manager.addDocument('pt', 'erro no sistema', 'tecnico');

    // --- INTENÇÃO: ELOGIO ---
    this.manager.addDocument('pt', 'bom atendimento', 'elogio');
    this.manager.addDocument('pt', 'gosto muito da biblioteca', 'elogio');
    this.manager.addDocument('pt', 'obrigado pela ajuda', 'elogio');

    // Treina e salva o modelo
    await this.manager.train();
    this.manager.save(MODEL_PATH);
    console.log('✅ IA Treinada e guardada com sucesso!');
  }

  async processarMensagem(texto: string) {
    // Processa o texto recebido
    const result = await this.manager.process('pt', texto);
    
    // Lógica de Sentimento baseada no score (-1 a 1)
    const score = result.sentiment.score;
    let sentimento = 'Neutro';
    if (score > 0.1) sentimento = 'Positivo';
    if (score < -0.1) sentimento = 'Negativo';

    // Retorna o objeto formatado para o Controller
    return {
      intent: result.intent || 'geral', // Tópico identificado
      sentimento,                       // Rótulo do sentimento
      score,                            // Pontuação numérica
      answer: result.answer             // Resposta automática (se configurada)
    };
  }
}

// Exporta uma instância única (Singleton)
export default new NlpService();