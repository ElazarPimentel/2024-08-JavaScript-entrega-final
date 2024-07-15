/* Nombre del archivo: ts/actualizacionesDOM.ts
Autor: Alessio Aguirre Pimentel
Versión: 201
Descripción: Funciones para actualizar el DOM con los datos de la aplicación. */

import { gestionarAlmacenamientoLocal } from './almacenamientoLocal.js';
import { mostrarError as mostrarErrorGlobal } from './manejoErrores.js';

interface Servicio {
    [id: number]: string;
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

// Actualiza la lista de servicios en el DOM
export const actualizarListaDeServicios = (servicios: Servicio): void => {
    try {
        const serviciosList = document.getElementById("servicios-listado");
        if (!serviciosList) {
            throw new Error("El elemento servicios-listado no se encuentra en el DOM.");
        }
        serviciosList.innerHTML = '';
        Object.entries(servicios).forEach(([id, nombre]: [string, string]) => {
            const li = document.createElement("li");
            li.textContent = `${id}. ${nombre}`;
            serviciosList.appendChild(li);
        });
    } catch (error) {
        mostrarErrorGlobal('Error al actualizar la lista de servicios');
    }
};

// Actualiza la lista de horarios en el DOM
export const actualizarListaDeHorarios = (horarios: Horario): void => {
    try {
        const horariosList = document.getElementById("horarios-listado");
        if (!horariosList) {
            throw new Error("El elemento horarios-listado no se encuentra en el DOM.");
        }
        horariosList.innerHTML = '';
        Object.entries(horarios).forEach(([dia, horas]: [string, string]) => {
            const li = document.createElement("li");
            li.innerHTML = `<strong>${dia}</strong>: ${horas}`;
            horariosList.appendChild(li);
        });
    } catch (error) {
        mostrarErrorGlobal('Error al actualizar la lista de horarios');
    }
};

// Actualiza el DOM con los detalles del cliente, mascotas y turnos
export const actualizarDOM = (cliente: Cliente | null, mascotas: Mascota[], turnos: Turno[], servicios: Servicio): void => {
    try {
        const clienteDetalles = document.getElementById('cliente-detalles');
        const mascotaDetalles = document.getElementById('mascota-detalles');
        const guardarClienteBtn = document.getElementById("guardar-cliente") as HTMLButtonElement;
        const siguienteMascotaBtn = document.getElementById("siguiente-mascota") as HTMLButtonElement;
        const guardarMascotasTurnosBtn = document.getElementById("guardar-mascotas-turnos") as HTMLButtonElement;
        const borrarDatosBtn = document.getElementById("borrar-datos") as HTMLButtonElement;

        if (!clienteDetalles || !mascotaDetalles) {
            throw new Error("Elementos requeridos faltantes en el DOM.");
        }

        clienteDetalles.innerHTML = '';
        mascotaDetalles.innerHTML = '';

        if (cliente) {
            clienteDetalles.innerHTML = `<h2>Cliente: ${cliente.clienteNombre}</h2><p><strong>Teléfono</strong>: ${cliente.clienteTelefono}</p>`;
        }

        let fechaPrimeraVezTexto = ""; // Para que ponga la fecha una sola vez
        turnos.forEach((turno, index) => {
            const mascota = mascotas.find(m => m.mascotaId === turno.turnoForeignMascotaId);
            if (!mascota) {
                throw new Error("Mascota no encontrada para el turno.");
            }
            const servicio = servicios[turno.turnoForeignServicioId];
            const turnoInfo = document.createElement('div');

            if (index === 0) { // Si es la primera vez, pone la fecha
                fechaPrimeraVezTexto = `<p><strong>Fecha</strong>: ${turno.turnoFecha}</p>`;
            }

            turnoInfo.innerHTML = `${index === 0 ? fechaPrimeraVezTexto : ""}<p><strong>Hora</strong>: ${turno.turnoHora} <strong>Mascota</strong>: ${mascota.mascotaNombre} (${mascota.mascotaEdad} año/s) <strong>Servicio</strong>: ${servicio}</p>`;
            mascotaDetalles.appendChild(turnoInfo);
        });

        // Mostrar u ocultar los botones según corresponda
        if (cliente || turnos.length > 0) {
            guardarClienteBtn.style.display = "none";
            siguienteMascotaBtn.style.display = "none";
            guardarMascotasTurnosBtn.style.display = "none";
            borrarDatosBtn.style.display = "inline-block";
        } else {
            guardarClienteBtn.style.display = "inline-block";
            siguienteMascotaBtn.style.display = "inline-block";
            guardarMascotasTurnosBtn.style.display = "inline-block";
            borrarDatosBtn.style.display = "none";
        }
    } catch (error) {
        mostrarErrorGlobal('Error al actualizar el DOM');
    }
};

// Poblamos los datos de la cita desde el almacenamiento local
export function poblarDatosDeCita(data: any) {
    const appointmentData = data.valor || data;

    (document.getElementById('cliente-nombre') as HTMLInputElement).value = appointmentData.clienteNombre || '';
    (document.getElementById('cliente-telefono') as HTMLInputElement).value = appointmentData.clienteTelefono || '';
    (document.getElementById('numero-mascotas') as HTMLInputElement).value = appointmentData.numeroMascotas || '';
    (document.getElementById('turno-fecha') as HTMLInputElement).value = appointmentData.turnoFecha || '';
    (document.getElementById('turno-hora') as HTMLInputElement).value = appointmentData.turnoHora || '';

    // Mostrar las secciones si tienen datos
    if (appointmentData.clienteNombre && appointmentData.clienteTelefono) {
        (document.getElementById('formulario-mascotas-info') as HTMLElement).style.display = 'block';
    }
    if (appointmentData.numeroMascotas && appointmentData.turnoFecha && appointmentData.turnoHora) {
        (document.getElementById('mascotas-formulario') as HTMLElement).style.display = 'block';
        (document.getElementById('botones-gardar-borrar') as HTMLElement).style.display = 'block';
        (document.getElementById('seccion-salida-datos-dos') as HTMLElement).style.display = 'block';
    }
}

// Guardar datos de la cita en el almacenamiento local
export const guardarDatosDeCita = (cliente: Cliente, mascotas: Mascota[], turnos: Turno[]): void => {
    const appointmentData = {
        clienteNombre: cliente.clienteNombre,
        clienteTelefono: cliente.clienteTelefono,
        numeroMascotas: mascotas.length,
        turnoFecha: turnos.length > 0 ? turnos[0].turnoFecha : '',
        turnoHora: turnos.length > 0 ? turnos[0].turnoHora : '',
        mascotas,
        turnos
    };
    gestionarAlmacenamientoLocal("guardar", "appointmentData", appointmentData);
};
