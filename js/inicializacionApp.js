/* Nombre del archivo: js/inicializacionApp.js
Autor: Alessio Aguirre Pimentel
Versión: 55 */

// Import statements and constants...
import { actualizarListaDeServicios, actualizarListaDeHorarios, actualizarDOM, mostrarFeriadosProximos } from './actualizacionesDom.js';
import { gestionarAlmacenamientoLocal } from './almacenamientoLocal.js';
import { mostrarError as mostrarErrorGlobal } from './manejoErrores.js';
import { mostrarFormulariosMascotas } from './gestionFormularios.js'; // Correct import
import { servicios, horarios, apiUrls, errorMessages } from './constantes.js';

// eslint-disable-next-line no-undef
const { DateTime } = luxon;

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
    const url = apiUrls.feriados(anio);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(errorMessages.noObtenerFeriados);
        }
        const data = await response.json();
        return data;
    } catch {
        return null;
    }
}

async function inicializarDatosFeriados() {
    const feriadosAlmacenados = localStorage.getItem('feriadosArgentina');
    if (feriadosAlmacenados) {
        const { dateFetched, holidays } = JSON.parse(feriadosAlmacenados);
        if (!datosDesactualizados(dateFetched)) {
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
        console.warn(errorMessages.noObtenerFeriados);
    }

    const feriados = [...feriadosAnioActual, ...(feriadosAnioSiguiente || [])];
    if (feriados.length) {
        const datosParaAlmacenar = {
            dateFetched: DateTime.now().toISO(),
            holidays: feriados
        };
        localStorage.setItem('feriadosArgentina', JSON.stringify(datosParaAlmacenar));
        return feriados;
    } else {
        return null;
    }
}

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
        mostrarErrorGlobal(errorMessages.noObtenerHoraActual);
        return DateTime.now().setZone('America/Argentina/Buenos_Aires');
    }
}

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
        const numeroMascotas = document.getElementById("numero-mascotas");
        const siguienteMascota = document.getElementById("siguiente-mascota");
        const borrarDatos = document.getElementById("borrar-datos");
        const guardarMascotasTurnos = document.getElementById("guardar-mascotas-turnos");

        if (numeroMascotas) numeroMascotas.style.display = "none";
        if (siguienteMascota) siguienteMascota.style.display = "none";
        if (borrarDatos) borrarDatos.style.display = "block";
        if (guardarMascotasTurnos) guardarMascotasTurnos.style.display = "none";

        mostrarFormulariosMascotas();
    }
};

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

        const formularioMascotasInfo = document.getElementById("formulario-mascotas-info");
        const seccionSalidaDatosDos = document.getElementById("seccion-salida-datos-dos");
        const mascotasFormulario = document.getElementById('mascotas-formulario');
        const botonesGardarBorrar = document.getElementById('botones-gardar-borrar');
        const borrarDatos = document.getElementById('borrar-datos');
        const recibirCorreo = document.getElementById('recibir-correo');

        if (formularioMascotasInfo) formularioMascotasInfo.style.display = "block";
        if (seccionSalidaDatosDos) seccionSalidaDatosDos.style.display = "block";
        if (mascotasFormulario) mascotasFormulario.style.display = 'block';
        if (botonesGardarBorrar) botonesGardarBorrar.style.display = 'flex';

        if (borrarDatos) borrarDatos.style.display = 'block';

        if (cliente.clienteEmail && recibirCorreo) {
            recibirCorreo.style.display = 'inline-block';
        }

        mostrarFormulariosMascotas();
    }
};

const aplicarTema = () => {
    try {
        const temaAlmacenado = gestionarAlmacenamientoLocal("cargar", "theme");
        const checkbox = document.getElementById('checkbox');
        if (temaAlmacenado) {
            document.body.dataset.theme = temaAlmacenado;
            if (checkbox) checkbox.checked = temaAlmacenado === 'dark';
        }
    } catch {
        mostrarErrorGlobal(errorMessages.errorAplicarTema);
    }
};

const controlarBotonGuardar = () => {
    const guardarBtn = document.getElementById("guardar-mascotas-turnos");
    if (guardarBtn) {
        guardarBtn.style.display = 'none';
    }
};

const resaltarFeriadosEnCalendario = (feriados) => {
    const inputFecha = document.getElementById('turno-fecha');
    const fechasFeriados = feriados.map(feriado => feriado.fecha);

    if (inputFecha) {
        inputFecha.addEventListener('input', (event) => {
            const fechaSeleccionada = event.target.value;
            if (fechasFeriados.includes(fechaSeleccionada)) {
                inputFecha.style.borderColor = 'tomato';
            } else {
                inputFecha.style.borderColor = '';
            }
        });
    }
};

// Export mascotas y turnos
export { mascotas, turnos };
