// src/pages/LoginPage.tsx
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom"; // 1. IMPORTE O 'useNavigate'

export function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate(); // 2. INICIE O 'navigate'

    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); 
        
        const sucesso = login(usuario, senha);
        if (sucesso) {
            // 3. A MÁGICA ESTÁ AQUI!
            // Se o login deu certo, navegue para a página de aeronaves.
            navigate("/aeronaves"); 
        } else {
            setErro("Usuário ou senha inválidos.");
        }
    };

    return (
        <div className="login-container"> 
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>AeroCode</h2>
                <div className="form-group">
                    <label htmlFor="usuario">Usuário</label>
                    <input
                        type="text"
                        id="usuario"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="senha">Senha</label>
                    <input
                        type="password"
                        id="senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                    />
                </div>
                
                {erro && <p className="error-message">{erro}</p>}

                <button type="submit" className="login-button">Entrar</button>
            </form>
        </div>
    );
}