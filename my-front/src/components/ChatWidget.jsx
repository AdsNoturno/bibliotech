import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, BookOpen, Star, User, Smile } from "lucide-react";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Estado inicial das mensagens
  const [messages, setMessages] = useState([]);

  // Função para rolar o chat para o final
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Simulação de dados vindos do seu Catálogo
  const livrosRecentes = [
    { id: 1, titulo: "Dom Casmurro" },
    { id: 2, titulo: "1984" },
    { id: 3, titulo: "O Pequeno Príncipe" },
    { id: 4, titulo: "A Metamorfose" },
    { id: 5, titulo: "O Grande Gatsby" }
  ];

  // Gera a saudação baseada no horário
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  // Inicializa o chat com a saudação correta
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting = getGreeting();
      setMessages([
        {
          sender: "bot",
          text: `${greeting}! Sou o assistente virtual da biblioteca. Como posso ajudar você hoje?`,
          suggestions: ["Avaliar um livro", "Indicar um livro"]
        },
      ]);
    }
  }, [isOpen]);

  // Função para enviar mensagem
  const handleSend = async (textOverride = null) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim()) return;

    // Adiciona mensagem do usuário
    setMessages(prev => [...prev, { sender: "user", text: textToSend }]);
    setInput("");
    setIsLoading(true);

    // --- LÓGICA 1: RECOMENDAR LIVRO ---
    if (textToSend === "Indicar um livro" || textToSend === "Quero outra indicação") {
      setTimeout(() => {
        const randomLivro = livrosRecentes[Math.floor(Math.random() * livrosRecentes.length)];
        setMessages(prev => [
          ...prev,
          {
            sender: "bot",
            text: `Baseado no nosso catálogo, minha recomendação especial para você é: "${randomLivro.titulo}". É uma leitura fascinante!`,
            suggestions: ["Avaliar este livro", "Quero outra indicação"]
          }
        ]);
        setIsLoading(false);
      }, 800);
      return;
    }

    // --- LÓGICA 2: INICIAR AVALIAÇÃO ---
    if (textToSend === "Avaliar um livro" || textToSend === "Avaliar este livro") {
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            sender: "bot",
            text: "Que ótimo! Qual destes livros do nosso catálogo você gostaria de avaliar?",
            suggestions: livrosRecentes.slice(0, 3).map(l => l.titulo)
          }
        ]);
        setIsLoading(false);
      }, 800);
      return;
    }

    // --- LÓGICA 3: SELECIONAR LIVRO ESPECÍFICO ---
    const isBookSelection = livrosRecentes.some(l => l.titulo === textToSend);
    if (isBookSelection) {
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            sender: "bot",
            text: `Entendido. De 1 a 5 estrelas, qual sua nota para "${textToSend}"?`,
            suggestions: ["⭐ 1", "⭐⭐ 2", "⭐⭐⭐ 3", "⭐⭐⭐⭐ 4", "⭐⭐⭐⭐⭐ 5"]
          }
        ]);
        setIsLoading(false);
      }, 800);
      return;
    }

    // --- CORREÇÃO AQUI: CAPTURAR AS ESTRELAS ---
    // Verifica se a mensagem contém o emoji de estrela
    if (textToSend.includes("⭐")) {
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            sender: "bot",
            text: "Muito obrigado pela sua avaliação! ⭐ Sua opinião ajuda muito nossa comunidade.",
            suggestions: ["Indicar um livro", "Encerrar atendimento"]
          }
        ]);
        setIsLoading(false);
      }, 800);
      // Retornamos AQUI para não enviar "⭐" para a API e evitar o erro
      return; 
    }

    // --- ENVIO PADRÃO PARA API (Se não for nenhuma das opções acima) ---
    try {
      const response = await fetch("http://localhost:3000/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto: textToSend, userId: "usuario-anonimo" }),
      });

      const data = await response.json();
      const botReply = data.reply || (data.data && data.data.respostaBot) || "Obrigado pelo feedback!";

      setMessages(prev => [...prev, { sender: "bot", text: botReply }]);
    } catch (error) {
      console.error("Erro na API:", error);
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { 
            sender: "bot", 
            text: "Obrigado pela sua interação! (Nota: O servidor parece estar offline, mas registrei sua intenção localmente)." 
          },
        ]);
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* --- JANELA DO CHAT --- */}
      <div
        className={`fixed bottom-24 right-5 w-full max-w-[350px] md:w-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-purple-100 z-[9999] transition-all duration-300 ease-in-out origin-bottom-right ${
          isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-10 pointer-events-none"
        }`}
        style={{ height: isOpen ? '500px' : '0px' }}
      >
        {/* Cabeçalho */}
        <div className="bg-gradient-to-r from-purple-800 to-purple-600 text-white p-4 flex justify-between items-center shadow-md">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-1.5 rounded-full">
              <BookOpen size={18} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight">Biblioteca Digital</h3>
              <p className="text-xs text-purple-100 opacity-90">
                {isLoading ? "Digitando..." : "Online agora"}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)} 
            className="hover:bg-white/20 p-1.5 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Área de Mensagens */}
        <div className="flex-1 p-4 overflow-y-auto bg-purple-50 flex flex-col gap-4 custom-scrollbar">
          <div className="text-center text-xs text-gray-400 my-2">
            Hoje, {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>

          {messages.map((msg, i) => (
            <div key={i} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
              <div className="flex items-end gap-2 max-w-[85%]">
                {msg.sender === "bot" && (
                  <div className="w-6 h-6 rounded-full bg-purple-200 flex items-center justify-center flex-shrink-0 text-purple-700">
                    <Smile size={14} />
                  </div>
                )}
                
                <div
                  className={`p-3 rounded-2xl text-sm shadow-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-purple-700 text-white rounded-br-none"
                      : "bg-white text-gray-700 border border-purple-100 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>

              {/* Sugestões / Chips de Resposta Rápida */}
              {msg.suggestions && (
                <div className="flex flex-wrap gap-2 mt-2 ml-8 animate-fadeIn">
                  {msg.suggestions.map((sug, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(sug)}
                      disabled={isLoading}
                      className="text-xs bg-purple-100 text-purple-800 px-3 py-1.5 rounded-full hover:bg-purple-200 transition-colors border border-purple-200 font-medium"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2">
               <div className="w-6 h-6 rounded-full bg-purple-200 flex items-center justify-center text-purple-700">
                  <Smile size={14} />
               </div>
               <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none border border-purple-100 shadow-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 bg-white border-t border-purple-100">
          <div className="flex gap-2 items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent transition-all">
            <input
              type="text"
              placeholder="Digite sua mensagem..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="text-purple-600 hover:text-purple-800 disabled:opacity-30 transition-colors p-1"
            >
              <Send size={20} />
            </button>
          </div>
          <div className="text-[10px] text-center text-gray-400 mt-2">
            Desenvolvido pela Equipe da Biblioteca
          </div>
        </div>
      </div>

      {/* --- BOTÃO FLUTUANTE --- */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-5 right-5 z-[9999] w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 ${
          isOpen ? "bg-gray-700 rotate-90" : "bg-purple-700 hover:bg-purple-800"
        }`}
      >
        {isOpen ? <X size={24} className="text-white" /> : <MessageCircle size={28} className="text-white" />}
        
        {/* Badge de notificação (opcional) */}
        {!isOpen && messages.length === 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
        )}
      </button>
    </>
  );
};

export default ChatWidget;