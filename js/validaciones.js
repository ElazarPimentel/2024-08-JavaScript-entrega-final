/* Nombre del archivo: js/validaciones.js
Autor: Alessio Aguirre Pimentel
Versión: 400 */

import { horarios, errorMessages } from './constantes.js';

// Validar nombre: solo permite de 2 a 25 caracteres alfabéticos y espacios
export const validarNombre = (nombre) => {
    const isValid = /^[a-zA-Z\s]{2,25}$/.test(nombre);
    console.log(`validarNombre(${nombre}): ${isValid}`);
    return isValid;
};

// Validar números de teléfono: permite de 7 a 15 caracteres, solo números
export const validarTelefono = (telefono) => {
    const isValid = /^[0-9]{7,15}$/.test(telefono);
    console.log(`validarTelefono(${telefono}): ${isValid}`);
    return isValid;
};

// Validar el número de mascotas: permite un dígito único, del 1 al 3
export const validarNumeroMascotas = (num) => {
    const isValid = /^[1-3]$/.test(num);
    console.log(`validarNumeroMascotas(${num}): ${isValid}`);
    return isValid;
};

// Validar la fecha del turno: debe ser dentro de los próximos 45 días
export const validarFecha = (fecha) => {
    const now = luxon.DateTime.now();  
    const fechaTurno = luxon.DateTime.fromISO(fecha);  
    const diffInDays = fechaTurno.startOf('day').diff(now.startOf('day'), 'days').days;  
    const isValid = diffInDays >= 0 && diffInDays <= 45;  
    return isValid;
};

// Validar si la fecha es un día laborable (de lunes a viernes)
export const validarDiaAbierto = (fecha) => {
    const dia = luxon.DateTime.fromISO(fecha).weekday;
    const isValid = dia >= 1 && dia <= 5;  // Lunes a Viernes
    console.log(`validarDiaAbierto(${fecha}): ${isValid}, dia: ${dia}`);
    return isValid;
};

// Validar la hora del turno
export const validarHora = (fecha, hora, horarios) => {
    const dia = luxon.DateTime.fromISO(fecha).weekday;
    const diaSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const nombreDia = diaSemana[dia];
    const horario = horarios[nombreDia];
    if (!horario || horario === 'Cerrado') return false;

    const [inicioStr, finStr] = horario.split(' - ');
    const inicio = luxon.DateTime.fromFormat(`${fecha}T${inicioStr}`, 'yyyy-MM-dd\'T\'H:mm');
    const fin = luxon.DateTime.fromFormat(`${fecha}T${finStr}`, 'yyyy-MM-dd\'T\'H:mm');
    const horaTurno = luxon.DateTime.fromISO(`${fecha}T${hora}`);
    const now = luxon.DateTime.now();
    const isValid = horaTurno >= inicio && horaTurno <= fin && horaTurno >= now.plus({ hours: 1 });

    console.log(`validarHora(${fecha}, ${hora}): ${isValid}, Inicio: ${inicio}, Fin: ${fin}, HoraTurno: ${horaTurno}, Now: ${now}`);
    return isValid;
};

// Validar la edad de la mascota
export const validarEdadMascota = (edad) => {
    const edadParsed = parseInt(edad);
    const isValid = Number.isInteger(edadParsed) && edadParsed >= 0 && edadParsed <= 40;
    console.log(`validarEdadMascota(${edad}): ${isValid}`);
    return isValid;
};
