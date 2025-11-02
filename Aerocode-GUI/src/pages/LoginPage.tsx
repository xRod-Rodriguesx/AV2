// src/pages/LoginPage.tsx (Completo e Corrigido)
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); 
        
        const sucesso = login(usuario, senha);
        if (sucesso) {
            // CORREÇÃO: Redireciona para a raiz (/)
            navigate("/"); 
        } else {
            setErro("Usuário ou senha inválidos.");
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