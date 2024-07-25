/* Nombre del archivo: js/manejoErrores.js
Autor: Alessio Aguirre Pimentel
Versión: 70 */

// mostrar errores utilizando SweetAlert
export const mostrarError = (mensaje) => {
    // eslint-disable-next-line no-undef
    Swal.fire({
        icon: 'info',
        title: 'Ups :)',
        text: mensaje,
        confirmButtonText: 'Aceptar'
    });
};

// limpiar errores en el formulario
export const limpiarError = (element) => {
    if (element && element.classList) {
        element.classList.remove('error');
    }
};
