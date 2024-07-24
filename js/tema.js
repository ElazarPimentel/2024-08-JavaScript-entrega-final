/* Nombre del archivo: js/tema.js
Autor: Alessio Aguirre Pimentel
Versión: 49 */

import { gestionarAlmacenamientoLocal } from './almacenamientoLocal.js';
import { mostrarError } from './manejoErrores.js';
import { errorMessages } from './constantes.js';

// Aplicar tema DArk o Light
export const aplicarTema = (tema) => {
    console.log('aplicarTema llamado con tema:', tema);
    try {
        document.body.dataset.theme = tema;
        gestionarAlmacenamientoLocal('guardar', 'theme', tema);
        console.log('Tema aplicado:', tema);
    } catch (error) {
        mostrarError(errorMessages.errorAplicarTema);
        console.error(`${errorMessages.errorAplicarTema}: ${error}`);
    }
};
