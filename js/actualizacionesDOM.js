/* Nombre del archivo: js/actualizacionesDOM.js
Autor: Alessio Aguirre Pimentel
Versión: 324 */

// Funciones para actualizar el DOM con los datos de la aplicación
import { mostrarError } from './manejoErrores.js';

// Actualiza la lista de servicios en el DOM
export const actualizarListaDeServicios = (servicios) => {
    console.log('actualizarListaDeServicios called with servicios:', servicios);
    const serviciosList = document.getElementById("servicios-listado");
    serviciosList.innerHTML = '';
    Object.entries(servicios).forEach(([id, nombre]) => {
        const li = document.createElement("li");
        li.textContent = `${id}. ${nombre}`;
        serviciosList.appendChild(li);
    });
};

// Actualiza la lista de horarios en el DOM
export const actualizarListaDeHorarios = (horarios) => {
    console.log('actualizarListaDeHorarios called with horarios:', horarios);
    const horariosList = document.getElementById("horarios-listado");
    horariosList.innerHTML = '';
    Object.entries(horarios).forEach(([dia, horas]) => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${dia}</strong>: ${horas}`;
        horariosList.appendChild(li);
    });
};

// Poblar datos de citas en el formulario desde los datos guardados
export const poblarDatosDeCita = (data) => {
    console.log('poblarDatosDeCita called with data:', data);
    const { clienteNombre = '', clienteTelefono = '', numeroMascotas = '', turnoFecha = '', turnoHora = '' } = data;
    document.getElementById('cliente-nombre').value = clienteNombre;
    document.getElementById('cliente-telefono').value = clienteTelefono;
    document.getElementById('numero-mascotas').value = numeroMascotas;
    document.getElementById('turno-fecha').value = turnoFecha;
    document.getElementById('turno-hora').value = turnoHora;
    // Más lógica para mostrar/ocultar elementos basados en los datos
};

// Actualizar los detalles del cliente
const actualizarDetallesCliente = (cliente) => {
    const clienteDetalles = document.getElementById("cliente-detalles");
    clienteDetalles.innerHTML = `
        <h3>Detalles del Cliente</h3>
        <p>Nombre: ${cliente.clienteNombre}</p>
        <p>Teléfono: ${cliente.clienteTelefono}</p>
    `;
};

// Actualizar los detalles de las mascotas y turnos
const actualizarDetallesMascotas = (mascotas, turnos, servicios) => {
    const mascotaDetalles = document.getElementById("mascota-detalles");
    mascotaDetalles.innerHTML = `<h3>Detalles de Mascotas y Turnos</h3>`;
    
    mascotas.forEach(mascota => {
        const turno = turnos.find(turno => turno.turnoForeignMascotaId === mascota.mascotaId);
        const servicioNombre = servicios[turno.turnoForeignServicioId];
        mascotaDetalles.innerHTML += `
            <div class="mascota-detalle">
                <p>Nombre de Mascota: ${mascota.mascotaNombre}</p>
                <p>Edad: ${mascota.mascotaEdad} años</p>
                <p>Servicio: ${servicioNombre}</p>
                <p>Fecha del Turno: ${turno.turnoFecha}</p>
                <p>Hora del Turno: ${turno.turnoHora}</p>
            </div>
            <hr>
        `;
    });
};

// Exportar la función actualizarDOM
export const actualizarDOM = (cliente, mascotas, turnos, servicios, horarios) => {
    console.log('actualizarDOM called with:', { cliente, mascotas, turnos, servicios, horarios });
    actualizarListaDeServicios(servicios);
    actualizarListaDeHorarios(horarios);
    
    if (cliente) {
        actualizarDetallesCliente(cliente);
    }
    
    if (mascotas.length > 0 && turnos.length > 0) {
        actualizarDetallesMascotas(mascotas, turnos, servicios);
    }
};
