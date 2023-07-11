/*
    EP03 de MAC0420/MAC5744 - Starship

    Nome: Gustavo de Medeiros Carlos
    NUSP: 11276298
 */

"use strict";

// ==================================================================
// variáveis globais
let gl;
let gCanvas;
let gShader = {};  // encapsula globais do shader

// Os códigos fonte dos shaders serão descritos em 
// strings para serem compilados e passados a GPU
let gVertexShaderSrc;
let gFragmentShaderSrc;

// guarda dados da interface e contexto do desenho
let gCtx = {
    vista: mat4(), // view matrix, inicialmente identidade
    perspectiva: mat4(), // projection matrix
}

let gaPosicoes = [];
let gaCores = [];

let gNave;
let gCdr;
let gObjetos = [];
let gUltimoT = Date.now();

// ==================================================================
// chama a main quando terminar de carregar a janela
window.onload = main;

/**
 * Programa principal.
 */
function main() {
    gCanvas = document.getElementById("glcanvas");
    gl = gCanvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");

    console.log("Canvas: ", gCanvas.width, gCanvas.height);

    Controle.criaInterface();

    gNave = new Nave(
        Config.naveCamera.posicaoInicial,
        Config.naveCamera.theta,
        Config.naveCamera.velocidadeInicial
    );

    // Chão
    Esquema.adicionaNaCena(
        add(Config.minePos,
            vec3(
                -Config.mineLado * Config.mineBlocos,
                -Config.mineLado,
                -Config.mineLado * Config.mineBlocos
            )),
        [Array(2 * Config.mineBlocos + 1).fill(Array(2 * Config.mineBlocos + 1).fill(0))],
        [Config.verdeGrama],
        Config.mineLado)

    // Árvores
    Config.mineArvores.forEach((p) => Esquema.adicionaNaCena(add(Config.minePos, p), Config.mineArvore, [Config.marrom, Config.verdeFolha], Config.mineLado));

    // cubo de referência
    gCdr = new Cubo(Config.cuboReferencia);

    // esferas
    Config.esferas.forEach((props) => gObjetos.push(new Esfera(props)));

    // cubos
    Config.cubos.forEach((props) => gObjetos.push(new Cubo(props)));

    // Inicializações feitas apenas 1 vez
    gl.viewport(0, 0, gCanvas.width, gCanvas.height);
    gl.clearColor(Config.corFundo[0], Config.corFundo[1], Config.corFundo[2], Config.corFundo[3]);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    crieShaders();

    desenha(); // desenha pela primeira vez
    loopAnimacao(); // inicia animação
}

/**
 * Cria e configura os shaders.
 */
function crieShaders() {
    //  cria o programa
    gShader.program = makeProgram(gl, gVertexShaderSrc, gFragmentShaderSrc);
    gl.useProgram(gShader.program);

    // carrega dados na GPU
    let bufferVertices = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferVertices);
    gl.bufferData(gl.ARRAY_BUFFER, safeFlatten(gaPosicoes), gl.STATIC_DRAW);

    let aPosition = gl.getAttribLocation(gShader.program, "aPosition");
    gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);

    let bufCores = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufCores);
    gl.bufferData(gl.ARRAY_BUFFER, safeFlatten(gaCores), gl.STATIC_DRAW);

    var aColor = gl.getAttribLocation(gShader.program, "aColor");
    gl.vertexAttribPointer(aColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aColor);

    // resolve os uniforms
    gShader.uModelView = gl.getUniformLocation(gShader.program, "uModelView");
    gShader.uPerspective = gl.getUniformLocation(gShader.program, "uPerspective");

    // calcula a matriz de transformação perpectiva (fovy, aspect, near, far)
    // que é feita apenas 1 vez
    let aspect = gCanvas.width / gCanvas.height;
    gCtx.perspectiva = perspective(Config.naveCamera.fovy, aspect, Config.naveCamera.near, Config.naveCamera.far);
    gl.uniformMatrix4fv(gShader.uPerspective, false, safeFlatten(gCtx.perspectiva));
};

/**
 * Estabelece loop da animação.
 */
function loopAnimacao() {
    if (!Controle.estado.pausado) {
        let now = Date.now();
        let delta = (now - gUltimoT) / 1000;
        gUltimoT = now;

        simula(delta);
    }


    window.requestAnimationFrame(loopAnimacao);
}

/**
 * Simula movimento da nave e dos outros objetos.
 * @param {number} delta - tempo em segundos a ser simulado em uma iteração
 */
function simula(delta) {
    Controle.executaComandosNave(gNave, delta);
    atualizaMovimento(delta);
    desenha();
}

/**
 * Atualiza movimento da nave e dos outros objetos.
 * @param {number} delta - tempo em segundos a ser considerado
 */
function atualizaMovimento(delta) {
    gNave.atualizaMovimento(delta);

    for (let objeto of gObjetos) {
        objeto.atualizaMovimento(delta);
    }
}

/**
 * Usa o shader para desenhar.
 * Assume que os dados já foram carregados e são estáticos.
 */
function desenha() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gNave.atualizaVisao();
    gCdr.desenha();
    for (let objeto of gObjetos) {
        objeto.desenha();
    }
}

// ========================================================
// Código fonte dos shaders em GLSL
// a primeira linha deve conter "#version 300 es"
// para WebGL 2.0

gVertexShaderSrc = `#version 300 es

// aPosition é um buffer de entrada
in vec3 aPosition;
uniform mat4 uModelView;
uniform mat4 uPerspective;

in vec4 aColor;  // buffer com a cor de cada vértice
out vec4 vColor; // varying -> passado ao fShader

void main() {
    gl_Position = uPerspective * uModelView * vec4(aPosition, 1);
    vColor = aColor; 
}
`;

gFragmentShaderSrc = `#version 300 es

precision highp float;

in vec4 vColor;
out vec4 outColor;

void main() {
  outColor = vColor;
}
`;
