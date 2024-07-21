/* Nombre del archivo: js/inicializacionApp.js
Autor: Alessio Aguirre Pimentel
Versión: 350 */

import { actualizarListaDeServicios, actualizarListaDeHorarios, actualizarDOM, poblarDatosDeCita } from './actualizacionesDOM.js';
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
        if (anio === obtenerAnioActual()) {
            mostrarErrorGlobal('No se pudieron obtener los feriados del año actual.');
        }
        console.log(`Failed to fetch holidays for the year ${anio}`);
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
    const feriadosAnioActual = await traerFeriados(anioActual);

    if (!feriadosAnioActual) {
        return null;
    }

    let feriadosAnioSiguiente = [];
    try {
        feriadosAnioSiguiente = await traerFeriados(anioActual + 1);
    } catch (error) {
        console.warn('No se pudieron obtener los feriados del próximo año aún. Intenta nuevamente más tarde.');
    }

    const feriados = [...feriadosAnioActual, ...(feriadosAnioSiguiente || [])];
    if (feriados.length) {
        const datosParaAlmacenar = {
            dateFetched: DateTime.now().toISO(),
            holidays: feriados
        };
        localStorage.setItem('feriadosArgentina', JSON.stringify(datosParaAlmacenar));
        console.log('Feriados actualizados:', feriados);
    } else {
        console.warn('No se pudieron obtener los feriados del próximo año.');
    }
}

export async function obtenerHoraActualArgentina() {
    const url = 'http://worldtimeapi.org/api/timezone/America/Argentina/Buenos_Aires';
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('No se pudo obtener la hora actual');
        }
        const data = await response.json();
        return DateTime.fromISO(data.datetime);
    } catch (error) {
        mostrarErrorGlobal('No se pudo obtener la hora actual. Usando la hora local de la PC.');
        return DateTime.now().setZone('America/Argentina/Buenos_Aires');
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
    const storedData = {
        cliente: gestionarAlmacenamientoLocal("cargar", "cliente"),
        mascotas: gestionarAlmacenamientoLocal("cargar", "mascotas"),
        turnos: gestionarAlmacenamientoLocal("cargar", "turnos")
    };
    if (storedData.cliente && storedData.mascotas.length && storedData.turnos.length) {
        cliente = storedData.cliente;
        mascotas = storedData.mascotas;
        turnos = storedData.turnos;
        actualizarDOM(cliente, mascotas, turnos, servicios, horarios);
        document.getElementById("formulario-mascotas-info").style.display = "block";
        document.getElementById("seccion-salida-datos-dos").style.display = "block";
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
