# 2024-08 JavaScript Entrega Final

## Descripción del Proyecto

Este proyecto es la entrega final para el curso de JavaScript en CoderHouse. Es una aplicación web para gestionar turnos en una clínica veterinaria, "Pata-Pata-Gonia".

## Características

- *Gestión de Clientes*: Agregar, editar y eliminar información de clientes.
- *Gestión de Mascotas*: Agregar, editar y eliminar información de mascotas.
- *Programación de Turnos*: Programar, ver y gestionar turnos.
- *Cambio de Tema*: Alternar entre temas claro y oscuro.

## Tecnologías Utilizadas
- *HTML*
- *SCSS*
- *JavaScript*

## Autor
- Elazar (Alessio) Pimentel 
- Correo: Elazar.Pimentel@gmail.com 
- Comentarios: //I love chocolate

## Cambios 
# Done
- Interacción con el DOM desde JS.
- Comunicación con el usuario sin utilizar prompts ni alerts.
- Eventos.
- Persistencia de datos modificados en tiempo de ejecución con la utilización de storage. 
- Funciones/arrays/objetos/estructuras de control.
- Ejecución sin errores.
- se validan los caracteres para todos los inputs de entrada.
- Se controla que el horario reservado esté dentro de los horarios de atención de la veterinaria.
- El código está muy bien organizado en distintos archivos. 
- Los nombres de las variables y funciones son muy claros.
- Dark and Light Theme.
- Redistribución de código en nuevos archivos:
-  Encapsulación.
-  Sacudida de Árbol (Tree Shaking).
-  Separación de Responsabilidades (Separation of Concerns)
- Se almacenan datos y se traen nuevamente cuando se carga el formulario.
- Al refrescar la página se visualizan los datos recuperándolos del storage. 
- Mover algunas cosas a const
- agregar ARIA
- Comentar el código
- Uniformar nombres de archivos, funciones, elementos a Castellano
- Sacar todoss los console.log de debbuging 
- El botón Borrar Datos aparece cuando se re-carga la página. 
- Input número mascotas: aclarar que sea de type="number"
- Cambiar errores de console.log a cuandros de diálogos con arcoiris y unicornios desde validaciones.js
- Agregado luxon
- Crear fetch a API de feriados. 

# ToDo
- Usar el array horario para vlidar entrada de hora y fechas
- Sacar botón "sacar turno" cuando no presionó siguiente
- usar feriados tomados de api para no dejar hacer turno en feriado
- Poner mensajes de error descriptivos y agradables
- avisar turnos que no pueden pasar horario de cierre
- avisar turno si feriado
- ver horario máximo para N mascotas que no sea superior
- borrar mascota
- editar mascota
- agregar mascota



