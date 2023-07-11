/**
 * Define cubos a serem adicionados à cena.
 */
class Cubo extends Objeto {
    static triangulos = Cubo.geraTriangulos();

    /**
     * Gera triângulos correspondentes a um cubo de lado 1 centrado na origem.
     * @return {vec3[][]} 
     */
    static geraTriangulos() {
        let vertices = [
            vec3(0.5, 0.5, 0.5),
            vec3(0.5, 0.5, -0.5),
            vec3(0.5, -0.5, 0.5),
            vec3(0.5, -0.5, -0.5),
            vec3(-0.5, 0.5, 0.5),
            vec3(-0.5, 0.5, -0.5),
            vec3(-0.5, -0.5, 0.5),
            vec3(-0.5, -0.5, -0.5)
        ];

        let triangulosIndices = [
            // +x
            [0, 2, 1],
            [1, 2, 3],
            // -x
            [4, 5, 6],
            [5, 7, 6],
            // +y
            [0, 5, 4],
            [0, 1, 5],
            // -y
            [2, 6, 7],
            [2, 7, 3],
            // +z
            [0, 4, 2],
            [2, 4, 6],
            // -z
            [1, 3, 5],
            [3, 7, 5],
        ];

        return triangulosIndices.map((t) => t.map((vi) => vertices[vi]));
    }

    /**
     * @param {ObjectProperties} props
     */
    constructor(props) {
        super(props, Cubo.triangulos);
    }
}
