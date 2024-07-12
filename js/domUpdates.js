/* Nombre del archivo: ts/src/domUpdates.ts
Autor: Alessio Aguirre Pimentel
Versión: 100 */
// Actualiza la lista de servicios en el DOM
export const actualizarServiciosList = (servicios) => {
    try {
        const serviciosList = document.getElementById("servicios-listado");
        if (!serviciosList) {
            throw new Error("El elemento servicios-listado no se encuentra en el DOM.");
        }
        serviciosList.innerHTML = '';
        Object.entries(servicios).forEach(([id, nombre]) => {
            const li = document.createElement("li");
            li.textContent = `${id}. ${nombre}`;
            serviciosList.appendChild(li);
        });
    }
    catch (error) {
        console.error('Error al actualizar la lista de servicios', error);
    }
};
// Actualiza la lista de horarios en el DOM
export const actualizarHorariosList = (horarios) => {
    try {
        const horariosList = document.getElementById("horarios-listado");
        if (!horariosList) {
            throw new Error("El elemento horarios-listado no se encuentra en el DOM.");
        }
        horariosList.innerHTML = '';
        Object.entries(horarios).forEach(([dia, horas]) => {
            const li = document.createElement("li");
            li.innerHTML = `<strong>${dia}</strong>: ${horas}`;
            horariosList.appendChild(li);
        });
    }
    catch (error) {
        console.error('Error al actualizar la lista de horarios', error);
    }
};
// Actualiza el DOM con los detalles del cliente, mascotas y turnos
export const actualizarDOM = (cliente, mascotas, turnos, servicios) => {
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
    }
    catch (error) {
        console.error('Error al actualizar el DOM', error);
    }
};
// Populate appointment data from local storage
export function populateAppointmentData(data) {
    document.getElementById('cliente-nombre').value = data.clienteNombre || '';
    document.getElementById('cliente-telefono').value = data.clienteTelefono || '';
    document.getElementById('numero-mascotas').value = data.numeroMascotas || '';
    document.getElementById('turno-fecha').value = data.turnoFecha || '';
    document.getElementById('turno-hora').value = data.turnoHora || '';
    // Show the sections if they have data
    if (data.clienteNombre && data.clienteTelefono) {
        document.getElementById('formulario-mascotas-info').style.display = 'block';
    }
    if (data.numeroMascotas && data.turnoFecha && data.turnoHora) {
        document.getElementById('mascotas-formulario').style.display = 'block';
        document.getElementById('botones-gardar-borrar').style.display = 'block';
        document.getElementById('seccion-salida-datos-dos').style.display = 'block';
    }
}
