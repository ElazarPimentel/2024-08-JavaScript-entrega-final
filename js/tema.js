/* Nombre del archivo: js/tema.js
Autor: Alessio Aguirre Pimentel
Versión: 70 */

import { gestionarAlmacenamientoLocal } from './almacenamientoLocal.js';
import { mostrarError } from './manejoErrores.js';
import { errorMessages } from './constantes.js';

// Aplicar tema Dark o Light
export const aplicarTema = (tema) => {
    try {
        document.body.dataset.theme = tema;
        gestionarAlmacenamientoLocal('guardar', 'theme', tema);
    } catch (error) {
        mostrarError(errorMessages.errorAplicarTema);
        console.error(`${errorMessages.errorAplicarTema}: ${error}`);
    }
};
