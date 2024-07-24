/* Nombre del archivo: js/eventos.js
Autor: Alessio Aguirre Pimentel
Versión: 42 */

import { mostrarFormulariosMascotas, guardarCliente, guardarMascotasYTurnos, comenzarDeNuevo, agregarMascotaFormulario, recibirCorreo } from './gestionFormularios.js';
import { aplicarTema } from './tema.js';
import { gestionarAlmacenamientoLocal } from './almacenamientoLocal.js';

// Configuración de los oyentes de eventos del DOM
export const configurarOyentesDeEventos = () => {
    document.getElementById('guardar-cliente').addEventListener('click', () => {
        console.log('Button "guardar-cliente" clicked');
        guardarCliente();
    });

    document.getElementById('borrar-datos').addEventListener('click', () => {
        console.log('Button "borrar-datos" clicked');
        comenzarDeNuevo();
    });

    document.getElementById('guardar-mascotas-turnos').addEventListener('click', () => {
        console.log('Button "guardar-mascotas-turnos" clicked');
        guardarMascotasYTurnos();
    });

    document.getElementById('borrar-todo-temp').addEventListener('click', () => {
        console.log('Button "borrar-todo-temp" clicked');
        console.log('LocalStorage before clearing:', JSON.parse(JSON.stringify(localStorage)));
        gestionarAlmacenamientoLocal('borrarTodo');
        console.log('LocalStorage after clearing:', JSON.parse(JSON.stringify(localStorage)));
        location.reload();
    });

    const themeToggle = document.getElementById('checkbox');
    themeToggle.addEventListener('change', () => {
        const theme = themeToggle.checked ? 'dark' : 'light';
        console.log(`Theme toggled to: ${theme}`);
        aplicarTema(theme);
    });

    document.getElementById('agregar-mascota').addEventListener('click', () => {
        console.log('Button "agregar-mascota" clicked');
        agregarMascotaFormulario();
    });

    document.getElementById('recibir-correo').addEventListener('click', () => {
        console.log('Button "recibir-correo" clicked');
        recibirCorreo();
    });

    // Aplicar el tema inicialmente al cargar la página
    const initialTheme = themeToggle.checked ? 'dark' : 'light';
    console.log(`Initial theme: ${initialTheme}`);
    aplicarTema(initialTheme);
};
