import { useEffect, useState } from 'react';
import '../calculator.css';
import Button from './Button';
import { validateMatrix, validationsDimension } from '../validationZOD/validationsDimension';
import Hecho_en from './children';
import MatrixResult from './matrixResult';
import { add3DMatrices, subtract3DMatrices } from './matriztridi';
import { determinant, determinant3x3From3D } from './determinantes'; // Importa las funciones de determinante

function MatrixCalculator() {
    const [displayValue, setDisplayValue] = useState<string>('Prueba la calculadora');
    const [matrixA, setMatrixA] = useState<number[][] | number[][][]>([[0]]);
    const [matrixB, setMatrixB] = useState<number[][] | number[][][]>([[0]]);
    const [resultMatrix, setResultMatrix] = useState<number[][] | number[][][] | null>(null);
    const [operator, setOperator] = useState<string | null>(null);
    const [dimensionMatrix, setDimensionMatrix] = useState<'unidimensional' | 'bidimensional' | 'tridimensional'>('unidimensional');

    const handleMatrixInput = (
        matrix: number[][] | number[][][],
        setMatrix: React.Dispatch<React.SetStateAction<number[][] | number[][][]>>,
        layer: number,
        row: number,
        col: number,
        value: string
    ) => {
        let newMatrix: number[][] | number[][][] = Array.isArray((matrix as number[][][])[0][0])
            ? (matrix as number[][][]).map(layer => layer.map(row => [...row]))
            : (matrix as number[][]).map(row => [...row]);

        if (Array.isArray(newMatrix[0][0])) {
            (newMatrix as number[][][])[layer][row][col] = value === '' ? 0 : parseFloat(value);
        } else {
            (newMatrix as number[][])[row][col] = value === '' ? 0 : parseFloat(value);
        }

        setMatrix(newMatrix);
    };

    const handleMatrixAInput = (row: number, col: number, value: string) => {
        if (dimensionMatrix === 'tridimensional') {
            handleMatrixInput(matrixA as number[][][], setMatrixA as React.Dispatch<React.SetStateAction<number[][] | number[][][]>>, 0, row, col, value);
        } else {
            handleMatrixInput(matrixA as number[][], setMatrixA as React.Dispatch<React.SetStateAction<number[][] | number[][][]>>, 0, row, col, value);
        }
    };

    const handleMatrixBInput = (row: number, col: number, value: string) => {
        if (dimensionMatrix === 'tridimensional') {
            handleMatrixInput(matrixB as number[][][], setMatrixB as React.Dispatch<React.SetStateAction<number[][] | number[][][]>>, 0, row, col, value);
        } else {
            handleMatrixInput(matrixB as number[][], setMatrixB as React.Dispatch<React.SetStateAction<number[][] | number[][][]>>, 0, row, col, value);
        }
    };

    //Actualiza el valor de la matriz
    useEffect(() => {
        const defaultMatrixA = dimensionMatrix === 'unidimensional'
            ? [[0]]
            : dimensionMatrix === 'bidimensional'
                ? [[0, 0], [0, 0]]
                : [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

        const defaultMatrixB = dimensionMatrix === 'unidimensional'
            ? [[0]]
            : dimensionMatrix === 'bidimensional'
                ? [[0, 0], [0, 0]]
                : [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

        setMatrixA(defaultMatrixA);
        setMatrixB(defaultMatrixB);
        setResultMatrix(null);

    }, [dimensionMatrix]);

    const handClearClick = () => {
        setDisplayValue('Ingresa nuevamente los valores de las matrices a calcular :)');
        setOperator(null);

        const defaultMatrix = dimensionMatrix === 'unidimensional'
            ? [[0]]
            : dimensionMatrix === 'bidimensional'
                ? [[0, 0], [0, 0]]
                : [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

        setMatrixA(defaultMatrix);
        setMatrixB(defaultMatrix);
        setResultMatrix(null);
    };

    const handleDimensionChange = (dimension: string) => {
        const validation = validationsDimension.safeParse(dimension);

        if (!validation.success) {
            alert('Dimensión inválida, por favor selecciona una válida.');
            return;
        }

        const validDimension = validation.data;

        setDimensionMatrix(validDimension);
        const defaultMatrix = validDimension === 'unidimensional'
            ? [[0]]
            : validDimension === 'bidimensional'
                ? [[0, 0], [0, 0]]
                : [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

        setMatrixA(defaultMatrix);
        setMatrixB(defaultMatrix);
        setResultMatrix(null);
    };

    const handleSumClick = () => {
        const matrixA3D = ensure3DMatrix(matrixA);
        const matrixB3D = ensure3DMatrix(matrixB);

        const result = add3DMatrices(matrixA3D, matrixB3D);
        setResultMatrix(result);
    };

    const handleSubtractClick = () => {
        const matrixA3D = ensure3DMatrix(matrixA);
        const matrixB3D = ensure3DMatrix(matrixB);

        const result = subtract3DMatrices(matrixA3D, matrixB3D);
        setResultMatrix(result);
    };

    const ensure3DMatrix = (matrix: number[][] | number[][][]): number[][][] => {
        if (matrix.length > 0 && Array.isArray(matrix[0][0])) {
            return matrix as number[][][];
        } else {
            return [matrix] as number[][][];
        }
    };

    const applyOperation = (a: number, b: number, operator: string) => {
        switch (operator) {
            case '+':
                return a + b;
            case '-':
                return a - b;
            case '*':
                return a * b;
            default:
                throw new Error('Operador no válido');
        }
    };

    const multiplyMatrices = (A: number[][], B: number[][]): number[][] => {
        const rowsA = A.length;
        const colsA = A[0].length;
        const rowsB = B.length;
        const colsB = B[0].length;

        if (colsA !== rowsB) {
            throw new Error('Número de columnas de A debe ser igual al número de filas de B');
        }

        const result = Array.from({ length: rowsA }, () => Array(colsB).fill(0));

        for (let i = 0; i < rowsA; i++) {
            for (let j = 0; j < colsB; j++) {
                for (let k = 0; k < colsA; k++) {
                    result[i][j] += A[i][k] * B[k][j];
                }
            }
        }

        return result;
    };
    
    const handleDeterminantClick = () => {
    if (dimensionMatrix === 'tridimensional') {
        try {
            const matrixA3D = matrixA as number[][][];
            if (matrixA3D.length > 0 && matrixA3D[0].length > 0 && matrixA3D[0][0].length > 0) {
                // Asume que calculas el determinante de la primera capa (layer 0)
                const result = determinant3x3From3D(matrixA3D, 0);
                setResultMatrix([[result]]);
                setDisplayValue(`Determinante de la primera capa: ${result}`);
            } else {
                console.error('La matriz tridimensional no tiene capas válidas para calcular el determinante.');
                setDisplayValue('Error: La matriz tridimensional no tiene capas válidas para calcular el determinante.');
            }
        } catch (error) {
            console.error(`Error al calcular el determinante: ${(error as Error).message}`);
            setDisplayValue(`Error al calcular el determinante: ${(error as Error).message}`);
        }
        return;
    }

    // Manejo para matrices 2D y 1D
    const matrixAValidation = validateMatrix(matrixA);
    if (!matrixAValidation.success) {
        console.error(`Error en Matriz A: ${matrixAValidation.error?.issues.map(issue => issue.message).join(', ')}`);
        setDisplayValue(`Error en Matriz A: ${matrixAValidation.error?.issues.map(issue => issue.message).join(', ')}`);
        return;
    }

    let result: number | null = null;

    try {
        result = determinant(matrixA as number[][]);
        setResultMatrix(result !== null ? [[result]] : null);
        setDisplayValue(`Determinante: ${result}`);
    } catch (error) {
        console.error(`Error al calcular el determinante: ${(error as Error).message}`);
        setDisplayValue(`Error al calcular el determinante: ${(error as Error).message}`);
    }
};


    const calculate = () => {
        if (operator === null) {
            alert('Selecciona una operación antes de calcular');
            return;
        }

        const matrixAValidation = validateMatrix(matrixA);
        const matrixBValidation = validateMatrix(matrixB);

        if (!matrixAValidation.success) {
            console.error(`Error en Matriz A: ${matrixAValidation.error?.issues.map(issue => issue.message).join(', ')}`);
            return;
        }

        if (!matrixBValidation.success) {
            console.error(`Error en Matriz B: ${matrixBValidation.error?.issues.map(issue => issue.message).join(', ')}`);
            return;
        }

        let result: number[][] | number[][][] | null = null;

        switch (dimensionMatrix) {
            case 'unidimensional':
                result = (matrixA as number[][]).map((value, i) =>
                    [applyOperation(value[0], (matrixB as number[][])[i][0], operator!)]
                );
                break;

            case 'bidimensional':
                const matrixA2D = matrixA as number[][];
                const matrixB2D = matrixB as number[][];

                if (operator === '*') {
                    result = multiplyMatrices(matrixA2D, matrixB2D);
                } else {
                    result = matrixA2D.map((row, i) =>
                        row.map((_, j) =>
                            applyOperation(matrixA2D[i][j], matrixB2D[i][j], operator!)
                        )
                    );
                }
                break;

            case 'tridimensional':
                if (operator === '+') {
                    handleSumClick();
                    return;
                } else if (operator === '-') {
                    handleSubtractClick();
                    return;
                } else {
                    alert('Operación no soportada para matrices tridimensionales');
                    return;
                }
                break;

            default:
                throw new Error('Dimensión no soportada');
        }

        setResultMatrix(result);
        setOperator(null);
    };

    return (
        <div className='matrix-calculator'>
            <h1>Calculadora de Matrices</h1>
            <div className='display'>
                <div>
                    <Button value="Matriz Unidimensional" onClick={() => handleDimensionChange('unidimensional')} />
                    <Button value="Matriz Bidimensional" onClick={() => handleDimensionChange('bidimensional')} />
                    <Button value="Matriz Tridimensional" onClick={() => handleDimensionChange('tridimensional')} />
                </div>

                <h4>Tipo de Matriz Seleccionado: {dimensionMatrix}</h4>

                {displayValue}

                <div className='matriz'>
                    <h3>Matriz A</h3>
                    {matrixA.map((row, i) => (
                        <div key={i}>
                            {row.map((value, j) => (
                                <input
                                    key={j}
                                    type="number"
                                    value={typeof value === 'number' ? value.toString() : ''}
                                    onChange={(e) => handleMatrixAInput(i, j, e.target.value)}
                                />
                            ))}
                        </div>
                    ))}
                </div>

                <div className='matriz'>
                    <h3>Matriz B</h3>
                    {matrixB.map((row, i) => (
                        <div key={i}>
                            {row.map((value, j) => (
                                <input
                                    key={j}
                                    type="number"
                                    value={typeof value === 'number' ? value.toString() : ''}
                                    onChange={(e) => handleMatrixBInput(i, j, e.target.value)}
                                />
                            ))}
                        </div>
                    ))}
                </div>

                <Button value="A + B" onClick={() => setOperator('+')} />
                <Button value="A - B" onClick={() => setOperator('-')} />
                <Button value="A * B" onClick={() => setOperator('*')} />
                <Button value="Determinante" onClick={handleDeterminantClick} />
                <Button value="Calcular" onClick={calculate} />
                <Button value="C" onClick={handClearClick} />

                {resultMatrix && (
                    <MatrixResult
                        resultMatrix={resultMatrix}
                        dimensionMatrix={dimensionMatrix}

                    />
                )}
            </div>
            <Hecho_en>
                <h3>MADE IN CHINA</h3>
            </Hecho_en>
        </div>
    );
}

export default MatrixCalculator;
