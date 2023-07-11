/**
 * Define nave que o usuário controla e que mantém a posição da câmera.
 */
class Nave {
    static INCREMENTO_VELOCIDADE = 600;
    static INCREMENTO_ROTACAO = 60;

    /**
     * @param {vec3} posicao - posição inicial da nave
     * @param {vec3} theta - ângulo da nave em relação aos eixos
     * @param {number} velocidade - velocidade inicial da nave
     */
    constructor(posicao, theta = vec3(0, 0, 0), velocidade = 0) {
        this.pos = posicao;
        this.matrizRotacao = rotateXYZ(theta);
        this.vTrans = velocidade;

        Controle.registraComandosNave(this);
    }

    /**
     * Devolve vetor 3D normalizado com a direção que a nave está apontando.
     * @return {vec3}
     */
    pegaDirecao() {
        return normalize(toVec3(mult(this.matrizRotacao, vec4(0, 0, -1, 1))));
    }

    /**
     * Devolve vetor 3D normalizado com a direção que aponta para cima em
     * relação à nave.
     * @return {vec3}
     */
    pegaRoll() {
        return normalize(toVec3(mult(this.matrizRotacao, vec4(0, 1, 0, 1))));
    }

    /**
     * Atualiza movimento da nave considerando uma determinada quantidade de
     * tempo desde sua última atualização.
     * @param {number} delta - tempo em segundos
     */
    atualizaMovimento(delta) {
        this.pos = add(this.pos, mult(delta * this.vTrans, this.pegaDirecao()));
    }

    /**
     * Imprime informações da nave.
     */
    imprimeInformacoes() {
        let [px, py, pz] = this.pos;

        console.log(`pos: (${Math.round(px)}, ${Math.round(py)}, ${Math.round(pz)})`);

        console.log(`velocidade: ${Math.round(this.vTrans)}`);

        // Esses ângulos não seguem a convenção de yaw e roll no intervalo
        // [-180, 180] e pitch no intervalo [-90, 90], mas representam os
        // ângulos em relação aos eixos se as rotações forem aplicanas na ordem
        // descrita no enunciado.
        let ax = Math.atan2(this.matrizRotacao[2][1], this.matrizRotacao[2][2]) / Math.PI * 180;
        let ay = Math.asin(-this.matrizRotacao[2][0]) / Math.PI * 180;
        let az = Math.atan2(this.matrizRotacao[1][0], this.matrizRotacao[0][0]) / Math.PI * 180;

        console.log(`theta: (${Math.round(ax)}°, ${Math.round(ay)}°, ${Math.round(az)}°)`);
    }

    /**
     * Atualiza matriz de transformação das coordenadas do mundo para
     * coordenadas da câmera (que corresponde à nave).
     */
    atualizaVisao() {
        let eye = this.pos;
        let at = add(this.pos, this.pegaDirecao());
        let up = this.pegaRoll();
        gCtx.vista = lookAt(eye, at, up);
    }

    /**
     * Diminui velocidade da nave.
     * @param {number} delta - tempo em segundos
     */
    desacelera(delta) {
        this.vTrans -= delta * Nave.INCREMENTO_VELOCIDADE;
    }

    /**
     * Aumenta velocidade da nave.
     * @param {number} delta - tempo em segundos
     */
    acelera(delta) {
        this.vTrans += delta * Nave.INCREMENTO_VELOCIDADE;
    }

    /**
     * Zera velocidade da nave.
     */
    para() {
        this.vTrans = 0;
    }

    // Rotações sempre em relação aos eixos da nave.
    // Eixo x aponta para direita.
    // Eixo y aponta para cima.
    // Eixo z aponta para trás.
    // 

    /**
     * Incrementa rotação em x (para cima).
     * @param {number} delta - tempo em segundos
     */
    incrementaRotacaoX(delta) {
        this.matrizRotacao = mult(this.matrizRotacao, rotateX(delta * Nave.INCREMENTO_ROTACAO));
    }

    /**
     * Decrementa rotação em x (para baixo).
     * @param {number} delta - tempo em segundos
     */
    decrementaRotacaoX(delta) {
        this.matrizRotacao = mult(this.matrizRotacao, rotateX(-delta * Nave.INCREMENTO_ROTACAO));
    }

    /**
     * Incrementa rotação em y (para esquerda).
     * @param {number} delta - tempo em segundos
     */
    incrementaRotacaoY(delta) {
        this.matrizRotacao = mult(this.matrizRotacao, rotateY(delta * Nave.INCREMENTO_ROTACAO));
    }

    /**
     * Decrementa rotação em y (para direita).
     * @param {number} delta - tempo em segundos
     */
    decrementaRotacaoY(delta) {
        this.matrizRotacao = mult(this.matrizRotacao, rotateY(-delta * Nave.INCREMENTO_ROTACAO));
    }

    /**
     * Incrementa rotação em z (anti-horário).
     * @param {number} delta - tempo em segundos
     */
    incrementaRotacaoZ(delta) {
        this.matrizRotacao = mult(this.matrizRotacao, rotateZ(delta * Nave.INCREMENTO_ROTACAO));
    }

    /**
     * Decrementa rotação em z (horário).
     * @param {number} delta - tempo em segundos
     */
    decrementaRotacaoZ(delta) {
        this.matrizRotacao = mult(this.matrizRotacao, rotateZ(-delta * Nave.INCREMENTO_ROTACAO));
    }
};
