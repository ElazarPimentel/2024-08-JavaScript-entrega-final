/* Nombre del archivo: js/eventos.js
Autor: Alessio Aguirre Pimentel
Versión: 70 */

import { guardarCliente, guardarMascotasYTurnos, comenzarDeNuevo, agregarMascotaFormulario, agregarPrimeraMascota, recibirCorreo, mostrarFormulariosMascotas } from './gestionFormularios.js';
import { aplicarTema } from './tema.js';
import { gestionarAlmacenamientoLocal } from './almacenamientoLocal.js';
import { validarFecha, validarHora } from './validaciones.js';
import { mensajesDeError, horarios } from './constantes.js';
import { mostrarError } from './manejoErrores.js';
import { mascotas, turnos } from './inicializacionApp.js'; 

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
            guardarCliente();
        });
    }

    if (borrarDatosBtn) {
        borrarDatosBtn.addEventListener('click', () => {
            comenzarDeNuevo();
        });
    }

    if (guardarMascotasTurnosBtn) {
        guardarMascotasTurnosBtn.addEventListener('click', () => {
            guardarMascotasYTurnos();
        });
    }

    if (borrarTodoTempBtn) {
        borrarTodoTempBtn.addEventListener('click', () => {
            gestionarAlmacenamientoLocal('borrarTodo');
            location.reload();
        });
    }

    if (themeToggle) {
        themeToggle.addEventListener('change', () => {
            const theme = themeToggle.checked ? 'dark' : 'light';
            aplicarTema(theme);
        });
    }

    if (agregarMascotaBtn) {
        agregarMascotaBtn.addEventListener('click', () => {
            agregarMascotaFormulario();
        });
    }

    if (siguienteBtn) {
        siguienteBtn.addEventListener('click', () => {
            const fecha = document.getElementById("turno-fecha").value;
            const hora = document.getElementById("turno-hora").value;

            if (!validarFecha(fecha)) {
                mostrarError(mensajesDeError.fechaInvalida);
                return;
            }
            if (!validarHora(fecha, hora, horarios)) {
                mostrarError(mensajesDeError.horaInvalida);
                return;
            }

            agregarPrimeraMascota();
            document.getElementById('formulario-mascotas-info').style.display = 'none';
            document.getElementById('mascotas-formulario').style.display = 'block';
        });
    }

    if (recibirCorreoBtn) {
        recibirCorreoBtn.addEventListener('click', () => {
            recibirCorreo();
        });
    }

    const initialTheme = themeToggle && themeToggle.checked ? 'dark' : 'light';
    aplicarTema(initialTheme);

    if (mascotasFormulario) {
        mascotasFormulario.addEventListener('input', () => {
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
                editarMascotaFormulario(index);
            } else if (button.classList.contains('eliminar-mascota')) {
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

        mostrarFormulariosMascotas();
    } else {
        console.error(`No se encontró el formulario de la mascota con el ID (índice): ${index}`);
    }
};

const eliminarMascotaFormulario = (index) => {
    
    
    
    mascotas.splice(index, 1);
    turnos.splice(index, 1);
    mostrarFormulariosMascotas();


};
