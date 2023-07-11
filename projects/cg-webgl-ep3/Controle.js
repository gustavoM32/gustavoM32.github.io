/**
 * Define a interação do usuário com o canvas.
 */
class Controle {
    static teclasPressionadas = new Set();
    static comandos = {};
    static estado = {
        pausado: true
    };

    /**
     * Associa funções do programa a eventos da interface.
     */
    static criaInterface() {
        window.onkeydown = Controle.callbackKeyDown;
        window.onkeyup = Controle.callbackKeyUp;

        window.onmousemove = function (e) {
            if (e.buttons % 2 == 1) {
                let deltaY = e.movementY;
                if (deltaY > 0) {
                    gNave.incrementaRotacaoX(0.001 * deltaY);
                } else if (deltaY < 0) {
                    gNave.decrementaRotacaoX(-0.001 * deltaY);
                }

                let deltaX = e.movementX;
                if (deltaX > 0) {
                    gNave.incrementaRotacaoY(0.001 * deltaX);
                } else if (deltaX < 0) {
                    gNave.decrementaRotacaoY(-0.001 * deltaX);
                }
            }
        }

        window.onwheel = function (e) {
            if (e.buttons % 2 == 1) {
                let deltaY = e.deltaY;
                if (deltaY > 0) {
                    gNave.incrementaRotacaoZ(0.001 * deltaY);
                } else if (deltaY < 0) {
                    gNave.decrementaRotacaoZ(-0.001 * deltaY);
                }
            }
        }

        let botaoExecutar = document.getElementById("botaoExecutar");
        let botaoPasso = document.getElementById("botaoPasso");

        let tempoPasso = document.getElementById("tempoPasso");

        let botaoExplode = document.getElementById("botaoExplode");
        let botaoPara = document.getElementById("botaoPara");

        tempoPasso.onchange = function () {
            tempoPasso.value = Math.max(tempoPasso.min, tempoPasso.value);
        }

        botaoExecutar.onclick = function () {
            if (Controle.estado.pausado) Controle.executa();
            else Controle.pausa();
        };

        botaoPasso.onclick = function () {
            simula(Number(tempoPasso.value));
            gNave.imprimeInformacoes();
        };

        botaoExplode.onclick = function () {
            Controle.moveTudo();
        };

        botaoPara.onclick = function () {
            Controle.paraTudo();
        };
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
            o.velocidade = sorteioVec3Aleatorio(-1000, 1000);
            o.vtheta = sorteioVec3Aleatorio(-100, 100);
        });
    }

    /**
     * Zera velocidades e rotações de todos os objetos.
     */
    static paraTudo() {
        gObjetos.forEach((o) => {
            o.velocidade = vec3(0, 0, 0);
            o.vtheta = vec3(0, 0, 0);
        });
    }

    /**
     * Callback chamado quando uma tecla é pressionada. Maíusculas e minúsculas
     * são consideradas da mesma forma.
     * @param {object} event
     */
    static callbackKeyDown(event) {
        const keyName = event.key.toLowerCase();
        Controle.teclasPressionadas.add(keyName);

        switch (keyName) {
            case 'm':
                Controle.moveTudo();
                break;
            case 'n':
                Controle.paraTudo();
                break;
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
     * Associa teclas com comandos da nave.
     * @param {Nave} nave
     */
    static registraComandosNave(nave) {
        Controle.registraComando('j', nave.desacelera);
        Controle.registraComando('l', nave.acelera);
        Controle.registraComando('k', nave.para);
        Controle.registraComando('w', nave.incrementaRotacaoX);
        Controle.registraComando('x', nave.decrementaRotacaoX);
        Controle.registraComando('a', nave.incrementaRotacaoY);
        Controle.registraComando('d', nave.decrementaRotacaoY);
        Controle.registraComando('z', nave.incrementaRotacaoZ);
        Controle.registraComando('c', nave.decrementaRotacaoZ);
    }

    /**
     * Associa tecla com um comando.
     * @param {string} tecla
     * @param {Function} comando
     */
    static registraComando(tecla, comando) {
        this.comandos[tecla] = comando;
    }

    /**
     * Executa os comandos da nave de acordo com as teclas que estão
     * pressionadas.
     * @param {Nave} nave
     * @param {number} delta - tempo em segundos para o comando considerar
     */
    static executaComandosNave(nave, delta) {
        for (let tecla in Controle.comandos) {
            if (Controle.teclasPressionadas.has(tecla)) {
                Controle.comandos[tecla].call(nave, delta);
            }
        }
    }
}
