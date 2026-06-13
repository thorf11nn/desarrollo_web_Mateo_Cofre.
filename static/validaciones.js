document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. VALIDACIONES: REGISTRO DE MIEMBROS
    // ==========================================
    const formRegistro = document.getElementById("form-registro");

    if (formRegistro) {
        formRegistro.addEventListener("submit", (event) => {
            // Detenemos el envío para validar primero con JS
            event.preventDefault();

            // Captura de valores
            const nombre = document.getElementById("nombre").value.trim();
            const email = document.getElementById("email").value.trim();
            const telefono = document.getElementById("telefono").value.trim();
            const tipoMiembro = document.getElementById("tipo-miembro").value;
            
            // Campos de BD (Región y Comuna)
            const region = document.getElementById("region") ? document.getElementById("region").value : "";
            const comuna = document.getElementById("comuna") ? document.getElementById("comuna").value : "";

            let esValido = true;

            // Validación Nombre
            if (nombre.length === 0) {
                document.getElementById("error-nombre").style.display = "block";
                esValido = false;
            } else {
                document.getElementById("error-nombre").style.display = "none";
            }

            // Validación Email
            const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!regexEmail.test(email)) {
                document.getElementById("error-email").style.display = "block";
                esValido = false;
            } else {
                document.getElementById("error-email").style.display = "none";
            }

            // Validación Teléfono (Es opcional, pero si escribe, debe ser válido)
            if (telefono.length > 0) {
                // Acepta formatos como +56912345678 o +56 9 1234 5678
                const regexTel = /^\+56\s?9\s?\d{4}\s?\d{4}$|^\+569\d{8}$/;
                if (!regexTel.test(telefono.replace(/\s+/g, ''))) {
                    document.getElementById("error-telefono").style.display = "block";
                    esValido = false;
                } else {
                    document.getElementById("error-telefono").style.display = "none";
                }
            } else {
                document.getElementById("error-telefono").style.display = "none";
            }

            // Validación Región (Nuevo en Tarea 2)
            const errorRegion = document.getElementById("error-region");
            if (errorRegion) {
                if (region === "") {
                    errorRegion.style.display = "block";
                    esValido = false;
                } else {
                    errorRegion.style.display = "none";
                }
            }

            // Validación Comuna (Nuevo en Tarea 2)
            const errorComuna = document.getElementById("error-comuna");
            if (errorComuna) {
                if (comuna === "") {
                    errorComuna.style.display = "block";
                    esValido = false;
                } else {
                    errorComuna.style.display = "none";
                }
            }

            // Validación Rol DCC
            if (tipoMiembro === "") {
                document.getElementById("error-tipo").style.display = "block";
                esValido = false;
            } else {
                document.getElementById("error-tipo").style.display = "none";
            }

            // FLUJO TAREA 2: Si todo es válido, liberamos el formulario hacia Flask
            if (esValido) {
                formRegistro.submit(); 
            }
        });
    }

    // ==========================================
    // 2. VALIDACIONES: INFORMAR ACTIVIDAD
    // ==========================================
    const formActividad = document.getElementById("form-actividad");

    if (formActividad) {
        formActividad.addEventListener("submit", (event) => {
            // Detenemos el envío para validar
            event.preventDefault();

            const nombreAct = document.getElementById("nombre-actividad").value.trim();
            const tipoAct = document.getElementById("tipo-actividad").value;
            const horaInicio = document.getElementById("hora-inicio").value;
            const horaFin = document.getElementById("hora-fin").value;
            const archivoEvi = document.getElementById("archivo-evidencia").files; 
            const enlaceEvi = document.getElementById("enlace-evidencia").value.trim();
            
            // Validar checkboxes de días (Múltiples opciones)
            const diasCheckbox = document.querySelectorAll('input[name="dias"]:checked');

            let esValido = true;

            if (nombreAct === "") { 
                document.getElementById("error-nombre-act").style.display = "block"; 
                esValido = false; 
            } else { 
                document.getElementById("error-nombre-act").style.display = "none"; 
            }

            if (tipoAct === "") { 
                document.getElementById("error-tipo-act").style.display = "block"; 
                esValido = false; 
            } else { 
                document.getElementById("error-tipo-act").style.display = "none"; 
            }

            // Validar que seleccione al menos un día
            if (diasCheckbox.length === 0) { 
                document.getElementById("error-dias").style.display = "block"; 
                esValido = false; 
            } else { 
                document.getElementById("error-dias").style.display = "none"; 
            }

            if (horaInicio === "") { 
                document.getElementById("error-hora-inicio").style.display = "block"; 
                esValido = false; 
            } else { 
                document.getElementById("error-hora-inicio").style.display = "none"; 
            }

            if (horaFin === "") { 
                document.getElementById("error-hora-fin").style.display = "block"; 
                esValido = false; 
            } else { 
                document.getElementById("error-hora-fin").style.display = "none"; 
            }

            // Lógica de horas: Hora Fin debe ser mayor que Hora Inicio
            if (horaInicio !== "" && horaFin !== "") {
                if (horaFin <= horaInicio) {
                    document.getElementById("error-rango-horas").style.display = "block";
                    esValido = false;
                } else {
                    document.getElementById("error-rango-horas").style.display = "none";
                }
            } else {
                document.getElementById("error-rango-horas").style.display = "none";
            }

            // Exigencia del profesor: Al menos un archivo y un enlace
            if (archivoEvi.length === 0) {
                document.getElementById("error-archivo").style.display = "block";
                esValido = false;
            } else {
                document.getElementById("error-archivo").style.display = "none";
            }

            const regexUrl = /^(https?:\/\/)/i;
            if (!regexUrl.test(enlaceEvi)) {
                document.getElementById("error-enlace").style.display = "block";
                esValido = false;
            } else {
                document.getElementById("error-enlace").style.display = "none";
            }

            // FLUJO TAREA 2: Si es válido, enviará al backend (la ruta la programaremos luego)
            if (esValido) {
                formActividad.submit();
            }
        });
    }
});