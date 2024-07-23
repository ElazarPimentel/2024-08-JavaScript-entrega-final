/* eslint-disable no-undef */
/* Nombre del archivo: js/inicializacionApp.js
Autor: Alessio Aguirre Pimentel
Versión: 42 */

import { actualizarListaDeServicios, actualizarListaDeHorarios, actualizarDOM, mostrarFeriadosProximos } from './actualizacionesDom.js';
import { gestionarAlmacenamientoLocal } from './almacenamientoLocal.js';
import { mostrarError as mostrarErrorGlobal } from './manejoErrores.js';
import { servicios, horarios, apiUrls, errorMessages } from './constantes.js';

const { DateTime } = luxon;

let cliente = gestionarAlmacenamientoLocal("cargar", "cliente") || null;
let mascotas = gestionarAlmacenamientoLocal("cargar", "mascotas") || [];
let turnos = gestionarAlmacenamientoLocal("cargar", "turnos") || [];

// Función para verificar si los datos están desactualizados
function datosDesactualizados(fechaString) {
    const fechaAlmacenada = DateTime.fromISO(fechaString);
    const fechaActual = DateTime.now();
    const diferencia = fechaActual.diff(fechaAlmacenada, 'days').days;
    return diferencia > 7;
}

// Función para obtener el año actual
function obtenerAnioActual() {
    return DateTime.now().year;
}

// Función para traer feriados desde la API
async function traerFeriados(anio) {
    const url = apiUrls.feriados(anio);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(errorMessages.noObtenerFeriados);
        }
        const data = await response.json();
        return data;
    } catch {
        if (anio === obtenerAnioActual()) {
            mostrarErrorGlobal(errorMessages.noObtenerFeriadosAnioActual);
        }
        console.log(`Failed to fetch holidays for the year ${anio}`);
        return null;
    }
}

// Función para inicializar datos de feriados
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
    } catch {
        console.warn(errorMessages.noObtenerFeriadosAnioSiguiente);
    }

    const feriados = [...feriadosAnioActual, ...(feriadosAnioSiguiente || [])];
    if (feriados.length) {
        const datosParaAlmacenar = {
            dateFetched: DateTime.now().toISO(),
            holidays: feriados
        };
        localStorage.setItem('feriadosArgentina', JSON.stringify(datosParaAlmacenar));
        console.log('Feriados actualizados:', feriados);
        return feriados;
    } else {
        console.warn(errorMessages.noObtenerFeriadosAnioSiguiente);
        return null;
    }
}

// Función para obtener la hora actual de Argentina
export async function obtenerHoraActualArgentina() {
    const url = 'http://worldtimeapi.org/api/timezone/America/Argentina/Buenos_Aires';
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(errorMessages.noObtenerHoraActual);
        }
        const data = await response.json();
        return DateTime.fromISO(data.datetime);
    } catch {
        mostrarErrorGlobal(errorMessages.noObtenerHoraActualUsarHoraPC);
        return DateTime.now().setZone('America/Argentina/Buenos_Aires');
    }
}

// Función principal para inicializar la aplicación
export const inicializarApp = async () => {
    const feriados = await inicializarDatosFeriados();
    recuperarYPoblarDatos();
    aplicarTema();
    controlarBotonGuardar();
    actualizarListaDeServicios(servicios);
    actualizarListaDeHorarios(horarios);
    actualizarDOM(cliente, mascotas, turnos, servicios, horarios);

    if (feriados) {
        mostrarFeriadosProximos(feriados);
        resaltarFeriadosEnCalendario(feriados);
    }

    if (cliente || (mascotas && mascotas.length > 0) || (turnos && turnos.length > 0)) {
        document.getElementById("numero-mascotas").style.display = "none";
        document.getElementById("siguiente-mascota").style.display = "none";
        document.getElementById("borrar-datos").style.display = "block";
        document.getElementById("guardar-mascotas-turnos").style.display = "none";
    }
};

// Función para recuperar y poblar datos guardados
const recuperarYPoblarDatos = () => {
    const storedData = {
        cliente: gestionarAlmacenamientoLocal("cargar", "cliente"),
        mascotas: gestionarAlmacenamientoLocal("cargar", "mascotas"),
        turnos: gestionarAlmacenamientoLocal("cargar", "turnos")
    };
    if (storedData.cliente && storedData.mascotas && storedData.turnos) {
        cliente = storedData.cliente;
        mascotas = storedData.mascotas;
        turnos = storedData.turnos;
        actualizarDOM(cliente, mascotas, turnos, servicios, horarios);
        document.getElementById("formulario-mascotas-info").style.display = "block";
        document.getElementById("seccion-salida-datos-dos").style.display = "block";
    }
};

// Función para aplicar el tema
const aplicarTema = () => {
    try {
        const temaAlmacenado = gestionarAlmacenamientoLocal("cargar", "theme");
        if (temaAlmacenado) {
            document.body.dataset.theme = temaAlmacenado;
            document.getElementById('checkbox').checked = temaAlmacenado === 'dark';
        }
    } catch {
        mostrarErrorGlobal(errorMessages.errorAplicarTema);
    }
};

// Función para controlar el botón de guardar
const controlarBotonGuardar = () => {
    const guardarBtn = document.getElementById("guardar-mascotas-turnos");
    if (guardarBtn) {
        guardarBtn.style.display = 'none';
    }
};

// Función para mostrar los próximos feriados
const resaltarFeriadosEnCalendario = (feriados) => {
    const inputFecha = document.getElementById('turno-fecha');
    const fechasFeriados = feriados.map(feriado => feriado.fecha);

    inputFecha.addEventListener('input', (event) => {
        const fechaSeleccionada = event.target.value;
        if (fechasFeriados.includes(fechaSeleccionada)) {
            inputFecha.style.borderColor = 'tomato';
        } else {
            inputFecha.style.borderColor = '';
        }
    });
};
