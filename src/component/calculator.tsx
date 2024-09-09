import { useState } from 'react';
import Button from './Button';

function MatrixCalculator() {
    /*El primer componente actualiza el segundo*/
    const [displayValue, setDisplayValue] = useState<string>('Prueba la calculadora');
    const [matrixA, setMatrixA] = useState<number[][]>([[0]]);
    const [matrixB, setMatrixB] = useState<number[][]>([[0]]);
    const [resultMatrix, setResultMatrix] = useState<number[][] | null>(null); 
    const [operator, setOperator] = useState<string | null>(null);
    const [dimensionMatrix, setDimensionMatrix] = useState<'unidimensional' | 'bidimensional' | 'tridimensional'>('unidimensional');

    const handleMatrixInput = (
        matrix: number[][],
        setMatrix: React.Dispatch<React.SetStateAction<number[][]>>,
        row: number,
        col: number,
        value: string
    ) => {
        //Se crea una copio de la matriz
        const newMatrix = matrix.map(r => [...r]);
        // Si el valor es vacío, se establece como cadena vacía en lugar de un número
        if (value === '') {
            newMatrix[row][col] = value as unknown as number; // Temporariamente permite un string vacío
        } else {
            newMatrix[row][col] = parseFloat(value); // Convertir a número solo si hay algo en value
        }

        setMatrix(newMatrix);
    };

    const handleMatrixAInput = (row: number, col: number, value: string) => {
        handleMatrixInput(matrixA, setMatrixA, row, col, value);
    };

    const handleMatrixBInput = (row: number, col: number, value: string) => {
        handleMatrixInput(matrixB, setMatrixB, row, col, value);
    };

    function handClearClick() {
        setDisplayValue('Ingresa nuevamente las valores de las matrices a calcular :)');
        setOperator(null);
    
        // Limpiar las matrices A y B restableciéndolas a una matriz de ceros según la dimensión actual
        const defaultMatrix = dimensionMatrix === 'unidimensional'
            ? [[0]]
            : dimensionMatrix === 'bidimensional'
                ? [[0, 0], [0, 0]]
                : [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    
        setMatrixA(defaultMatrix);
        setMatrixB(defaultMatrix);
        setResultMatrix(null); // Limpiar también la matriz de resultados
    }
    
    
    // Selección de dimensiones de la matriz
    const handleDimensionChange = (dimension: 'unidimensional' | 'bidimensional' | 'tridimensional') => {
        setDimensionMatrix(dimension);
        const defaultMatrix = dimension === 'unidimensional'
            ? [[0]]
            : dimension === 'bidimensional'
                ? [[0, 0], [0, 0]]
                : [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

        setMatrixA(defaultMatrix);
        setMatrixB(defaultMatrix);
        setResultMatrix(null); // Reiniciar la matriz de resultados al cambiar de dimensión
    };

    const applyOperation = (a: number, b: number, operator: string): number => {
        switch (operator) {
            case '+':
                return a + b;
            case '-':
                return a - b;
            case '*':
                return a * b;
            case '/':
                return a / b;
            default:
                throw new Error('Operador no válido');
        }
    };

    function calculate() {
        if (operator === null) {
            alert('Selecciona una operación antes de calcular');
            return;
        }

        let result;
        switch (dimensionMatrix) {
            case 'unidimensional':
                result = matrixA.map((row, i) =>
                    row.map((_, j) =>
                        applyOperation(matrixA[i][j], matrixB[i][j], operator!)
                    )
                );
                setResultMatrix(result);
                break;
            case 'bidimensional':
                result = matrixA.map((row, i) =>
                    row.map((_, j) =>
                        applyOperation(matrixA[i][j], matrixB[i][j], operator!)
                    )
                );
                setResultMatrix(result);
                break;
            case 'tridimensional':
                result = matrixA.map((row, i) =>
                    row.map((_, j) =>
                        applyOperation(matrixA[i][j], matrixB[i][j], operator!)
                    )
                );
                setResultMatrix(result);
                break;
            default:
                throw new Error('Dimensión no soportada');
        }

        setOperator(null);
        
    };

    return (
        <div className='matrix-calculator'>
            <h2>Calculadora de Matrices</h2>
            <div className='display'>
                {/* Botones para seleccionar el tipo de matriz */}
                <div>
                    <Button value="Matriz Unidimencional" onClick={() => handleDimensionChange('unidimensional')}/>
                    <Button value="Matriz Bidimencional" onClick={() => handleDimensionChange('bidimensional')}/>
                    <Button value="Matriz Tridimencional" onClick={() => handleDimensionChange('tridimensional')}/>
                </div>

                <h3>Tipo de Matriz Seleccionado: {dimensionMatrix}</h3>

                {displayValue} {/*Mensaje de que ingrese nuevamente los valores*/}

                {/* Matriz A */}
                <div>
                    <h3>Matriz A</h3>
                    {/*Crea una copia de la matriz B*/}
                    {matrixA.map((row, i) => (
                        <div key={i}>
                            {row.map((value, j) => (
                                <input
                                    key={j}
                                    type="number"
                                    value={isNaN(value) ? '': value}
                                    onChange={(e) => handleMatrixAInput(i, j, e.target.value)}
                                />
                            ))}
                        </div>
                    ))}
                </div>

                {/* Matriz B */}
                <div>
                    <h3>Matriz B</h3>
                    {/*Crea una copia de la matriz B*/}
                    {matrixB.map((row, i) => (
                        <div key={i}>
                            {row.map((value, j) => (
                                <input
                                    key={j}
                                    type="number"
                                    value={isNaN(value) ? '': value}
                                    onChange={(e) => handleMatrixBInput(i, j, e.target.value)}
                                />
                            ))}
                        </div>
                    ))}
                </div>

                {/* Botones para realizar operaciones 
                    Implementación de los props en los botones operacionales
                */}
                <Button value="A + B" onClick={() => setOperator('+')}/>
                <Button value="A - B" onClick={() => setOperator('-')}/>
                <Button value="A * B" onClick={() => setOperator('*')}/>
                <Button value="A / B" onClick={() => setOperator('/')}/>
                <Button value="Calcular" onClick={calculate}/>
                <Button value="C" onClick={handClearClick} />

                {/* Resultado */}
                {resultMatrix && (
                    <div>
                        <h3>Resultado</h3>
                        {resultMatrix.map((row, i) => (
                            <div key={i}>
                                {row.map((value, j) => (
                                    <div key={j}>{value}</div>
                                ))}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MatrixCalculator;

