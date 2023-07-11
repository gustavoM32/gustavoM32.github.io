/* 
    EP3 - Starship - arquivo de configuração

    arquivo de configuração e dados.
    A câmera está presa no nariz da nave.
*/
class Config {
    static corFundo = [0.0, 0.0, 0.15, 1.0];

    static naveCamera = {
        posicaoInicial: vec3(200, 300, 800),
        theta: vec3(-10, 20, 0),
        velocidadeInicial: 0.050,
        fovy: 60,
        near: 0.1,
        far: 10000000,
    };

    static coresCDR = [
        vec4(1, 0, 0, 1), // face +x
        vec4(0, 1, 1, 1), // face -x
        vec4(0, 1, 0, 1), // face +y
        vec4(1, 0, 1, 1), // face -y
        vec4(0, 0, 1, 1), // face +z
        vec4(1, 1, 0, 1), // face -z
    ];

    static cuboReferencia = {
        posicao: vec3(0, 0, 0),
        escala: vec3(30, 30, 30),
        cores: Config.coresCDR.flatMap((c) => [c, c])
    };

    static esferas = [
        // Terra
        {
            posicao: vec3(0, 0, -30000),
            escala: vec3(10000, 10000, 10000),
            velocidadeRotacao: vec3(0, 1, 0),
            cores: [
                vec4(0.2, 0.6, 0.3, 1.0), // Verde escuro
                vec4(0.15, 0.5, 0.2, 1.0), // Verde médio
                vec4(0.1, 0.4, 0.1, 1.0), // Verde claro
                vec4(0.8, 0.8, 0.0, 1.0), // Amarelo
                vec4(0.1, 0.1, 0.9, 1.0), // Azul
            ]
        },
        // Lua
        {
            posicao: vec3(-30000, 0, -30000),
            escala: vec3(3000, 3000, 3000),
            velocidadeRotacao: vec3(0, 20, 0),
            cores: [
                vec4(0.9, 0.9, 0.9, 1.0), // Cinza bem claro
                vec4(0.8, 0.8, 0.8, 1.0), // Cinza claro
                vec4(0.7, 0.7, 0.7, 1.0), // Cinza
                vec4(0.5, 0.5, 0.5, 1.0), // Cinza escuro
                vec4(0.3, 0.3, 0.3, 1.0)  // Cinza bem escuro
            ]
        },
        // Sol
        {
            posicao: vec3(-200000, 0, 400000),
            escala: vec3(100000, 100000, 100000),
            velocidadeRotacao: vec3(0, 5, 0),
            cores: [
                vec4(1.0, 0.7, 0.3, 1.0), // Laranja claro
                vec4(1.0, 0.9, 0.5, 1.0), // Amarelo claro
                vec4(1.0, 1.0, 0.8, 1.0), // Branco
                vec4(1.0, 0.8, 0.2, 1.0), // Amarelo ouro
                vec4(1.0, 0.5, 0.1, 1.0)  // Laranja escuro
            ]
        },

        {
            posicao: vec3(100, -100, 200),
            escala: vec3(100, 30, 30),
            velocidadeRotacao: vec3(20, 0, 180),
            cores: [
                vec4(0.7, 0.7, 0.7, 1.0), // Cinza Claro
                vec4(0.2, 0.6, 0.2, 1.0), // Verde
                vec4(0.1, 0.4, 0.9, 1.0), // Azul
                vec4(0.9, 0.1, 0.1, 1.0)  // Vermelho
            ]
        },
        {
            posicao: vec3(200, 0, -200),
            escala: vec3(70, 80, 20),
            velocidadeRotacao: vec3(200, 50, 100),
            cores: [
                vec4(0.9, 0.6, 0.2, 1.0), // Laranja
                vec4(0.7, 0.3, 0.9, 1.0), // Roxo
                vec4(0.1, 0.9, 0.6, 1.0)  // Verde Azulado
            ]

        },
        {
            posicao: vec3(-300, -200, 100),
            escala: vec3(150, 100, 50),
            velocidadeRotacao: vec3(100, 200, 20),
            cores: [
                vec4(1.0, 0.0, 0.0, 1.0), // Vermelho
                vec4(1.0, 0.5, 0.0, 1.0), // Laranja
                vec4(1.0, 1.0, 0.0, 1.0), // Amarelo
                vec4(0.0, 1.0, 0.0, 1.0), // Verde
                vec4(0.0, 0.0, 1.0, 1.0)  // Azul
            ]
        },
        {
            posicao: vec3(-100, 100, -300),
            escala: vec3(30, 50, 30),
            velocidadeRotacao: vec3(400, 20, 20),
            cores: [
                vec4(0.8, 0.8, 0.6, 1.0), // Amarelo Claro
                vec4(0.7, 0.7, 0.4, 1.0), // Amarelo Médio
                vec4(0.6, 0.6, 0.3, 1.0), // Amarelo Escuro
                vec4(0.9, 0.9, 0.7, 1.0)  // Bege
            ]
        }
    ];

    static cubos = [
        {
            posicao: vec3(300, 200, 300),
            escala: vec3(60, 30, 30),
            velocidadeRotacao: vec3(20, 0, 180),
            cores: [
                vec4(0.4, 0.6, 0.9, 1.0), // Azul Claro
                vec4(0.1, 0.3, 0.7, 1.0)  // Azul Escuro
            ]
        },
        {
            posicao: vec3(300, 600, -300),
            escala: vec3(200, 300, 100),
            velocidadeRotacao: vec3(200, 50, 30),
            cores: [
                vec4(0.8, 0.6, 0.4, 1.0), // Marrom
                vec4(0.3, 0.5, 0.2, 1.0)  // Verde
            ]
        },
        {
            posicao: vec3(-300, 400, -100),
            escala: vec3(30, 200, 200),
            velocidadeRotacao: vec3(100, 10, 0),
            cores: [
                vec4(0.9, 0.4, 0.2, 1.0), // Laranja
                vec4(0.9, 0.1, 0.1, 1.0)  // Vermelho
            ]
        },
        {
            posicao: vec3(-300, 200, -300),
            escala: vec3(300, 20, 20),
            velocidadeRotacao: vec3(80, 80, 80),
            cores: [
                vec4(0.7, 0.7, 0.7, 1.0), // Cinza Claro
                vec4(0.5, 0.5, 0.5, 1.0), // Cinza Médio
                vec4(0.3, 0.3, 0.3, 1.0)  // Cinza Escuro
            ]
        }
    ];

    static verdeGrama = vec4(88 / 255, 134 / 255, 64 / 255, 1.0);
    static marrom = vec4(126 / 255, 103 / 255, 49 / 255, 1.0);
    static verdeFolha = vec4(78 / 255, 116 / 255, 35 / 255, 1.0);

    static mineBlocos = 15;
    static mineLado = 100;
    static minePos = vec3(-20 * Config.mineLado, -10 * Config.mineLado, -30 * Config.mineLado);
    static mineArvores = [
        vec3(-7 * Config.mineLado, 0, 8 * Config.mineLado),
        vec3(7 * Config.mineLado, 0, -3 * Config.mineLado),
        vec3(5 * Config.mineLado, 0, 6 * Config.mineLado),
        vec3(2 * Config.mineLado, 0, -9 * Config.mineLado),
        vec3(-6 * Config.mineLado, 0, -9 * Config.mineLado),
        vec3(-12 * Config.mineLado, 0, -3 * Config.mineLado),
        vec3(-2 * Config.mineLado, 0, -2 * Config.mineLado)
    ];

    static mineArvore = [
        [
            [-1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1],
            [-1, -1, 0, -1, -1],
            [-1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1],
        ],
        [
            [-1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1],
            [-1, -1, 0, -1, -1],
            [-1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1],
        ],
        [
            [-1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1],
            [-1, -1, 0, -1, -1],
            [-1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1],
        ],
        [
            [-1, 1, 1, 1, -1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [-1, 1, 1, 1, -1],
        ],
        [
            [-1, 1, 1, 1, -1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [-1, 1, 1, 1, -1],
        ],
        [
            [-1, -1, -1, -1, -1],
            [-1, 1, 1, 1, -1],
            [-1, 1, 1, 1, -1],
            [-1, 1, 1, 1, -1],
            [-1, -1, -1, -1, -1],
        ],
        [
            [-1, -1, -1, -1, -1],
            [-1, -1, 1, -1, -1],
            [-1, 1, 1, 1, -1],
            [-1, -1, 1, -1, -1],
            [-1, -1, -1, -1, -1],
        ],
    ];
}
