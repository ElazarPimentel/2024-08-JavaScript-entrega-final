/* Nombre del archivo: js/inicializacionApp.js
Autor: Alessio Aguirre Pimentel
Versión: 322 */

import { ClienteClass, MascotaClass, TurnoClass } from './modelos.js';
import { actualizarListaDeServicios, actualizarListaDeHorarios, actualizarDOM, poblarDatosDeCita } from './actualizacionesDOM.js';
import { aplicarTema as aplicarTemaGlobal } from './tema.js';
import { gestionarAlmacenamientoLocal, obtenerDatosDeAlmacenamientoLocal } from './almacenamientoLocal.js';
import { mostrarError as mostrarErrorGlobal } from './manejoErrores.js';

const DateTime = luxon.DateTime;

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

function datosDesactualizados(fechaString) {
    const fechaAlmacenada = DateTime.fromISO(fechaString);
    const fechaActual = DateTime.now();
    const diferencia = fechaActual.diff(fechaAlmacenada, 'days').days;
    return diferencia > 7;
}

function obtenerAnioActual() {
    return DateTime.now().year;
}

async function traerFeriados(anio) {
    const url = `https://api.argentinadatos.com/v1/feriados/${anio}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('No se pudieron obtener los feriados');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        mostrarErrorGlobal('No se pudieron obtener los feriados. Por favor verificá no sacar un turno en un feriado dado que estamos cerrados');
        return null;
    }
}

async function inicializarDatosFeriados() {
    const feriadosAlmacenados = localStorage.getItem('feriadosArgentina');
    if (feriadosAlmacenados) {
        const { dateFetched, holidays } = JSON.parse(feriadosAlmacenados);
        if (!datosDesactualizados(dateFetched)) {
            console.log('Feriados almacenados:', holidays);
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
        console.log('Feriados actualizados:', feriados);
    }
}

export const inicializarApp = async () => {
    await inicializarDatosFeriados();
    recuperarYPoblarDatos();
    aplicarTema();
    controlarBotonGuardar();
    actualizarListaDeServicios(servicios);
    actualizarListaDeHorarios(horarios);
    actualizarDOM(cliente, mascotas, turnos, servicios, horarios);
};

const recuperarYPoblarDatos = () => {
    const storedData = obtenerDatosDeAlmacenamientoLocal('appointmentData');
    if (storedData) {
        poblarDatosDeCita(storedData);
        cliente = gestionarAlmacenamientoLocal("cargar", "cliente") || null;
        mascotas = gestionarAlmacenamientoLocal("cargar", "mascotas") || [];
        turnos = gestionarAlmacenamientoLocal("cargar", "turnos") || [];
        actualizarDOM(cliente, mascotas, turnos, servicios, horarios);
    }
};

const aplicarTema = () => {
    try {
        const temaAlmacenado = gestionarAlmacenamientoLocal("cargar", "theme");
        if (temaAlmacenado) {
            document.body.dataset.theme = temaAlmacenado;
            document.getElementById('checkbox').checked = temaAlmacenado === 'dark';
        }
    } catch (error) {
        mostrarErrorGlobal('Error al aplicar el tema');
    }
};

const controlarBotonGuardar = () => {
    const guardarBtn = document.getElementById("guardar-mascotas-turnos");
    if (guardarBtn) {
        guardarBtn.style.display = 'none';
    }
};

