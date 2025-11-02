import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { NivelPermissao } from '../logic/models';
import './Header.css';

export function Header() {
    const { usuarioLogado, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="app-header">
            <div className="header-brand">
                {}
                <Link to="/">AeroCode GUI</Link>
            </div>
            
            <nav className="header-nav">
                {usuarioLogado && (
                    <>
                        {usuarioLogado.nivelPermissao === NivelPermissao.ADMINISTRADOR && (
                            <NavLink to="/funcionarios">Funcionários</NavLink>
                        )}
                        <NavLink to="/aeronaves">Aeronaves</NavLink>
                    </>
                )}
            </nav>

            <div className="header-auth">
                {usuarioLogado ? (
                    <>
                        <span className="welcome-message">Olá, {usuarioLogado.nome}</span>
                        <button onClick={handleLogout} className="btn-danger">Salvar e Sair</button>
                    </>
                ) : (
                    <Link to="/login" className="btn-primary">Login</Link>
                )}
            </div>
        </header>
    );
}