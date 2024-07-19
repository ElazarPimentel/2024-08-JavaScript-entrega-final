/* Nombre del archivo: js/almacenamientoLocal.js
Autor: Alessio Aguirre Pimentel
Versión: 322 */

import { mostrarError } from './manejoErrores.js';

// Función para gestionar el almacenamiento local
export const gestionarAlmacenamientoLocal = (accion, clave, valor = null) => {
    console.log(`gestionarAlmacenamientoLocal called with accion: ${accion}, clave: ${clave}, valor: ${valor}`);
    try {
        switch (accion) {
            case "guardar":
                if (!clave || valor === null) {
                    console.error("Clave y valor son requeridos para guardar");
                    throw new Error("Clave y valor son requeridos para guardar");
                }
                const fechaExp = new Date();
                fechaExp.setDate(fechaExp.getDate() + 45); // Set expiration for local storage items
                localStorage.setItem(clave, JSON.stringify({ valor, fechaExp }));
                console.log(`Saved to localStorage: ${clave} = ${JSON.stringify({ valor, fechaExp })}`);
                break;
            case "cargar":
                if (!clave) {
                    console.error("Clave es requerida para cargar");
                    throw new Error("Clave es requerida para cargar");
                }
                const item = JSON.parse(localStorage.getItem(clave));
                console.log(`Loaded from localStorage: ${clave} = ${JSON.stringify(item)}`);
                if (item && new Date(item.fechaExp) > new Date()) {
                    return item.valor;
                } else {
                    localStorage.removeItem(clave);
                    console.log(`Removed expired item from localStorage: ${clave}`);
                    return null;
                }
            case "borrar":
                if (!clave) {
                    console.error("Clave es requerida para borrar");
                    throw new Error("Clave es requerida para borrar");
                }
                localStorage.removeItem(clave);
                console.log(`Removed item from localStorage: ${clave}`);
                break;
            case "borrarTodo":
                localStorage.clear();
                console.log("Cleared all items from localStorage");
                break;
            default:
                console.error("Acción no reconocida");
                throw new Error("Acción no reconocida");
        }
    } catch (error) {
        mostrarError(`Error al ${accion} en almacenamiento local: ${error.message}`);
        console.error(`Error in gestionarAlmacenamientoLocal: ${error.message}`);
        return null;
    }
};

// Función para obtener datos de almacenamiento local
export const obtenerDatosDeAlmacenamientoLocal = (clave) => {
    try {
        const item = JSON.parse(localStorage.getItem(clave));
        if (item && new Date(item.fechaExp) > new Date()) {
            return item.valor;
        } else {
            localStorage.removeItem(clave);
            return null;
        }
    } catch (error) {
        mostrarError(`Error al obtener datos de almacenamiento local: ${error.message}`);
        console.error(`Error in obtenerDatosDeAlmacenamientoLocal: ${error.message}`);
        return null;
    }
};
