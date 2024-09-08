import { useState } from 'react';
import Button from './Button';

function MatrixCalculator() {
    /*El valor de useState se incializa en 0*/
    /*El primer componente actualiza el segundo*/
    const [displayValue, setDisplayValue] = useState<string>('0');
    const [matrixA, setMatrixA] = useState<number[][]>([[0]]);
    const [matrixB, setMatrixB] = useState<number[][]>([[0]]);
    const [resultMatrix, setResultMatrix] = useState<number[][] | null>(null); 
    const [operator, setOperator] = useState<string | null>(null);
    const [firstOperand, setFirstOperand] = useState<number | string | null>(null);
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
        newMatrix[row][col] = parseFloat(value) || 0;
        setMatrix(newMatrix);
    };

    const handleMatrixAInput = (row: number, col: number, value: string) => {
        handleMatrixInput(matrixA, setMatrixA, row, col, value);
    };

    const handleMatrixBInput = (row: number, col: number, value: string) => {
        handleMatrixInput(matrixB, setMatrixB, row, col, value);
    };
    
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
        setFirstOperand(null);
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

                {/* Ingreso de la matriz A */}
                <div>
                    <h3>Matriz A</h3>
                    {matrixA.map((row, i) => (
                        <div key={i}>
                            {row.map((value, j) => (
                                <input
                                    key={j}
                                    type="number"
                                    value={value}
                                    onChange={(e) => handleMatrixAInput(i, j, e.target.value)}
                                />
                            ))}
                        </div>
                    ))}
                </div>

                {/* Ingreso de la matriz B */}
                <div>
                    <h3>Matriz B</h3>
                    {matrixB.map((row, i) => (
                        <div key={i}>
                            {row.map((value, j) => (
                                <input
                                    key={j}
                                    type="number"
                                    value={value}
                                    onChange={(e) => handleMatrixBInput(i, j, e.target.value)}
                                />
                            ))}
                        </div>
                    ))}
                </div>

                {/* Botones para realizar operaciones */}
                <Button value="A + B" onClick={() => setOperator('+')}/>
                <Button value="A - B" onClick={() => setOperator('-')}/>
                <Button value="A * B" onClick={() => setOperator('*')}/>
                <Button value="A / B" onClick={() => setOperator('/')}/>
                <Button value="Calcular" onClick={calculate}/>

                {/* Mostrar el resultado */}
                {resultMatrix && (
                    <div>
                        <h3>Resultado</h3>
                        {resultMatrix.map((row, i) => (
                            <div key={i} style={{ display: 'flex' }}>
                                {row.map((value, j) => (
                                    <div key={j} style={{ marginRight: '10px' }}>{value}</div>
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

