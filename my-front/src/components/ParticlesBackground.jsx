import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export default function ParticlesBackground() {
  // Removemos a tipagem ": any" do parâmetro engine
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine); // Carrega engine completa
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background: { color: "#1f2937" },
        particles: {
          number: { value: 50 },
          size: { value: 3 },
          move: { speed: 1 },
        },
      }}
    />
  );
}