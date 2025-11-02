import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { AeronavesPage } from './pages/AeronavesPage';
import { AeronaveDetailPage } from './pages/AeronaveDetailPage';
import { FuncionariosPage } from './pages/FuncionariosPage';
import { AppLayout } from './components/AppLayout';
import { useAuth } from './contexts/AuthContext';
import { HomePage } from './pages/HomePage';


function PrivateRoute() {
  const { usuarioLogado } = useAuth();
  const location = useLocation();

  if (!usuarioLogado) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <AppLayout />;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      {}
      <Route element={<PrivateRoute />}>
        {}
        
        {}
        <Route index element={<HomePage />} /> 
        
        <Route path="aeronaves" element={<AeronavesPage />} />
        <Route path="aeronaves/:id" element={<AeronaveDetailPage />} />
        <Route path="funcionarios" element={<FuncionariosPage />} />
      </Route>
    </Routes>
  );
}

export default App;