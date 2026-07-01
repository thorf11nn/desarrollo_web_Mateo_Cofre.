document.addEventListener("DOMContentLoaded", () => {

    const API_BASE = "http://localhost:8080/api/actividades";
    const input = document.getElementById("input-buscar");
    const contenedorResultados = document.getElementById("resultados-buscador");

    let timeoutBusqueda = null;

    input.addEventListener("input", () => {
        const texto = input.value.trim();

        // Limpiar el timeout anterior para no disparar búsquedas de más (debounce)
        clearTimeout(timeoutBusqueda);

        if (texto.length < 3) {
            contenedorResultados.innerHTML = "";
            return;
        }

        // Pequeña espera para no buscar en cada tecla individual
        timeoutBusqueda = setTimeout(() => {
            buscarActividades(texto);
        }, 300);
    });

    function buscarActividades(texto) {
        fetch(`${API_BASE}/buscar?texto=${encodeURIComponent(texto)}`)
            .then(respuesta => {
                if (!respuesta.ok) {
                    throw new Error("Error al buscar actividades");
                }
                return respuesta.json();
            })
            .then(actividades => mostrarResultados(actividades, texto))
            .catch(error => {
                contenedorResultados.innerHTML = `<p id="mensaje-sin-resultados">Ocurrió un error al buscar. Intenta nuevamente.</p>`;
                console.error(error);
            });
    }

    function resaltarTexto(campo, texto) {
        if (!campo) return "";
        const regex = new RegExp(`(${escaparRegex(texto)})`, "gi");
        return campo.replace(regex, "<mark>$1</mark>");
    }

    function escaparRegex(texto) {
        return texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    function mostrarResultados(actividades, texto) {
        contenedorResultados.innerHTML = "";

        if (actividades.length === 0) {
            contenedorResultados.innerHTML = `<p id="mensaje-sin-resultados">No se encontraron actividades que coincidan con "${texto}".</p>`;
            return;
        }

        actividades.forEach(act => {
            const articulo = document.createElement("article");
            articulo.className = "resultado-actividad";

            const notaTexto = act.notaPromedio !== null && act.notaPromedio !== undefined
                ? act.notaPromedio.toFixed(1)
                : "-";

            articulo.innerHTML = `
                <h3>${resaltarTexto(act.nombre, texto)}</h3>
                <p><strong>Miembro:</strong> ${act.nombreMiembro}</p>
                <p><strong>Día:</strong> ${act.dia}</p>
                <p><strong>Tipo:</strong> ${act.tipo}</p>
                <p><strong>Comuna:</strong> ${resaltarTexto(act.comuna, texto)}</p>
                <p><strong>Descripción:</strong> ${resaltarTexto(act.descripcion || "Sin descripción", texto)}</p>
                <div class="nota-info">
                    <strong>Nota:</strong>
                    <span class="nota-valor" data-actividad-id="${act.actividadId}">${notaTexto}</span>
                    <button type="button" class="boton-evaluar" data-actividad-id="${act.actividadId}">Evaluar</button>
                    <select class="select-nota" data-actividad-id="${act.actividadId}" style="display:none;">
                        <option value="">--</option>
                        ${[1,2,3,4,5,6,7].map(n => `<option value="${n}">${n}</option>`).join("")}
                    </select>
                </div>
            `;

            contenedorResultados.appendChild(articulo);
        });

        // Listeners para los botones "Evaluar" recién creados
        document.querySelectorAll(".boton-evaluar").forEach(boton => {
            boton.addEventListener("click", () => {
                const id = boton.dataset.actividadId;
                const select = document.querySelector(`.select-nota[data-actividad-id="${id}"]`);
                select.style.display = "inline-block";
                select.focus();
            });
        });

        document.querySelectorAll(".select-nota").forEach(select => {
            select.addEventListener("change", () => {
                const id = select.dataset.actividadId;
                const valor = parseInt(select.value, 10);

                if (!valor || valor < 1 || valor > 7) {
                    return;
                }

                enviarNota(id, valor, select);
            });
        });
    }

    function enviarNota(actividadId, valor, selectElemento) {
        fetch(`${API_BASE}/${actividadId}/nota`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nota: valor })
        })
            .then(respuesta => {
                if (!respuesta.ok) {
                    throw new Error("No se pudo guardar la nota");
                }
                return respuesta.json();
            })
            .then(data => {
                const spanNota = document.querySelector(`.nota-valor[data-actividad-id="${actividadId}"]`);
                spanNota.textContent = data.notaPromedio.toFixed(1);
                selectElemento.style.display = "none";
                selectElemento.value = "";
            })
            .catch(error => {
                alert("Error al guardar la nota. Intenta nuevamente.");
                console.error(error);
            });
    }

});