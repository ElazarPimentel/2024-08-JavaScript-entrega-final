/* Nombre del archivo: js/eventos.js
Autor: Alessio Aguirre Pimentel
Versión: 361 */

import { mostrarFormulariosMascotas, guardarCliente, guardarMascotasYTurnos, comenzarDeNuevo } from './gestionFormularios.js';
import { aplicarTema } from './tema.js';
import { gestionarAlmacenamientoLocal } from './almacenamientoLocal.js';
import { validarNumeroMascotas, validarFecha, validarDiaAbierto, validarHora } from './validaciones.js';
import { mostrarError } from './manejoErrores.js';
import { horarios } from './constantes.js'; // Import horarios from constantes.js

// Configuración de los oyentes de eventos del DOM
export const configurarOyentesDeEventos = () => {
    document.getElementById('siguiente-mascota').addEventListener('click', () => {
        console.log('Button "siguiente-mascota" clicked');
        const numMascotas = document.getElementById("numero-mascotas");
        const fecha = document.getElementById("turno-fecha");
        const hora = document.getElementById("turno-hora");

        if (!validarNumeroMascotas(numMascotas.value)) {
            mostrarError("El número de mascotas debe estar entre 1 y 3. Si tiene más de tres mascotas, por favor haga otro turno para las otras mascotas.");
            return;
        }
        if (!validarFecha(fecha.value)) {
            mostrarError("La fecha del turno debe ser un día que la veterinaria esté abierta y dentro de los próximos 45 días.");
            return;
        }
        if (!validarDiaAbierto(fecha.value)) {
            mostrarError("Por favor seleccionar un día en el que la veterinaria esté abierta. Ver días y horarios a la izquierda.");
            return;
        }
        if (!validarHora(fecha.value, hora.value, horarios)) {
            mostrarError("El turno que estás tratando de tomar no está dentro del horario habil de la veterinaria, por favor mirá nuestros horarios a la izquierda.");
            return;
        }

        mostrarFormulariosMascotas();
        document.getElementById('siguiente-mascota').style.display = 'none'; // Hide the "Siguiente" button
        document.getElementById('numero-mascotas').disabled = true; // Grey out the number of pets field
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
