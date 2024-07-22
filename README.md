# 2024-08 JavaScript Entrega Final

## Descripción del Proyecto

Este proyecto es la entrega final para el curso de JavaScript en CoderHouse. Es una aplicación web para gestionar turnos en una clínica veterinaria, "Pata-Pata-Gonia".

## Características

- **Gestión de Clientes**: Agregar, editar y eliminar información de clientes.
- **Gestión de Mascotas**: Agregar, editar y eliminar información de mascotas.
- **Programación de Turnos**: Programar, ver y gestionar turnos.
- **Cambio de Tema**: Alternar entre temas claro y oscuro.

## Tecnologías Utilizadas

- **HTML**
- **SCSS**
- **JavaScript**

## Autor

- **Elazar (Alessio) Pimentel**
- **Correo**: [Elazar.Pimentel@gmail.com](mailto:Elazar.Pimentel@gmail.com)
- **Comentarios**: *I love chocolate*

## Cambios Realizados

### Hecho

- Interacción con el DOM desde JS.
- Comunicación con el usuario sin utilizar prompts ni alerts.
- Eventos.
- Persistencia de datos modificados en tiempo de ejecución con la utilización de storage.
- Funciones/arrays/objetos/estructuras de control.
- Ejecución sin errores.
- Validación de caracteres para todos los inputs de entrada.
- Control de que el horario reservado esté dentro de los horarios de atención de la veterinaria.
- Código organizado en distintos archivos.
- Nombres de variables y funciones claros.
- Temas claro y oscuro.
- Redistribución de código en nuevos archivos:
  - Encapsulación.
  - Sacudida de Árbol (Tree Shaking).
  - Separación de Responsabilidades (Separation of Concerns).
- Almacenamiento y recuperación de datos al cargar el formulario.
- Visualización de datos recuperados del storage al refrescar la página.
- Uso de constantes.
- Agregado de ARIA.
- Comentarios en el código.
- Uniformidad en nombres de archivos, funciones y elementos en Castellano.
- Eliminación de `console.log` de depuración.
- El botón "Borrar Datos" aparece al recargar la página.
- En vez de número de mascotas`type="number"` se usa SweetAlert2
- Cambio de errores de `console.log` a cuadros de diálogos con SweetAlert2 `validaciones.js`.
- Agregado de Luxon.
- Uso de feriados tomados de la API para no permitir turnos en feriados.
- Creación de fetch a API de feriados para año actual y próximo, con catch try en caso que no haya próximo todavía. 
- Eliminación del botón "sacar turno" cuando no se ha presionado "siguiente".
- Mover constantes, arrays o elementos que no cambian durante la ejecución a nuevo archivo constantes.js para Separation of Concerns. 


### Por Hacer

- Mensajes de error descriptivos y agradables.
- Avisar sobre turnos que no pueden exceder el horario de cierre.
- Avisar sobre turnos en días feriados.
- Controlar horario máximo para N mascotas.
- Borrar mascota.
- Editar mascota.
- Agregar mascota.
- Incluir feriados en el calendario si es posible.
- Agregar menú desplegable para seleccionar mascotas y horarios.

## Instalación y Uso

1. Cloná el repositorio a tu compu.
2. Abrí `index.html` en un browser. Depende del OS quizá debas correrlo desde un servidor HTTP local. (En el Gloriolos Fedora Linuxu uso `http-server`)
3. Seguí las instrucciones en pantalla para agregar clientes, mascotas y programar turnos.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo [LICENSE](./LICENSE) para más detalles. (me tenés que pagar si vas a ganar dinero con mi projecto :)