const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/docs', express.static('docs')); // Servir os gifs

// =========================================================== //
// DADOS DOS PERSONAGENS
// =========================================================== //

const personagens = {
    mario: {
        nome: "Mario",
        velocidade: 4,
        manobrabilidade: 3,
        poder: 3,
        gif: "mario.gif"
    },
    luigi: {
        nome: "Luigi",
        velocidade: 3,
        manobrabilidade: 4,
        poder: 4,
        gif: "luigi.gif"
    },
    bowser: {
        nome: "Bowser",
        velocidade: 5,
        manobrabilidade: 2,
        poder: 5,
        gif: "bowser.gif"
    },
    peach: {
        nome: "Peach",
        velocidade: 3,
        manobrabilidade: 5,
        poder: 2,
        gif: "peach.gif"
    },
    yoshi: {
        nome: "Yoshi",
        velocidade: 4,
        manobrabilidade: 4,
        poder: 3,
        gif: "yoshi.gif"
    },
    toad: {
        nome: "Toad",
        velocidade: 5,
        manobrabilidade: 3,
        poder: 2,
        gif: "toad.gif"
    },
    dk: {
        nome: "Donkey Kong",
        velocidade: 4,
        manobrabilidade: 2,
        poder: 5,
        gif: "dk.gif"
    },
    header: {
        nome: "Header",
        velocidade: 3,
        manobrabilidade: 3,
        poder: 4,
        gif: "header.gif"
    }
};

// =========================================================== //
// ROTA - Listar personagens disponíveis
// =========================================================== //

app.get('/api/personagens', (req, res) => {
    res.json(personagens);
});

// =========================================================== //
// FUNÇÕES DO JOGO
// =========================================================== //

async function rolarDados(){
    return Math.floor(Math.random() * 6) + 1;
}

async function pegarBlocoAleatorio(){
    let aleatorio = Math.random()
    let resultado 

    switch (true) {
        case aleatorio < 0.33:
            resultado = "RETA"      
            break;
        case aleatorio < 0.66:
            resultado = "CURVA"
            break;    
        default: 
            resultado = "CONFRONTO"
            break;
    }
    return resultado;
}

// =========================================================== //
// ROTA PRINCIPAL - Iniciar corrida
// =========================================================== //

app.post('/api/corrida/iniciar', async (req, res) => {
    const { jogador1Key, jogador2Key } = req.body;
    
    const p1 = personagens[jogador1Key] || personagens.mario;
    const p2 = personagens[jogador2Key] || personagens.luigi;
    
    const player1 = {
        NOME: p1.nome,
        VELOCIDADE: p1.velocidade,
        MANOBRABILIDADE: p1.manobrabilidade,
        PODER: p1.poder,
        PONTOS: 0,
        GIF: p1.gif
    };
    
    const player2 = {
        NOME: p2.nome,
        VELOCIDADE: p2.velocidade,
        MANOBRABILIDADE: p2.manobrabilidade,
        PODER: p2.poder,
        PONTOS: 0,
        GIF: p2.gif
    };
    
    res.json({ 
        mensagem: "Corrida iniciada!", 
        player1, 
        player2 
    });
});

// =========================================================== //
// ROTA - Executar uma rodada
// =========================================================== //

app.post('/api/corrida/rodada', async (req, res) => {
    const { player1, player2, rodada } = req.body;
    
    // Simular um pequeno delay para parecer processamento
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Sortear bloco
    let bloco = await pegarBlocoAleatorio();
    
    // Rolar os dados
    let resultadoDado1 = await rolarDados();
    let resultadoDado2 = await rolarDados();
    
    let totalTesteSkill1 = 0;
    let totalTesteSkill2 = 0;
    let eventos = [];
    
    if(bloco === "RETA"){
        totalTesteSkill1 = resultadoDado1 + player1.VELOCIDADE;
        totalTesteSkill2 = resultadoDado2 + player2.VELOCIDADE;
        
        eventos.push({
            tipo: "rolagem",
            personagem: player1.NOME,
            bloco: "velocidade",
            dado: resultadoDado1,
            atributo: player1.VELOCIDADE,
            total: totalTesteSkill1
        });
        
        eventos.push({
            tipo: "rolagem",
            personagem: player2.NOME,
            bloco: "velocidade",
            dado: resultadoDado2,
            atributo: player2.VELOCIDADE,
            total: totalTesteSkill2
        });
    }
    
    if(bloco === "CURVA"){
        totalTesteSkill1 = resultadoDado1 + player1.MANOBRABILIDADE;
        totalTesteSkill2 = resultadoDado2 + player2.MANOBRABILIDADE;
        
        eventos.push({
            tipo: "rolagem",
            personagem: player1.NOME,
            bloco: "manobrabilidade",
            dado: resultadoDado1,
            atributo: player1.MANOBRABILIDADE,
            total: totalTesteSkill1
        });
        
        eventos.push({
            tipo: "rolagem",
            personagem: player2.NOME,
            bloco: "manobrabilidade",
            dado: resultadoDado2,
            atributo: player2.MANOBRABILIDADE,
            total: totalTesteSkill2
        });
    }
    
    if(bloco === "CONFRONTO"){
        let resultadoPoder1 = resultadoDado1 + player1.PODER;
        let resultadoPoder2 = resultadoDado2 + player2.PODER;
        
        totalTesteSkill1 = resultadoPoder1;
        totalTesteSkill2 = resultadoPoder2;
        
        eventos.push({
            tipo: "confronto",
            personagem1: player1.NOME,
            personagem2: player2.NOME
        });
        
        eventos.push({
            tipo: "rolagem",
            personagem: player1.NOME,
            bloco: "poder",
            dado: resultadoDado1,
            atributo: player1.PODER,
            total: resultadoPoder1
        });
        
        eventos.push({
            tipo: "rolagem",
            personagem: player2.NOME,
            bloco: "poder",
            dado: resultadoDado2,
            atributo: player2.PODER,
            total: resultadoPoder2
        });
        
        if(resultadoPoder1 > resultadoPoder2 && player2.PONTOS > 0){
            player2.PONTOS--;
            eventos.push({
                tipo: "resultado_confronto",
                vencedor: player1.NOME,
                perdedor: player2.NOME
            });
        } else if(resultadoPoder2 > resultadoPoder1 && player1.PONTOS > 0){
            player1.PONTOS--;
            eventos.push({
                tipo: "resultado_confronto",
                vencedor: player2.NOME,
                perdedor: player1.NOME
            });
        } else if(resultadoPoder2 === resultadoPoder1){
            eventos.push({
                tipo: "resultado_confronto",
                empate: true
            });
        }
    }
    
    // Verificar vencedor da rodada
    if(totalTesteSkill1 > totalTesteSkill2){
        player1.PONTOS++;
        eventos.push({
            tipo: "ponto",
            personagem: player1.NOME
        });
    } else if(totalTesteSkill2 > totalTesteSkill1){
        player2.PONTOS++;
        eventos.push({
            tipo: "ponto",
            personagem: player2.NOME
        });
    }
    
    res.json({
        rodada: rodada,
        bloco: bloco,
        eventos: eventos,
        player1: player1,
        player2: player2,
        totalTesteSkill1: totalTesteSkill1,
        totalTesteSkill2: totalTesteSkill2
    });
});

// =========================================================== //
// ROTA - Declarar campeão
// =========================================================== //

app.post('/api/corrida/campeao', (req, res) => {
    const { player1, player2 } = req.body;
    
    let campeao = null;
    let mensagem = "";
    
    if(player1.PONTOS > player2.PONTOS){
        campeao = player1.NOME;
        mensagem = `${player1.NOME} venceu a corrida! 🏆`;
    } else if(player2.PONTOS > player1.PONTOS){
        campeao = player2.NOME;
        mensagem = `${player2.NOME} venceu a corrida! 🏆`;
    } else {
        mensagem = "A corrida terminou empatada! 🤝";
    }
    
    res.json({
        campeao: campeao,
        mensagem: mensagem,
        player1: player1,
        player2: player2
    });
});

app.listen(port, () => {
    console.log(`Servidor Mario Kart rodando em http://localhost:${port}`);
});