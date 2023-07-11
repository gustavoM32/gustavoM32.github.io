/**
 * Define conjuntos de cubos a serem adicionados à cena em um esquema específico
 * e com diferenciação sutil das cores das faces para melhorar a identificação.
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

                    // +x, -x, +y, -y, +z, -z
                    let coresCubo = [
                        mult(0.80, cores[cor]), mult(0.70, cores[cor]),
                        mult(1.00, cores[cor]), mult(0.60, cores[cor]),
                        mult(0.90, cores[cor]), mult(0.90, cores[cor]),
                    ];

                    coresCubo.forEach((c) => c[3] = 1.0);

                    let props = {
                        posicao: add(posicao, vec3(lado * i, lado * k, lado * j)),
                        escala: vec3(lado, lado, lado),
                        cores: coresCubo.flatMap((c) => Array(2).fill(c))
                    };

                    gObjetos.push(new Cubo(props));
                }
            }
        }
    }
}
