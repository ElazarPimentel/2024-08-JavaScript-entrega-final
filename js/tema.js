/* Nombre del archivo: js/tema.js
Autor: Alessio Aguirre Pimentel
Versión: 348 */

import { gestionarAlmacenamientoLocal } from './almacenamientoLocal.js';
import { mostrarError } from './manejoErrores.js';

// Aplicar tema oscuro o claro
export const aplicarTema = (tema) => {
    console.log('aplicarTema called with tema:', tema);
    try {
        document.body.dataset.theme = tema;
        gestionarAlmacenamientoLocal('guardar', 'theme', tema);
        console.log('Tema aplicado:', tema);
    } catch (error) {
        mostrarError('Error al aplicar el tema');
        console.error('Error applying theme:', error);
    }
};
