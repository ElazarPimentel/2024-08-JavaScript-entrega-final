/*  Nombre del archivo fuente: ts/src/main.ts
    Nombre del archivo destino: js/main.js
    Autor: Alessio Aguirre Pimentel
    Versión: 100 */

    import { gestionarLocalStorage, getDataFromLocalStorage } from './localStorage.js';
    import { mostrarError, limpiarError, validarNombre, validarTelefono, validarNumeroMascotas, validarFecha, validarDiaAbierto, validarHora, validarEdadMascota } from './validaciones.js';
    import { actualizarServiciosList, actualizarHorariosList, actualizarDOM, populateAppointmentData } from './domUpdates.js';
    
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
    
    // Guardar cliente
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
    };
    
    // Mostrar formularios para mascotas
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
    };
    
    // Guardar mascotas y turnos
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
    
            for (let i = 0; i < numMascotas; i++) {
                const mascotaNombre = (document.getElementById(`mascota-nombre-${i}`) as HTMLInputElement).value;
                const mascotaEdad = parseInt((document.getElementById(`mascota-edad-${i}`) as HTMLInputElement).value);
                const servicioId = parseInt((document.getElementById(`servicio-${i}`) as HTMLSelectElement).value);
    
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
        } catch (error) {
            console.error('Error al guardar mascotas y turnos', error); // Elaborar en versiones futuras
        }
    };
    
    // Retrieve and populate stored data
    const retrieveAndPopulateData = () => {
        const storedData = getDataFromLocalStorage('appointmentData');
        if (storedData) {
            populateAppointmentData(storedData);
        }
    }
    
    // Aplicar tema
    const aplicarTema = () => {
        try {
            const temaAlmacenado = gestionarLocalStorage("cargar", "theme") as string | null;
            if (temaAlmacenado) {
                document.body.dataset.theme = temaAlmacenado;
            }
        } catch (error) {
            console.error('Error al aplicar el tema', error); // Elaborar en versiones futuras 
        }
    };
    
    // Controlar botón guardar
    const controlarBotonGuardar = () => {
        const guardarBtn = document.getElementById("guardar-mascotas-turnos");
        if (guardarBtn) {
            guardarBtn.style.display = 'none'; // Ocultar botón
        }
    };
    
    // Borrar todos los datos
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
        } catch (error) {
            console.error('Error al borrar todos los datos', error); // Elaborar en versiones futuras
        }
    };
    
    // Comenzar de nuevo
    const comenzarDeNuevo = () => {
        borrarTodosDatos();
        const guardarBtn = document.getElementById("guardar-mascotas-turnos");
        if (guardarBtn) {
            guardarBtn.style.display = "inline-block"; // Mostrar el botón
        }
    };
    
    // Attach event listeners
    const attachEventListeners = () => {
        document.getElementById('siguiente-mascota')!.addEventListener('click', mostrarFormulariosMascotas);
        document.getElementById('guardar-cliente')!.addEventListener('click', guardarCliente);
    
        document.body.addEventListener("click", (event: MouseEvent) => {
            const target = event.target as HTMLElement;
    
            if (target && target.id) {
                switch (target.id) {
                    case "guardar-cliente":
                        guardarCliente();
                        break;
                    case "siguiente-mascota":
                        mostrarFormulariosMascotas();
                        break;
                    case "borrar-datos":
                        comenzarDeNuevo();
                        break;
                    case "guardar-mascotas-turnos":
                        guardarMascotasYTurnos();
                        break;
                }
            }
        });
    }
    
    // Initialize the app
    const initializeApp = () => {
        retrieveAndPopulateData();
        attachEventListeners();
        aplicarTema();
        controlarBotonGuardar();
        actualizarServiciosList(servicios);
        actualizarHorariosList(horarios);
        actualizarDOM(cliente, mascotas, turnos, servicios);
    }
    
    initializeApp();
    
    export {};
    