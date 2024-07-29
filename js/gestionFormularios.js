/* Nombre del archivo: js/gestionFormularios.js
Autor: Alessio Aguirre Pimentel
Versión: 78 */

import { ClienteClass, MascotaClass, TurnoClass } from './modelos.js';
import { actualizarDOM } from './actualizacionesDom.js';
import { mostrarError } from './manejoErrores.js';
import { validarNombre, validarTelefono, validarEdadMascota, validarEmail, validarFecha, validarDiaAbierto, validarHora } from './validaciones.js';
import { gestionarAlmacenamientoLocal } from './almacenamientoLocal.js';
import { servicios, horarios, mensajesDeError } from './constantes.js';

const { DateTime } = luxon;

const showError = (message) => {
    mostrarError(message);
};

let cliente = gestionarAlmacenamientoLocal("cargar", "cliente") || null;
let mascotas = gestionarAlmacenamientoLocal("cargar", "mascotas") || [];
let turnos = gestionarAlmacenamientoLocal("cargar", "turnos") || [];

export { cliente, mascotas, turnos }; 

export const mostrarFormulariosMascotas = () => {
    const mascotasForm = document.getElementById("mascotas-formulario");
    mascotasForm.innerHTML = '';
    mascotas.forEach((mascota, index) => {
        mascotasForm.appendChild(crearFormularioMascota(index, mascota));
    });
    document.getElementById("guardar-mascotas-turnos").style.display = "inline-block";
    document.getElementById("borrar-datos").style.display = "inline-block";
    document.getElementById("botones-gardar-borrar").style.display = 'flex';  
};

const crearFormularioMascota = (index, mascota = {}) => {
    const petForm = document.createElement("div");
    petForm.setAttribute("id", `mascota-form-${index}`);
    petForm.classList.add("mascota-form");
    petForm.innerHTML = `
        <fieldset>
            <legend>Mascota ${index + 1}</legend>
            <label for="mascota-nombre-${index}">Nombre:</label>
            <input type="text" id="mascota-nombre-${index}" name="mascota-nombre-${index}" value="${mascota.mascotaNombre || ''}" placeholder="Campo requerido" required>
            <label for="mascota-edad-${index}">Edad:</label>
            <input type="number" id="mascota-edad-${index}" name="mascota-edad-${index}" value="${mascota.mascotaEdad || ''}" required size="1">
            <label for="servicio-${index}">Servicio:</label>
            <select id="servicio-${index}" name="servicio-${index}" required>
                ${Object.entries(servicios).map(([id, nombre]) => `<option value="${id}" ${mascota.turnoForeignServicioId === id ? 'selected' : ''}>${nombre}</option>`).join('')}
            </select>
            <button type="button" class="editar-mascota" data-index="${index}">Editar</button>
            <button type="button" class="eliminar-mascota" data-index="${index}">Sacar</button>
            ${index === mascotas.length - 1 ? '<button type="button" id="agregar-mascota">Agregar Mascota</button>' : ''}
        </fieldset>
    `;
    return petForm;
};

export const agregarMascotaFormulario = () => {
    for (let i = 0; i < mascotas.length; i++) {
        const mascotaNombre = document.getElementById(`mascota-nombre-${i}`).value;
        const mascotaEdad = parseInt(document.getElementById(`mascota-edad-${i}`).value, 10);
        const servicioId = parseInt(document.getElementById(`servicio-${i}`).value, 10);
        mascotas[i] = new MascotaClass(mascotas[i].mascotaId, cliente.clienteId, mascotaNombre, mascotaEdad);
        turnos[i] = new TurnoClass(turnos[i].turnoId, mascotas[i].mascotaId, turnos[i].turnoFecha, turnos[i].turnoHora, servicioId);
    }

    if (mascotas.length >= 3) {
        showError(mensajesDeError.limiteMascotas);
        return;
    }

    const nuevaMascota = new MascotaClass(null, cliente.clienteId, "", 0);
    mascotas.push(nuevaMascota);
    const nuevoTurno = new TurnoClass(null, nuevaMascota.mascotaId, "", "", 1);
    turnos.push(nuevoTurno);

    mostrarFormulariosMascotas();
};

export const guardarCliente = () => {
    const nombre = document.getElementById("cliente-nombre").value;
    const telefono = document.getElementById("cliente-telefono").value;
    const email = document.getElementById("cliente-email").value;

    if (!validarNombre(nombre)) {
        showError(mensajesDeError.nombreInvalido);
        return;
    }
    if (!validarTelefono(telefono)) {
        showError(mensajesDeError.telefonoInvalido);
        return;
    }
    if (email && !validarEmail(email)) {
        showError(mensajesDeError.correoInvalido);
        return;
    }
    cliente = new ClienteClass(null, nombre, telefono, email);
    gestionarAlmacenamientoLocal("guardar", "cliente", cliente);
    document.getElementById("formulario-mascotas-info").style.display = "block";
};

const diasSemana = {
    Monday: "Lunes",
    Tuesday: "Martes",
    Wednesday: "Miércoles",
    Thursday: "Jueves",
    Friday: "Viernes",
    Saturday: "Sábado",
    Sunday: "Domingo"
};

export const guardarMascotasYTurnos = async () => {
    try {
        if (!cliente) {
            mostrarError(mensajesDeError.clienteNoInicializado);
            return;
        }

        const fecha = document.getElementById("turno-fecha").value;
        const hora = document.getElementById("turno-hora").value;

        console.log("Fecha seleccionada:", fecha);
        console.log("Hora seleccionada:", hora);

        if (!validarFecha(fecha)) {
            showError(mensajesDeError.fechaInvalida);
            return;
        }
        if (!validarDiaAbierto(fecha)) {
            showError(mensajesDeError.diaCerrado);
            return;
        }
        if (!validarHora(fecha, hora, horarios)) {
            showError(mensajesDeError.horaInvalida);
            return;
        }

        let turnoHora = DateTime.fromISO(`${fecha}T${hora}`);
        for (let i = 0; i < mascotas.length; i++) {
            const mascotaNombre = document.getElementById(`mascota-nombre-${i}`).value;
            const mascotaEdad = parseInt(document.getElementById(`mascota-edad-${i}`).value, 10);
            const servicioId = parseInt(document.getElementById(`servicio-${i}`).value, 10);

            console.log(`Mascota ${i + 1}: Nombre: ${mascotaNombre}, Edad: ${mascotaEdad}, Servicio ID: ${servicioId}`);

            if (!validarNombre(mascotaNombre)) {
                showError(mensajesDeError.nombreMascotaInvalido);
                return;
            }
            if (!validarEdadMascota(mascotaEdad.toString())) {
                showError(mensajesDeError.edadMascotaInvalida);
                return;
            }
            const mascota = new MascotaClass(null, cliente.clienteId, mascotaNombre, mascotaEdad);
            mascotas[i] = mascota;
            const turno = new TurnoClass(null, mascota.mascotaId, turnoHora.toISO(), turnoHora.toISO(), servicioId);
            turnos[i] = turno;
            turnoHora = turnoHora.plus({ minutes: 45 });

            const diaSemana = DateTime.fromISO(fecha).weekdayLong;
            const nombreDia = diasSemana[diaSemana];
            const horarioDia = horarios[nombreDia];

            console.log(`Día de la semana: ${nombreDia}, Horario del día: ${horarioDia}`);

            if (horarioDia && horarioDia !== 'Cerrado') {
                const [, finStr] = horarioDia.split(' - ');
                const finHorario = DateTime.fromFormat(`${fecha}T${finStr}`, 'yyyy-LL-dd\'T\'H:mm');
                const horaFinTurno = DateTime.fromISO(turnoHora.toISO());
                if (horaFinTurno.plus({ minutes: 45 }) > finHorario) {
                    showError(mensajesDeError.turnoFueraHorario);
                    return;
                }
            } else {
                showError(mensajesDeError.diaCerrado);
                return;
            }
        }
        gestionarAlmacenamientoLocal("guardar", "mascotas", mascotas);
        gestionarAlmacenamientoLocal("guardar", "turnos", turnos);
        actualizarDOM(cliente, mascotas, turnos, servicios, horarios);
        document.getElementById("seccion-salida-datos-dos").style.display = "block";
        document.getElementById("guardar-mascotas-turnos").style.display = "none";

        if (cliente.clienteEmail && validarEmail(cliente.clienteEmail)) {
            document.getElementById("recibir-correo").style.display = "inline-block";
        } else {
            document.getElementById("recibir-correo").style.display = "none";
        }
    } catch (error) {
        mostrarError(mensajesDeError.errorGuardarMascotasTurnos);
        console.error(`${mensajesDeError.errorGuardarMascotasTurnos}: ${error}`);
    }
};

export const recibirCorreo = () => {
    Swal.fire({
        icon: 'info',
        title: 'Correo Enviado',
        text: mensajesDeError.correoEnviado,
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
};

export const agregarPrimeraMascota = () => {
    if (mascotas.length === 0) {
        agregarMascotaFormulario();
    }
    mostrarFormulariosMascotas();
};
