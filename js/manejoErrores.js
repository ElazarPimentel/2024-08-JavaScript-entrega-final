/* Nombre del archivo: ts/manejoErrores.ts
Autor: Alessio Aguirre Pimentel
Versión: 201
Descripción: Funciones para manejar y mostrar mensajes de error al usuario. */
export const mostrarError = (mensaje) => {
    Swal.fire({
        icon: 'info',
        title: 'Ups :)',
        text: mensaje,
        confirmButtonText: 'Cerrar'
    });
    console.error(mensaje);
};
