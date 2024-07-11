/* Nombre del archivo: ts/src/domUpdates.ts
Autor: Alessio Aguirre Pimentel
Versión: 02 */

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
export const actualizarServiciosList = (servicios: Servicio): void => {
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
        console.error('Error al actualizar la lista de servicios', error);
    }
};

// Actualiza la lista de horarios en el DOM
export const actualizarHorariosList = (horarios: Horario): void => {
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
        console.error('Error al actualizar la lista de horarios', error);
    }
};

// Actualiza el DOM con los detalles del cliente, mascotas y turnos
export const actualizarDOM = (cliente: Cliente | null, mascotas: Mascota[], turnos: Turno[], servicios: Servicio): void => {
    try {
        const clienteDetalles = document.getElementById('cliente-detalles');
        const mascotaDetalles = document.getElementById('mascota-detalles');

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
    } catch (error) {
        console.error('Error al actualizar el DOM', error);
    }
};

// Populate appointment data from local storage
export function populateAppointmentData(data: any) {
    (document.getElementById('cliente-nombre') as HTMLInputElement).value = data.clienteNombre || '';
    (document.getElementById('cliente-telefono') as HTMLInputElement).value = data.clienteTelefono || '';
    (document.getElementById('numero-mascotas') as HTMLInputElement).value = data.numeroMascotas || '';
    (document.getElementById('turno-fecha') as HTMLInputElement).value = data.turnoFecha || '';
    (document.getElementById('turno-hora') as HTMLInputElement).value = data.turnoHora || '';

    // Show the sections if they have data
    if (data.clienteNombre && data.clienteTelefono) {
        (document.getElementById('formulario-mascotas-info') as HTMLElement).style.display = 'block';
    }
    if (data.numeroMascotas && data.turnoFecha && data.turnoHora) {
        (document.getElementById('mascotas-formulario') as HTMLElement).style.display = 'block';
        (document.getElementById('botones-gardar-borrar') as HTMLElement).style.display = 'block';
        (document.getElementById('seccion-salida-datos-dos') as HTMLElement).style.display = 'block';
    }
}
