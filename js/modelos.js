/* Nombre del archivo: js/modelos.js
Autor: Alessio Aguirre Pimentel
Versión: 49 */

// Clase para manejar los datos del cliente
export class ClienteClass {
    constructor(clienteId, clienteNombre, clienteTelefono, clienteEmail) {
        this.clienteId = clienteId || ClienteClass.generarId('cliente');
        this.clienteNombre = clienteNombre;
        this.clienteTelefono = clienteTelefono;
        this.clienteEmail = clienteEmail;
        console.log('ClienteClass instancia creada:', this);
    }

    static generarId(prefijo) {
        const id = `${prefijo}_` + Math.random().toString(36).substring(2, 15); // Nueva modalidad
        console.log(`generarId llamado con prefijo: ${prefijo}, id generado: ${id}`);
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
        console.log('MascotaClass instancia creada:', this);
    }

    static generarId(prefijo) {
        const id = `${prefijo}_` + Math.random().toString(36).substring(2, 15);
        console.log(`generarId llamado con prefijo: ${prefijo}, id generado: ${id}`);
        return id;
    }
}

// Clase para manejar los datos del turno
export class TurnoClass {
    constructor(turnoId, turnoForeignMascotaId, turnoFecha, turnoHora, turnoForeignServicioId) {
        this.turnoId = turnoId || TurnoClass.generarId('turno');
        this.turnoForeignMascotaId = turnoForeignMascotaId;
        this.turnoFecha = turnoFecha; 
        this.turnoHora = turnoHora;   
        this.turnoForeignServicioId = turnoForeignServicioId;
        console.log('TurnoClass instancia creada:', this);
    }

    static generarId(prefijo) {
        const id = `${prefijo}_` + Math.random().toString(36).substring(2, 15);
        console.log(`generarId llamado con prefijo: ${prefijo}, id generado: ${id}`);
        return id;
    }
}
