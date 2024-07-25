/* Nombre del archivo: js/main.js
Autor: Alessio Aguirre Pimentel
Versión: 51 */

import { inicializarApp  } from './inicializacionApp.js';
import { configurarOyentesDeEventos } from './eventos.js';

// Inicializar la aplicación
console.log('Inicializando la aplicación');
document.addEventListener('DOMContentLoaded', () => {
    inicializarApp();
    console.log('Configurando oyentes de eventos');
    configurarOyentesDeEventos();
});
