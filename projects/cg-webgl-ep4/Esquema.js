/**
 * Define conjuntos de cubos a serem adicionados à cena em um esquema específico.
 */
class Esquema {
    /**
     * Adiciona blocos em um esquema específico na cena.
     * @param {vec3} posicao - posicão do canto inferior em todas a dimensões
     * @param {number[][][]} blocos - blocos do esquema, inteiros de -1 a cores.length-1
     * @param {vec4[]} cores - cada número de blocos representa uma cor nesse vetor
     * @param {number} lado - lado de um cubo
     */
    static adicionaNaCena(posicao, blocos, cores, lado = 1) {
        for (let k = 0; k < blocos.length; k++) {
            for (let i = 0; i < blocos[k].length; i++) {
                for (let j = 0; j < blocos[k][i].length; j++) {
                    let cor = blocos[k][i][j];
                    if (cor <= -1) continue; // bloco vazio
                    if (cor >= cores.length) {
                        console.error(`Cor ${cor} não definida para bloco (${k}, ${i}, ${j})`);
                        continue;
                    }

                    let props = {
                        posicao: add(posicao, vec3(lado * i, lado * k, lado * j)),
                        escala: vec3(lado, lado, lado),
                        cores: [cores[cor]]
                    };

                    gObjetos.push(new Cubo(props));
                }
            }
        }
    }
}
