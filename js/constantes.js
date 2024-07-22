/* Nombre del archivo: constantes.js
Autor: Alessio Aguirre Pimentel
Versión: 367 */

// Servicios ofrecidos por la veterinaria
export const servicios = {
    1: "Bañado y Peinado",
    2: "Vacunación",
    3: "Chequeo General",
    4: "Quitar pulgas"
};

// Horarios de atención de la veterinaria
export const horarios = {
    Lunes: "9:00 - 17:00",
    Martes: "9:00 - 17:00",
    Miércoles: "9:00 - 17:00",
    Jueves: "9:00 - 17:00",
    Viernes: "9:00 - 17:00",
    Sábado: "Cerrado",
    Domingo: "Cerrado"
};

// Duración de un turno en minutos
export const duracionDeTurno = 45;

// Formatos de fecha y hora
export const formatoFecha = "Y-MMM-d";
export const formatoHora = "H:i";

// Mensajes de error comunes
export const errorMessages = {
    clienteNoInicializado: "Cliente no está inicializado",
    limiteMascotas: "El número de mascotas debe estar entre 1 y 3. Si tiene más de tres mascotas, por favor haga otro turno para las otras mascotas.",
    fechaInvalida: "La fecha del turno debe ser un día que la veterinaria esté abierta y dentro de los próximos 45 días.",
    diaCerrado: "Por favor seleccionar un día en el que la veterinaria esté abierta. Ver días y horarios a la izquierda.",
    horaInvalida: "El turno que estás tratando de tomar no está dentro del horario habil de la veterinaria, por favor mirá nuestros horarios a la izquierda.",
    nombreInvalido: "El nombre debe contener entre 2 y 25 letras del alfabeto latino.",
    telefonoInvalido: "El teléfono debe contener solo números, signos +, -, (, ), y espacios, con un máximo de 20 caracteres.",
    nombreMascotaInvalido: "El nombre de la mascota debe contener entre 2 y 25 letras del alfabeto latino.",
    edadMascotaInvalida: "La edad de la mascota debe ser un número entre 0 y 40 años.",
    turnoFueraHorario: "Los turnos duran 45 minutos. El turno que estás tratando de tomar terminaría fuera del horario laboral. Por favor tomá un turno que termine antes de éste horario. Por favor ver horarios a la izquierda."
};

// URL de la API para obtener feriados
export const apiUrls = {
    feriados: (anio) => `https://api.argentinadatos.com/v1/feriados/${anio}`
};
