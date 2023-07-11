/**
 * Define esferas a serem adicionados à cena.
 */
class Esfera extends Objeto {
    static NUM_DIVISOES = 4;
    static triangulos = Esfera.geraTriangulos(Esfera.NUM_DIVISOES);

    /**
     * Gera triângulos correspondentes a uma aproximação de esfera de raio 1
     * centrada na origem.
     * @param {number} divisoes - número de divisões a serem feitas, quanto mais
     * divisões, maior a aproximação de uma esfera real.
     * @return {vec3[][]} 
     */
    static geraTriangulos(divisoes) {
        let vertices = [
            vec3(0.0, 0.0, 1.0),
            vec3(1.0, 0.0, 0.0),
            vec3(0.0, 1.0, 0.0),
            vec3(-1.0, 0.0, 0.0),
            vec3(0.0, -1.0, 0.0),
            vec3(0.0, 0.0, -1.0)
        ];

        let triangulosIndices = [
            // superior
            [0, 1, 2],
            [0, 2, 3],
            [0, 3, 4],
            [0, 4, 1],
            // inferior
            [5, 2, 1],
            [5, 3, 2],
            [5, 4, 3],
            [5, 1, 4],
        ];

        let triangulos = triangulosIndices.map((t) => t.map((vi) => vertices[vi]));

        for (let d = 0; d < divisoes; d++) {
            triangulos = triangulos.flatMap((t, i) => {
                let m = [];
                for (let i = 0; i < 3; i++) {
                    m.push(normalize(add(t[i], t[(i + 1) % 3])));
                }

                let newTs = []
                for (let i = 0; i < 3; i++) {
                    newTs.push([t[i], m[i], m[mod(i - 1, 3)]]);
                }

                newTs.push(m);

                return newTs;
            });
        }

        return triangulos;
    }

    /**
     * @param {ObjectProperties} props
     */
    constructor(props) {
        super(props, Esfera.triangulos);
    }
}