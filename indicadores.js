document.addEventListener("DOMContentLoaded", () => {

    const ctxMiembros = document.getElementById("grafico-miembros");
    if (ctxMiembros) {
        new Chart(ctxMiembros.getContext("2d"), {
            type: "doughnut",
            data: {
                labels: ["Estudiantes Pregrado", "Estudiantes Postgrado", "Académicos", "Funcionarios"],
                datasets: [{
                    data: [60, 25, 22, 17],
                    backgroundColor: ["#003366", "#4e79a7", "#59a14f", "#f28e2b"]
                }]
            },
            options: {
                plugins: {
                    legend: { position: "bottom" }
                }
            }
        });
    }

    const ctxActividades = document.getElementById("grafico-actividades");
    if (ctxActividades) {
        new Chart(ctxActividades.getContext("2d"), {
            type: "bar",
            data: {
                labels: ["Deportiva", "Artística", "Tecnológica", "Social", "Recreativa"],
                datasets: [{
                    label: "Cantidad de actividades",
                    data: [18, 12, 9, 10, 7],
                    backgroundColor: "#003366"
                }]
            },
            options: {
                scales: {
                    y: { beginAtZero: true }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }

});