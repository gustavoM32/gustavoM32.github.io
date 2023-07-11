/**
 * Calcula o valor de a mod b. Devolve um valor x tal que 0 <= x < b.
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
function mod(a, b) {
    return (b + (a % b)) % b
}

/**
 * Flatten que funciona quando v é vazio.
 * @param {vec2[]} v
 * @return {number[]}
 */
function safeFlatten(v) {
    if (v.length == 0) return [];
    return flatten(v);
}

/**
 * Devolve vetor 3D aleatório com coordenadas no intervalo [minimo, maximo].
 * @param {number} minimo
 * @param {number} maximo
 * @return {vec3}
 */
function sorteioVec3Aleatorio(minimo, maximo) {
    return vec3(
        sorteieInteiro(minimo, maximo),
        sorteieInteiro(minimo, maximo),
        sorteieInteiro(minimo, maximo)
    );
}

/**
 * Devolve a matriz que aplica as transformações lineares na ordem usual.
 * @param {vec3} escala
 * @param {vec3} rotacao
 * @param {vec3} translacao
 * @return {mat4}
 */
function pegaMatrizSRT(escala, rotacao, translacao) {
    // scale
    let scaleMatrix = scale(escala[0], escala[1], escala[2]);
    // rotate
    let rotateMatrix = rotateXYZ(rotacao);
    // translate
    let translateMatrix = translate(translacao[0], translacao[1], translacao[2]);

    return mult(translateMatrix, mult(rotateMatrix, scaleMatrix));
}

/**
 * Devolve a matriz que aplica as rotações na ordem usual dos eixos, dados os
 * ângulos de rotação em relação a cada um.
 * @param {vec3} theta
 * @return {mat4}
 */
function rotateXYZ(theta) {
    return mult(rotateZ(theta[2]), mult(rotateY(theta[1]), rotateX(theta[0])));
}

/**
 * Transforma um vetor 4D em um vetor 3D ignorando a última coordenada, que é
 * usualmente a coordenada homogênea.
 * @param {vec4} v4
 * @return {vec3}
 */
function toVec3(v4) {
    return vec3(v4[0], v4[1], v4[2]);
}
