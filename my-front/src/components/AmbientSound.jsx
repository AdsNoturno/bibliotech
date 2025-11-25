import React, { useEffect } from "react";

export default function AmbientSound() {
  useEffect(() => {
    const audio = new Audio("/sounds/library.mp3"); // coloque o mp3 em public/sounds/
    audio.loop = true;
    audio.volume = 0.2;
    audio.play().catch(() => {}); // evita erro se autoplay for bloqueado
    
    // Opcional: Retornar uma função de limpeza é uma boa prática 
    // para parar o áudio se o componente for desmontado (ex: mudar de página)
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  return null;
}