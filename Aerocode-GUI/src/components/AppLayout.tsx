// src/components/AppLayout.tsx
import { Outlet } from "react-router-dom";
import { Header } from "./Header";

// Vamos criar este CSS também
import './AppLayout.css';

export function AppLayout() {
    return (
        <div className="app-layout">
            <Header />
            <main className="content-area">
                {/* O <Outlet> renderiza a rota filha (AeronavesPage ou FuncionariosPage) */}
                <Outlet />
            </main>
        </div>
    );
}