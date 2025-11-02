import React, { useState } from 'react';
import { useDatabase } from '../../contexts/DatabaseContext';
import { Funcionario, NivelPermissao } from '../../logic/models';
import './FormStyles.css'; 

interface Props {
    onClose: () => void;
}

export function AddFuncionarioForm({ onClose }: Props) {
    const { funcionarios, addFuncionario } = useDatabase();

    // Estados para cada campo do formulário
    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [endereco, setEndereco] = useState('');
    const [usuario, setUsuario] = useState('');
    const [senha, setSenha] = useState('');
    const [nivelPermissao, setNivelPermissao] = useState(NivelPermissao.OPERADOR); 
    const [erro, setErro] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validar usuário único
        if (funcionarios.find(f => f.usuario === usuario)) {
            setErro('Erro: Este nome de usuário já está em uso.');
            return;
        }

        if (!nome || !usuario || !senha) {
            setErro('Nome, Usuário e Senha são obrigatórios.');
            return;
        }
        
        const id = self.crypto.randomUUID();
        const novoFuncionario = new Funcionario(id, nome, telefone, endereco, usuario, senha, nivelPermissao);
        
        addFuncionario(novoFuncionario);
        
        console.log("Funcionário Adicionado!", novoFuncionario);
        onClose(); // Fecha o modal
    };

    return (
        <form onSubmit={handleSubmit} className="form-container" style={{ width: '400px' }}>
            <h2>Cadastrar Novo Funcionário</h2>
            
            <div className="form-group">
                <label htmlFor="nome">Nome Completo</label>
                <input type="text" id="nome" value={nome} onChange={e => setNome(e.target.value)} />
            </div>
            <div className="form-group">
                <label htmlFor="telefone">Telefone</label>
                <input type="text" id="telefone" value={telefone} onChange={e => setTelefone(e.target.value)} />
            </div>
            <div className="form-group">
                <label htmlFor="endereco">Endereço</label>
                <input type="text" id="endereco" value={endereco} onChange={e => setEndereco(e.target.value)} />
            </div>

            <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #eee' }} />

            <div className="form-group">
                <label htmlFor="usuario">Usuário (para login)</label>
                <input type="text" id="usuario" value={usuario} onChange={e => setUsuario(e.target.value)} />
            </div>
            <div className="form-group">
                <label htmlFor="senha">Senha</label>
                <input type="password" id="senha" value={senha} onChange={e => setSenha(e.target.value)} />
            </div>

            <div className="form-group">
                <label htmlFor="nivel">Nível de Permissão</label>
                <select id="nivel" value={nivelPermissao} onChange={e => setNivelPermissao(e.target.value as NivelPermissao)}>
                    {}
                    {Object.values(NivelPermissao).map(nivel => (
                        <option key={nivel} value={nivel}>{nivel}</option>
                    ))}
                </select>
            </div>

            {erro && <p className="error-message">{erro}</p>}

            <div className="form-actions">
                <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
                <button type="submit" className="btn-primary">Salvar Funcionário</button>
            </div>
        </form>
    );
}