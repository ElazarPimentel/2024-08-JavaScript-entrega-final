/* Nombre del archivo: ts/inicializacionApp.ts
Autor: Alessio Aguirre Pimentel
Versión: 200
Descripción: Lógica de inicialización de la aplicación, incluyendo la obtención de datos de feriados. */

// luxon variable global
declare const luxon: any;

const DateTime = luxon.DateTime; // Usar el objeto global luxon

import { gestionarAlmacenamientoLocal, obtenerDatosDeAlmacenamientoLocal } from './almacenamientoLocal.js';
import { mostrarError, limpiarError, validarNombre, validarTelefono, validarNumeroMascotas, validarFecha, validarDiaAbierto, validarHora, validarEdadMascota } from './validaciones.js';
import { actualizarListaDeServicios, actualizarListaDeHorarios, actualizarDOM, poblarDatosDeCita, guardarDatosDeCita } from './actualizacionesDOM.js';

// Interfaces para los datos de la aplicación
interface Servicio {
    [key: number]: string;
}

interface Horario {
    [day: string]: string;
}

interface Cliente {
    clienteId: string;
    clienteNombre: string;
    clienteTelefono: string;
}

interface Mascota {
    mascotaId: string;
    mascotaForeignClienteId: string;
    mascotaNombre: string;
    mascotaEdad: number;
}

interface Turno {
    turnoId: string;
    turnoForeignMascotaId: string;
    turnoFecha: string;
    turnoHora: string;
    turnoForeignServicioId: number;
}

const servicios: Servicio = {
    1: "Bañado y Peinado",
    2: "Vacunación",
    3: "Chequeo General",
    4: "Quitar pulgas"
};

const horarios: Horario = {
    Lunes: "9:00 - 17:00",
    Martes: "9:00 - 17:00",
    Miércoles: "9:00 - 17:00",
    Jueves: "9:00 - 17:00",
    Viernes: "9:00 - 17:00",
    Sábado: "Cerrado",
    Domingo: "Cerrado"
};

let cliente: Cliente | null = gestionarAlmacenamientoLocal("cargar", "cliente") || null;
let mascotas: Mascota[] = gestionarAlmacenamientoLocal("cargar", "mascotas") || [];
let turnos: Turno[] = gestionarAlmacenamientoLocal("cargar", "turnos") || [];

// Clase para manejar los datos del cliente
class ClienteClass implements Cliente {
    clienteId: string;
    clienteNombre: string;
    clienteTelefono: string;

    constructor(clienteId: string | null, clienteNombre: string, clienteTelefono: string) {
        this.clienteId = clienteId || ClienteClass.generarId('cliente');
        this.clienteNombre = clienteNombre;
        this.clienteTelefono = clienteTelefono;
    }

    static generarId(prefijo: string): string {
        return `${prefijo}_` + Math.random().toString(36).slice(2, 11);
    }
}

// Clase para manejar los datos de la mascota
class MascotaClass implements Mascota {
    mascotaId: string;
    mascotaForeignClienteId: string;
    mascotaNombre: string;
    mascotaEdad: number;

    constructor(mascotaId: string | null, mascotaForeignClienteId: string, mascotaNombre: string, mascotaEdad: number) {
        this.mascotaId = mascotaId || MascotaClass.generarId('mascota');
        this.mascotaForeignClienteId = mascotaForeignClienteId;
        this.mascotaNombre = mascotaNombre;
        this.mascotaEdad = mascotaEdad;
    }

    static generarId(prefijo: string): string {
        return `${prefijo}_` + Math.random().toString(36).slice(2, 11);
    }
}

// Clase para manejar los datos del turno
class TurnoClass implements Turno {
    turnoId: string;
    turnoForeignMascotaId: string;
    turnoFecha: string;
    turnoHora: string;
    turnoForeignServicioId: number;

    constructor(turnoId: string | null, turnoForeignMascotaId: string, turnoFecha: string, turnoHora: string, turnoForeignServicioId: number) {
        this.turnoId = turnoId || TurnoClass.generarId('turno');
        this.turnoForeignMascotaId = turnoForeignMascotaId;
        this.turnoFecha = turnoFecha;
        this.turnoHora = turnoHora;
        this.turnoForeignServicioId = turnoForeignServicioId;
    }

    static generarId(prefijo: string): string {
        return `${prefijo}_` + Math.random().toString(36).slice(2, 11);
    }
}

// Función para obtener los feriados de Argentina
async function traerFeriados(anio: number): Promise<any> {
    const url = `https://api.argentinadatos.com/v1/feriados/${anio}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('No se pudieron obtener los feriados');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        mostrarError(document.body, 'No se pudieron obtener los feriados. Por favor verificá no sacar un turno en un feriado dado que estamos cerrados');
        return null;
    }
}

// Función para verificar si los datos almacenados están desactualizados
function datosDesactualizados(fechaString: string): boolean {
    const fechaAlmacenada = DateTime.fromISO(fechaString);
    const fechaActual = DateTime.now();
    const diferencia = fechaActual.diff(fechaAlmacenada, 'days').days;
    return diferencia > 7;
}

// Función para obtener el año actual
function obtenerAnioActual(): number {
    return DateTime.now().year;
}

// Inicializar datos de feriados
async function inicializarDatosFeriados(): Promise<void> {
    const feriadosAlmacenados = localStorage.getItem('feriadosArgentina');
    if (feriadosAlmacenados) {
        const { dateFetched, holidays } = JSON.parse(feriadosAlmacenados);
        if (!datosDesactualizados(dateFetched)) {
            console.log('Feriados almacenados:', holidays); // Mostrar feriados almacenados en la consola
            return holidays;
        }
    }
    const anioActual = obtenerAnioActual();
    const feriados = await traerFeriados(anioActual);
    if (feriados) {
        const datosParaAlmacenar = {
            dateFetched: DateTime.now().toISO(),
            holidays: feriados
        };
        localStorage.setItem('feriadosArgentina', JSON.stringify(datosParaAlmacenar));
        console.log('Feriados actualizados:', feriados); // Mostrar feriados actualizados en la consola
    }
}

// Guardar cliente
export const guardarCliente = () => {
    const nombre = document.getElementById("cliente-nombre") as HTMLInputElement;
    const telefono = document.getElementById("cliente-telefono") as HTMLInputElement;

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
    document.getElementById("formulario-mascotas-info")!.style.display = "block";
};

// Mostrar formularios para mascotas
export const mostrarFormulariosMascotas = () => {
    const numMascotas = document.getElementById("numero-mascotas") as HTMLInputElement;
    const fecha = document.getElementById("turno-fecha") as HTMLInputElement;
    const hora = document.getElementById("turno-hora") as HTMLInputElement;

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

    const mascotasForm = document.getElementById("mascotas-formulario")!;
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
${Object.entries(servicios).map(([id, nombre]: [string, string]) => `<option value="${id}">${nombre}</option>`).join('')}
</select>
</fieldset>
`;
        mascotasForm.appendChild(petForm);
    }

    mascotasForm.style.display = "block";
    document.getElementById("guardar-mascotas-turnos")!.style.display = "inline-block";
    document.getElementById("borrar-datos")!.style.display = "inline-block";
};

// Guardar mascotas y turnos
export const guardarMascotasYTurnos = async () => {
    try {
        if (!cliente) {
            console.error('Cliente no está inicializado');
            return;
        }

        const numMascotas = parseInt((document.getElementById("numero-mascotas") as HTMLInputElement).value);
        const fecha = (document.getElementById("turno-fecha") as HTMLInputElement).value;
        const hora = (document.getElementById("turno-hora") as HTMLInputElement).value;
        let turnoHora = new Date(`${fecha}T${hora}`);

        for (let i = 0; i < numMascotas; i++) {
            const mascotaNombre = (document.getElementById(`mascota-nombre-${i}`) as HTMLInputElement).value;
            const mascotaEdad = parseInt((document.getElementById(`mascota-edad-${i}`) as HTMLInputElement).value);
            const servicioId = parseInt((document.getElementById(`servicio-${i}`) as HTMLSelectElement).value);

            if (!validarNombre(mascotaNombre)) {
                mostrarError(document.getElementById(`mascota-nombre-${i}`)!, "El nombre de la mascota debe contener entre 2 y 25 letras del alfabeto latino.");
                return;
            }

            if (!validarEdadMascota(mascotaEdad.toString())) {
                mostrarError(document.getElementById(`mascota-edad-${i}`)!, "La edad de la mascota debe ser un número entre 0 y 40 años.");
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
        document.getElementById("seccion-salida-datos-dos")!.style.display = "block";
        document.getElementById("guardar-mascotas-turnos")!.style.display = "none"; // Ocultar el botón
    } catch (error) {
        console.error('Error al guardar mascotas y turnos', error); // Elaborar en versiones futuras
    }
};

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
        const temaAlmacenado = gestionarAlmacenamientoLocal("cargar", "theme") as string | null;
        if (temaAlmacenado) {
            document.body.dataset.theme = temaAlmacenado;
            (document.getElementById('checkbox') as HTMLInputElement).checked = temaAlmacenado === 'dark';
        }
    } catch (error) {
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
export const borrarTodosDatos = async () => {
    try {
        gestionarAlmacenamientoLocal("borrarTodo");
        cliente = null;
        mascotas = [];
        turnos = [];
        actualizarDOM(cliente, mascotas, turnos, servicios);
        (document.getElementById("formulario-cliente") as HTMLFormElement).reset();
        document.getElementById("formulario-mascotas-info")!.style.display = "none";
        document.getElementById("mascotas-formulario")!.style.display = "none";
        document.getElementById("guardar-mascotas-turnos")!.style.display = "none";
        document.getElementById("borrar-datos")!.style.display = "none";
        document.getElementById("seccion-salida-datos-dos")!.style.display = "none";
    } catch (error) {
        console.error('Error al borrar todos los datos', error); // Elaborar en versiones futuras
    }
};

// Comenzar de nuevo
export const comenzarDeNuevo = async () => {
    borrarTodosDatos();
    const guardarBtn = document.getElementById("guardar-mascotas-turnos");
    if (guardarBtn) {
        guardarBtn.style.display = "inline-block"; // Mostrar el botón
    }
};

// Inicializar la aplicación
export const inicializarApp = async () => {
    await inicializarDatosFeriados();
    recuperarYPoblarDatos();
    aplicarTema();
    controlarBotonGuardar();
    actualizarListaDeServicios(servicios);
    actualizarListaDeHorarios(horarios);
    actualizarDOM(cliente, mascotas, turnos, servicios);
};
