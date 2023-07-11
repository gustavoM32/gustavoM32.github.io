/*
    EP04 de MAC0420/MAC5744 - Starship 2

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
let gaNormais = [];
let gaCores = [];
let gaEmCoefs = [];
let gaAlfaEsps = [];

let gNaves = [];
let gNaveIndex;
let gCdr;
let gFonteLuz;
let gTerra;
let gLua;
let gSol;
let gObjetos = [];
let gUltimoT = Date.now();

// Propriedades da fonte de luz
const LUZ = {
    pos: toVec4(Config.posicaoFonte), // posição
    amb: mult(0.1, Config.corLuz), // ambiente
    dif: mult(1.0, Config.corLuz), // difusão
    esp: mult(0.3, Config.corLuz) // especular
};

// Propriedades de todos os materiais
const MAT_GLOBAL = {
    amb: vec4(1.0, 1.0, 1.0, 1.0),
    dif: vec4(1.0, 1.0, 1.0, 1.0),
    alfa: 10.0,
};

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

    Controle.registraComandos();
    Controle.criaInterface();

    gNaves = Config.naves.map((nave) => new Nave(
        nave.posicaoInicial,
        nave.theta,
        nave.velocidadeInicial,
        nave.cor
    ));

    gNaveIndex = 0;

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

    // fonte
    gFonteLuz = new Esfera(Config.fonteLuz);
    gObjetos.push(gFonteLuz);

    // corpos grandes
    gTerra = new Esfera(Config.terra);
    gObjetos.push(gTerra);

    gLua = new Esfera(Config.lua);
    gObjetos.push(gLua);

    gSol = new Esfera(Config.sol);
    gObjetos.push(gSol);

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

    // buffer das normais
    var bufNormais = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufNormais);
    gl.bufferData(gl.ARRAY_BUFFER, safeFlatten(gaNormais), gl.STATIC_DRAW);

    var aNormal = gl.getAttribLocation(gShader.program, "aNormal");
    gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aNormal);

    // buffer das posições dos
    let bufferVertices = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferVertices);
    gl.bufferData(gl.ARRAY_BUFFER, safeFlatten(gaPosicoes), gl.STATIC_DRAW);

    let aPosition = gl.getAttribLocation(gShader.program, "aPosition");
    gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);

    // buffer das cores
    let bufCores = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufCores);
    gl.bufferData(gl.ARRAY_BUFFER, safeFlatten(gaCores), gl.STATIC_DRAW);

    var aColor = gl.getAttribLocation(gShader.program, "aColor");
    gl.vertexAttribPointer(aColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aColor);

    // buffer dos coeficientes de emissão
    let bufEmCoefs = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufEmCoefs);
    gl.bufferData(gl.ARRAY_BUFFER, safeFlatten(gaEmCoefs), gl.STATIC_DRAW);

    var aEmCoef = gl.getAttribLocation(gShader.program, "aEmCoef");
    gl.vertexAttribPointer(aEmCoef, 1, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aEmCoef);

    // buffer do alfa especular
    let bufAlfaEsps = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufAlfaEsps);
    gl.bufferData(gl.ARRAY_BUFFER, safeFlatten(gaAlfaEsps), gl.STATIC_DRAW);

    var aAlfaEsp = gl.getAttribLocation(gShader.program, "aAlfaEsp");
    gl.vertexAttribPointer(aAlfaEsp, 1, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aAlfaEsp);

    // resolve os uniforms
    gShader.uModel = gl.getUniformLocation(gShader.program, "uModel");
    gShader.uView = gl.getUniformLocation(gShader.program, "uView");
    gShader.uPerspective = gl.getUniformLocation(gShader.program, "uPerspective");
    gShader.uInverseTranspose = gl.getUniformLocation(gShader.program, "uInverseTranspose");

    // calcula a matriz de transformação perpectiva (fovy, aspect, near, far)
    // que é feita apenas 1 vez
    let aspect = gCanvas.width / gCanvas.height;
    gCtx.perspectiva = perspective(Config.perspectiva.fovy, aspect, Config.perspectiva.near, Config.perspectiva.far);
    gl.uniformMatrix4fv(gShader.uPerspective, false, safeFlatten(gCtx.perspectiva));

    // parametros para iluminação
    gShader.uLuzPos = gl.getUniformLocation(gShader.program, "uLuzPos");
    gl.uniform4fv(gShader.uLuzPos, LUZ.pos);

    // fragment shader
    gShader.uLuzAmb = gl.getUniformLocation(gShader.program, "uLuzAmbiente");
    gShader.uLuzDif = gl.getUniformLocation(gShader.program, "uLuzDifusao");
    gShader.uLuzEsp = gl.getUniformLocation(gShader.program, "uLuzEspecular");
    gShader.uAlfaEsp = gl.getUniformLocation(gShader.program, "uAlfaEsp");

    gl.uniform4fv(gShader.uLuzAmb, mult(MAT_GLOBAL.amb, LUZ.amb));
    gl.uniform4fv(gShader.uLuzDif, mult(MAT_GLOBAL.dif, LUZ.dif));
    gl.uniform4fv(gShader.uLuzEsp, LUZ.esp);
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
    Controle.executaComandosContinuos(gNaves[gNaveIndex], delta);
    atualizaMovimento(delta);
    desenha();
}

/**
 * Atualiza movimento das naves e dos outros objetos.
 * @param {number} delta - tempo em segundos a ser considerado
 */
function atualizaMovimento(delta) {
    if (Controle.estado.gravidadeAtivada) {
        for (let objeto of gObjetos) {
            let vCdr = subtract(gCdr.posicao, objeto.posicao);
            let dCdr = length(vCdr)
            if (dCdr < 1) continue;
            objeto.aceleracao = mult(Config.coefGravidade / dCdr / dCdr, vCdr);
        }
    }

    for (let nave of gNaves) {
        nave.atualizaMovimento(delta);
    }

    for (let objeto of gObjetos) {
        objeto.atualizaMovimento(delta);
    }

    gl.uniform4fv(gShader.uLuzPos, toVec4(gFonteLuz.posicao));
}

/**
 * Usa o shader para desenhar.
 * Assume que os dados já foram carregados e são estáticos.
 */
function desenha() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gNaves[gNaveIndex].atualizaVisao();

    for (let nave of gNaves) {
        nave.desenha();
    }

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

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uPerspective;
uniform mat4 uInverseTranspose;

uniform vec4 uLuzPos;

in vec4 aPosition;
in vec3 aNormal;

in vec4 aColor;
in float aEmCoef;
in float aAlfaEsp;

out vec3 vNormal;
out vec3 vLight;
out vec3 vView;

out vec4 vColor;
out float vEmCoef;
out float vAlfaEsp;

void main() {
    mat4 modelView = uView * uModel;
    gl_Position = uPerspective * modelView * aPosition;

    // orienta as normais como vistas pela câmera
    vNormal = (mat3(uInverseTranspose) * aNormal);
    vec4 pos = modelView * aPosition;

    vLight = (uView * uLuzPos - pos).xyz;
    vView = -(pos.xyz);

    vColor = aColor;
    vEmCoef = aEmCoef;
    vAlfaEsp = aAlfaEsp;
}
`;

gFragmentShaderSrc = `#version 300 es

precision highp float;

uniform vec4 uLuzAmbiente;
uniform vec4 uLuzDifusao;
uniform vec4 uLuzEspecular;

in vec3 vNormal;
in vec3 vLight;
in vec3 vView;

in vec4 vColor;
in float vEmCoef;
in float vAlfaEsp;

out vec4 corSaida;

void main() {
    vec3 normalV = normalize(vNormal);
    vec3 lightV = normalize(vLight);
    vec3 viewV = normalize(vView);
    vec3 halfV = normalize(lightV + viewV);
  
    // difusao
    float kd = max(0.0, dot(normalV, lightV));
    vec4 difusao = kd * (uLuzDifusao * vColor);

    // especular
    float ks = pow(max(0.0, dot(normalV, halfV)), vAlfaEsp);
    
    vec4 especular = vec4(0, 0, 0, 1); // parte não iluminada
    if (kd > 0.0) {  // parte iluminada
        especular = ks * uLuzEspecular;
    }

    corSaida = vEmCoef * vColor + difusao + especular + (uLuzAmbiente * vColor);    
    corSaida.a = 1.0;
}
`;
