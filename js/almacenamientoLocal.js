/* Nombre del archivo: js/almacenamientoLocal.js
Autor: Alessio Aguirre Pimentel
Versión: 42 */

import { mostrarError } from './manejoErrores.js';
import { errorMessages } from './constantes.js';

// Función para gestionar el almacenamiento local
export const gestionarAlmacenamientoLocal = (accion, clave, valor = null) => {
    console.log(`gestionarAlmacenamientoLocal called with accion: ${accion}, clave: ${clave}, valor: ${valor}`);
    try {
        switch (accion) {
            case "guardar": {
                if (!clave || valor === null) {
                    throw new Error(errorMessages.claveValorRequeridos);
                }
                const fechaExp = new Date();
                fechaExp.setDate(fechaExp.getDate() + 45);
                localStorage.setItem(clave, JSON.stringify({ valor, fechaExp }));
                console.log(`Saved to localStorage: ${clave} = ${JSON.stringify({ valor, fechaExp })}`);
                break;
            }
            case "cargar": {
                if (!clave) {
                    throw new Error(errorMessages.claveRequerida);
                }
                const item = JSON.parse(localStorage.getItem(clave));
                console.log(`Loaded from localStorage: ${clave} = ${JSON.stringify(item)}`);
                if (item && new Date(item.fechaExp) > new Date()) {
                    return item.valor;
                } else {
                    console.log(`Item expired or not found: ${clave}`);
                    localStorage.removeItem(clave);
                }
                break;
            }
            case "borrar": {
                if (!clave) {
                    throw new Error(errorMessages.claveRequerida);
                }
                localStorage.removeItem(clave);
                console.log(`Removed item from localStorage: ${clave}`);
                break;
            }
            case "borrarTodo": {
                localStorage.clear();
                console.log("Cleared all items from localStorage");
                break;
            }
            default: {
                throw new Error(errorMessages.accionNoReconocida);
            }
        }
    } catch (error) {
        mostrarError(`${errorMessages.errorAl} ${accion} ${errorMessages.enAlmacenamientoLocal}: ${error.message}`);
        console.error(`Error in gestionarAlmacenamientoLocal: ${error.message}`);
        return null;
    }
};

