// src/pages/FuncionariosPage.tsx
import { useState } from "react";
import { useDatabase } from "../contexts/DatabaseContext";
import { useAuth } from "../contexts/AuthContext";
import { NivelPermissao } from "../logic/models";
import { Modal } from "../components/Modal";
import { AddFuncionarioForm } from "../components/forms/AddFuncionarioForm";
import './PageStyles.css'; // Reutilizando nosso CSS de página

export function FuncionariosPage() {
    const { usuarioLogado } = useAuth();
    const { funcionarios } = useDatabase();
    
    // Estado para controlar o modal de cadastro
    const [isModalAberto, setIsModalAberto] = useState(false);

    // GUARDIÃO DOS REQUISITOS: Proteção de Rota
    // Mesmo que o link esteja oculto, se um usuário não-admin digitar a URL /funcionarios...
    if (usuarioLogado?.nivelPermissao !== NivelPermissao.ADMINISTRADOR) {
        return (
            <div className="page-container" style={{ textAlign: 'center' }}>
                <h2 style={{ color: '#d62828' }}>[ ACESSO NEGADO ]</h2>
                <p>Você não tem permissão para acessar esta página.</p>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h2>Gerenciamento de Funcionários</h2>
                <button onClick={() => setIsModalAberto(true)} className="btn-primary">
                    + Cadastrar Novo Funcionário
                </button>
            </div>

            <table className="data-table">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Usuário</th>
                        <th>Nível de Permissão</th>
                        <th>Telefone</th>
                    </tr>
                </thead>
                <tbody>
                    {funcionarios.length === 0 ? (
                        <tr>
                            <td colSpan={4}>Nenhum funcionário cadastrado.</td>
                        </tr>
                    ) : (
                        funcionarios.map(func => (
                            <tr key={func.id}>
                                <td>{func.nome}</td>
                                <td>{func.usuario}</td>
                                <td>{func.nivelPermissao}</td>
                                <td>{func.telefone}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* O Modal de Cadastro */}
            <Modal isOpen={isModalAberto} onClose={() => setIsModalAberto(false)}>
                <AddFuncionarioForm onClose={() => setIsModalAberto(false)} />
            </Modal>
        </div>
    );
}