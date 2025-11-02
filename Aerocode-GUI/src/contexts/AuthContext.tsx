import React, { createContext, useContext, useState } from "react";
import { Funcionario } from "../logic/models";
import { useDatabase } from "./DatabaseContext"; 

interface IAuthContext {
    usuarioLogado: Funcionario | null;
    login: (usuario: string, senha: string) => boolean;
    logout: () => void;
}

const AuthContext = createContext<IAuthContext>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [usuarioLogado, setUsuarioLogado] = useState<Funcionario | null>(null);
    
    const { funcionarios, salvarDados } = useDatabase(); 

    const login = (usuario: string, senha: string): boolean => {
        
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