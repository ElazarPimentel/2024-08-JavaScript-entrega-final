/* Nombre del archivo: js/gestionFormularios.js
Autor: Alessio Aguirre Pimentel
Versión: 42 */

import { ClienteClass, MascotaClass, TurnoClass } from './modelos.js';
import { actualizarDOM } from './actualizacionesDom.js';
import { mostrarError, limpiarError } from './manejoErrores.js';
import { validarNombre, validarTelefono, validarEdadMascota } from './validaciones.js';
import { gestionarAlmacenamientoLocal } from './almacenamientoLocal.js';
import { servicios, horarios, duracionDeTurno, formatoFecha, formatoHora, errorMessages } from './constantes.js';
// eslint-disable-next-line no-undef
const { DateTime } = luxon;

const showError = (message) => {
    mostrarError(message);
};

// Declarar cliente, mascotas, y turnos a nivel superior para evitar errores de referencia
let cliente = gestionarAlmacenamientoLocal("cargar", "cliente") || null;
let mascotas = gestionarAlmacenamientoLocal("cargar", "mascotas") || [];
let turnos = gestionarAlmacenamientoLocal("cargar", "turnos") || [];

export const mostrarFormulariosMascotas = async () => {
    const mascotasForm = document.getElementById("mascotas-formulario");
    mascotasForm.innerHTML = '';
    mascotas.forEach((mascota, index) => {
        mascotasForm.appendChild(crearFormularioMascota(index, mascota));
    });
    document.getElementById("guardar-mascotas-turnos").style.display = "inline-block";
    document.getElementById("borrar-datos").style.display = "inline-block";
};

const crearFormularioMascota = (index, mascota = {}) => {
    const petForm = document.createElement("div");
    petForm.setAttribute("id", `mascota-form-${index}`);
    petForm.classList.add("mascota-form");
    petForm.innerHTML = `
        <fieldset>
            <legend>Mascota ${index + 1}</legend>
            <label for="mascota-nombre-${index}">Nombre:</label>
            <input type="text" id="mascota-nombre-${index}" name="mascota-nombre-${index}" value="${mascota.mascotaNombre || ''}" required>
            <label for="mascota-edad-${index}">Edad:</label>
            <input type="number" id="mascota-edad-${index}" name="mascota-edad-${index}" value="${mascota.mascotaEdad || ''}" required>
            <label for="servicio-${index}">Servicio:</label>
            <select id="servicio-${index}" name="servicio-${index}" required>
                ${Object.entries(servicios).map(([id, nombre]) => `<option value="${id}" ${mascota.turnoForeignServicioId === id ? 'selected' : ''}>${nombre}</option>`).join('')}
            </select>
            <button type="button" class="editar-mascota" data-index="${index}">📝</button>
            <button type="button" class="eliminar-mascota" data-index="${index}">➖</button>
        </fieldset>
    `;
    return petForm;
};

export const agregarMascotaFormulario = () => {
    if (mascotas.length >= 3) {
        showError(errorMessages.limiteMascotas);
        return;
    }
    mascotas.push(new MascotaClass());
    mostrarFormulariosMascotas();
};

export const guardarCliente = () => {
    const nombre = document.getElementById("cliente-nombre").value;
    const telefono = document.getElementById("cliente-telefono").value;
    const email = document.getElementById("cliente-email").value;
    limpiarError(document.getElementById("cliente-nombre"));
    limpiarError(document.getElementById("cliente-telefono"));

    if (!validarNombre(nombre)) {
        showError(errorMessages.nombreInvalido);
        return;
    }
    if (!validarTelefono(telefono)) {
        showError(errorMessages.telefonoInvalido);
        return;
    }
    cliente = new ClienteClass(null, nombre, telefono, email);
    gestionarAlmacenamientoLocal("guardar", "cliente", cliente);
    document.getElementById("formulario-mascotas-info").style.display = "block";
};

export const guardarMascotasYTurnos = async () => {
    try {
        if (!cliente) {
            mostrarError(errorMessages.clienteNoInicializado);
            return;
        }
        const fecha = document.getElementById("turno-fecha").value;
        const hora = document.getElementById("turno-hora").value;
        let turnoHora = DateTime.fromISO(`${fecha}T${hora}`);
        for (let i = 0; i < mascotas.length; i++) {
            const mascotaNombre = document.getElementById(`mascota-nombre-${i}`).value;
            const mascotaEdad = parseInt(document.getElementById(`mascota-edad-${i}`).value);
            const servicioId = parseInt(document.getElementById(`servicio-${i}`).value);
            if (!validarNombre(mascotaNombre)) {
                showError(errorMessages.nombreMascotaInvalido);
                return;
            }
            if (!validarEdadMascota(mascotaEdad.toString())) {
                showError(errorMessages.edadMascotaInvalida);
                return;
            }
            const mascota = new MascotaClass(null, cliente.clienteId, mascotaNombre, mascotaEdad);
            mascotas[i] = mascota;
            const turno = new TurnoClass(null, mascota.mascotaId, turnoHora.toISO(), turnoHora.toISO(), servicioId);
            turnos[i] = turno;
            turnoHora = turnoHora.plus({ minutes: duracionDeTurno });

            // Verificación de si el turno termina fuera del horario de atención
            const finHorario = DateTime.fromFormat(`${fecha}T17:00`, `${formatoFecha}T${formatoHora}`);
            const horaFinTurno = DateTime.fromISO(turnoHora.toISO());
            if (horaFinTurno.plus({ minutes: duracionDeTurno }) > finHorario) {
                mostrarError(errorMessages.turnoFueraHorario);
                return;
            }
        }
        gestionarAlmacenamientoLocal("guardar", "mascotas", mascotas);
        gestionarAlmacenamientoLocal("guardar", "turnos", turnos);
        actualizarDOM(cliente, mascotas, turnos, servicios, horarios);
        document.getElementById("seccion-salida-datos-dos").style.display = "block";
        document.getElementById("guardar-mascotas-turnos").style.display = "none"; // Ocultar el botón
        document.getElementById("recibir-correo").style.display = "inline-block"; // Mostrar botón de recibir correo
    } catch (error) {
        mostrarError(errorMessages.errorGuardarMascotasTurnos);
        console.error('Error al guardar mascotas y turnos:', error);
    }
};

export const recibirCorreo = () => {
    // eslint-disable-next-line no-undef
    Swal.fire({
        icon: 'info',
        title: 'Correo Enviado',
        text: 'El correo con la información del turno fue enviado',
        confirmButtonText: 'Aceptar'
    });
};

export const comenzarDeNuevo = () => {
    gestionarAlmacenamientoLocal('borrarTodo');
    cliente = null;
    mascotas = [];
    turnos = [];
    document.getElementById('formulario-cliente').reset();
    document.getElementById('cliente-nombre').value = '';
    document.getElementById('cliente-telefono').value = '';
    document.getElementById('cliente-email').value = '';
    document.getElementById('formulario-mascotas-info').reset();
    document.getElementById('formulario-mascotas-info').style.display = 'none';
    document.getElementById('mascotas-formulario').style.display = 'none';
    document.getElementById('botones-gardar-borrar').style.display = 'none';
    document.getElementById('seccion-salida-datos-dos').style.display = 'none';
    document.getElementById('siguiente-mascota').style.display = 'inline-block'; // Make "Siguiente" button visible again
    document.getElementById('numero-mascotas').disabled = false; // Enable the number of pets field
    document.getElementById('turno-fecha').disabled = false; // Enable the date input
    document.getElementById('turno-hora').disabled = false; // Enable the time input
};

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('editar-mascota')) {
        const index = event.target.dataset.index;
        // Logic to handle editing the pet details
    } else if (event.target.classList.contains('eliminar-mascota')) {
        const index = event.target.dataset.index;
        mascotas.splice(index, 1);
        turnos.splice(index, 1);
        mostrarFormulariosMascotas();
    }
});
