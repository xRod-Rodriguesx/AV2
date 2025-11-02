import React, { createContext, useContext, useState } from "react";
import { Aeronave, Funcionario } from "../logic/models.js";
import { db } from "../data/mockDatabase.js";

interface IDatabaseContext {
    aeronaves: Aeronave[];
    funcionarios: Funcionario[];
    addAeronave: (aeronave: Aeronave) => void;
    addFuncionario: (funcionario: Funcionario) => void;
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
                updateAeronave, 
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