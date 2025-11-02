import { Funcionario, Aeronave, NivelPermissao } from "../logic/models";


const adminUser = new Funcionario(
    "1",
    "Admin Principal",
    "99999-9999",
    "Sede da AeroCode",
    "admin",
    "admin",
    NivelPermissao.ADMINISTRADOR
);

export const db = {
    funcionarios: [adminUser],
    aeronaves: [] as Aeronave[]
};