/* Nombre del archivo: ts/src/validaciones.ts
 Autor: Alessio Aguirre Pimentel
 Versión: 100 */
// Mostrar un mensaje de error al lado del elemento especificado
export const mostrarError = (elemento, mensaje) => {
    let error = elemento.nextElementSibling;
    if (!error || !error.classList.contains('error')) {
        error = document.createElement('div');
        error.classList.add('error');
        elemento.parentNode?.insertBefore(error, elemento.nextSibling);
    }
    if (error) {
        error.textContent = mensaje;
    }
};
// Limpiar el mensaje de error mostrado
export const limpiarError = (elemento) => {
    let error = elemento.nextElementSibling;
    if (error && error.classList.contains('error')) {
        error.remove();
    }
};
// Validar nombre: solo permite de 2 a 25 caracteres alfabéticos y espacios
export const validarNombre = (nombre) => /^[a-zA-Z\s]{2,25}$/.test(nombre);
// Validar números de teléfono: permite de 7 a 20 caracteres, incluyendo números y símbolos +, -, (, ), y espacios
export const validarTelefono = (telefono) => /^[0-9+\-().\s]{7,20}$/.test(telefono);
// Validar el número de mascotas: permite un dígito único, del 1 al 3
export const validarNumeroMascotas = (num) => /^[1-3]$/.test(num);
// Validar la fecha del turno: debe ser dentro de los próximos 45 días
export const validarFecha = (fecha) => {
    const now = new Date();
    const nowDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Remover la parte de la hora
    const fechaTurno = new Date(fecha + "T00:00:00"); // Asegurar que solo se parsea la parte de la fecha
    const diff = (fechaTurno.getTime() - nowDateOnly.getTime()) / (1000 * 60 * 60 * 24); // Diferencia en días
    return fechaTurno >= nowDateOnly && diff <= 45;
};
// Verificar si la fecha es un día laborable (de lunes a viernes)
export const validarDiaAbierto = (fecha) => {
    const dia = new Date(fecha + "T00:00:00").getDay();
    return dia >= 1 && dia <= 5;
};
// Validar la hora del turno, asegurando que esté dentro del horario laboral y considerando el número de mascotas
export const validarHora = (fecha, hora, horarios, numeroDeMascotas) => {
    const dia = new Date(fecha + "T00:00:00").getDay();
    const horario = horarios[Object.keys(horarios)[dia - 1]];
    if (!horario || horario === 'Cerrado')
        return false;
    const [horaInicio, horaFin] = horario.split(' - ');
    const parseTime = (timeString) => {
        const [hours, minutes] = timeString.split(':').map(Number);
        const date = new Date(fecha + "T00:00:00");
        date.setHours(hours, minutes);
        return date;
    };
    const turnoHora = parseTime(hora);
    const inicio = parseTime(horaInicio);
    const fin = parseTime(horaFin);
    const numeroDeMascotasParsed = parseInt(numeroDeMascotas, 10);
    if (isNaN(numeroDeMascotasParsed)) {
        console.error("Número de mascotas inválido:", numeroDeMascotas);
        return false;
    }
    const turnoHoraFinal = new Date(turnoHora.getTime() + 45 * 60000 * numeroDeMascotasParsed);
    return turnoHora >= inicio && turnoHoraFinal <= fin && turnoHora >= new Date(Date.now() + 3600000);
};
// Validar la edad de la mascota
export const validarEdadMascota = (edad) => {
    const edadParsed = parseInt(edad, 10);
    return Number.isInteger(edadParsed) && edadParsed >= 0 && edadParsed <= 40;
};
