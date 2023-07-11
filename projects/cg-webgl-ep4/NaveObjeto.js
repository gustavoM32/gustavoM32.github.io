/**
 * Define o objeto que representa uma nave.
 */
class NaveObjeto extends Objeto {
    static triangulos = NaveObjeto.geraTriangulos();

    /**
     * Gera triângulos que representam a nave centrada na origem.
     * @return {vec3[][]} 
     */
    static geraTriangulos() {
        let vertices = [
            vec3(-0.5, -0.1, 1),
            vec3(0.0, 0.0, -1),
            vec3(0.5, -0.1, 1),
            vec3(0.0, 0.40, 1),
        ];

        let triangulosIndices = [
            // base
            [0, 1, 2],
            // traseira
            [0, 2, 3],
            // direita
            [0, 3, 1],
            // esquerda
            [1, 3, 2],
        ];

        return triangulosIndices.map((t) => t.map((vi) => vertices[vi]));
    }

    /**
     * @param {ObjectProperties} props
     */
    constructor(props) {
        super(props, NaveObjeto.triangulos);
    }
}
