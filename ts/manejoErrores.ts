/* Nombre del archivo: ts/manejoErrores.ts
Autor: Alessio Aguirre Pimentel
Versión: 201
Descripción: Funciones para manejar y mostrar mensajes de error al usuario. */

declare var Swal: any;

export const mostrarError = (mensaje: string) => {
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: mensaje,
        confirmButtonText: 'Cerrar'
    });
    console.error(mensaje);
};
