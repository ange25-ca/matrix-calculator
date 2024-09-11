import { z } from 'zod';

// Unidimensional
const unidimensionalMatrixSchema = z.array(z.number());
type UnidimensionalMatrix = z.infer<typeof unidimensionalMatrixSchema>;

// Bidimensional
const bidimensionalMatrixSchema = z.array(z.array(z.number())).nonempty().refine(
    (matrix) => matrix.every(row => row.length === matrix[0].length),
    { message: "Todas las filas deben tener el mismo número de columnas" }
);
type BidimensionalMatrix = z.infer<typeof bidimensionalMatrixSchema>;

// Tridimensional
const tridimensionalMatrixSchema = z.array(
    z.array(
        z.array(z.number())
    ).nonempty().refine(
        (matrix) => matrix.every(row => row.length === matrix[0].length),
        { message: "Todas las filas deben tener el mismo número de columnas" }
    )
).nonempty().refine(
    (matrix) => matrix.every(layer => layer.every(row => row.length === matrix[0].length)),
    { message: "Todas las capas deben tener el mismo número de filas y columnas" }
);

type TridimensionalMatrix = z.infer<typeof tridimensionalMatrixSchema>;

type MatrixValidationResult<T> = {
    success: boolean;
    data?: T;
    error?: z.ZodError<any>;
};

export const validateMatrix = (
    matrix: number[][] | number[][][]
): MatrixValidationResult<UnidimensionalMatrix | BidimensionalMatrix | TridimensionalMatrix> => {
    if (matrix.length === 0 || !Array.isArray(matrix[0])) {
        const result = unidimensionalMatrixSchema.safeParse(matrix as unknown as number[]);
        return {
            success: result.success,
            data: result.success ? result.data : undefined,
            error: result.success ? undefined : result.error
        };
    } else if (Array.isArray(matrix[0][0])) {
        const result = tridimensionalMatrixSchema.safeParse(matrix as number[][][]);
        return {
            success: result.success,
            data: result.success ? result.data : undefined,
            error: result.success ? undefined : result.error
        };
    } else {
        const result = bidimensionalMatrixSchema.safeParse(matrix as number[][]);
        return {
            success: result.success,
            data: result.success ? result.data : undefined,
            error: result.success ? undefined : result.error
        };
    }
};

export const validationsDimension = z.enum(['unidimensional', 'bidimensional', 'tridimensional']);
