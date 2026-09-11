import './styles/main.scss';
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom';
import Cadastro from './pages/Cadastro';
import Home from './pages/Home';
import Login from './pages/Login';
import Perfil from './pages/Perfil';
import RecuperarSenha from './pages/RecuperarSenha';
import RedefinirSenha from './pages/RedefinirSenha';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <nav aria-label="Navegação principal">
          <Link to="/cadastro">Cadastro</Link>
          <Link to="/login">Login</Link>
          <Link to="/recuperar-senha">Recuperar senha</Link>
          <Link to="/perfil">Perfil</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Navigate to="/cadastro" replace />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/recuperar-senha" element={<RecuperarSenha />} />
          <Route path="/redefinir-senha" element={<RedefinirSenha />} />
          <Route path="*" element={<Navigate to="/cadastro" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
