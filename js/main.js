/* Nombre del archivo: js/main.js
Autor: Alessio Aguirre Pimentel
Versión: 70 */

import { inicializarApp } from './inicializacionApp.js';
import { configurarOyentesDeEventos } from './eventos.js';

// Inicializar la aplicación
console.log('Inicializando la aplicación');
inicializarApp();
console.log('Configurando oyentes de eventos');
configurarOyentesDeEventos();
