import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from "./ProtectedRoutes";
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Catalog from '../pages/Catalog';
import CreateBook from '../pages/CreateBook';
import BookDetails from '../pages/BookDetails';
import EditBook from '../pages/EditBook';
import ReadBook from "../pages/ReadBook";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/catalog" element={<Catalog />} />

        {/* Rotas protegidas (usuário logado) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/books/:id/read" element={<ReadBook />} />
          <Route path="/books/:id" element={<BookDetails />} />
        </Route>

        {/* Rotas admin-only */}
        <Route element={<ProtectedRoute adminOnly />}>
          <Route path="/books/new" element={<CreateBook />} />
          <Route path="/books/:id/edit" element={<EditBook />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<div>Página não encontrada!</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
