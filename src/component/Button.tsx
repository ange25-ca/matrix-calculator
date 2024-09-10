import React from 'react';
import { ButtonProps } from '../interfaces/interfaces';

const Button: React.FC<ButtonProps> = ({ value, onClick, disabled }) => {
    return (
        <button className='operator' onClick={onClick} disabled={disabled}>
            {value}
        </button>
    );
};

export default Button;
