/* Nombre del archivo: ts/main.ts
Nombre del archivo destino: js/main.js
Autor: Alessio Aguirre Pimentel
Versión: 200
Descripción: Punto de entrada principal para la inicialización de la aplicación. */

import { inicializarApp } from './inicializacionApp.js';
import { configurarOyentesDeEventos } from './eventos.js';

// Inicializar la aplicación
inicializarApp();

// Configurar oyentes de eventos
configurarOyentesDeEventos();
