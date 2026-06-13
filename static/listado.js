document.addEventListener("DOMContentLoaded", () => {

    const miembros = [
        { nombre: "Ana Torres",      rol: "estudiante-pre",  email: "atorres@dcc.uchile.cl" },
        { nombre: "Juan Pérez",      rol: "estudiante-pre",  email: "jperez@dcc.uchile.cl" },
        { nombre: "María Soto",      rol: "estudiante-post", email: "msoto@dcc.uchile.cl" },
        { nombre: "Dra. Elena Gómez",rol: "academico",       email: "egomez@dcc.uchile.cl" },
        { nombre: "Dr. Luis Rojas",  rol: "academico",       email: "lrojas@dcc.uchile.cl" },
        { nombre: "Carlos Muñoz",    rol: "funcionario",     email: "cmunoz@dcc.uchile.cl" },
        { nombre: "Paula Vega",      rol: "funcionario",     email: "pvega@dcc.uchile.cl" },
        { nombre: "Sofía Herrera",   rol: "estudiante-pre",  email: "sherrera@dcc.uchile.cl" },
        { nombre: "Andrés Castillo", rol: "estudiante-post", email: "acastillo@dcc.uchile.cl" }
    ];

    const ITEMS_POR_PAGINA = 5;
    let paginaActual = 1;
    let miembrosFiltrados = [...miembros];

    const etiquetasRol = {
        "estudiante-pre":  "Estudiante Pregrado",
        "estudiante-post": "Estudiante Postgrado",
        "academico":       "Académico(a)",
        "funcionario":     "Funcionario(a)"
    };

    function filtrarYOrdenar() {
        const filtro = document.getElementById("filtro-tipo").value;
        const orden = document.getElementById("orden-datos").value;

        miembrosFiltrados = miembros.filter(m => {
            if (filtro === "todos") return true;
            return m.rol === filtro;
        });

        miembrosFiltrados.sort((a, b) => {
            if (orden === "nombre-asc") return a.nombre.localeCompare(b.nombre);
            if (orden === "nombre-desc") return b.nombre.localeCompare(a.nombre);
            if (orden === "email") return a.email.localeCompare(b.email);
            return 0;
        });

        paginaActual = 1;
        renderTabla();
        renderPaginacion();
    }

    function renderTabla() {
        const tbody = document.getElementById("tabla-cuerpo");
        tbody.innerHTML = "";

        const inicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
        const fin = inicio + ITEMS_POR_PAGINA;
        const pagina = miembrosFiltrados.slice(inicio, fin);

        if (pagina.length === 0) {
            const fila = document.createElement("tr");
            fila.innerHTML = `<td colspan="4">No se encontraron miembros con los filtros seleccionados.</td>`;
            tbody.appendChild(fila);
            return;
        }

        pagina.forEach(m => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${m.nombre}</td>
                <td>${etiquetasRol[m.rol]}</td>
                <td>${m.email}</td>
                <td><a href="#">Ver actividades</a></td>
            `;
            tbody.appendChild(fila);
        });
    }

    function renderPaginacion() {
        const totalPaginas = Math.ceil(miembrosFiltrados.length / ITEMS_POR_PAGINA);
        const nav = document.querySelector(".paginacion");
        nav.innerHTML = "";

        const liAnterior = document.createElement("li");
        const aAnterior = document.createElement("a");
        aAnterior.href = "#";
        aAnterior.setAttribute("aria-label", "Página anterior");
        aAnterior.textContent = "« Anterior";
        aAnterior.addEventListener("click", (e) => {
            e.preventDefault();
            if (paginaActual > 1) {
                paginaActual--;
                renderTabla();
                renderPaginacion();
            }
        });
        liAnterior.appendChild(aAnterior);
        nav.appendChild(liAnterior);

        for (let i = 1; i <= totalPaginas; i++) {
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.href = "#";
            a.textContent = i;
            if (i === paginaActual) {
                a.classList.add("activo");
                a.setAttribute("aria-current", "page");
            }
            a.addEventListener("click", (e) => {
                e.preventDefault();
                paginaActual = i;
                renderTabla();
                renderPaginacion();
            });
            li.appendChild(a);
            nav.appendChild(li);
        }

        const liSiguiente = document.createElement("li");
        const aSiguiente = document.createElement("a");
        aSiguiente.href = "#";
        aSiguiente.setAttribute("aria-label", "Página siguiente");
        aSiguiente.textContent = "Siguiente »";
        aSiguiente.addEventListener("click", (e) => {
            e.preventDefault();
            if (paginaActual < totalPaginas) {
                paginaActual++;
                renderTabla();
                renderPaginacion();
            }
        });
        liSiguiente.appendChild(aSiguiente);
        nav.appendChild(liSiguiente);
    }

    const btnAplicar = document.getElementById("btn-aplicar");
    if (btnAplicar) {
        btnAplicar.addEventListener("click", filtrarYOrdenar);
        filtrarYOrdenar();
    }

});
