/* Nombre del archivo: ts/actualizacionesDOM.ts
Autor: Alessio Aguirre Pimentel
Versión: 113
Descripción: Funciones para actualizar el DOM con los datos de la aplicación. */
import { gestionarAlmacenamientoLocal } from './almacenamientoLocal.js';
// Actualiza la lista de servicios en el DOM
export const actualizarListaDeServicios = (servicios) => {
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
export const actualizarListaDeHorarios = (horarios) => {
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
        const guardarClienteBtn = document.getElementById("guardar-cliente");
        const siguienteMascotaBtn = document.getElementById("siguiente-mascota");
        const guardarMascotasTurnosBtn = document.getElementById("guardar-mascotas-turnos");
        const borrarDatosBtn = document.getElementById("borrar-datos");
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
        }
        else {
            guardarClienteBtn.style.display = "inline-block";
            siguienteMascotaBtn.style.display = "inline-block";
            guardarMascotasTurnosBtn.style.display = "inline-block";
            borrarDatosBtn.style.display = "none";
        }
    }
    catch (error) {
        console.error('Error al actualizar el DOM', error);
    }
};
// Poblamos los datos de la cita desde el almacenamiento local
export function poblarDatosDeCita(data) {
    const appointmentData = data.valor || data;
    document.getElementById('cliente-nombre').value = appointmentData.clienteNombre || '';
    document.getElementById('cliente-telefono').value = appointmentData.clienteTelefono || '';
    document.getElementById('numero-mascotas').value = appointmentData.numeroMascotas || '';
    document.getElementById('turno-fecha').value = appointmentData.turnoFecha || '';
    document.getElementById('turno-hora').value = appointmentData.turnoHora || '';
    // Mostrar las secciones si tienen datos
    if (appointmentData.clienteNombre && appointmentData.clienteTelefono) {
        document.getElementById('formulario-mascotas-info').style.display = 'block';
    }
    if (appointmentData.numeroMascotas && appointmentData.turnoFecha && appointmentData.turnoHora) {
        document.getElementById('mascotas-formulario').style.display = 'block';
        document.getElementById('botones-gardar-borrar').style.display = 'block';
        document.getElementById('seccion-salida-datos-dos').style.display = 'block';
    }
}
// Guardar datos de la cita en el almacenamiento local
export const guardarDatosDeCita = (cliente, mascotas, turnos) => {
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
