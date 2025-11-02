import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { AeronavesPage } from './pages/AeronavesPage';
import { AeronaveDetailPage } from './pages/AeronaveDetailPage';
import { FuncionariosPage } from './pages/FuncionariosPage';
import { AppLayout } from './components/AppLayout';
import { useAuth } from './contexts/AuthContext';
import { HomePage } from './pages/HomePage'; // Import da nova Home

// Componente que protege rotas
function PrivateRoute() {
  const { usuarioLogado } = useAuth();
  const location = useLocation();

  if (!usuarioLogado) {
    // Se não estiver logado, redireciona para o login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Se estiver logado, renderiza o "Casco" (AppLayout), 
  // que por sua vez renderiza a página filha (HomePage, AeronavesPage, etc.)
  return <AppLayout />;
}

function App() {
  // Lógica de Dark Mode REMOVIDA
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      {/* Rotas Protegidas */}
      <Route element={<PrivateRoute />}>
        {/* Rotas que serão renderizadas DENTRO do <Outlet> do AppLayout */}
        
        {/* Rota Raiz (/) agora é a HomePage */}
        <Route index element={<HomePage />} /> 
        
        <Route path="aeronaves" element={<AeronavesPage />} />
        <Route path="aeronaves/:id" element={<AeronaveDetailPage />} />
        <Route path="funcionarios" element={<FuncionariosPage />} />
      </Route>
    </Routes>
  );
}

export default App;