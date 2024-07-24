/* Nombre del archivo: js/manejoErrores.js
Autor: Alessio Aguirre Pimentel
Versión: 46 */

// mostrar errores utilizando SweetAlert
export const mostrarError = (mensaje) => {
    console.log('mostrarError llamado con mensaje:', mensaje);
    // eslint-disable-next-line no-undef
    Swal.fire({
        icon: 'info',
        title: 'Ups :)',
        text: mensaje,
        confirmButtonText: 'Aceptar'
    });
    console.error(mensaje);  // También registramos el error en la consola para el desarrollo
};

// limpiar errores en el formulario
export const limpiarError = (element) => {
    if (element && element.classList) {
        element.classList.remove('error');
    }
};
