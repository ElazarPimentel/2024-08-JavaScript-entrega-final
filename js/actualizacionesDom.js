/* Nombre del archivo: js/actualizacionesDom.js
Autor: Alessio Aguirre Pimentel
Versión: 70 */

// eslint-disable-next-line no-undef
const { DateTime } = luxon; // Acceso a luxon desde el objeto global, evita errores varios. 
import { formatoFecha, formatoHora, rangoFeriados, errorMessages } from './constantes.js';

// Actualiza la lista de servicios en el DOM
export const actualizarListaDeServicios = (servicios) => {
    
    const serviciosList = document.getElementById("servicios-listado");
    serviciosList.innerHTML = '';
    Object.entries(servicios).forEach(([id, nombre]) => {
        const li = document.createElement("li");
        li.textContent = `${id}. ${nombre}`;
        serviciosList.appendChild(li);
    });
};

export const actualizarListaDeHorarios = (horarios) => {
    
    const horariosList = document.getElementById("horarios-listado");
    horariosList.innerHTML = '';
    Object.entries(horarios).forEach(([dia, horas]) => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${dia}</strong>: ${horas}`;
        horariosList.appendChild(li);
    });
};

export const poblarDatosDeCita = (data) => {
    
    const { clienteNombre = '', clienteTelefono = '', clienteEmail = '', turnoFecha = '', turnoHora = '' } = data;
    document.getElementById('cliente-nombre').value = clienteNombre;
    document.getElementById('cliente-telefono').value = clienteTelefono;
    document.getElementById('cliente-email').value = clienteEmail;
    document.getElementById('turno-fecha').value = turnoFecha;
    document.getElementById('turno-hora').value = turnoHora;
    // Más lógica para mostrar/ocultar elementos basados en los datos
};

const actualizarDetallesCliente = (cliente, turnos) => {
    const clienteDetalles = document.getElementById("cliente-detalles");
    const fechaTurno = turnos.length > 0 ? DateTime.fromISO(turnos[0].turnoFecha).setLocale('es').toFormat(formatoFecha) : 'N/A';
    clienteDetalles.innerHTML = `
        <h3>Detalles del Cliente</h3>
        <p><strong>Nombre:</strong> ${cliente.clienteNombre} <strong>Teléfono:</strong> ${cliente.clienteTelefono} <strong>Email:</strong> ${cliente.clienteEmail}</p>
        <p><strong>Fecha del Turno:</strong> ${fechaTurno}</p>
        <hr>
    `;
};

const actualizarDetallesMascotas = (mascotas, turnos, servicios) => {
    const mascotaDetalles = document.getElementById("mascota-detalles");
    mascotaDetalles.innerHTML = `<h3>Detalles de Mascotas y Turnos</h3>`;

    mascotas.forEach(mascota => {
        const turno = turnos.find(turno => turno.turnoForeignMascotaId === mascota.mascotaId);
        const servicioNombre = servicios[turno.turnoForeignServicioId];
        const horaTurno = DateTime.fromISO(turno.turnoHora).setLocale('es').toFormat(formatoHora);
        mascotaDetalles.innerHTML += `
            <div class="mascota-detalle">
                <p><strong>Nombre de Mascota:</strong> ${mascota.mascotaNombre} <strong>Edad:</strong> ${mascota.mascotaEdad} años</p>
                <p><strong>Hora del Turno:</strong> ${horaTurno} <strong>Servicio:</strong> ${servicioNombre}</p>
            </div>
        `;
    });
};

export const actualizarDOM = (cliente, mascotas, turnos, servicios, horarios) => {
    
    actualizarListaDeServicios(servicios);
    actualizarListaDeHorarios(horarios);

    if (cliente) {
        actualizarDetallesCliente(cliente, turnos);
    }

    if (mascotas.length > 0 && turnos.length > 0) {
        actualizarDetallesMascotas(mascotas, turnos, servicios);
    }
};

// Mostrar los próximos feriados
export const mostrarFeriadosProximos = (feriados) => {
    const feriadosProximos = feriados.filter(feriado => {
        const fechaFeriado = DateTime.fromISO(feriado.fecha);
        const hoy = DateTime.now();
        const diferencia = fechaFeriado.diff(hoy, 'days').days;
        return diferencia >= 0 && diferencia <= rangoFeriados; // rangoFeriados en días
    });

    const feriadosListado = document.getElementById('feriados-listado');
    feriadosListado.innerHTML = feriadosProximos.length > 0 
        ? feriadosProximos.map(feriado => `<li>${DateTime.fromISO(feriado.fecha).setLocale('es').toFormat(formatoFecha)}</li>`).join('') 
        : `<li>${errorMessages.noObtenerFeriados}</li>`;
};
