
export function add3DMatrices(A: number[][][], B: number[][][]): number[][][] {
    console.log('Matriz A:', A);
    console.log('Matriz B:', B);

    const depth = A.length;
    const rows = A[0].length;
    const cols = A[0][0].length;

    // Verifica que las dimensiones de ambas matrices sean iguales
    if (depth !== B.length || rows !== B[0].length || cols !== B[0][0].length) {
        throw new Error('Las matrices tridimensionales deben tener las mismas dimensiones');
    }

    // Inicializa la matriz de resultados con ceros
    const result: number[][][] = Array.from({ length: depth }, () =>
        Array.from({ length: rows }, () => Array(cols).fill(0))
    );

    console.log('Matriz de resultados inicial:', result);

    // Realiza la suma de las matrices
    for (let d = 0; d < depth; d++) {
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                console.log(`Sumando A[${d}][${r}][${c}] = ${A[d][r][c]} y B[${d}][${r}][${c}] = ${B[d][r][c]}`);
                result[d][r][c] = A[d][r][c] + B[d][r][c];
                console.log(`Resultado en result[${d}][${r}][${c}] = ${result[d][r][c]}`);
            }
        }
    }

    console.log('Resultado final:', result);
    return result;
}
