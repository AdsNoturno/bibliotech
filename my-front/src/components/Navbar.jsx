import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/"); // redireciona para home
  };

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <div className="text-xl font-bold">
        <Link to="/">MeuSite</Link>
      </div>

      <div className="space-x-4">
        <Link to="/catalog" className="hover:underline">
          Catálogo
        </Link>

        {!token ? (
          <>
            <Link to="/login" className="hover:underline">
              Entrar
            </Link>
            <Link to="/register" className="hover:underline">
              Cadastrar
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-red-600 px-3 py-1 rounded hover:bg-red-500"
          >
            Sair
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;