// aerocode-backend/test-load.ts
import axios from 'axios';

const URL_ALVO = 'http://localhost:3001/aeronaves';

async function simularUsuario(id: number) {
    const start = performance.now();
    try {
        await axios.get(URL_ALVO);
        const end = performance.now();
        const responseTime = end - start;
        return responseTime;
    } catch (error) {
        console.error(`Erro no usuário ${id}:`, error);
        return 0;
    }
}

async function rodarTesteDeCarga(quantidadeUsuarios: number) {
    console.log(`\n--- INICIANDO TESTE PARA ${quantidadeUsuarios} USUÁRIO(S) SIMULTÂNEO(S) ---`);
    
    // CORREÇÃO: Tipando explicitamente o array
    const promessas: Promise<number>[] = []; 
    
    for (let i = 0; i < quantidadeUsuarios; i++) {
        promessas.push(simularUsuario(i + 1));
    }

    const tempos = await Promise.all(promessas);

    const totalTime = tempos.reduce((a, b) => a + b, 0);
    const mediaResponseTime = totalTime / tempos.length;

    console.log(`Média de Tempo de Resposta: ${mediaResponseTime.toFixed(3)} ms`);
    console.log(`(Anote este valor para o seu gráfico!)`);
}

async function main() {
    console.log("Preparando testes...");
    
    // Cenário 1: 1 Usuário
    await rodarTesteDeCarga(1);

    await new Promise(r => setTimeout(r, 2000));

    // Cenário 2: 5 Usuários
    await rodarTesteDeCarga(5);

    await new Promise(r => setTimeout(r, 2000));

    // Cenário 3: 10 Usuários
    await rodarTesteDeCarga(10);
}

main();