/* Nombre del archivo: ts/inicializacionApp.ts
Autor: Alessio Aguirre Pimentel
Versión: 200
Descripción: Lógica de inicialización de la aplicación, incluyendo la obtención de datos de feriados. */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const DateTime = luxon.DateTime; // Use the global luxon object
import { gestionarAlmacenamientoLocal, obtenerDatosDeAlmacenamientoLocal } from './almacenamientoLocal.js';
import { mostrarError, limpiarError, validarNombre, validarTelefono, validarNumeroMascotas, validarFecha, validarDiaAbierto, validarHora, validarEdadMascota } from './validaciones.js';
import { actualizarListaDeServicios, actualizarListaDeHorarios, actualizarDOM, poblarDatosDeCita, guardarDatosDeCita } from './actualizacionesDOM.js';
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
// Clase para manejar los datos del cliente
class ClienteClass {
    constructor(clienteId, clienteNombre, clienteTelefono) {
        this.clienteId = clienteId || ClienteClass.generarId('cliente');
        this.clienteNombre = clienteNombre;
        this.clienteTelefono = clienteTelefono;
    }
    static generarId(prefix) {
        return `${prefix}_` + Math.random().toString(36).slice(2, 11);
    }
}
// Clase para manejar los datos de la mascota
class MascotaClass {
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
// Clase para manejar los datos del turno
class TurnoClass {
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
// Función para obtener los feriados de Argentina
function fetchHolidays(year) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://api.argentinadatos.com/v1/feriados/${year}`;
        try {
            const response = yield fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = yield response.json();
            return data;
        }
        catch (error) {
            mostrarError(document.body, 'No se pudieron obtener los feriados. Por favor verificá no sacar un turno en un feriado dado que estamos cerrados');
            return null;
        }
    });
}
// Función para verificar si los datos almacenados están desactualizados
function isDataOutdated(dateString) {
    const storedDate = DateTime.fromISO(dateString);
    const currentDate = DateTime.now();
    const diff = currentDate.diff(storedDate, 'days').days;
    return diff > 7;
}
// Función para obtener el año actual
function getCurrentYear() {
    return DateTime.now().year;
}
// Inicializar datos de feriados
function initializeHolidayData() {
    return __awaiter(this, void 0, void 0, function* () {
        const storedHolidays = localStorage.getItem('feriadosArgentina');
        if (storedHolidays) {
            const { dateFetched, holidays } = JSON.parse(storedHolidays);
            if (!isDataOutdated(dateFetched)) {
                return holidays;
            }
        }
        const currentYear = getCurrentYear();
        const holidays = yield fetchHolidays(currentYear);
        if (holidays) {
            const dataToStore = {
                dateFetched: DateTime.now().toISO(),
                holidays
            };
            localStorage.setItem('feriadosArgentina', JSON.stringify(dataToStore));
        }
    });
}
// Guardar cliente
export const guardarCliente = () => {
    const nombre = document.getElementById("cliente-nombre");
    const telefono = document.getElementById("cliente-telefono");
    limpiarError(nombre);
    limpiarError(telefono);
    if (!validarNombre(nombre.value)) {
        mostrarError(nombre, "El nombre debe contener entre 2 y 25 letras del alfabeto latino.");
        return;
    }
    if (!validarTelefono(telefono.value)) {
        mostrarError(telefono, "El teléfono debe contener solo números, signos +, -, (, ), y espacios, con un máximo de 20 caracteres.");
        return;
    }
    cliente = new ClienteClass(null, nombre.value, telefono.value);
    gestionarAlmacenamientoLocal("guardar", "cliente", cliente);
    document.getElementById("formulario-mascotas-info").style.display = "block";
};
// Mostrar formularios para mascotas
export const mostrarFormulariosMascotas = () => {
    const numMascotas = document.getElementById("numero-mascotas");
    const fecha = document.getElementById("turno-fecha");
    const hora = document.getElementById("turno-hora");
    limpiarError(numMascotas);
    limpiarError(fecha);
    limpiarError(hora);
    if (!validarNumeroMascotas(numMascotas.value)) {
        mostrarError(numMascotas, "El número de mascotas debe estar entre 1 y 3. Si tiene más de tres mascotas, por favor haga otro turno para las otras mascotas.");
        return;
    }
    if (!validarFecha(fecha.value)) {
        mostrarError(fecha, "La fecha del turno debe ser un día que la veterinaria esté abierta y dentro de los próximos 45 días.");
        return;
    }
    if (!validarDiaAbierto(fecha.value)) {
        mostrarError(fecha, "La veterinaria está cerrada ese día. Por favor elija otro día.");
        return;
    }
    if (!validarHora(fecha.value, hora.value, horarios, numMascotas.value)) {
        mostrarError(hora, "La hora del turno debe estar dentro del horario de atención y al menos una hora después de la hora actual.");
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
// Guardar mascotas y turnos
export const guardarMascotasYTurnos = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!cliente) {
            console.error('Cliente no está inicializado');
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
                mostrarError(document.getElementById(`mascota-nombre-${i}`), "El nombre de la mascota debe contener entre 2 y 25 letras del alfabeto latino.");
                return;
            }
            if (!validarEdadMascota(mascotaEdad.toString())) {
                mostrarError(document.getElementById(`mascota-edad-${i}`), "La edad de la mascota debe ser un número entre 0 y 40 años.");
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
        guardarDatosDeCita(cliente, mascotas, turnos);
        actualizarDOM(cliente, mascotas, turnos, servicios);
        document.getElementById("seccion-salida-datos-dos").style.display = "block";
        document.getElementById("guardar-mascotas-turnos").style.display = "none"; // Ocultar el botón
    }
    catch (error) {
        console.error('Error al guardar mascotas y turnos', error); // Elaborar en versiones futuras
    }
});
// Recuperar y poblar datos almacenados
const recuperarYPoblarDatos = () => {
    const storedData = obtenerDatosDeAlmacenamientoLocal('appointmentData');
    if (storedData) {
        poblarDatosDeCita(storedData);
        cliente = gestionarAlmacenamientoLocal("cargar", "cliente") || null;
        mascotas = gestionarAlmacenamientoLocal("cargar", "mascotas") || [];
        turnos = gestionarAlmacenamientoLocal("cargar", "turnos") || [];
        actualizarDOM(cliente, mascotas, turnos, servicios);
    }
};
// Aplicar tema
export const aplicarTema = () => {
    try {
        const temaAlmacenado = gestionarAlmacenamientoLocal("cargar", "theme");
        if (temaAlmacenado) {
            document.body.dataset.theme = temaAlmacenado;
            document.getElementById('checkbox').checked = temaAlmacenado === 'dark';
        }
    }
    catch (error) {
        console.error('Error al aplicar el tema', error); // Elaborar en versiones futuras 
    }
};
// Controlar botón guardar
const controlarBotonGuardar = () => {
    const guardarBtn = document.getElementById("guardar-mascotas-turnos");
    if (guardarBtn) {
        guardarBtn.style.display = 'none'; // Ocultar botón
    }
};
// Borrar todos los datos
export const borrarTodosDatos = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        gestionarAlmacenamientoLocal("borrarTodo");
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
    }
    catch (error) {
        console.error('Error al borrar todos los datos', error); // Elaborar en versiones futuras
    }
});
// Comenzar de nuevo
export const comenzarDeNuevo = () => __awaiter(void 0, void 0, void 0, function* () {
    borrarTodosDatos();
    const guardarBtn = document.getElementById("guardar-mascotas-turnos");
    if (guardarBtn) {
        guardarBtn.style.display = "inline-block"; // Mostrar el botón
    }
});
// Inicializar la aplicación
export const inicializarApp = () => __awaiter(void 0, void 0, void 0, function* () {
    yield initializeHolidayData();
    recuperarYPoblarDatos();
    aplicarTema();
    controlarBotonGuardar();
    actualizarListaDeServicios(servicios);
    actualizarListaDeHorarios(horarios);
    actualizarDOM(cliente, mascotas, turnos, servicios);
});
