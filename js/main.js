/*  Nombre del archivo fuente: ts/src/main.ts
    Nombre del archivo destino: js/main.js
    Autor: Alessio Aguirre Pimentel
    Versión: 100 */
import { gestionarLocalStorage, getDataFromLocalStorage } from './localStorage.js';
import { mostrarError, limpiarError, validarNombre, validarTelefono, validarNumeroMascotas, validarFecha, validarDiaAbierto, validarHora, validarEdadMascota } from './validaciones.js';
import { actualizarServiciosList, actualizarHorariosList, actualizarDOM, populateAppointmentData } from './domUpdates.js';
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
let cliente = gestionarLocalStorage("cargar", "cliente") || null;
let mascotas = gestionarLocalStorage("cargar", "mascotas") || [];
let turnos = gestionarLocalStorage("cargar", "turnos") || [];
class ClienteClass {
    clienteId;
    clienteNombre;
    clienteTelefono;
    constructor(clienteId, clienteNombre, clienteTelefono) {
        this.clienteId = clienteId || ClienteClass.generarId('cliente');
        this.clienteNombre = clienteNombre;
        this.clienteTelefono = clienteTelefono;
    }
    static generarId(prefix) {
        return `${prefix}_` + Math.random().toString(36).slice(2, 11);
    }
}
class MascotaClass {
    mascotaId;
    mascotaForeignClienteId;
    mascotaNombre;
    mascotaEdad;
    constructor(mascotaId, mascotaForeignClienteId, mascotaNombre, mascotaEdad) {
        this.mascotaId = mascotaId || MascotaClass.generarId('mascota');
        this.mascotaForeignClienteId = mascotaForeignClienteId;
        this.mascotaNombre = mascotaNombre;
        this.mascotaEdad = mascotaEdad;
    }
    static generarId(prefix) {
        return `${prefix}_` + Math.random().toString(36).slice(2, 11);
    }
}
class TurnoClass {
    turnoId;
    turnoForeignMascotaId;
    turnoFecha;
    turnoHora;
    turnoForeignServicioId;
    constructor(turnoId, turnoForeignMascotaId, turnoFecha, turnoHora, turnoForeignServicioId) {
        this.turnoId = turnoId || TurnoClass.generarId('turno');
        this.turnoForeignMascotaId = turnoForeignMascotaId;
        this.turnoFecha = turnoFecha;
        this.turnoHora = turnoHora;
        this.turnoForeignServicioId = turnoForeignServicioId;
    }
    static generarId(prefix) {
        return `${prefix}_` + Math.random().toString(36).slice(2, 11);
    }
}
// Guardar cliente
const guardarCliente = () => {
    console.log('Saving client...');
    const nombre = document.getElementById("cliente-nombre");
    const telefono = document.getElementById("cliente-telefono");
    limpiarError(nombre);
    limpiarError(telefono);
    console.log('Client name:', nombre.value);
    console.log('Client phone:', telefono.value);
    if (!validarNombre(nombre.value)) {
        mostrarError(nombre, "El nombre debe contener entre 2 y 25 letras del alfabeto latino.");
        console.log('Invalid client name.');
        return;
    }
    if (!validarTelefono(telefono.value)) {
        mostrarError(telefono, "El teléfono debe contener solo números, signos +, -, (, ), y espacios, con un máximo de 20 caracteres.");
        console.log('Invalid client phone.');
        return;
    }
    cliente = new ClienteClass(null, nombre.value, telefono.value);
    gestionarLocalStorage("guardar", "cliente", cliente);
    document.getElementById("formulario-mascotas-info").style.display = "block";
    console.log('Client saved:', cliente);
};
// Mostrar formularios para mascotas
const mostrarFormulariosMascotas = () => {
    console.log('Showing pet forms...');
    const numMascotas = document.getElementById("numero-mascotas");
    const fecha = document.getElementById("turno-fecha");
    const hora = document.getElementById("turno-hora");
    limpiarError(numMascotas);
    limpiarError(fecha);
    limpiarError(hora);
    console.log('Number of pets:', numMascotas.value);
    console.log('Appointment date:', fecha.value);
    console.log('Appointment time:', hora.value);
    if (!validarNumeroMascotas(numMascotas.value)) {
        mostrarError(numMascotas, "El número de mascotas debe estar entre 1 y 3. Si tiene más de tres mascotas, por favor haga otro turno para las otras mascotas.");
        console.log('Invalid number of pets.');
        return;
    }
    if (!validarFecha(fecha.value)) {
        mostrarError(fecha, "La fecha del turno debe ser un día que la veterinaria esté abierta y dentro de los próximos 45 días.");
        console.log('Invalid appointment date.');
        return;
    }
    if (!validarDiaAbierto(fecha.value)) {
        mostrarError(fecha, "La veterinaria está cerrada ese día. Por favor elija otro día.");
        console.log('Closed day.');
        return;
    }
    if (!validarHora(fecha.value, hora.value, horarios, numMascotas.value)) {
        mostrarError(hora, "La hora del turno debe estar dentro del horario de atención y al menos una hora después de la hora actual.");
        console.log('Invalid appointment time.');
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
    <input type="text" id="mascota-edad-${i}" name="mascota-edad-${i}" required aria-label="Edad de la Mascota ${i + 1}">
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
    console.log('Pet forms shown.');
};
// Guardar mascotas y turnos
const guardarMascotasYTurnos = () => {
    console.log('Saving pets and appointments...');
    try {
        if (!cliente) {
            console.error('Cliente no está inicializado');
            return;
        }
        const numMascotas = parseInt(document.getElementById("numero-mascotas").value);
        const fecha = document.getElementById("turno-fecha").value;
        const hora = document.getElementById("turno-hora").value;
        let turnoHora = new Date(`${fecha}T${hora}`);
        console.log('Number of pets:', numMascotas);
        console.log('Appointment date:', fecha);
        console.log('Appointment time:', hora);
        console.log('Initial appointment time:', turnoHora);
        for (let i = 0; i < numMascotas; i++) {
            const mascotaNombre = document.getElementById(`mascota-nombre-${i}`).value;
            const mascotaEdad = parseInt(document.getElementById(`mascota-edad-${i}`).value);
            const servicioId = parseInt(document.getElementById(`servicio-${i}`).value);
            console.log(`Pet ${i + 1} name:`, mascotaNombre);
            console.log(`Pet ${i + 1} age:`, mascotaEdad);
            console.log(`Pet ${i + 1} service:`, servicioId);
            if (!validarNombre(mascotaNombre)) {
                mostrarError(document.getElementById(`mascota-nombre-${i}`), "El nombre de la mascota debe contener entre 2 y 25 letras del alfabeto latino.");
                console.log('Invalid pet name.');
                return;
            }
            if (!validarEdadMascota(mascotaEdad.toString())) {
                mostrarError(document.getElementById(`mascota-edad-${i}`), "La edad de la mascota debe ser un número entre 0 y 40 años.");
                console.log('Invalid pet age.');
                return;
            }
            const mascota = new MascotaClass(null, cliente.clienteId, mascotaNombre, mascotaEdad);
            mascotas.push(mascota);
            const turno = new TurnoClass(null, mascota.mascotaId, fecha, turnoHora.toTimeString().slice(0, 5), servicioId);
            turnos.push(turno);
            turnoHora.setMinutes(turnoHora.getMinutes() + 45);
            console.log(`Pet ${i + 1} saved:`, mascota);
            console.log(`Appointment ${i + 1} saved:`, turno);
        }
        gestionarLocalStorage("guardar", "mascotas", mascotas);
        gestionarLocalStorage("guardar", "turnos", turnos);
        actualizarDOM(cliente, mascotas, turnos, servicios);
        document.getElementById("seccion-salida-datos-dos").style.display = "block";
        document.getElementById("guardar-mascotas-turnos").style.display = "none"; // Ocultar el botón
        console.log('Pets and appointments saved.');
    }
    catch (error) {
        console.error('Error al guardar mascotas y turnos', error); // Elaborar en versiones futuras
    }
};
// Retrieve and populate stored data
const retrieveAndPopulateData = () => {
    console.log('Retrieving and populating data...');
    const storedData = getDataFromLocalStorage('appointmentData');
    if (storedData) {
        populateAppointmentData(storedData);
        console.log('Data populated:', storedData);
    }
    else {
        console.log('No data to populate.');
    }
};
// Aplicar tema
const aplicarTema = () => {
    console.log('Applying theme...');
    try {
        const temaAlmacenado = gestionarLocalStorage("cargar", "theme");
        if (temaAlmacenado) {
            document.body.dataset.theme = temaAlmacenado;
        }
        console.log('Theme applied:', temaAlmacenado);
    }
    catch (error) {
        console.error('Error al aplicar el tema', error); // Elaborar en versiones futuras 
    }
};
// Controlar botón guardar
const controlarBotonGuardar = () => {
    console.log('Controlling save button...');
    const guardarBtn = document.getElementById("guardar-mascotas-turnos");
    if (guardarBtn) {
        guardarBtn.style.display = 'none'; // Ocultar botón
    }
    console.log('Save button controlled.');
};
// Borrar todos los datos
const borrarTodosDatos = () => {
    console.log('Deleting all data...');
    try {
        gestionarLocalStorage("borrarTodo");
        cliente = null;
        mascotas = [];
        turnos = [];
        actualizarDOM(cliente, mascotas, turnos, servicios);
        document.getElementById("formulario-cliente").reset();
        document.getElementById("formulario-mascotas-info").style.display = "none";
        document.getElementById("mascotas-formulario").style.display = "none";
        document.getElementById("guardar-mascotas-turnos").style.display = "none";
        document.getElementById("borrar-datos").style.display = "none";
        document.getElementById("seccion-salida-datos-dos").style.display = "none";
        console.log('All data deleted.');
    }
    catch (error) {
        console.error('Error al borrar todos los datos', error); // Elaborar en versiones futuras
    }
};
// Comenzar de nuevo
const comenzarDeNuevo = () => {
    console.log('Starting over...');
    borrarTodosDatos();
    const guardarBtn = document.getElementById("guardar-mascotas-turnos");
    if (guardarBtn) {
        guardarBtn.style.display = "inline-block"; // Mostrar el botón
    }
    console.log('Started over.');
};
// Attach event listeners
const attachEventListeners = () => {
    console.log('Attaching event listeners...');
    document.getElementById('siguiente-mascota').addEventListener('click', mostrarFormulariosMascotas);
    document.getElementById('guardar-cliente').addEventListener('click', guardarCliente);
    document.body.addEventListener("click", (event) => {
        const target = event.target;
        if (target && target.id) {
            switch (target.id) {
                case "guardar-cliente":
                    guardarCliente();
                    break;
                case "siguiente-mascota":
                    mostrarFormulariosMascotas();
                    break;
                case "borrar-datos":
                    comenzarDeNuevo();
                    break;
                case "guardar-mascotas-turnos":
                    guardarMascotasYTurnos();
                    break;
            }
        }
    });
    console.log('Event listeners attached.');
};
// Initialize the app
const initializeApp = () => {
    console.log('Initializing app...');
    retrieveAndPopulateData();
    attachEventListeners();
    aplicarTema();
    controlarBotonGuardar();
    actualizarServiciosList(servicios);
    actualizarHorariosList(horarios);
    actualizarDOM(cliente, mascotas, turnos, servicios);
    console.log('App initialized.');
};
initializeApp();
