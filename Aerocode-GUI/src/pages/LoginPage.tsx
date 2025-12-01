import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import '../components/forms/FormStyles.css'; 
import './LoginPage.css'; 

export function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); 
        
        // Adicione 'await' aqui
        const sucesso = await login(usuario, senha);
        
        if (sucesso) {
            navigate("/"); 
        } else {
            setErro("Usuário ou senha inválidos (ou erro de servidor).");
        }
    };

    return (
        <div className="fullscreen-center-container"> 
            <form className="form-container login-page-card" onSubmit={handleSubmit}>
                <h2 className="aerocode-title">AeroCode</h2> 
                <p className="login-subtitle">Login</p> 
                
                <div className="form-group">
                    <label htmlFor="usuario">Usuário</label>
                    <input
                        type="text"
                        id="usuario"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                        onFocus={() => setErro('')} 
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="senha">Senha</label>
                    <input
                        type="password"
                        id="senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        onFocus={() => setErro('')} 
                    />
                </div>
                
                {erro && <p className="error-message">{erro}</p>}

                <button type="submit" className="btn-primary login-button">Entrar</button>
            </form>
        </div>
    );
}