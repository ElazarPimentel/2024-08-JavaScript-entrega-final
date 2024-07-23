/* Nombre del archivo: js/modelos.js
Autor: Alessio Aguirre Pimentel
Versión: 42 */

// Clase para manejar los datos del cliente
export class ClienteClass {
    constructor(clienteId, clienteNombre, clienteTelefono) {
        this.clienteId = clienteId || ClienteClass.generarId('cliente');
        this.clienteNombre = clienteNombre;
        this.clienteTelefono = clienteTelefono;
        console.log('ClienteClass instance created:', this);
    }

    static generarId(prefijo) {
        const id = `${prefijo}_` + Math.random().toString(36).substring(2, 15);
        console.log(`generarId called with prefijo: ${prefijo}, generated id: ${id}`);
        return id;
    }
}

// Clase para manejar los datos de la mascota
export class MascotaClass {
    constructor(mascotaId, mascotaForeignClienteId, mascotaNombre, mascotaEdad) {
        this.mascotaId = mascotaId || MascotaClass.generarId('mascota');
        this.mascotaForeignClienteId = mascotaForeignClienteId;
        this.mascotaNombre = mascotaNombre;
        this.mascotaEdad = mascotaEdad;
        console.log('MascotaClass instance created:', this);
    }

    static generarId(prefijo) {
        const id = `${prefijo}_` + Math.random().toString(36).substring(2, 15);
        console.log(`generarId called with prefijo: ${prefijo}, generated id: ${id}`);
        return id;
    }
}

// Clase para manejar los datos del turno
export class TurnoClass {
    constructor(turnoId, turnoForeignMascotaId, turnoFecha, turnoHora, turnoForeignServicioId) {
        this.turnoId = turnoId || TurnoClass.generarId('turno');
        this.turnoForeignMascotaId = turnoForeignMascotaId;
        this.turnoFecha = turnoFecha; // Ensure this is an ISO string
        this.turnoHora = turnoHora;   // Ensure this is an ISO string
        this.turnoForeignServicioId = turnoForeignServicioId;
        console.log('TurnoClass instance created:', this);
    }

    static generarId(prefijo) {
        const id = `${prefijo}_` + Math.random().toString(36).substring(2, 15);
        console.log(`generarId called with prefijo: ${prefijo}, generated id: ${id}`);
        return id;
    }
}