/* Nombre del archivo: js/eventos.js
Autor: Alessio Aguirre Pimentel
Versión: 400 */

import { mostrarFormulariosMascotas, guardarCliente, guardarMascotasYTurnos, comenzarDeNuevo } from './gestionFormularios.js';
import { aplicarTema } from './tema.js';
import { gestionarAlmacenamientoLocal } from './almacenamientoLocal.js';
import { validarFecha, validarDiaAbierto, validarHora } from './validaciones.js';
import { mostrarError } from './manejoErrores.js';
import { horarios, errorMessages } from './constantes.js'; // Import horarios and errorMessages

// Configuración de los oyentes de eventos del DOM
export const configurarOyentesDeEventos = () => {
    document.getElementById('siguiente-mascota').addEventListener('click', () => {
        console.log('Button "siguiente-mascota" clicked');
        const numMascotas = document.getElementById("numero-mascotas");
        const fecha = document.getElementById("turno-fecha");
        const hora = document.getElementById("turno-hora");

        if (numMascotas.value < 1 || numMascotas.value > 3) {
            mostrarError(errorMessages.limiteMascotas);
            return;
        }
        if (!validarFecha(fecha.value)) {
            mostrarError(errorMessages.fechaInvalida);
            return;
        }
        if (!validarDiaAbierto(fecha.value)) {
            mostrarError(errorMessages.diaCerrado);
            return;
        }
        if (!validarHora(fecha.value, hora.value, horarios)) {
            mostrarError(errorMessages.horaInvalida);
            return;
        }

        mostrarFormulariosMascotas();
        document.getElementById('siguiente-mascota').style.display = 'none'; // Hide the "Siguiente" button
        document.getElementById('numero-mascotas').disabled = true; // Grey out the number of pets field
        document.getElementById('turno-fecha').disabled = true; // Disable the date input
        document.getElementById('turno-hora').disabled = true; // Disable the time input
        document.getElementById('guardar-mascotas-turnos').style.display = 'inline-block'; // Show the "Pedir éste Turno" button
    });

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

    // Aplicar el tema inicialmente al cargar la página
    const initialTheme = themeToggle.checked ? 'dark' : 'light';
    console.log(`Initial theme: ${initialTheme}`);
    aplicarTema(initialTheme);
};