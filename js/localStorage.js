/* Nombre del archivo: ts/src/localStorage.ts
Autor: Alessio Aguirre Pimentel
Versión: 02 */
export const gestionarLocalStorage = (accion, clave, valor) => {
    try {
        switch (accion) {
            case "guardar": {
                if (!clave || valor === undefined)
                    throw new Error("Clave y valor son requeridos para guardar");
                const fechaExp = new Date();
                fechaExp.setDate(fechaExp.getDate() + 45);
                localStorage.setItem(clave, JSON.stringify({ valor, fechaExp }));
                break;
            }
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
            case "borrar": {
                if (!clave)
                    throw new Error("Clave es requerida para borrar");
                localStorage.removeItem(clave);
                break;
            }
            case "borrarTodo": {
                localStorage.clear();
                break;
            }
            default: {
                throw new Error("Acción no reconocida");
            }
        }
    }
    catch (error) {
        console.error(`Error al ${accion} en local storage`, error);
        return null;
    }
};
