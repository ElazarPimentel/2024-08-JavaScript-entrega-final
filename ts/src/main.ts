/* Nombre del archivo: ts/src/main.ts
   Autor: Alessio Aguirre Pimentel
   Versión: 04 */

import { gestionarLocalStorage } from './localStorage.js';
import { mostrarError, limpiarError, validarNombre, validarTelefono, validarNumeroMascotas, validarFecha, validarDiaAbierto, validarHora, validarEdadMascota } from './validaciones.js';
import { actualizarServiciosList, actualizarHorariosList, actualizarDOM } from './domUpdates.js';

interface Servicio {
    [key: number]: string;
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

const servicios: Servicio = {
    1: "Bañado y Peinado",
    2: "Vacunación",
    3: "Chequeo General",
    4: "Quitar pulgas"
};

const horarios: Horario = {
    Lunes: "9:00 - 17:00",
    Martes: "9:00 - 17:00",
    Miércoles: "9:00 - 17:00",
    Jueves: "9:00 - 17:00",
    Viernes: "9:00 - 17:00",
    Sábado: "Cerrado",
    Domingo: "Cerrado"
};

let cliente: Cliente | null = gestionarLocalStorage("cargar", "cliente") || null;
let mascotas: Mascota[] = gestionarLocalStorage("cargar", "mascotas") || [];
let turnos: Turno[] = gestionarLocalStorage("cargar", "turnos") || [];

class ClienteClass implements Cliente {
    clienteId: string;
    clienteNombre: string;
    clienteTelefono: string;

    constructor(clienteId: string | null, clienteNombre: string, clienteTelefono: string) {
        this.clienteId = clienteId || ClienteClass.generarId('cliente');
        this.clienteNombre = clienteNombre;
        this.clienteTelefono = clienteTelefono;
    }

    static generarId(prefix: string): string {
        return `${prefix}_` + Math.random().toString(36).slice(2, 11);
    }
}

class MascotaClass implements Mascota {
    mascotaId: string;
    mascotaForeignClienteId: string;
    mascotaNombre: string;
    mascotaEdad: number;

    constructor(mascotaId: string | null, mascotaForeignClienteId: string, mascotaNombre: string, mascotaEdad: number) {
        this.mascotaId = mascotaId || MascotaClass.generarId('mascota');
        this.mascotaForeignClienteId = mascotaForeignClienteId;
        this.mascotaNombre = mascotaNombre;
        this.mascotaEdad = mascotaEdad;
    }

    static generarId(prefix: string): string {
        return `${prefix}_` + Math.random().toString(36).slice(2, 11);
    }
}

class TurnoClass implements Turno {
    turnoId: string;
    turnoForeignMascotaId: string;
    turnoFecha: string;
    turnoHora: string;
    turnoForeignServicioId: number;

    constructor(turnoId: string | null, turnoForeignMascotaId: string, turnoFecha: string, turnoHora: string, turnoForeignServicioId: number) {
        this.turnoId = turnoId || TurnoClass.generarId('turno');
        this.turnoForeignMascotaId = turnoForeignMascotaId;
        this.turnoFecha = turnoFecha;
        this.turnoHora = turnoHora;
        this.turnoForeignServicioId = turnoForeignServicioId;
    }

    static generarId(prefix: string): string {
        return `${prefix}_` + Math.random().toString(36).slice(2, 11);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const checkbox = document.getElementById('checkbox') as HTMLInputElement;
    const body = document.body;

    if (checkbox) {
        console.log('DOM completamente cargado - Inicializando el interruptor de tema.');
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                console.log('Cambiando al tema oscuro.');
                body.classList.remove('light');
                body.classList.add('dark');
            } else {
                console.log('Cambiando al tema claro.');
                body.classList.remove('dark');
                body.classList.add('light');
            }
            gestionarLocalStorage("guardar", "theme", checkbox.checked ? 'dark' : 'light');
        });

        // Inicializar tema basado en la preferencia guardada o preferencia del sistema
        const savedTheme = gestionarLocalStorage("cargar", "theme") as string | null;
        if (savedTheme) {
            console.log(`Tema guardado encontrado: ${savedTheme}`);
            body.classList.add(savedTheme);
            checkbox.checked = savedTheme === 'dark';
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            console.log('Tema oscuro preferido por el sistema.');
            body.classList.add('dark');
            checkbox.checked = true;
        } else {
            console.log('Tema claro preferido por el sistema.');
            body.classList.add('light');
            checkbox.checked = false;
        }
    } else {
        console.log('No se encontró el interruptor de tema.');
    }

    actualizarServiciosList(servicios);
    actualizarHorariosList(horarios);

    document.body.addEventListener("click", (event: MouseEvent) => {
        const target = event.target as HTMLElement;

        if (target && target.id) {
            switch (target.id) {
                case "guardar-cliente":
                    console.log('Botón guardar cliente presionado.');
                    guardarCliente();
                    break;
                case "siguiente-mascota":
                    console.log('Botón siguiente mascota presionado.');
                    mostrarFormulariosMascotas();
                    break;
                case "borrar-datos":
                    console.log('Botón borrar datos presionado.');
                    comenzarDeNuevo();
                    break;
                case "guardar-mascotas-turnos":
                    console.log('Botón guardar mascotas y turnos presionado.');
                    guardarMascotasYTurnos();
                    break;
            }
        }
    });

    actualizarDOM(cliente, mascotas, turnos, servicios);
    aplicarTema();
    controlarBotonGuardar();
});

const guardarCliente = () => {
    const nombre = document.getElementById("cliente-nombre") as HTMLInputElement;
    const telefono = document.getElementById("cliente-telefono") as HTMLInputElement;

    limpiarError(nombre);
    limpiarError(telefono);

    if (!validarNombre(nombre.value)) {
        mostrarError(nombre, "El nombre debe contener entre 2 y 25 letras del alfabeto latino.");
        return;
    }

    if (!validarTelefono(telefono.value)) {
        mostrarError(telefono, "El teléfono debe contener solo números, signos +, -, (, ), y espacios, con un máximo de 20 caracteres.");
        return;
    }

    cliente = new ClienteClass(null, nombre.value, telefono.value);
    gestionarLocalStorage("guardar", "cliente", cliente);
    document.getElementById("formulario-mascotas-info")!.style.display = "block";
    console.log('Cliente guardado:', cliente);
};

const mostrarFormulariosMascotas = () => {
    const numMascotas = document.getElementById("numero-mascotas") as HTMLInputElement;
    const fecha = document.getElementById("turno-fecha") as HTMLInputElement;
    const hora = document.getElementById("turno-hora") as HTMLInputElement;

    limpiarError(numMascotas);
    limpiarError(fecha);
    limpiarError(hora);

    if (!validarNumeroMascotas(numMascotas.value)) {
        mostrarError(numMascotas, "El número de mascotas debe estar entre 1 y 3. Si tiene más de tres mascotas, por favor haga otro turno para las otras mascotas.");
        return;
    }

    if (!validarFecha(fecha.value)) {
        mostrarError(fecha, "La fecha del turno debe ser un día que la veterinaria esté abierta y dentro de los próximos 45 días.");
        return;
    }

    if (!validarDiaAbierto(fecha.value)) {
        mostrarError(fecha, "La veterinaria está cerrada ese día. Por favor elija otro día.");
        return;
    }

    if (!validarHora(fecha.value, hora.value, horarios, numMascotas.value)) {
        mostrarError(hora, "La hora del turno debe estar dentro del horario de atención y al menos una hora después de la hora actual.");
        return;
    }

    const mascotasForm = document.getElementById("mascotas-formulario")!;
    mascotasForm.innerHTML = '';

    for (let i = 0; i < parseInt(numMascotas.value); i++) {
        const petForm = document.createElement("form");
        petForm.setAttribute("id", `form-mascota-${i}`);
        petForm.innerHTML = `
            <fieldset>
                <legend>Datos de la Mascota ${i + 1}</legend>
                <label for="mascota-nombre-${i}">Nombre de mascota:</label>
                <input type="text" id="mascota-nombre-${i}" name="mascota-nombre-${i}" required aria-label="Nombre de la Mascota ${i + 1}">
                <label for="mascota-edad-${i}">Edad (años):</label>
                <input type="text" id="mascota-edad-${i}" name="mascota-edad-${i}" required aria-label="Edad de la Mascota ${i + 1}">
                <label for="servicio-${i}">Servicio</label>
                <select id="servicio-${i}" required aria-label="Servicio para la Mascota ${i + 1}">
                    ${Object.entries(servicios).map(([id, nombre]: [string, string]) => `<option value="${id}">${nombre}</option>`).join('')}
                </select>
            </fieldset>
        `;
        mascotasForm.appendChild(petForm);
    }

    mascotasForm.style.display = "block";
    document.getElementById("guardar-mascotas-turnos")!.style.display = "inline-block";
    document.getElementById("borrar-datos")!.style.display = "inline-block";
    console.log('Formularios de mascotas mostrados.');
};

const guardarMascotasYTurnos = () => {
    try {
        if (!cliente) {
            console.error('Cliente no está inicializado');
            return;
        }

        const numMascotas = parseInt((document.getElementById("numero-mascotas") as HTMLInputElement).value);
        const fecha = (document.getElementById("turno-fecha") as HTMLInputElement).value;
        const hora = (document.getElementById("turno-hora") as HTMLInputElement).value;
        let turnoHora = new Date(`${fecha}T${hora}`);

        console.log(`numMascotas: ${numMascotas}, fecha: ${fecha}, hora: ${hora}`);

        for (let i = 0; i < numMascotas; i++) {
            const mascotaNombre = (document.getElementById(`mascota-nombre-${i}`) as HTMLInputElement).value;
            const mascotaEdad = parseInt((document.getElementById(`mascota-edad-${i}`) as HTMLInputElement).value);
            const servicioId = parseInt((document.getElementById(`servicio-${i}`) as HTMLSelectElement).value);

            console.log(`Mascota ${i}: nombre=${mascotaNombre}, edad=${mascotaEdad}, servicioId=${servicioId}`);

            if (!validarNombre(mascotaNombre)) {
                mostrarError(document.getElementById(`mascota-nombre-${i}`)!, "El nombre de la mascota debe contener entre 2 y 25 letras del alfabeto latino.");
                return;
            }

            if (!validarEdadMascota(mascotaEdad.toString())) {
                mostrarError(document.getElementById(`mascota-edad-${i}`)!, "La edad de la mascota debe ser un número entre 0 y 40 años.");
                return;
            }

            const mascota = new MascotaClass(null, cliente.clienteId, mascotaNombre, mascotaEdad);
            mascotas.push(mascota);

            const turno = new TurnoClass(null, mascota.mascotaId, fecha, turnoHora.toTimeString().slice(0, 5), servicioId);
            turnos.push(turno);
            turnoHora.setMinutes(turnoHora.getMinutes() + 45);
        }

        gestionarLocalStorage("guardar", "mascotas", mascotas);
        gestionarLocalStorage("guardar", "turnos", turnos);
        actualizarDOM(cliente, mascotas, turnos, servicios);
        document.getElementById("seccion-salida-datos-dos")!.style.display = "block";
        document.getElementById("guardar-mascotas-turnos")!.style.display = "none"; // Ocultar el botón
        console.log('Mascotas y turnos guardados.');
    } catch (error) {
        console.error('Error al guardar mascotas y turnos', error); // Elaborar en versiones futuras
    }
};

const borrarTodosDatos = () => {
    try {
        gestionarLocalStorage("borrarTodo");
        cliente = null;
        mascotas = [];
        turnos = [];
        actualizarDOM(cliente, mascotas, turnos, servicios);
        (document.getElementById("formulario-cliente") as HTMLFormElement).reset();
        document.getElementById("formulario-mascotas-info")!.style.display = "none";
        document.getElementById("mascotas-formulario")!.style.display = "none";
        document.getElementById("guardar-mascotas-turnos")!.style.display = "none";
        document.getElementById("borrar-datos")!.style.display = "none";
        document.getElementById("seccion-salida-datos-dos")!.style.display = "none";
        console.log('Todos los datos borrados.');
    } catch (error) {
        console.error('Error al borrar todos los datos', error); // Elaborar en versiones futuras
    }
};

const comenzarDeNuevo = () => {
    borrarTodosDatos();
    const guardarBtn = document.getElementById("guardar-mascotas-turnos");
    if (guardarBtn) {
        guardarBtn.style.display = "inline-block"; // Mostrar el botón
    }
    console.log('Comenzar de nuevo.');
};

const aplicarTema = () => {
    try {
        const temaAlmacenado = gestionarLocalStorage("cargar", "theme") as string | null;
        if (temaAlmacenado) {
            document.body.dataset.theme = temaAlmacenado;
            console.log(`Tema aplicado: ${temaAlmacenado}`);
        }
    } catch (error) {
        console.error('Error al aplicar el tema', error); // Elaborar en versiones futuras 
    }
};

const controlarBotonGuardar = () => {
    const guardarBtn = document.getElementById("guardar-mascotas-turnos");
    if (guardarBtn) {
        guardarBtn.style.display = 'none'; // Ocultar botón
    }
    console.log('Controlar botón guardar.');
};
