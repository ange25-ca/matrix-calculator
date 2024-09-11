export function add3DMatrices(matrixA: number[][][], matrixB: number[][][]): number[][][] {
    // Verifica si las matrices tienen las mismas dimensiones
    if (
        matrixA.length !== matrixB.length ||
        matrixA[0].length !== matrixB[0].length ||
        matrixA[0][0].length !== matrixB[0][0].length
    ) {
        throw new Error('Las matrices no tienen las mismas dimensiones');
    }

    // Crear una nueva matriz para almacenar el resultado
    const resultMatrix: number[][][] = [];

    for (let i = 0; i < matrixA.length; i++) {
        const layer: number[][] = [];
        for (let j = 0; j < matrixA[i].length; j++) {
            const row: number[] = [];
            for (let k = 0; k < matrixA[i][j].length; k++) {
                row.push(matrixA[i][j][k] + matrixB[i][j][k]);
            }
            layer.push(row);
        }
        resultMatrix.push(layer);
    }

    return resultMatrix;
}
