import { Routes, Route } from "react-router-dom";
import App from "./App";
import { Routes, Route } from "react-router-dom";
import App from "./App"; // Importação do layout base (Layout Wrapper)
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import BookDetails from "./pages/BookDetails";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="catalog" element={<Catalog />} />
        <Route path="book/:id" element={<BookDetails />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
    </Routes>
  );
}