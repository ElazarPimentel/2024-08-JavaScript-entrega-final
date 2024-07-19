/* Nombre del archivo: js/manejoErrores.js
Autor: Alessio Aguirre Pimentel
Versión: 322 */

// Función para mostrar errores utilizando SweetAlert
export const mostrarError = (mensaje) => {
    console.log('mostrarError called with mensaje:', mensaje);
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: mensaje,
        confirmButtonText: 'Aceptar'
    });
    console.error(mensaje);  // También registramos el error en la consola para el desarrollo
};

// Función para limpiar errores en el formulario
export const limpiarError = (element) => {
    element.classList.remove('error');
};
