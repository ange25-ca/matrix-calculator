import React, { ReactNode } from 'react'; //Importa el React

//Se declara un componente funcional que recibira un hijo 
const Hecho_en: React.FC<{ children: ReactNode }> = ( { children }) => {
    // Se asegna una clase
    return <div className='Lugar_de_origen'>
        {/*Se muestra el contenido de children*/}
        {children}
    </div>
};

export default Hecho_en;