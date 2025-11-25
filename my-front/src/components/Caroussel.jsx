import { useRef, useState, useEffect } from "react";

export default function CarouselNetflix() {
  const carrosselRef = useRef(null);
  const [scrollPos, setScrollPos] = useState(0);
  const [centerIndex, setCenterIndex] = useState(0);

  const capas = [
    "https://m.media-amazon.com/images/I/81pJt9U8sHL._SL1500_.jpg",
    "https://m.media-amazon.com/images/I/71yJx0g6G5L._SL1500_.jpg",
    "https://m.media-amazon.com/images/I/81dH7wq7u-L._SL1500_.jpg",
    "https://m.media-amazon.com/images/I/91H8ZmOf6NL._SL1500_.jpg",
    "https://m.media-amazon.com/images/I/91fJZbW+1KL._SL1500_.jpg",
    "https://m.media-amazon.com/images/I/91nxvTZ6uEL._SL1500_.jpg"
  ];

  const duplicado = [...capas, ...capas];

  // Auto scroll com loop infinito
  useEffect(() => {
    const interval = setInterval(() => {
      if (carrosselRef.current) {
        carrosselRef.current.scrollLeft += 1;
        setScrollPos(carrosselRef.current.scrollLeft);
      }
    }, 20);
    return () => clearInterval(interval);
  }, []);

  // Detecta item central para zoom
  const handleScroll = () => {
    const car = carrosselRef.current;
    if (!car) return;

    const center = car.scrollLeft + car.offsetWidth / 2;

    let menorDiferença = Infinity;
    let melhorIndex = 0;

    duplicado.forEach((_, idx) => {
      const itemPos = idx * 180 + 90; // posição dentro do carrossel
      const diferença = Math.abs(center - itemPos);

      if (diferença < menorDiferença) {
        menorDiferença = diferença;
        melhorIndex = idx;
      }
    });

    setCenterIndex(melhorIndex);

    // Loop infinito
    if (car.scrollLeft > car.scrollWidth / 2) {
      car.scrollLeft = 0;
    }
  };

  // Botões de navegação
  const scrollLeftBtn = () => {
    carrosselRef.current.scrollLeft -= 300;
  };

  const scrollRightBtn = () => {
    carrosselRef.current.scrollLeft += 300;
  };

  return (
    <div className="relative w-full flex flex-col items-center mt-40 pb-24">

      {/* Gradientes laterais */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-gray-950 to-transparent z-20" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-gray-950 to-transparent z-20" />

      <h2 className="text-3xl font-bold text-purple-300 mb-6">Recomendados</h2>

      {/* Carrossel */}
      <div className="relative w-full max-w-6xl flex items-center">

        {/* Botão Esquerdo */}
        <button
          onClick={scrollLeftBtn}
          className="absolute left-2 z-30 px-3 py-4 bg-gray-900/40 rounded-full border border-purple-600 text-purple-300 hover:bg-purple-700/30 hover:scale-110 transition"
        >
          ❮
        </button>

        <div
          ref={carrosselRef}
          onScroll={handleScroll}
          className="flex gap-6 overflow-x-scroll no-scrollbar px-16 scroll-smooth"
          style={{ scrollBehavior: "smooth" }}
        >
          {duplicado.map((src, idx) => (
            <div
              key={idx}
              className={`
                min-w-[150px] h-[210px] rounded-2xl shadow-xl 
                border border-purple-700/40 overflow-hidden 
                transition-all duration-300 
                ${idx === centerIndex ? "scale-125 shadow-purple-500/40 z-10" : "scale-100 opacity-80"}
              `}
            >
              <img
                src={src}
                alt="Livro"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Botão Direito */}
        <button
          onClick={scrollRightBtn}
          className="absolute right-2 z-30 px-3 py-4 bg-gray-900/40 rounded-full border border-purple-600 text-purple-300 hover:bg-purple-700/30 hover:scale-110 transition"
        >
          ❯
        </button>

      </div>
    </div>
  );
}