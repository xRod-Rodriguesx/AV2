// src/contexts/DatabaseContext.tsx
import React, { createContext, useContext, useState } from "react";
import { Aeronave, Funcionario } from "../logic/models.js";
import { db } from "../data/mockDatabase.js";

interface IDatabaseContext {
    aeronaves: Aeronave[];
    funcionarios: Funcionario[];
    addAeronave: (aeronave: Aeronave) => void;
    addFuncionario: (funcionario: Funcionario) => void;
    // 1. ADICIONE A FUNÇÃO DE UPDATE AQUI
    updateAeronave: (aeronave: Aeronave) => void;
    salvarDados: () => void;
}

const DatabaseContext = createContext<IDatabaseContext>(null!);

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
    const [aeronaves, setAeronaves] = useState<Aeronave[]>(db.aeronaves);
    const [funcionarios, setFuncionarios] = useState<Funcionario[]>(db.funcionarios);

    const addAeronave = (aeronave: Aeronave) => {
        setAeronaves(listaAtual => [...listaAtual, aeronave]);
    };

    const addFuncionario = (funcionario: Funcionario) => {
        setFuncionarios(listaAtual => [...listaAtual, funcionario]);
    };

    // 2. ADICIONE A IMPLEMENTAÇÃO DA FUNÇÃO
    // Esta função força o React a "perceber" mudanças em uma aeronave
    const updateAeronave = (aeronave: Aeronave) => {
        setAeronaves(prevAeronaves => 
            prevAeronaves.map(a => a.codigo === aeronave.codigo ? aeronave : a)
        );
    };

    const salvarDados = () => {
        console.log("DADOS SALVOS (simulado):", { aeronaves, funcionarios });
    };

    return (
        <DatabaseContext.Provider 
            value={{ 
                aeronaves, 
                funcionarios, 
                addAeronave, 
                addFuncionario, 
                updateAeronave, // 3. EXPONHA A NOVA FUNÇÃO
                salvarDados 
            }}
        >
            {children}
        </DatabaseContext.Provider>
    );
}

export function useDatabase() {
    return useContext(DatabaseContext);
}