/**
 * @typedef ObjectProperties
 * @type {object}
 * @property {vec3} posicao - posição inicial
 * @property {vec3} escala - escala em relação aos eixos
 * @property {vec3} theta - ângulo de rotação em relação aos eixos
 * @property {vec3} vtheta - velocidade de rotação em relação aos eixos
 * @property {vec4[]} cores - cores dos triângulos
 * @property {number[]} emCoefs - coeficientes de emissão
 * @property {number[]} alfaEsps - alfa especular dos triângulos
 */

/**
 * @typedef VertexBufferInfo
 * @type {object}
 * @property {number} indice - índice do primeiro vértice do objeto nos buffers
 * @property {number} numVertices - número de vértices do objeto nos buffers
 */

/**
 * Define objetos a serem adicionados à cena.
 */
class Objeto {
    /**
     * @param {ObjectProperties} props
     * @param {vec3[][]} triangulos
     */
    constructor(props, triangulos) {
        this.posicao = props.posicao;
        this.escala = props.escala ?? vec3(1.0, 1.0, 1.0);
        this.theta = props.rotacao ?? vec3(0.0, 0.0, 0.0);
        this.vtheta = props.velocidadeRotacao ?? vec3(0.0, 0.0, 0.0);
        this.cores = props.cores ?? [vec4(1.0, 1.0, 1.0, 1.0)];
        this.emCoefs = props.emCoefs ?? [0.0];
        this.alfaEsps = props.alfaEsps ?? [MAT_GLOBAL.alfa];
        this.velocidade = vec3(0, 0, 0);
        this.aceleracao = vec3(0, 0, 0);
        this.vertexBufferInfo = Objeto.adicionaObjetoNaCena(triangulos,
            this.cores, this.emCoefs, this.alfaEsps);
    }

    /**
     * Adiciona triângulos do objeto aos buffers de vértices. Os triângulos
     * recebem as propriedades na mesma ordem que seus argumentos (cores, etc),
     * considerando-os como uma lista circular.
     * @param {vec3[][]} triangulos
     * @param {vec4[]} cores
     * @param {number[]} emCoefs
     * @param {number[]} alfaEsps
     * @returns {VertexBufferInfo}
     */
    static adicionaObjetoNaCena(triangulos, cores, emCoefs, alfaEsps) {
        let indiceGaPosicoes = gaPosicoes.length;

        for (let i = 0; i < triangulos.length; i++) {
            let ab = subtract(triangulos[i][1], triangulos[i][0]);
            let ac = subtract(triangulos[i][2], triangulos[i][0]);
            let normal = normalize(cross(ab, ac));

            for (let vertice of triangulos[i]) {
                gaPosicoes.push(vertice);
                gaNormais.push(normal);

                gaCores.push(cores[i % cores.length]);
                gaEmCoefs.push(emCoefs[i % emCoefs.length]);
                gaAlfaEsps.push(alfaEsps[i % alfaEsps.length]);
            }
        }

        return {
            indice: indiceGaPosicoes,
            numVertices: 3 * triangulos.length
        }
    }

    /**
     * Atualiza movimento do objeto considerando uma determinada quantidade de
     * tempo desde sua última atualização.
     * @param {number} delta - tempo em segundos
     */
    atualizaMovimento = function (delta) {
        this.velocidade = add(this.velocidade, mult(delta, this.aceleracao));
        this.posicao = add(this.posicao, mult(delta, this.velocidade));
        this.theta = add(this.theta, mult(delta, this.vtheta));
    };

    /**
     * Desenha objeto.
     */
    desenha = function () {
        let model = pegaMatrizSRT(this.escala, this.theta, this.posicao);
        let modelView = mult(gCtx.vista, model);
        let modelViewInv = inverse(modelView);
        let modelViewInvTrans = transpose(modelViewInv);

        gl.uniformMatrix4fv(gShader.uModel, false, safeFlatten(model));
        gl.uniformMatrix4fv(gShader.uInverseTranspose, false, safeFlatten(modelViewInvTrans));

        gl.drawArrays(gl.TRIANGLES, this.vertexBufferInfo.indice, this.vertexBufferInfo.numVertices);
    };
};
