document.addEventListener("DOMContentLoaded", () => {

    // =========================================
    // REGISTRO DE MIEMBROS
    // =========================================

    const formRegistro = document.getElementById("form-registro");
    const selectTipo = document.getElementById("tipo-miembro");

    const camposDinamicos = {
        "estudiante-pre": document.getElementById("campos-estudiante-pre"),
        "estudiante-post": document.getElementById("campos-estudiante-post"),
        "academico": document.getElementById("campos-academico"),
        "funcionario": document.getElementById("campos-funcionario")
    };

    if (selectTipo) {
        selectTipo.addEventListener("change", () => {
            const valorSeleccionado = selectTipo.value;

            for (const clave in camposDinamicos) {
                if (camposDinamicos[clave]) {
                    camposDinamicos[clave].style.display = (clave === valorSeleccionado) ? "block" : "none";

                    const inputs = camposDinamicos[clave].querySelectorAll("input, select");
                    inputs.forEach(input => input.value = "");

                    const errores = camposDinamicos[clave].querySelectorAll(".error");
                    errores.forEach(e => e.style.display = "none");
                }
            }
        });
    }

    if (formRegistro) {
        formRegistro.addEventListener("submit", (event) => {
            event.preventDefault();

            const nombre = document.getElementById("nombre").value.trim();
            const email = document.getElementById("email").value.trim();
            const telefono = document.getElementById("telefono").value.trim();
            const tipoMiembro = document.getElementById("tipo-miembro").value;

            const errorNombre = document.getElementById("error-nombre");
            const errorEmail = document.getElementById("error-email");
            const errorTelefono = document.getElementById("error-telefono");
            const errorTipo = document.getElementById("error-tipo");

            let esValido = true;

            if (nombre.length === 0) {
                errorNombre.style.display = "block";
                esValido = false;
            } else {
                errorNombre.style.display = "none";
            }

            const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!regexEmail.test(email)) {
                errorEmail.style.display = "block";
                esValido = false;
            } else {
                errorEmail.style.display = "none";
            }

            if (telefono.length > 0) {
                const regexTel = /^\+?[\d\s\-]{7,15}$/;
                if (!regexTel.test(telefono)) {
                    errorTelefono.style.display = "block";
                    esValido = false;
                } else {
                    errorTelefono.style.display = "none";
                }
            } else {
                errorTelefono.style.display = "none";
            }

            if (tipoMiembro === "") {
                errorTipo.style.display = "block";
                esValido = false;
            } else {
                errorTipo.style.display = "none";
            }

            if (tipoMiembro === "estudiante-pre") {
                const carrera = document.getElementById("carrera").value.trim();
                const anio = document.getElementById("anio-ingreso").value.trim();
                const errorCarrera = document.getElementById("error-carrera");
                const errorAnio = document.getElementById("error-anio");

                if (carrera.length === 0) {
                    errorCarrera.style.display = "block";
                    esValido = false;
                } else {
                    errorCarrera.style.display = "none";
                }

                const anioNum = parseInt(anio, 10);
                if (anio.length === 0 || isNaN(anioNum) || anioNum < 2000 || anioNum > 2026) {
                    errorAnio.style.display = "block";
                    esValido = false;
                } else {
                    errorAnio.style.display = "none";
                }
            }

            if (tipoMiembro === "estudiante-post") {
                const programa = document.getElementById("programa").value.trim();
                const errorPrograma = document.getElementById("error-programa");

                if (programa.length === 0) {
                    errorPrograma.style.display = "block";
                    esValido = false;
                } else {
                    errorPrograma.style.display = "none";
                }
            }

            if (tipoMiembro === "academico") {
                const area = document.getElementById("area-investigacion").value.trim();
                const jerarquia = document.getElementById("jerarquia").value;
                const errorArea = document.getElementById("error-area");
                const errorJerarquia = document.getElementById("error-jerarquia");

                if (area.length === 0) {
                    errorArea.style.display = "block";
                    esValido = false;
                } else {
                    errorArea.style.display = "none";
                }

                if (jerarquia === "") {
                    errorJerarquia.style.display = "block";
                    esValido = false;
                } else {
                    errorJerarquia.style.display = "none";
                }
            }

            if (tipoMiembro === "funcionario") {
                const unidad = document.getElementById("unidad").value.trim();
                const errorUnidad = document.getElementById("error-unidad");

                if (unidad.length === 0) {
                    errorUnidad.style.display = "block";
                    esValido = false;
                } else {
                    errorUnidad.style.display = "none";
                }
            }

            if (esValido) {
                alert(`¡Registro exitoso! Bienvenido/a a la comunidad, ${nombre}.`);
                formRegistro.reset();

                for (const clave in camposDinamicos) {
                    if (camposDinamicos[clave]) {
                        camposDinamicos[clave].style.display = "none";
                    }
                }
            }
        });
    }

    // =========================================
    // INFORMAR ACTIVIDAD
    // =========================================

    const formActividad = document.getElementById("form-actividad");

    if (formActividad) {
        formActividad.addEventListener("submit", (event) => {
            event.preventDefault();

            const nombreAct = document.getElementById("nombre-actividad").value.trim();
            const tipoAct = document.getElementById("tipo-actividad").value;
            const diasSeleccionados = document.querySelectorAll("input[name='dias']:checked");
            const horaInicio = document.getElementById("hora-inicio").value;
            const horaFin = document.getElementById("hora-fin").value;
            const archivoEvi = document.getElementById("archivo-evidencia").files;
            const enlaceEvi = document.getElementById("enlace-evidencia").value.trim();

            const errorNombreAct = document.getElementById("error-nombre-act");
            const errorTipoAct = document.getElementById("error-tipo-act");
            const errorDias = document.getElementById("error-dias");
            const errorHoraInicio = document.getElementById("error-hora-inicio");
            const errorHoraFin = document.getElementById("error-hora-fin");
            const errorRangoHoras = document.getElementById("error-rango-horas");
            const errorArchivo = document.getElementById("error-archivo");
            const errorEnlace = document.getElementById("error-enlace");

            let esValido = true;

            if (nombreAct === "") {
                errorNombreAct.style.display = "block";
                esValido = false;
            } else {
                errorNombreAct.style.display = "none";
            }

            if (tipoAct === "") {
                errorTipoAct.style.display = "block";
                esValido = false;
            } else {
                errorTipoAct.style.display = "none";
            }

            if (diasSeleccionados.length === 0) {
                errorDias.style.display = "block";
                esValido = false;
            } else {
                errorDias.style.display = "none";
            }

            if (horaInicio === "") {
                errorHoraInicio.style.display = "block";
                esValido = false;
            } else {
                errorHoraInicio.style.display = "none";
            }

            if (horaFin === "") {
                errorHoraFin.style.display = "block";
                esValido = false;
            } else {
                errorHoraFin.style.display = "none";

                if (horaInicio !== "" && horaFin <= horaInicio) {
                    errorRangoHoras.style.display = "block";
                    esValido = false;
                } else {
                    errorRangoHoras.style.display = "none";
                }
            }

            if (archivoEvi.length === 0) {
                errorArchivo.style.display = "block";
                esValido = false;
            } else {
                errorArchivo.style.display = "none";
            }

            const regexUrl = /^https?:\/\/.+\..+/i;
            if (!regexUrl.test(enlaceEvi)) {
                errorEnlace.style.display = "block";
                esValido = false;
            } else {
                errorEnlace.style.display = "none";
            }

            if (esValido) {
                alert(`¡Actividad "${nombreAct}" registrada exitosamente!`);
                formActividad.reset();
            }
        });
    }

});
