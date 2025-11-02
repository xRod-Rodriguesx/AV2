import './PageStyles.css'; 
import { useAuth } from '../contexts/AuthContext'; 

export function HomePage() {
    const { usuarioLogado } = useAuth(); 
    return (
        <div className="page-container" style={{ textAlign: 'center', paddingTop: '50px' }}>
            
            <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', color: 'var(--aerocode-title-color)' }}>
                Bem-vindo(a) ao AeroCode, {usuarioLogado?.nome || 'Piloto'}!
            </h1>
            
            <p style={{ fontSize: '1.2rem', color: 'var(--text-light-color)' }}>
                Selecione na navbar acima seu roteiro de voo em nosso sistema.
            </p>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-light-color)' }}>
                Bom trabalho!
            </p>
            
        </div>
    );
}