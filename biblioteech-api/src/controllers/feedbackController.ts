import { Request, Response } from 'express';
import Feedback from '../models/Feedback';

// Função que mapeia número ou palavra para intenção
const mapOpcaoParaIntent = (texto: string): string => {
  const msg = texto.trim().toLowerCase();

  switch (msg) {
    case '1':
    case 'categorias':
    case 'categoria':
      return 'categoria';
    case '2':
    case 'emprestimo':
    case 'como pegar':
      return 'emprestimo';
    case '3':
    case 'suporte':
    case 'tecnico':
      return 'tecnico';
    case '4':
    case 'sugestao':
    case 'feedback':
      return 'feedback_opcao';
    case 'oi':
    case 'olá':
      return 'saudacao';
    default:
      return 'geral';
  }
};

// Saudação baseada na hora
const saudacaoHora = (): string => {
  const hora = new Date().getHours();
  if (hora >= 5 && hora < 12) return 'Bom dia! 🌞';
  if (hora >= 12 && hora < 18) return 'Boa tarde! 🌤️';
  return 'Boa noite! 🌙';
};

// Menu inicial
const menuInicial = (): string => {
  return `${saudacaoHora()} Bem-vindo à Biblioteca Virtual Bibliotech!\nEscolha uma opção para continuar:\n1 – Categorias de livros\n2 – Como pegar livros emprestados\n3 – Suporte Técnico\n4 – Enviar sugestão/feedback`;
};

// Rota principal do bot
export const createFeedback = async (req: Request, res: Response) => {
  try {
    const { texto, isFeedback } = req.body; 
    // isFeedback = true se usuário está enviando feedback após escolher 4

    let respostaBot = '';
    let intent = '';

    if (isFeedback) {
      // Usuário enviou mensagem de feedback
      intent = 'feedback';
      respostaBot = '✉️ Obrigado pelo seu feedback! Ele será analisado para melhorar nossa biblioteca.';
    } else {
      // Mapeia intenção da escolha inicial
      intent = mapOpcaoParaIntent(texto);

      switch (intent) {
        case 'saudacao':
          respostaBot = menuInicial();
          break;

        case 'categoria':
          respostaBot = `📖 Categorias disponíveis: Ficção, Romance, Aventura, Tecnologia, Ciências e muito mais.`;
          break;

        case 'emprestimo':
          respostaBot = `📚 Para pegar um livro:\n1. Acesse o livro desejado na plataforma\n2. Clique em "Reservar"\n3. Siga as instruções para empréstimo virtual.`;
          break;

        case 'tecnico':
          respostaBot = `🛠️ Suporte Técnico:\nSe encontrou algum problema, abra um chamado em: https://bibliotech.com/suporte`;
          break;

        case 'feedback_opcao':
          respostaBot = `✉️ Você escolheu enviar uma sugestão/feedback. Por favor, digite sua mensagem agora.`;
          intent = 'feedback_opcao';
          break;

        case 'geral':
        default:
          respostaBot = `Não entendi sua mensagem 😅. Por favor, escolha uma das opções:\n${menuInicial()}`;
          break;
      }
    }

    // Salvar no banco
    const novoFeedback = new Feedback({
      texto,
      topico: intent,
      sentimento: 'neutro',
      score: 0,
      respostaBot,
    });

    await novoFeedback.save();

    return res.status(201).json({
      message: 'Mensagem processada',
      resposta: respostaBot,
      data: novoFeedback,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno' });
  }
};