/* Nombre del archivo: js/eventos.js
Autor: Alessio Aguirre Pimentel
Versión: 70 */

import { guardarCliente, guardarMascotasYTurnos, comenzarDeNuevo, agregarMascotaFormulario, agregarPrimeraMascota, recibirCorreo, mostrarFormulariosMascotas } from './gestionFormularios.js';
import { aplicarTema } from './tema.js';
import { gestionarAlmacenamientoLocal } from './almacenamientoLocal.js';
import { validarFecha, validarHora } from './validaciones.js';
import { errorMessages, horarios } from './constantes.js';
import { mostrarError } from './manejoErrores.js';
import { mascotas, turnos } from './inicializacionApp.js'; // Import the required variables from inicializacionApp.js

// Configuración de los oyentes de eventos del DOM
export const configurarOyentesDeEventos = () => {
    const guardarClienteBtn = document.getElementById('guardar-cliente');
    const borrarDatosBtn = document.getElementById('borrar-datos');
    const guardarMascotasTurnosBtn = document.getElementById('guardar-mascotas-turnos');
    const borrarTodoTempBtn = document.getElementById('borrar-todo-temp');
    const themeToggle = document.getElementById('checkbox');
    const agregarMascotaBtn = document.getElementById('agregar-mascota');
    const siguienteBtn = document.getElementById('siguiente');
    const recibirCorreoBtn = document.getElementById('recibir-correo');
    const mascotasFormulario = document.getElementById('mascotas-formulario');

    if (guardarClienteBtn) {
        guardarClienteBtn.addEventListener('click', () => {
            console.log('Button "guardar-cliente" clickeado');
            guardarCliente();
        });
    }

    if (borrarDatosBtn) {
        borrarDatosBtn.addEventListener('click', () => {
            console.log('Button "borrar-datos" clickeado');
            comenzarDeNuevo();
        });
    }

    if (guardarMascotasTurnosBtn) {
        guardarMascotasTurnosBtn.addEventListener('click', () => {
            console.log('Button "guardar-mascotas-turnos" clickeado');
            guardarMascotasYTurnos();
        });
    }

    if (borrarTodoTempBtn) {
        borrarTodoTempBtn.addEventListener('click', () => {
            console.log('Button "borrar-todo-temp" clickeado');
            console.log('LocalStorage antes de limpiar:', JSON.parse(JSON.stringify(localStorage)));
            gestionarAlmacenamientoLocal('borrarTodo');
            console.log('LocalStorage después de limpiar:', JSON.parse(JSON.stringify(localStorage)));
            location.reload();
        });
    }

    if (themeToggle) {
        themeToggle.addEventListener('change', () => {
            const theme = themeToggle.checked ? 'dark' : 'light';
            console.log(`Tema cambiado a: ${theme}`);
            aplicarTema(theme);
        });
    }

    if (agregarMascotaBtn) {
        agregarMascotaBtn.addEventListener('click', () => {
            console.log('Button "agregar-mascota" clickeado');
            agregarMascotaFormulario();
        });
    }

    if (siguienteBtn) {
        siguienteBtn.addEventListener('click', () => {
            console.log('Button "siguiente" clickeado');
            const fecha = document.getElementById("turno-fecha").value;
            const hora = document.getElementById("turno-hora").value;

            if (!validarFecha(fecha)) {
                mostrarError(errorMessages.fechaInvalida);
                return;
            }
            if (!validarHora(fecha, hora, horarios)) {
                mostrarError(errorMessages.horaInvalida);
                return;
            }

            agregarPrimeraMascota();
            document.getElementById('formulario-mascotas-info').style.display = 'none';
            document.getElementById('mascotas-formulario').style.display = 'block';
        });
    }

    if (recibirCorreoBtn) {
        recibirCorreoBtn.addEventListener('click', () => {
            console.log('Button "recibir-correo" clickeado');
            recibirCorreo();
        });
    }

    // Aplicar el tema inicialmente al cargar la página
    const initialTheme = themeToggle && themeToggle.checked ? 'dark' : 'light';
    console.log(`Tema inicial: ${initialTheme}`);
    aplicarTema(initialTheme);

    // Detectar cambios en las mascotas
    if (mascotasFormulario) {
        mascotasFormulario.addEventListener('input', () => {
            console.log('Formulario de mascotas modificado');
            const guardarMascotasTurnosBtn = document.getElementById("guardar-mascotas-turnos");
            const recibirCorreoBtn = document.getElementById("recibir-correo");
            if (guardarMascotasTurnosBtn) {
                guardarMascotasTurnosBtn.style.display = "inline-block";
            }
            if (recibirCorreoBtn) {
                recibirCorreoBtn.style.display = "none";
            }
        });
    }

    document.addEventListener('click', (event) => {
        const button = event.target.closest('.editar-mascota, .eliminar-mascota');
        if (button) {
            const index = button.dataset.index;
            if (button.classList.contains('editar-mascota')) {
                console.log('Button "editar-mascota" clickeado', index);
                editarMascotaFormulario(index);
            } else if (button.classList.contains('eliminar-mascota')) {
                console.log("Eliminando mascota en el índice:", index);
                eliminarMascotaFormulario(index);
            }
        }
    });
};

const editarMascotaFormulario = (index) => {
    const mascotaForm = document.getElementById(`mascota-form-${index}`);
    if (mascotaForm) {
        const nombre = mascotaForm.querySelector(`#mascota-nombre-${index}`).value;
        const edad = mascotaForm.querySelector(`#mascota-edad-${index}`).value;
        const servicioId = mascotaForm.querySelector(`#servicio-${index}`).value;

        mascotas[index].mascotaNombre = nombre;
        mascotas[index].mascotaEdad = parseInt(edad);
        turnos[index].turnoForeignServicioId = parseInt(servicioId);

        console.log("Mascota editada:", mascotas[index]);
        mostrarFormulariosMascotas();
    } else {
        console.error(`No se encontró el formulario de la mascota con el índice: ${index}`);
    }
};

const eliminarMascotaFormulario = (index) => {
    mascotas.splice(index, 1);
    turnos.splice(index, 1);
    mostrarFormulariosMascotas();
};
