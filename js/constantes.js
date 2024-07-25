/* Nombre del archivo: constantes.js
Autor: Alessio Aguirre Pimentel
Versión: 51 */

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
export const formatoFecha = "yyyy-LLL-dd";
export const formatoHora = "HH:mm";

// Rango de feriados en días
export const rangoFeriados = 45;

// Mensajes de error comunes
export const errorMessages = {
    clienteNoInicializado: "Cliente no está inicializado, avisá a soporte técnico",
    limiteMascotas: "El número de mascotas debe estar entre 1 y 3. Si tiene más de tres mascotas, por favor hacé otro turno para las otras mascotas.",
    fechaInvalida: `La fecha del turno debe ser un día que la veterinaria esté abierta y dentro de los próximos ${rangoFeriados} días.`,
    diaCerrado: "Por favor seleccionar un día en el que la veterinaria esté abierta. Ver días y horarios a la izquierda.",
    horaInvalida: "El turno que estás tratando de tomar no está dentro del horario habil de la veterinaria, por favor mirá nuestros horarios y los feriados a la izquierda.",
    nombreInvalido: "El nombre debe contener entre 2 y 25 letras del alfabeto latino, para evitar errores y/o confusiones.",
    telefonoInvalido: "El teléfono debe contener solo números, signos +, -, (, ), y espacios, con un máximo de 20 caracteres.",
    nombreMascotaInvalido: "El nombre de la mascota debe contener entre 2 y 25 letras del alfabeto latino, sino poné un nombre parecido.",
    edadMascotaInvalida: "La edad de la mascota debe ser un número entre 0 y 40 años. Si tiene menos de seis meses poné 0 y más cerca de un año poné 1.",
    turnoFueraHorario: "Los turnos duran 45 minutos. El turno que estás tratando de tomar terminaría fuera del horario laboral. Por favor tomá un turno que termine antes de éste horario. Por favor ver horarios a la izquierda.",
    noObtenerFeriados: "No se pudieron obtener los feriados, por favor avisar al administrador",
    noObtenerHoraActual: "No se pudo obtener la hora actual, por favor avisá a soporte técnico",
    errorAplicarTema: "Error al aplicar el tema",
    claveValorRequeridos: "Clave y valor son requeridos para guardar, avisá a soporte técnico",
    claveRequerida: "Clave es requerida para cargar, avisá a soporte técnico",
    accionNoReconocida: "Acción no reconocida, avisá a soporte técnico por favor.",
    errorEnGestionarAlmacenamientoLocal: "Error en gestionarAlmacenamientoLocal: ",
    errorGuardarMascotasTurnos: "Error al guardar mascotas y turnos, contactá a soporte por favor",
    correoInvalido: "Por favor poné un correo electrónico válido",
    correoEnviado: "El correo con la información del turno fue enviado"
};

// URL de la API para obtener feriados
export const apiUrls = {
    feriados: (anio) => `https://api.argentinadatos.com/v1/feriados/${anio}`
};
