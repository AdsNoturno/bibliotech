import React from "react";
import AppRoutes from "./routes/routes"; 
import Navbar from "./components/Navbar";
import AmbientSound from "./components/AmbientSound";
import ChatWidget from "./components/ChatWidget.jsx";

const App = () => {
  return (
    <>
      <div className="bg-gray-800 min-h-screen text-white pointer-events-none">

        <Navbar />
        <AmbientSound />
        <AppRoutes />
      </div>

      {/* Agora ele fica TOTALMENTE LIVRE NA TELA */}
      {console.log("ChatWidget carregou")}


      <ChatWidget />
    </>
  );
};

export default App;
