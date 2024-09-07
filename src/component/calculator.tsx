import { useState } from 'react';
import Button from './Button';

function MatrixCalculator() {
    /*El valor de useState se incializa en 0*/
    /*El primer componente actualiza el segundo*/
    const [displayValue, setDisplayValue] = useState<string>('0');
    const [matrixA, setMatrixA] = useState<number[][]>([[0]]);
    const [matrixB, setMatrixB] = useState<number[][]>([[0]]);
    const [resultMatrix, setResultMatrix] = useState<number[][] | null>(null); // Resultado de la operacion entre matrices
    const [operator, setOperator] = useState<string | null>(null); /*Operación a realizar*/
    const [firstOperand, setFirstOperand] = useState<number | string | null>(null); // Primer operando, puede ser número o matriz
    //La constante dinensionMatriz puede ser unideimensional o bidimensional o tridimensional 
    const [dimensionMatrix, setDimensionMatrix] = useState<'unidimensional' | 'bidimensional' | 'tridimensional'>('unidimensional'); //El valor empieza en unidemsional

    function handleMatrixA(value: string) {
        setDisplayValue(displayValue === '0' ? value : displayValue + value);
    } //Solo actualiza el tamaño de MatrixA (se enfoca en la visualización)

    function handleMatrixB(value: string) {
        setDisplayValue(displayValue === '0' ? value : displayValue + value);
    } //Solo actualiza el tamaño de MatrixB (se enfoca en la visualización)

    const handleMatrixInput = (
        matrix: number[][], // Tipo de la matriz
        setMatrix: React.Dispatch<React.SetStateAction<number[][]>>, // Función para actualizar la matriz
        row: number, // Fila a actualizar
        col: number, // Columna a actualizar
        value: string // Nuevo valor como string
    ) => {
        // Crear una copia profunda de la matriz
        const newMatrix = matrix.map(r => [...r]);

        // Convertir el valor a número y manejar valores no válidos
        newMatrix[row][col] = parseFloat(value) || 0;

        // Actualizar el estado con la nueva matriz
        setMatrix(newMatrix);
    };

    // Actualización de la matriz directamente
    const handleMatrixAInput = (row: number, col: number, value: string) => {
        handleMatrixInput(matrixA, setMatrixA, row, col, value);
        handleMatrixA(value);
    };

    const handleMatrixBInput = (row: number, col: number, value: string) => {
        handleMatrixInput(matrixB, setMatrixB, row, col, value);
        handleMatrixB(value);
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
        if (firstOperand !== null && operator !== null) {
            switch (dimensionMatrix) {
                case 'bidimensional':
                    setResultMatrix(
                        matrixA.map((row, i) =>
                            /*se emplea el "_" ya que no se necesita saber el valor*/
                            row.map((_, j) =>
                                applyOperation(
                                    matrixA[i][j],
                                    matrixB[i][j],
                                    operator
                                )
                            )
                        )
                    );
                    break;
            }
            setOperator(null);
            setFirstOperand(null);
        }
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

                {/* Se ingresa los valores de la matriz B */}
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
                <Button value="Sumar" onClick={() => setOperator('+')}/>
                <Button value="Restar" onClick={() => setOperator('-')}/>
                <Button value="Multiplicar" onClick={() => setOperator('*')}/>
                <Button value="Dividir" onClick={() => setOperator('/')}/>
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
