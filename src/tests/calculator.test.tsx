import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MatrixCalculator from '../component/calculator'; // Ajusta la ruta si es necesario
import '@testing-library/jest-dom';

describe('MatrixCalculator', () => {
  it('should render the component and handle dimension change', () => {
    // Renderiza el componente
    render(<MatrixCalculator />);

    // Verifica si el título se muestra
    expect(screen.getByText(/Calculadora de Matrices/i)).toBeInTheDocument();

    // Verifica que el botón de matriz unidimensional está en el documento
    const button1D = screen.getByText(/Matriz Unidimensional/i);
    expect(button1D).toBeInTheDocument();

    // Verifica que el botón de matriz bidimensional está en el documento
    const button2D = screen.getByText(/Matriz Bidimensional/i);
    expect(button2D).toBeInTheDocument();

    // Verifica que el botón de matriz tridimensional está en el documento
    const button3D = screen.getByText(/Matriz Tridimensional/i);
    expect(button3D).toBeInTheDocument();

    // Simula el click en el botón de matriz bidimensional
    fireEvent.click(button2D);

    // Verifica que el tipo de matriz seleccionado es bidimensional
    expect(screen.getByText(/Tipo de Matriz Seleccionado: bidimensional/i)).toBeInTheDocument();
  });
});
