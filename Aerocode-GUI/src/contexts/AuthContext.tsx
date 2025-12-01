import React, { createContext, useContext, useState, useEffect } from "react";
import { Funcionario, NivelPermissao } from "../logic/models";
import { useDatabase } from "./DatabaseContext";

interface IAuthContext {
    usuarioLogado: Funcionario | null;
    login: (usuario: string, senha: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<IAuthContext>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    // 1. Inicializa o estado lendo do LocalStorage (se existir)
    const [usuarioLogado, setUsuarioLogado] = useState<Funcionario | null>(() => {
        const savedUser = localStorage.getItem('aerocode_user');
        if (savedUser) {
            try {
                return JSON.parse(savedUser);
            } catch (e) {
                return null;
            }
        }
        return null;
    });
    
    const { refreshDados } = useDatabase();

    // 2. Efeito para manter o refreshDados atualizado se o usuário já estiver logado ao abrir
    useEffect(() => {
        if (usuarioLogado) {
            refreshDados();
        }
    }, []);

    const login = async (usuario: string, senha: string): Promise<boolean> => {
        try {
            const response = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario, senha })
            });

            if (response.ok) {
                const dados = await response.json();
                const funcionario = new Funcionario(
                    dados.id, dados.nome, dados.telefone, dados.endereco, 
                    dados.usuario, dados.senha, dados.nivelPermissao as NivelPermissao
                );
                
                // 3. Salva no Estado E no LocalStorage
                setUsuarioLogado(funcionario);
                localStorage.setItem('aerocode_user', JSON.stringify(funcionario));
                
                refreshDados(); 
                return true;
            }
            return false;
        } catch (error) {
            console.error("Erro no login:", error);
            return false;
        }
    };

    const logout = () => {
        setUsuarioLogado(null);
        // 4. Limpa o LocalStorage ao sair
        localStorage.removeItem('aerocode_user');
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