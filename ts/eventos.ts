/* Nombre del archivo: ts/eventos.ts
Autor: Alessio Aguirre Pimentel
Versión: 113
Descripción: Configuración de los oyentes de eventos. */

import { guardarCliente, mostrarFormulariosMascotas, guardarMascotasYTurnos, comenzarDeNuevo, aplicarTema } from './inicializacionApp.js';
import { gestionarAlmacenamientoLocal } from './almacenamientoLocal.js';

export const configurarOyentesDeEventos = () => {
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

    const switchTema = document.getElementById('checkbox') as HTMLInputElement;
    switchTema.addEventListener('change', () => {
        const theme = switchTema.checked ? 'dark' : 'light';
        document.body.dataset.theme = theme;
        gestionarAlmacenamientoLocal('guardar', 'theme', theme);
    });

    // Apply the saved theme when the event listeners are configured
    aplicarTema();
}
