/* Nombre del archivo: js/gestionFormularios.js
Autor: Alessio Aguirre Pimentel
Versión: 361 */

import { ClienteClass, MascotaClass, TurnoClass } from './modelos.js';
import { actualizarDOM } from './actualizacionesDOM.js';
import { mostrarError, limpiarError } from './manejoErrores.js';
import { validarNombre, validarTelefono, validarNumeroMascotas, validarFecha, validarDiaAbierto, validarHora, validarEdadMascota } from './validaciones.js';
import { gestionarAlmacenamientoLocal } from './almacenamientoLocal.js';
import { obtenerHoraActualArgentina } from './inicializacionApp.js';
import { servicios, horarios, duracionDeTurno, formatoFecha, formatoHora, errorMessages } from './constantes.js';

const showError = (message) => {
    mostrarError(message);
};

// Declare cliente, mascotas, and turnos at the top level to avoid reference errors
let cliente = gestionarAlmacenamientoLocal("cargar", "cliente") || null;
let mascotas = gestionarAlmacenamientoLocal("cargar", "mascotas") || [];
let turnos = gestionarAlmacenamientoLocal("cargar", "turnos") || [];

export const mostrarFormulariosMascotas = async () => {
    const numMascotas = document.getElementById("numero-mascotas");
    const fecha = document.getElementById("turno-fecha");
    const hora = document.getElementById("turno-hora");
    limpiarError(numMascotas);
    limpiarError(fecha);
    limpiarError(hora);

    if (!validarNumeroMascotas(numMascotas.value)) {
        showError(errorMessages.limiteMascotas);
        Swal.fire({
            icon: 'info',
            title: 'Límite de Mascotas',
            text: errorMessages.limiteMascotas,
            confirmButtonText: 'Aceptar'
        });
        return;
    }
    if (!validarFecha(fecha.value)) {
        showError(errorMessages.fechaInvalida);
        return;
    }
    if (!validarDiaAbierto(fecha.value)) {
        showError(errorMessages.diaCerrado);
        return;
    }
    const ahoraArgentina = await obtenerHoraActualArgentina();
    if (!validarHora(fecha.value, hora.value, horarios)) {
        showError(errorMessages.horaInvalida);
        return;
    }

    const mascotasForm = document.getElementById("mascotas-formulario");
    mascotasForm.innerHTML = '';
    for (let i = 0; i < parseInt(numMascotas.value); i++) {
        const petForm = document.createElement("form");
        petForm.setAttribute("id", `form-mascota-${i}`);
        petForm.innerHTML = `
<fieldset>
<legend>Datos de la Mascota ${i + 1}</legend>
<label for="mascota-nombre-${i}">Nombre de mascota:</label>
<input type="text" id="mascota-nombre-${i}" name="mascota-nombre-${i}" required aria-label="Nombre de la Mascota ${i + 1}">
<label for="mascota-edad-${i}">Edad (años):</label>
<input type="number" id="mascota-edad-${i}" name="mascota-edad-${i}" required aria-label="Edad de la Mascota ${i + 1}" min="0" max="40">
<label for="servicio-${i}">Servicio</label>
<select id="servicio-${i}" required aria-label="Servicio para la Mascota ${i + 1}">
${Object.entries(servicios).map(([id, nombre]) => `<option value="${id}">${nombre}</option>`).join('')}
</select>
</fieldset>
`;
        mascotasForm.appendChild(petForm);
    }
    mascotasForm.style.display = "block";
    document.getElementById("guardar-mascotas-turnos").style.display = "inline-block";
    document.getElementById("borrar-datos").style.display = "inline-block";
};

export const guardarCliente = () => {
    const nombre = document.getElementById("cliente-nombre");
    const telefono = document.getElementById("cliente-telefono");
    limpiarError(nombre);
    limpiarError(telefono);

    if (!validarNombre(nombre.value)) {
        showError(errorMessages.nombreInvalido);
        return;
    }
    if (!validarTelefono(telefono.value)) {
        showError(errorMessages.telefonoInvalido);
        return;
    }
    cliente = new ClienteClass(null, nombre.value, telefono.value);
    gestionarAlmacenamientoLocal("guardar", "cliente", cliente);
    document.getElementById("formulario-mascotas-info").style.display = "block";
};

export const guardarMascotasYTurnos = async () => {
    try {
        if (!cliente) {
            mostrarError(errorMessages.clienteNoInicializado);
            return;
        }
        const numMascotas = parseInt(document.getElementById("numero-mascotas").value);
        const fecha = document.getElementById("turno-fecha").value;
        const hora = document.getElementById("turno-hora").value;
        let turnoHora = luxon.DateTime.fromFormat(`${fecha}T${hora}`, `${formatoFecha}T${formatoHora}`);
        const ahoraArgentina = await obtenerHoraActualArgentina();
        for (let i = 0; i < numMascotas; i++) {
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
            mascotas.push(mascota);
            const turno = new TurnoClass(null, mascota.mascotaId, fecha, turnoHora.toFormat(formatoHora), servicioId);
            turnos.push(turno);
            turnoHora = turnoHora.plus({ minutes: duracionDeTurno });

            // Verificación de si el turno termina fuera del horario de atención
            const finHorario = luxon.DateTime.fromFormat(`${fecha}T17:00`, `${formatoFecha}T${formatoHora}`);
            const horaFinTurno = luxon.DateTime.fromFormat(turno.turnoHora, formatoHora);
            if (horaFinTurno.plus({ minutes: duracionDeTurno }) > finHorario) {
                mostrarError(errorMessages.horaInvalida);
                return;
            }
        }
        gestionarAlmacenamientoLocal("guardar", "mascotas", mascotas);
        gestionarAlmacenamientoLocal("guardar", "turnos", turnos);
        actualizarDOM(cliente, mascotas, turnos, servicios, horarios);
        document.getElementById("seccion-salida-datos-dos").style.display = "block";
        document.getElementById("guardar-mascotas-turnos").style.display = "none"; // Ocultar el botón
    } catch (error) {
        mostrarError('Error al guardar mascotas y turnos');
        console.error('Error al guardar mascotas y turnos:', error);
    }
};

export const comenzarDeNuevo = () => {
    gestionarAlmacenamientoLocal('borrarTodo');
    cliente = null;
    mascotas = [];
    turnos = [];
    document.getElementById('formulario-cliente').reset();
    document.getElementById('cliente-nombre').value = '';
    document.getElementById('cliente-telefono').value = '';
    document.getElementById('formulario-mascotas-info').reset();
    document.getElementById('formulario-mascotas-info').style.display = 'none';
    document.getElementById('mascotas-formulario').style.display = 'none';
    document.getElementById('botones-gardar-borrar').style.display = 'none';
    document.getElementById('seccion-salida-datos-dos').style.display = 'none';
    document.getElementById('siguiente-mascota').style.display = 'inline-block'; // Make "Siguiente" button visible again
    document.getElementById('numero-mascotas').disabled = false; // Enable the number of pets field
};
