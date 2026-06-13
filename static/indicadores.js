document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // GRÁFICO 1: Miembros registrados por día (líneas)
    // ==========================================
    fetch('/api/estadisticas/miembros_por_dia')
        .then(function(response) { return response.json(); })
        .then(function(datos) {
            var etiquetas = datos.map(function(d) { return d.dia; });
            var valores   = datos.map(function(d) { return d.total; });

            var ctx = document.getElementById('grafico-miembros-dia');
            if (!ctx) { return; }

            new Chart(ctx.getContext('2d'), {
                type: 'line',
                data: {
                    labels: etiquetas,
                    datasets: [{
                        label: 'Miembros registrados',
                        data: valores,
                        borderColor: '#003366',
                        backgroundColor: 'rgba(0, 51, 102, 0.1)',
                        borderWidth: 2,
                        pointRadius: 4,
                        fill: true,
                        tension: 0.3
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { stepSize: 1 }
                        }
                    },
                    plugins: {
                        legend: { position: 'top' }
                    }
                }
            });
        })
        .catch(function(err) {
            console.error('Error cargando miembros por día:', err);
        });


    // ==========================================
    // GRÁFICO 2: Actividades por tipo (torta)
    // ==========================================
    fetch('/api/estadisticas/actividades_por_tipo')
        .then(function(response) { return response.json(); })
        .then(function(datos) {
            var etiquetas = datos.map(function(d) { return d.tipo; });
            var valores   = datos.map(function(d) { return d.total; });

            var colores = ['#003366', '#4e79a7', '#59a14f', '#f28e2b', '#e15759'];

            var ctx = document.getElementById('grafico-actividades-tipo');
            if (!ctx) { return; }

            new Chart(ctx.getContext('2d'), {
                type: 'pie',
                data: {
                    labels: etiquetas,
                    datasets: [{
                        data: valores,
                        backgroundColor: colores.slice(0, etiquetas.length)
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { position: 'bottom' }
                    }
                }
            });
        })
        .catch(function(err) {
            console.error('Error cargando actividades por tipo:', err);
        });


    // ==========================================
    // GRÁFICO 3: Actividades por comuna (barras)
    // ==========================================
    fetch('/api/estadisticas/actividades_por_comuna')
        .then(function(response) { return response.json(); })
        .then(function(datos) {
            var etiquetas = datos.map(function(d) { return d.comuna; });
            var valores   = datos.map(function(d) { return d.total; });

            var ctx = document.getElementById('grafico-actividades-comuna');
            if (!ctx) { return; }

            new Chart(ctx.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: etiquetas,
                    datasets: [{
                        label: 'Total de actividades',
                        data: valores,
                        backgroundColor: '#003366'
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { stepSize: 1 }
                        },
                        x: {
                            ticks: {
                                maxRotation: 45,
                                minRotation: 30
                            }
                        }
                    },
                    plugins: {
                        legend: { display: false }
                    }
                }
            });
        })
        .catch(function(err) {
            console.error('Error cargando actividades por comuna:', err);
        });

});
