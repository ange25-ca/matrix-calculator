import React from 'react';
import '../calculator.css';
import './matriztridi';

interface MatrixResultProps {
    resultMatrix: number[][] | number[][][] | number[] | null;
    dimensionMatrix: 'unidimensional' | 'bidimensional' | 'tridimensional';
}

const MatrixResult: React.FC<MatrixResultProps> = ({ resultMatrix, dimensionMatrix }) => {
    if (resultMatrix === null) {
        return <div>No hay resultados para mostrar.</div>;
    }

    if (dimensionMatrix === 'unidimensional') {
        return (
            <div>
                <h3>Resultado:</h3>
                <div className="matrix-container">
                    {(resultMatrix as number[]).map((value, i) => (
                        <span key={i} className="matrix-cell">{value}</span>
                    ))}
                </div>
            </div>
        );
    }

    if (dimensionMatrix === 'bidimensional') {
        return (
            <div>
                <h3>Resultado:</h3>
                <div className="matrix-container">
                    {(resultMatrix as number[][]).map((row, i) => (
                        <div key={i} className="matrix-row">
                            {row.map((value, j) => (
                                <span key={j} className="matrix-cell">{value}</span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (dimensionMatrix === 'tridimensional') {
        return (
            <div>
                <h3>Resultado:</h3>
                {(resultMatrix as number[][][]).map((layer, k) => (
                    <div key={k} className="matrix-layer">
                        <h4>Capa {k + 1}</h4>
                        <div className="matrix-container">
                            {layer.map((row, i) => (
                                <div key={i} className="matrix-row">
                                    {row.map((value, j) => (
                                        <span key={j} className="matrix-cell">{value}</span>
                                    ))}

                                    
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );

    }

    return <div>No hay resultados para mostrar.</div>;
};

export default MatrixResult;
