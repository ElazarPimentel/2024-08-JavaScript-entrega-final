/* Nombre del archivo: ts/manejoErrores.ts
Autor: Alessio Aguirre Pimentel
Versión: 113
Descripción: Funciones para manejar y mostrar mensajes de error al usuario. */

export const mostrarError = (mensaje: string) => {
    alert(`Error: ${mensaje}`);
    console.error(mensaje);
};
