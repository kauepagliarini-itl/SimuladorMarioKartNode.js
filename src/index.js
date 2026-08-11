const player1 = {
    NOME : "Mario",
    VELOCIDADE: 4,
    MANOBRABILIDADE:3,
    PODER: 3,
    PONTOS:0,
};

const player2 = {
    NOME : "Luigi",
    VELOCIDADE: 3,
    MANOBRABILIDADE:4,
    PODER: 4,
    PONTOS:0,
};

// =========================================================== //
// FUNÇÃO QUE FAZ O DADO RODAR = ASYNC
// =========================================================== //

async function rolarDados(){
    return Math.floor(Math.random() * 6) + 1;
}

// =========================================================== //
// FUNÇÃO QUE VAI SORTEAR O BLOCO
// =========================================================== //

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
// FUNÇÃO DE REFATORAÇÃO: POIS ESSA FUNÇÃO SERÁ USADA VARIAS VEZES NA function playRaceEngine
// =========================================================== //
async function resultadoRolagem(nomePersonagem, bloco, resultadoDado, atributo){
    
  console.log(`${nomePersonagem} 🎲 rolou um dado de ${bloco} ${resultadoDado} + ${atributo} = ${resultadoDado + atributo}`)

}

// =========================================================== //
// NOVA FUNÇÃO: Cria um delay usando setTimeout convertido em Promise
// =========================================================== //
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// =========================================================== //
// FUNÇÃO QUE FAZ ACONTECER AS RODADAS DA CORRIDA
// =========================================================== //
async function playRaceEngine(personagem1, personagem2){
    for(let round = 1; round <= 5; round ++){
        console.log(`\n🏁 Rodada ${round}`);
        console.log("⏳ Preparando...");

        // Aguarda 2 segundos entre cada rodada (exceto na primeira)
        if (round > 1) {
            await delay(2000); // 2 segundos de espera
        }

        //sortear bloco
        let bloco = await pegarBlocoAleatorio()
        console.log (`Bloco: ${bloco}`)

        // Pequena pausa antes de rolar os dados
        await delay(1000); // 1 segundo

        // rolar os dados
        let resultadoDado1 = await rolarDados()
        let resultadoDado2 = await rolarDados()

        // teste de habilidade
        let totalTesteSkill1 = 0
        let totalTesteSkill2 = 0

        if(bloco === "RETA"){
            totalTesteSkill1 = resultadoDado1 + personagem1.VELOCIDADE;
            totalTesteSkill2 = resultadoDado2 + personagem2.VELOCIDADE;

            await resultadoRolagem(
                personagem1.NOME,
                "velocidade", 
                resultadoDado1, 
                personagem1.VELOCIDADE
            );
            await resultadoRolagem(
                personagem2.NOME,
                "velocidade", 
                resultadoDado2, 
                personagem2.VELOCIDADE
            );     
            
        }

        if(bloco === "CURVA"){
            totalTesteSkill1 = resultadoDado1 + personagem1.MANOBRABILIDADE;
            totalTesteSkill2 = resultadoDado2 + personagem2.MANOBRABILIDADE;

            await resultadoRolagem(
                personagem1.NOME,
                "manobrabilidade", 
                resultadoDado1, 
                personagem1.MANOBRABILIDADE
            );
            await resultadoRolagem(
                personagem2.NOME,
                "manobrabilidade", 
                resultadoDado2, 
                personagem2.MANOBRABILIDADE
            );

        }

        if(bloco === "CONFRONTO"){
            let resultadoPoder1 = resultadoDado1 + personagem1.PODER;
            let resultadoPoder2 = resultadoDado2 + personagem2.PODER;

            totalTesteSkill1 = resultadoPoder1;
            totalTesteSkill2 = resultadoPoder2;

            console.log(`${personagem1.NOME} teve um confronto com ${personagem2.NOME}!🥊`);
            
            await resultadoRolagem(
                personagem1.NOME,
                "poder", 
                resultadoDado1, 
                personagem1.PODER
            );
            await resultadoRolagem(
                personagem2.NOME,
                "poder", 
                resultadoDado2, 
                personagem2.PODER
            );

            if(resultadoPoder1 > resultadoPoder2 && personagem2.PONTOS > 0 ){
                console.log(`${personagem1.NOME} venceu este confronto! ${personagem2.NOME} perdeu 1 ponto 🐢`)
                personagem2.PONTOS--;
            }
            
            if(resultadoPoder2 > resultadoPoder1 && personagem1.PONTOS > 0 ){
                console.log(`${personagem2.NOME} venceu este confronto! ${personagem1.NOME} perdeu 1 ponto 🐢`)
              personagem1.PONTOS--;
            }

            if(resultadoPoder2 === resultadoPoder1){
                console.log (`Confronto empatato! nenhum ponto foi perdido`)
            }           
                
        }

        // Pequena pausa antes de anunciar o vencedor da rodada
        await delay(500); // 0.5 segundos

         // verificando o vencedor
        if(totalTesteSkill1 > totalTesteSkill2){
            console.log(`${personagem1.NOME} marcou um ponto!`);
            personagem1.PONTOS++;
        }else if(totalTesteSkill2 > totalTesteSkill1){
            console.log(`${personagem2.NOME} marcou um ponto!`);
            personagem2.PONTOS++;
        }

        console.log(" ________________________________ ")
        
        // Pausa no final da rodada
        await delay(1500); // 1.5 segundos
    }
}

async function declareCampeao(personagem1, personagem2){
    console.log("\n🏆 Resultado final:")
    console.log(`${personagem1.NOME}: ${personagem1.PONTOS} ponto(s)`)
    console.log(`${personagem2.NOME}: ${personagem2.PONTOS} ponto(s)`)

    if(personagem1.PONTOS > personagem2.PONTOS){
        console.log(`\n${personagem1.NOME} venceu a corrida! Parabéns! 🏆`)
    }else if(personagem2.PONTOS > personagem1.PONTOS){
        console.log(`\n${personagem2.NOME} venceu a corrida! Parabéns! 🏆`)
    }else{
        console.log("A corrida terminou empatada!")
    };
}

// =========================================================== //
// FUNÇÃO PRINCIPAL = com função AUTO-INVOCÁVEL
// =========================================================== //
(async function main(){
    console.log (`🏁🚨 Corrida entre ${player1.NOME} e ${player2.NOME} começando...\n`);
    
    await playRaceEngine(player1, player2);
    await declareCampeao(player1, player2);
})();