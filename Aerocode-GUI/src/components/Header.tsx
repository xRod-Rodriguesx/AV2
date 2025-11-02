// src/components/Header.tsx
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { NivelPermissao } from "../logic/models";

// Vamos criar este CSS logo em seguida
import './Header.css'; 

export function Header() {
    const { usuarioLogado, logout } = useAuth();

    if (!usuarioLogado) {
        return null; // Não mostra nada se não estiver logado
    }

    return (
        <header className="app-header">
            <div className="header-logo">
                <Link to="/">AeroCode</Link>
            </div>
            
            <nav className="header-nav">
                <NavLink to="/aeronaves">Aeronaves</NavLink>
                
                {/* O Guardião dos Requisitos em ação! */}
                {usuarioLogado.nivelPermissao === NivelPermissao.ADMINISTRADOR && (
                    <NavLink to="/funcionarios">Funcionários</NavLink>
                )}
            </nav>

            <div className="header-user">
                <span>Olá, {usuarioLogado.nome}</span>
                <button onClick={logout} className="logout-button">
                    Salvar e Sair
                </button>
            </div>
        </header>
    );
}