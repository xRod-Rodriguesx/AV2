// src/data/mockDatabase.ts
import { Funcionario, Aeronave, NivelPermissao } from "../logic/models";

// Este é o ÚNICO usuário que deve existir no início.
const adminUser = new Funcionario(
    "1",
    "Rod Admin",
    "1298124-0774",
    "Sede da AeroCode - CAÇAPAVA - SP",
    "admin",
    "admin",
    NivelPermissao.ADMINISTRADOR
);

// Nossas "tabelas" do banco de dados
export const db = {
    funcionarios: [adminUser],
    aeronaves: [] as Aeronave[]
};