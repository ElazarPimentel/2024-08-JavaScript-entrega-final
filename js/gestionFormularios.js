/* Nombre del archivo: js/gestionFormularios.js
Autor: Alessio Aguirre Pimentel
Versión: 324 */

import { ClienteClass, MascotaClass, TurnoClass } from './modelos.js';
import { actualizarDOM, poblarDatosDeCita } from './actualizacionesDOM.js';
import { mostrarError, limpiarError } from './manejoErrores.js';
import { validarNombre, validarTelefono, validarNumeroMascotas, validarFecha, validarDiaAbierto, validarHora, validarEdadMascota } from './validaciones.js';
import { gestionarAlmacenamientoLocal } from './almacenamientoLocal.js';

const servicios = {
    1: "Bañado y Peinado",
    2: "Vacunación",
    3: "Chequeo General",
    4: "Quitar pulgas"
};

const horarios = {
    Lunes: "9:00 - 17:00",
    Martes: "9:00 - 17:00",
    Miércoles: "9:00 - 17:00",
    Jueves: "9:00 - 17:00",
    Viernes: "9:00 - 17:00",
    Sábado: "Cerrado",
    Domingo: "Cerrado"
};

let cliente = gestionarAlmacenamientoLocal("cargar", "cliente") || null;
let mascotas = gestionarAlmacenamientoLocal("cargar", "mascotas") || [];
let turnos = gestionarAlmacenamientoLocal("cargar", "turnos") || [];

const showError = (element, message) => {
    mostrarError(message);
    element.focus();
    element.classList.add('error');
    setTimeout(() => limpiarError(element), 3000);
};

export const mostrarFormulariosMascotas = () => {
    const numMascotas = document.getElementById("numero-mascotas");
    const fecha = document.getElementById("turno-fecha");
    const hora = document.getElementById("turno-hora");
    limpiarError(numMascotas);
    limpiarError(fecha);
    limpiarError(hora);

    if (!validarNumeroMascotas(numMascotas.value)) {
        showError(numMascotas, "El número de mascotas debe estar entre 1 y 3. Si tiene más de tres mascotas, por favor haga otro turno para las otras mascotas.");
        return;
    }
    if (!validarFecha(fecha.value)) {
        showError(fecha, "La fecha del turno debe ser un día que la veterinaria esté abierta y dentro de los próximos 45 días.");
        return;
    }
    if (!validarDiaAbierto(fecha.value)) {
        showError(fecha, "La veterinaria está cerrada ese día. Por favor elija otro día.");
        return;
    }
    if (!validarHora(fecha.value, hora.value, horarios, numMascotas.value)) {
        showError(hora, "La hora del turno debe estar dentro del horario de atención y al menos una hora después de la hora actual.");
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
        showError(nombre, "El nombre debe contener entre 2 y 25 letras del alfabeto latino.");
        return;
    }
    if (!validarTelefono(telefono.value)) {
        showError(telefono, "El teléfono debe contener solo números, signos +, -, (, ), y espacios, con un máximo de 20 caracteres.");
        return;
    }
    cliente = new ClienteClass(null, nombre.value, telefono.value);
    gestionarAlmacenamientoLocal("guardar", "cliente", cliente);
    document.getElementById("formulario-mascotas-info").style.display = "block";
};

export const guardarMascotasYTurnos = () => {
    try {
        if (!cliente) {
            mostrarError('Cliente no está inicializado');
            return;
        }
        const numMascotas = parseInt(document.getElementById("numero-mascotas").value);
        const fecha = document.getElementById("turno-fecha").value;
        const hora = document.getElementById("turno-hora").value;
        let turnoHora = new Date(`${fecha}T${hora}`);
        for (let i = 0; i < numMascotas; i++) {
            const mascotaNombre = document.getElementById(`mascota-nombre-${i}`).value;
            const mascotaEdad = parseInt(document.getElementById(`mascota-edad-${i}`).value);
            const servicioId = parseInt(document.getElementById(`servicio-${i}`).value);
            if (!validarNombre(mascotaNombre)) {
                showError(document.getElementById(`mascota-nombre-${i}`), "El nombre de la mascota debe contener entre 2 y 25 letras del alfabeto latino.");
                return;
            }
            if (!validarEdadMascota(mascotaEdad.toString())) {
                showError(document.getElementById(`mascota-edad-${i}`), "La edad de la mascota debe ser un número entre 0 y 40 años.");
                return;
            }
            const mascota = new MascotaClass(null, cliente.clienteId, mascotaNombre, mascotaEdad);
            mascotas.push(mascota);
            const turno = new TurnoClass(null, mascota.mascotaId, fecha, turnoHora.toTimeString().slice(0, 5), servicioId);
            turnos.push(turno);
            turnoHora.setMinutes(turnoHora.getMinutes() + 45);
        }
        gestionarAlmacenamientoLocal("guardar", "mascotas", mascotas);
        gestionarAlmacenamientoLocal("guardar", "turnos", turnos);
        actualizarDOM(cliente, mascotas, turnos, servicios, horarios);
        document.getElementById("seccion-salida-datos-dos").style.display = "block";
        document.getElementById("guardar-mascotas-turnos").style.display = "none"; // Ocultar el botón
    } catch (error) {
        mostrarError('Error al guardar mascotas y turnos');
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
};
