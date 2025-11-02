// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState } from "react";
import { Funcionario } from "../logic/models";
// 1. IMPORTAR o hook do outro "cérebro"
import { useDatabase } from "./DatabaseContext"; 

interface IAuthContext {
    usuarioLogado: Funcionario | null;
    login: (usuario: string, senha: string) => boolean;
    logout: () => void;
}

const AuthContext = createContext<IAuthContext>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [usuarioLogado, setUsuarioLogado] = useState<Funcionario | null>(null);
    
    // 2. PEGAR a lista de funcionários "ao vivo" do DatabaseContext
    const { funcionarios, salvarDados } = useDatabase(); 

    const login = (usuario: string, senha: string): boolean => {
        
        // 3. USAR a lista "ao vivo", em vez do 'db.funcionarios' estático
        const funcionario = funcionarios.find(
            (f) => f.usuario === usuario
        );

        if (funcionario && funcionario.autenticar(usuario, senha)) {
            setUsuarioLogado(funcionario);
            console.log("Login BEM-SUCEDIDO!", funcionario);
            return true;
        }

        console.error("Login FALHOU!", { usuario, senha, listaChecada: funcionarios });
        setUsuarioLogado(null);
        return false;
    };

    const logout = () => {
        setUsuarioLogado(null);
        // 4. BÔNUS: Agora o logout também chama o "Salvar Dados"
        salvarDados(); 
        console.log("Usuário deslogado, dados salvos (simulado).");
    };

    return (
        <AuthContext.Provider value={{ usuarioLogado, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}