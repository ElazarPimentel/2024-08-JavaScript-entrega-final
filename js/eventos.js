/* Nombre del archivo: js/eventos.js
Autor: Alessio Aguirre Pimentel
Versión: 77 */

import {
    guardarCliente,
    guardarMascotasYTurnos,
    comenzarDeNuevo,
    agregarMascotaFormulario,
    agregarPrimeraMascota,
    recibirCorreo,
    mostrarFormulariosMascotas,
    mascotas,  
    turnos     
} from './gestionFormularios.js';
import { aplicarTema } from './tema.js';
import { gestionarAlmacenamientoLocal } from './almacenamientoLocal.js';
import { validarFecha, validarHora } from './validaciones.js';
import { mensajesDeError, horarios } from './constantes.js';
import { mostrarError } from './manejoErrores.js';

const editarMascotaFormulario = (index) => {
    const mascotaForm = document.getElementById(`mascota-form-${index}`);
    const nombre = mascotaForm.querySelector(`#mascota-nombre-${index}`).value;
    const edad = mascotaForm.querySelector(`#mascota-edad-${index}`).value;
    const servicioId = mascotaForm.querySelector(`#servicio-${index}`).value;

    mascotas[index].mascotaNombre = nombre;
    mascotas[index].mascotaEdad = parseInt(edad, 10);
    turnos[index].turnoForeignServicioId = parseInt(servicioId, 10);

    mostrarFormulariosMascotas();
};

const eliminarMascotaFormulario = (index) => {
    mascotas.splice(index, 1);
    turnos.splice(index, 1);
    mostrarFormulariosMascotas();
};

export const configurarOyentesDeEventos = () => {
    const guardarClienteBtn = document.getElementById('guardar-cliente');
    const borrarDatosBtn = document.getElementById('borrar-datos');
    const guardarMascotasTurnosBtn = document.getElementById('guardar-mascotas-turnos');
    const borrarTodoTempBtn = document.getElementById('borrar-todo-temp');
    const themeToggle = document.getElementById('checkbox');
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
            document.getElementById('mascotas-formulario').style.display = 'block';
            document.getElementById('botones-gardar-borrar').style.display = 'flex';  // Mostrar el contenedor de los botones
        });
    }

    if (recibirCorreoBtn) {
        recibirCorreoBtn.addEventListener('click', () => {
            recibirCorreo();
        });
    }

    if (mascotasFormulario) {
        mascotasFormulario.addEventListener('click', (event) => {
            const button = event.target.closest('.editar-mascota, .eliminar-mascota, #agregar-mascota');
            if (button) {
                const index = button.dataset.index;
                if (button.classList.contains('editar-mascota')) {
                    editarMascotaFormulario(index);
                } else if (button.classList.contains('eliminar-mascota')) {
                    eliminarMascotaFormulario(index);
                } else if (button.id === 'agregar-mascota') {
                    agregarMascotaFormulario();
                }
            }
        });
    }

    const initialTheme = themeToggle && themeToggle.checked ? 'dark' : 'light';
    aplicarTema(initialTheme);
};
