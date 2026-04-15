# Sistema de Gestión de Actividades - Área de Calidad de Vida DCC

## Descripción

Prototipo web desarrollado para el curso de Desarrollo Web de la Universidad de Chile. Permite gestionar las actividades extracurriculares de los miembros de la comunidad del Departamento de Ciencias de la Computación (DCC): estudiantes de pre y postgrado, académicos y funcionarios.

## Estructura de archivos

```
├── index.html                  # Página de inicio con accesos directos
├── registro_miembros.html      # Formulario de registro de miembros
├── informar_actividades.html   # Formulario para informar actividades
├── listado_miembros.html       # Directorio con filtros y paginación
├── indicadores.html            # Panel de métricas y gráficos
├── styles.css                  # Estilos globales del sistema
├── validaciones.js             # Validaciones JS de los formularios
├── listado.js                  # Lógica de filtrado, ordenamiento y paginación
└── indicadores.js              # Renderizado de gráficos con Chart.js
```

## Decisiones de diseño

### Formularios y validación
- Todas las validaciones están implementadas en JavaScript puro, sin uso del atributo `required` de HTML5.
- Los mensajes de error están ocultos por defecto mediante CSS (`display: none`) y se muestran/ocultan dinámicamente con JS según el resultado de cada validación.
- El campo de teléfono es opcional en el registro, pero si se ingresa, se valida su formato con expresión regular.

### Registro de miembros
- El formulario muestra campos adicionales según el tipo de miembro seleccionado (pregrado, postgrado, académico o funcionario), usando `fieldset` ocultos que se activan con JS al cambiar el `select`. Al cambiar de tipo, los campos anteriores se limpian automáticamente.

### Informar actividad
- Los días de la semana se seleccionan mediante checkboxes en lugar de texto libre, para facilitar la validación y evitar ambigüedades.
- Los horarios usan `input type="time"` y se valida que la hora de término sea posterior a la de inicio.
- Tanto el archivo adjunto como el enlace URL son obligatorios según el enunciado.

### Directorio de miembros
- El filtrado, ordenamiento y paginación son completamente funcionales en JS con datos de ejemplo hardcodeados, dado que el sistema no requiere backend.
- La paginación se genera dinámicamente según el número de resultados filtrados.

### Indicadores
- Los gráficos se renderizan con la librería Chart.js (CDN) sobre elementos `canvas` de HTML5.
- Los datos son de ejemplo, representativos de un sistema en producción.

### Estilos
- Se utilizan variables CSS en `:root` para centralizar colores y facilitar cambios globales.
- El layout usa CSS Grid con `repeat(auto-fit, minmax(...))` para adaptarse a distintas resoluciones sin media queries adicionales.
- El footer siempre se mantiene al fondo usando `flexbox` en el `body` con `min-height: 100vh` y `flex: 1` en el `main`.
