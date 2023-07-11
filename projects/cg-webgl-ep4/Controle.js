/**
 * Define a interação do usuário com o canvas.
 */
class Controle {
    static teclasPressionadas = new Set();
    static comandos = {};
    static comandosContinuos = {};
    static estado = {
        pausado: true,
        gravidadeAtivada: false
    };

    /**
     * Associa funções do programa a eventos da interface.
     */
    static criaInterface() {
        window.onkeydown = Controle.callbackKeyDown;
        window.onkeyup = Controle.callbackKeyUp;

        let canvas = document.getElementById("glcanvas");

        canvas.onmousemove = function (e) {
            if (e.buttons % 2 == 1) {
                Controle.rotacionaNaveMouse(e.movementX, e.movementY);
            }
        }

        canvas.onwheel = function (e) {
            if (e.buttons % 2 == 1) {
                Controle.rotacionaNaveRoda(e.deltaY);
            }
        }

        let botaoExecutar = document.getElementById("botaoExecutar");
        let botaoPasso = document.getElementById("botaoPasso");

        let tempoPasso = document.getElementById("tempoPasso");

        let botaoExplode = document.getElementById("botaoExplode");
        let botaoPara = document.getElementById("botaoPara");

        let botaoGravidade = document.getElementById("botaoGravidade");

        let botaoEnunciado = document.getElementById("botaoEnunciado");

        tempoPasso.onchange = function () {
            tempoPasso.value = Math.max(tempoPasso.min, tempoPasso.value);
        }

        botaoExecutar.onclick = function () {
            if (Controle.estado.pausado) Controle.executa();
            else Controle.pausa();
        };

        botaoPasso.onclick = function () {
            simula(Number(tempoPasso.value));
            gNaves[gNaveIndex].imprimeInformacoes();
        };

        botaoExplode.onclick = function () {
            Controle.moveTudo();
        };

        botaoPara.onclick = function () {
            Controle.paraTudo();
        };

        botaoGravidade.onclick = function () {
            if (Controle.estado.gravidadeAtivada) {
                Controle.estado.gravidadeAtivada = false;
                botaoGravidade.innerText = "Ativar gravidade";
            } else {
                Controle.estado.gravidadeAtivada = true;
                botaoGravidade.innerText = "Desativar gravidade";
            }
        }

        botaoEnunciado.onclick = function () {
            if (Config.consideraEnunciado) {
                Config.consideraEnunciado = false;
                botaoEnunciado.innerText = "Considerar enunciado";
            } else {
                Config.consideraEnunciado = true;
                botaoEnunciado.innerText = "Ignorar enunciado";
            }
            console.log(Config.consideraEnunciado);
            localStorage.setItem("consideraEnunciado", Config.consideraEnunciado);
            location.reload();
        }

        if (Controle.estado.gravidadeAtivada) botaoGravidade.innerText = "Desativar gravidade";
        if (!Config.consideraEnunciado) botaoEnunciado.innerText = "Considerar enunciado";
        if (!Config.iniciarPausado) Controle.executa();
    }

    /**
     * Callback chamado quando uma tecla é pressionada. Maíusculas e minúsculas
     * são consideradas da mesma forma.
     * @param {object} event
     */
    static callbackKeyDown(event) {
        const tecla = event.key.toLowerCase();
        Controle.teclasPressionadas.add(tecla);

        if (tecla in Controle.comandos) {
            Controle.comandos[tecla]();
        }
    }

    /**
     * Callback chamado quando uma tecla é solta. Maíusculas e minúsculas são
     * consideradas da mesma forma.
     * @param {object} event
     */
    static callbackKeyUp(event) {
        const keyName = event.key.toLowerCase();
        Controle.teclasPressionadas.delete(keyName);
    }

    /**
     * Rotaciona nave de acordo com o movimento do mouse.
     * @param {number} deltaX - movimento horizontal do mouse, em píxeis
     * @param {number} deltaY - movimento vertical do mouse, em píxeis
1     */
    static rotacionaNaveMouse(deltaX, deltaY) {
        if (deltaY > 0) {
            gNaves[gNaveIndex].incrementaRotacaoX(0.001 * deltaY);
        } else if (deltaY < 0) {
            gNaves[gNaveIndex].decrementaRotacaoX(-0.001 * deltaY);
        }

        if (deltaX > 0) {
            gNaves[gNaveIndex].incrementaRotacaoY(0.001 * deltaX);
        } else if (deltaX < 0) {
            gNaves[gNaveIndex].decrementaRotacaoY(-0.001 * deltaX);
        }
    }

    /**
     * Rotaciona nave de acordo com o movimento da roda do mouse.
     * @param {number} deltaY - movimento da roda do mouse
     */
    static rotacionaNaveRoda(deltaY) {
        if (deltaY > 0) {
            gNaves[gNaveIndex].incrementaRotacaoZ(0.001 * deltaY);
        } else if (deltaY < 0) {
            gNaves[gNaveIndex].decrementaRotacaoZ(-0.001 * deltaY);
        }
    }

    /**
     * Inicia execução da simulação.
     */
    static executa() {
        let botaoExecutar = document.getElementById("botaoExecutar");
        let botaoPasso = document.getElementById("botaoPasso");

        Controle.estado.pausado = false;
        botaoExecutar.innerText = "Pausar";
        botaoPasso.disabled = true;
        gUltimoT = Date.now();
    }

    /**
     * Pausa execução da simulação.
     */
    static pausa() {
        let botaoExecutar = document.getElementById("botaoExecutar");
        let botaoPasso = document.getElementById("botaoPasso");

        Controle.estado.pausado = true;
        botaoExecutar.innerText = "Executar";
        botaoPasso.disabled = false;
    }

    /**
     * Aplica velocidade e rotações aleatória em todos os objetos.
     */
    static moveTudo() {
        gObjetos.forEach((o) => {
            o.velocidade = sorteioVec3Aleatorio(-300, 300);
            o.vtheta = sorteioVec3Aleatorio(-100, 100);
        });
    }

    /**
     * Zera velocidades e rotações de todos os objetos.
     */
    static paraTudo() {
        gObjetos.forEach((o) => {
            o.aceleracao = vec3(0, 0, 0);
            o.velocidade = vec3(0, 0, 0);
            o.vtheta = vec3(0, 0, 0);
        });
    }

    /**
     * Move visão e controle para a próxima nave da lista de naves.
     */
    static vaiParaProximaNave() {
        gNaveIndex = mod(gNaveIndex + 1, gNaves.length);
    }

    /**
     * Move visão e controle para a nave anterior da lista de naves.
     */
    static vaiParaNaveAnterior() {
        gNaveIndex = mod(gNaveIndex - 1, gNaves.length);
    }

    /**
     * Associa teclas com comandos.
     */
    static registraComandos() {
        Controle.registraComando('je', true,
            (args) => args.nave.desacelera(args.delta));
        Controle.registraComando('lq', true,
            (args) => args.nave.acelera(args.delta));
        Controle.registraComando('ks', true,
            (args) => args.nave.para(args.delta));
        Controle.registraComando('w', true,
            (args) => args.nave.incrementaRotacaoX(args.delta));
        Controle.registraComando('x', true,
            (args) => args.nave.decrementaRotacaoX(args.delta));
        Controle.registraComando('a', true,
            (args) => args.nave.incrementaRotacaoY(args.delta));
        Controle.registraComando('d', true,
            (args) => args.nave.decrementaRotacaoY(args.delta));
        Controle.registraComando('z', true,
            (args) => args.nave.incrementaRotacaoZ(args.delta));
        Controle.registraComando('c', true,
            (args) => args.nave.decrementaRotacaoZ(args.delta));

        Controle.registraComando('g', false,
            () => Controle.moveTudo());
        Controle.registraComando('h', false,
            () => Controle.paraTudo());

        Controle.registraComando('m', false,
            () => Controle.vaiParaProximaNave());
        Controle.registraComando('n', false,
            () => Controle.vaiParaNaveAnterior());
    }

    /**
     * Associa teclas com um comando.
     * @param {string} teclas - carecteres que representam cada tecla
     * @param {boolean} continuo - true se comando é executado enquanto a tecla estiver pressionada
     * @param {Function} comando
     */
    static registraComando(teclas, continuo, comando) {
        for (let tecla of teclas) {
            let listaComandos = (continuo ? this.comandosContinuos : this.comandos);
            listaComandos[tecla] = comando;
        }
    }

    /**
     * Executa os comandos que são executados continuamente.
     * @param {Nave} nave - nave que será movimentada com os comandos
     * @param {number} delta - tempo em segundos para o comando considerar
     */
    static executaComandosContinuos(nave, delta) {
        let args = {
            nave: nave,
            delta: delta
        }

        for (let tecla of Controle.teclasPressionadas) {
            if (tecla in Controle.comandosContinuos) {
                Controle.comandosContinuos[tecla](args);
            }
        }
    }
}
