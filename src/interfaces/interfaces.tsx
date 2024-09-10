//Se define la interfaz del prop
export interface ButtonProps {
    value: string; //Se muestra el texto en ele botón
    onClick: () => void; //Función que se habilita cuando se da click al botón
    disabled?: boolean; //Este propiedad es opcional
}


