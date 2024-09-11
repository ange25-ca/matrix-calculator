// matrixUtils.ts

export const determinant2x2 = (matrix: number[][]): number => {
    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
};

export const determinant3x3 = (matrix: number[][]): number => {
    const [a, b, c] = matrix[0];
    const [d, e, f] = matrix[1];
    const [g, h, i] = matrix[2];
    return a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
};

// Función para verificar si una matriz es 2D o 3D
const is3DMatrix = (matrix: number[][] | number[][][]): matrix is number[][][] => {
    return Array.isArray(matrix[0]) && Array.isArray(matrix[0][0]);
};

// Función para calcular el determinante de una submatriz 2x2
export const determinant2x2From3D = (matrix: number[][][], layer: number, rowStart: number, colStart: number): number => {
    const submatrix: number[][] = [];
    for (let i = rowStart; i < rowStart + 2; i++) {
        submatrix.push(matrix[layer][i].slice(colStart, colStart + 2));
    }
    return determinant2x2(submatrix);
};

export const determinant3x3From3D = (matrix: number[][][], layer: number): number => {
    if (matrix[layer].length < 3 || matrix[layer][0].length < 3) {
        throw new Error('La capa seleccionada no tiene suficiente tamaño para una submatriz 3x3.');
    }
    const submatrix: number[][] = matrix[layer].slice(0, 3).map(row => row.slice(0, 3));
    return determinant3x3(submatrix);
};


// Función principal para calcular el determinante de matrices
export const determinant = (matrix: number[][] | number[][][]): number => {
    if (is3DMatrix(matrix)) {
        if (matrix.length > 0) {
            return determinant3x3From3D(matrix, 0);
        } else {
            throw new Error('La matriz 3D no tiene capas.');
        }
    } else {
        if (matrix.length === 1 && matrix[0].length === 1) {
            return matrix[0][0];
        } else if (matrix.length === 2 && matrix[0].length === 2) {
            return determinant2x2(matrix);
        } else if (matrix.length === 3 && matrix[0].length === 3) {
            return determinant3x3(matrix);
        } else {
            throw new Error('Determinante solo soportado para matrices');
        }
    }
};
