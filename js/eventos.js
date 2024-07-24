/* Nombre del archivo: js/eventos.js
Autor: Alessio Aguirre Pimentel
Versión: 49 */
import { guardarCliente, guardarMascotasYTurnos, comenzarDeNuevo, agregarMascotaFormulario, agregarPrimeraMascota, recibirCorreo } from './gestionFormularios.js';
import { aplicarTema } from './tema.js';
import { gestionarAlmacenamientoLocal } from './almacenamientoLocal.js';

// Configuración de los oyentes de eventos del DOM
export const configurarOyentesDeEventos = () => {
    document.getElementById('guardar-cliente').addEventListener('click', () => {
        console.log('Button "guardar-cliente" clickeado');
        guardarCliente();
    });

    document.getElementById('borrar-datos').addEventListener('click', () => {
        console.log('Button "borrar-datos" clickeado');
        comenzarDeNuevo();
    });

    document.getElementById('guardar-mascotas-turnos').addEventListener('click', () => {
        console.log('Button "guardar-mascotas-turnos" clickeado');
        guardarMascotasYTurnos();
    });

    document.getElementById('borrar-todo-temp').addEventListener('click', () => {
        console.log('Button "borrar-todo-temp" clickeado');
        console.log('LocalStorage antes de limpiar:', JSON.parse(JSON.stringify(localStorage)));
        gestionarAlmacenamientoLocal('borrarTodo');
        console.log('LocalStorage después de limpiar:', JSON.parse(JSON.stringify(localStorage)));
        location.reload();
    });

    const themeToggle = document.getElementById('checkbox');
    themeToggle.addEventListener('change', () => {
        const theme = themeToggle.checked ? 'dark' : 'light';
        console.log(`Tema cambiado a: ${theme}`);
        aplicarTema(theme);
    });

    document.getElementById('agregar-mascota').addEventListener('click', () => {
        console.log('Button "agregar-mascota" clickeado');
        agregarMascotaFormulario();
    });

    document.getElementById('siguiente').addEventListener('click', () => {
        console.log('Button "siguiente" clickeado');
        document.getElementById('agregar-mascota').style.display = 'inline-block'; // Make the button visible
        agregarPrimeraMascota();
    });

    document.getElementById('recibir-correo').addEventListener('click', () => {
        console.log('Button "recibir-correo" clickeado');
        recibirCorreo();
    });

    // Aplicar el tema inicialmente al cargar la página
    const initialTheme = themeToggle.checked ? 'dark' : 'light';
    console.log(`Tema inicial: ${initialTheme}`);
    aplicarTema(initialTheme);
};
