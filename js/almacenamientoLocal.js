/* Nombre del archivo: js/almacenamientoLocal.js
Autor: Alessio Aguirre Pimentel
Versión: 70 */

import { mostrarError } from './manejoErrores.js';
import { errorMessages, rangoFeriados } from './constantes.js';

// gestionar el almacenamiento local
export const gestionarAlmacenamientoLocal = (accion, clave, valor = null) => {
    
    try {
        switch (accion) {
            case "guardar": {
                if (!clave || valor === null) {
                    throw new Error(errorMessages.claveValorRequeridos);
                }
                const fechaExp = new Date();
                fechaExp.setDate(fechaExp.getDate() + rangoFeriados);
                localStorage.setItem(clave, JSON.stringify({ valor, fechaExp }));
                
                break;
            }
            case "cargar": {
                if (!clave) {
                    throw new Error(errorMessages.claveRequerida);
                }
                const item = JSON.parse(localStorage.getItem(clave));
                
                if (item && new Date(item.fechaExp) > new Date()) {
                    return item.valor;
                } else {
                  
                    localStorage.removeItem(clave);
                }
                break;
            }
            case "borrar": {
                if (!clave) {
                    throw new Error(errorMessages.claveRequerida);
                }
                localStorage.removeItem(clave);
               
                break;
            }
            case "borrarTodo": {
                localStorage.clear();
              
                break;
            }
            default: {
                throw new Error(errorMessages.accionNoReconocida);
            }
        }
    } catch (error) {
        mostrarError(`${error.message}`);
        console.error(`${error.message}`);
        return null;
    }
};
