/* Nombre del archivo: ts/almacenamientoLocal.ts
Autor: Alessio Aguirre Pimentel
Versión: 202
Descripción: Funciones para gestionar el almacenamiento local. */
import { mostrarError as mostrarErrorGlobal } from './manejoErrores.js';
// Función para gestionar el almacenamiento local
export const gestionarAlmacenamientoLocal = (accion, clave, valor) => {
    try {
        switch (accion) {
            // Guardar datos en el almacenamiento local
            case "guardar": {
                if (!clave || valor === undefined)
                    throw new Error("Clave y valor son requeridos para guardar");
                const fechaExp = new Date();
                fechaExp.setDate(fechaExp.getDate() + 45);
                localStorage.setItem(clave, JSON.stringify({ valor, fechaExp }));
                break;
            }
            // Cargar datos desde el almacenamiento local
            case "cargar": {
                if (!clave)
                    throw new Error("Clave es requerida para cargar");
                const item = JSON.parse(localStorage.getItem(clave));
                if (item && new Date(item.fechaExp) > new Date()) {
                    return item.valor;
                }
                else {
                    localStorage.removeItem(clave);
                    return null;
                }
            }
            // Borrar datos del almacenamiento local
            case "borrar": {
                if (!clave)
                    throw new Error("Clave es requerida para borrar");
                localStorage.removeItem(clave);
                break;
            }
            // Borrar todos los datos del almacenamiento local
            case "borrarTodo": {
                localStorage.clear();
                break;
            }
            // Acción no reconocida
            default: {
                throw new Error("Acción no reconocida");
            }
        }
    }
    catch (error) {
        const err = error;
        mostrarErrorGlobal(`Error al ${accion} en almacenamiento local: ${err.message}`);
        return null;
    }
};
// Función para obtener datos del almacenamiento local
export function obtenerDatosDeAlmacenamientoLocal(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}
