import { useEffect, useState } from 'react';
import '../calculator.css'; // Importa el archivo CSS
import Button from './Button';
import { validateMatrix, validationsDimension } from '../validationZOD/validationsDimension';
import Hecho_en from './children';
import MatrixResult from './matrixResult';
import { add3DMatrices, subtract3DMatrices } from './matriztridi';

function MatrixCalculator() {
    /*El primer componente actualiza el segundo*/
    const [displayValue, setDisplayValue] = useState<string>('Prueba la calculadora');
    const [matrixA, setMatrixA] = useState<number[][] | number[][][]>([[0]]);
    const [matrixB, setMatrixB] = useState<number[][] | number[][][]>([[0]]);
    const [resultMatrix, setResultMatrix] = useState<number[][] | number[][][] | null>(null);
    const [operator, setOperator] = useState<string | null>(null);
    const [dimensionMatrix, setDimensionMatrix] = useState<'unidimensional' | 'bidimensional' | 'tridimensional'>('unidimensional');


    const handleMatrixInput = (
        matrix: number[][] | number[][][],
        setMatrix: React.Dispatch<React.SetStateAction<number[][] | number[][][]>>,
        layer: number,  // Solo necesario para matrices tridimensionales
        row: number,
        col: number,
        value: string
    ) => {
        let newMatrix: number[][] | number[][][];

        if (Array.isArray((matrix as number[][][])[0][0])) {
            // Si la matriz es tridimensional
            newMatrix = (matrix as number[][][]).map(layer =>
                layer.map(row => [...row])
            ) as number[][][];
            newMatrix[layer][row][col] = value === '' ? 0 : parseFloat(value); // Asigna 0 si value está vacío
        } else {
            // Si la matriz es bidimensional
            newMatrix = (matrix as number[][]).map(row => [...row]);
            newMatrix[row][col] = value === '' ? 0 : parseFloat(value); // Asigna 0 si value está vacío
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

    // Lógica para actualizar las matrices cuando cambia la dimensión
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
        setResultMatrix(null); // Limpiar también la matriz de resultados

    }, [dimensionMatrix]);

    const handClearClick = () => {
        setDisplayValue('Ingresa nuevamente los valores de las matrices a calcular :)');
        setOperator(null);

        // Reinicia las matrices A y B a ceros
        const defaultMatrix = dimensionMatrix === 'unidimensional'
            ? [[0]]
            : dimensionMatrix === 'bidimensional'
                ? [[0, 0], [0, 0]]
                : [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

        setMatrixA(defaultMatrix);
        setMatrixB(defaultMatrix);
        setResultMatrix(null); // Limpiar la matriz de resultados
    };

    // Validar el cambio de dimensión usando Zod
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
        //Validaciones de las matrices 
        const matrixA3D = ensure3DMatrix(matrixA);
        const matrixB3D = ensure3DMatrix(matrixB);

        const result = add3DMatrices(matrixA3D, matrixB3D); // Sumar matrices tridimensionales
        setResultMatrix(result); // Guardar el resultado en el estado
    };

    const handleSubtractClick = () => {
        //Validaciones de las matrices
        const matrixA3D = ensure3DMatrix(matrixA);
        const matrixB3D = ensure3DMatrix(matrixB);
    
        const result = subtract3DMatrices(matrixA3D, matrixB3D); // Restar matrices tridimensionales
        setResultMatrix(result); // Guardar el resultado en el estado
    };
    

    // Función para asegurar que una matriz es tridimensional
    const ensure3DMatrix = (matrix: number[][] | number[][][]): number[][][] => {
        if (matrix.length > 0 && Array.isArray(matrix[0][0])) {
            // Si ya es tridimensional, la retornamos sin cambios
            return matrix as number[][][];
        } else {
            // Si es bidimensional, la envolvemos en una capa adicional para hacerla tridimensional
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

        // Verifica si la multiplicación es posible
        if (colsA !== rowsB) {
            throw new Error('Número de columnas de A debe ser igual al número de filas de B');
        }

        // Inicializa la matriz resultado
        const result = Array.from({ length: rowsA }, () => Array(colsB).fill(0));

        // Calcula la multiplicación de matrices
        for (let i = 0; i < rowsA; i++) {
            for (let j = 0; j < colsB; j++) {
                for (let k = 0; k < colsA; k++) {
                    result[i][j] += A[i][k] * B[k][j];
                }
            }
        }

        return result;
    };

    const calculate = () => {
        if (operator === null) {
            alert('Selecciona una operación antes de calcular');
            return;
        }

        // Validar las matrices antes de calcular
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
                }
                    else {
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
                {/* Botones para seleccionar el tipo de matriz */}
                <div>
                    <Button value="Matriz Unidimensional" onClick={() => handleDimensionChange('unidimensional')} />
                    <Button value="Matriz Bidimensional" onClick={() => handleDimensionChange('bidimensional')} />
                    <Button value="Matriz Tridimensional" onClick={() => handleDimensionChange('tridimensional')} />
                </div>

                <h4>Tipo de Matriz Seleccionado: {dimensionMatrix}</h4>

                {displayValue} {/* Mensaje de que ingrese nuevamente los valores */}

                {/* Matriz A */}
                <div className='matriz'>
                    <h3>Matriz A</h3>
                    {/* Crea una copia de la matriz A */}
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


                {/* Matriz B */}
                <div className='matriz'>
                    <h3>Matriz B</h3>
                    {/* Crea una copia de la matriz A */}
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


                {/* Botones para realizar operaciones */}
                <Button value="A + B" onClick={() => setOperator('+')} />
                <Button value="A - B" onClick={() => setOperator('-')} />
                <Button value="A * B" onClick={() => setOperator('*')} />
                <Button value="Calcular" onClick={calculate} />
                <Button value="C" onClick={handClearClick} />

                {/* Resultado */}
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
