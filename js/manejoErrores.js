/* Nombre del archivo: js/manejoErrores.js
Autor: Alessio Aguirre Pimentel
Versión: 74 */

export const mostrarError = (mensaje) => {
    Swal.fire({
        icon: 'info',
        title: 'Ups :)',
        text: mensaje,
        confirmButtonText: 'Aceptar'
    });
};

