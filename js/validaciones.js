/* Nombre del archivo: js/validaciones.js
Autor: Alessio Aguirre Pimentel
Versión: 77 */

const { DateTime } = luxon; // Acceso a luxon desde el objeto global
import { rangoFeriados } from './constantes.js';

export const validarNombre = (nombre) => {
    const isValid = /^[a-zA-Z\s]{2,25}$/.test(nombre);
    return isValid;
};

export const validarTelefono = (telefono) => {
    const isValid = /^[0-9]{7,15}$/.test(telefono);
    return isValid;
};

export const validarNumeroMascotas = (num) => {
    const isValid = /^[1-3]$/.test(num);
    return isValid;
};

export const validarFecha = (fecha) => {
    const now = DateTime.now();  
    const fechaTurno = DateTime.fromISO(fecha);  
    const diffInDays = fechaTurno.startOf('day').diff(now.startOf('day'), 'days').days;  
    const isValid = diffInDays >= 0 && diffInDays <= rangoFeriados;  
    return isValid;
};

export const validarDiaAbierto = (fecha) => {
    const dia = DateTime.fromISO(fecha).weekday;
    const isValid = dia >= 1 && dia <= 5;  
    return isValid;
};

export const validarHora = (fecha, hora, horarios) => {
    const dia = DateTime.fromISO(fecha).weekday;
    const diaSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const nombreDia = diaSemana[dia];
    const horario = horarios[nombreDia];
    if (!horario || horario === 'Cerrado') return false;

    const [inicioStr, finStr] = horario.split(' - ');
    const inicio = DateTime.fromFormat(`${fecha}T${inicioStr}`, 'yyyy-LL-dd\'T\'H:mm');
    const fin = DateTime.fromFormat(`${fecha}T${finStr}`, 'yyyy-LL-dd\'T\'H:mm');
    const horaTurno = DateTime.fromISO(`${fecha}T${hora}`);
    const now = DateTime.now();
    const isValid = horaTurno >= inicio && horaTurno <= fin && horaTurno >= now.plus({ hours: 1 });

    return isValid;
};

export const validarEdadMascota = (edad) => {
    const edadParsed = parseInt(edad);
    const isValid = Number.isInteger(edadParsed) && edadParsed >= 0 && edadParsed <= 40;
    return isValid;
};

export const validarEmail = (email) => {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    return isValid;
};
