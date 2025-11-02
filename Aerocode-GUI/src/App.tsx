// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { LoginPage } from "./pages/LoginPage";
import { AppLayout } from "./components/AppLayout";
import { AeronavesPage } from "./pages/AeronavesPage";
import { FuncionariosPage } from "./pages/FuncionariosPage";
import { AeronaveDetailPage } from "./pages/AeronaveDetailPage"; // 1. Importar a nova página

function ProtectedLayout() {
    const { usuarioLogado } = useAuth();
    if (!usuarioLogado) {
        return <Navigate to="/login" replace />;
    }
    return <AppLayout />;
}

function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route element={<ProtectedLayout />}>
                <Route index element={<Navigate to="/aeronaves" replace />} />
                
                <Route path="aeronaves" element={<AeronavesPage />} />
                
                {/* 2. ROTA DINÂMICA: O ':id' captura o código da aeronave */}
                <Route path="aeronaves/:id" element={<AeronaveDetailPage />} /> 

                <Route path="funcionarios" element={<FuncionariosPage />} />
            </Route>
        </Routes>
    )
}

export default App