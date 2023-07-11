/**
 * @typedef ObjectProperties
 * @type {object}
 * @property {vec3} posicao - posição inicial
 * @property {vec3} escala - escala em relação aos eixos
 * @property {vec3} theta - ângulo de rotação em relação aos eixos
 * @property {vec3} vtheta - velocidade de rotação em relação aos eixos
 * @property {vec4[]} cores - cores dos triângulos
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
        this.velocidade = vec3(0, 0, 0);
        this.aceleracao = vec3(0, 0, 0);
        this.vertexBufferInfo = Objeto.adicionaObjetoNaCena(triangulos, this.cores);
    }

    /**
     * Adiciona triângulos do objeto aos buffers de vértices. Os triângulos são
     * pintados com as cores na mesma ordem do argumento "cores", considerando-o
     * como uma lista circular.
     * @param {vec3[][]} triangulos
     * @param {vec4[]} cores
     * @returns {VertexBufferInfo}
     */
    static adicionaObjetoNaCena(triangulos, cores) {
        let indiceGaPosicoes = gaPosicoes.length;

        for (let i = 0; i < triangulos.length; i++) {
            for (let vertice of triangulos[i]) {
                gaPosicoes.push(vertice);
                gaCores.push(cores[i % cores.length]);
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
        let modelView = this.calculaModelView();

        gl.uniformMatrix4fv(gShader.uModelView, false, safeFlatten(modelView));
        gl.drawArrays(gl.TRIANGLES, this.vertexBufferInfo.indice, this.vertexBufferInfo.numVertices);
    };

    /**
     * Calcula matriz model view do objeto.
     * @return {vec4}
     */
    calculaModelView = function () {
        return mult(gCtx.vista, pegaMatrizSRT(this.escala, this.theta, this.posicao));
    };
};
