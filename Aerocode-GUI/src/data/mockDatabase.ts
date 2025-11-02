// src/data/mockDatabase.ts
import { Funcionario, Aeronave, NivelPermissao } from "../logic/models";

// Este é o ÚNICO usuário que deve existir no início.
const adminUser = new Funcionario(
    "1",
    "Admin Principal",
    "99999-9999",
    "Sede da AeroCode",
    "admin",
    "admin123",
    NivelPermissao.ADMINISTRADOR
);

// Nossas "tabelas" do banco de dados
export const db = {
    funcionarios: [adminUser],
    aeronaves: [] as Aeronave[]
};