# Sistema de Gestión de Actividades - Área de Calidad de Vida DCC
## Tarea 2 - Desarrollo de Aplicaciones Web

## Descripción

Implementación del sistema de gestión de actividades extracurriculares de la comunidad del Departamento de Ciencias de la Computación, usando Python con Flask y base de datos MySQL. Permite registrar miembros, informar actividades con archivos adjuntos, y consultar el directorio de miembros con paginación.

## Estructura del proyecto

```
Tarea 2/
├── app.py                          # Servidor Flask principal
├── tarea2.sql                      # Estructura base de datos (provisto por el curso)
├── region-comuna.sql               # Datos de regiones y comunas (provisto por el curso)
├── templates/
│   ├── index.html                  # Portada con últimos 5 miembros
│   ├── registro_miembros.html      # Formulario de registro
│   ├── informar_actividades.html   # Formulario de actividades
│   ├── listado_miembros.html       # Directorio con paginación
│   ├── detalle_miembro.html        # Detalle de miembro y sus actividades
│   └── indicadores.html            # Panel de indicadores (pendiente tarea 3)
└── static/
    ├── styles.css                  # Estilos globales
    ├── validaciones.js             # Validaciones JS de formularios
    ├── listado.js                  # Lógica de filtrado del directorio
    ├── indicadores.js              # Gráficos con Chart.js
    └── media/                      # Carpeta donde se almacenan los archivos subidos
```

## Configuración de la base de datos

### Credenciales
```
Host: localhost
Puerto: 3306
Base de datos: tarea2
Usuario: cc5002
Contraseña: programacionweb
```

### Pasos para configurar la BD

1. Ejecutar `tarea2.sql` para crear la estructura base
2. Ejecutar `region-comuna.sql` para cargar regiones y comunas
3. **IMPORTANTE** — Ejecutar estas dos sentencias adicionales:

```sql
ALTER TABLE miembro ADD COLUMN rol VARCHAR(50) NOT NULL DEFAULT 'estudiante-pre';
ALTER TABLE actividad ADD COLUMN enlace VARCHAR(300) NULL;
```

> Estas columnas no están en el `tarea2.sql` original pero son necesarias para el funcionamiento. Sin ellas la aplicación lanzará un error. Ver sección "Decisiones de diseño" para la justificación.

### Crear usuario (si no existe)
```sql
CREATE USER 'cc5002'@'localhost' IDENTIFIED BY 'programacionweb';
GRANT ALL PRIVILEGES ON tarea2.* TO 'cc5002'@'localhost';
FLUSH PRIVILEGES;
```

## Instalación de dependencias

```bash
pip install flask flask-sqlalchemy mysql-connector-python werkzeug
```

## Cómo ejecutar

```bash
python app.py
```

Abrir en el navegador: `http://127.0.0.1:5000`

## Decisiones de diseño

### Columnas adicionales al modelo base
El enunciado indica que el modelo puede ajustarse a las decisiones tomadas en la tarea 1. Se agregaron dos columnas:
- `miembro.rol` — necesaria para distinguir entre los cuatro tipos de miembro (estudiante pregrado, postgrado, académico, funcionario) definidos en la tarea 1
- `actividad.enlace` — necesaria para cumplir el requisito de guardar un enlace a contenido propio de la actividad

### Actividades por día
Al informar una actividad con múltiples días seleccionados, se crea un registro de actividad por cada día. Esto permite que en el futuro cada día pueda tener horarios o evidencias distintas. El archivo subido se asocia a cada actividad creada.

### Almacenamiento de archivos
Los archivos se guardan en `static/media/` con un timestamp como prefijo para evitar colisiones de nombres. La ruta relativa se guarda en la tabla `foto` para acceder al archivo desde los templates con `url_for('static', ...)`.

### Validación doble
Todas las validaciones se realizan dos veces: primero en JavaScript del lado del cliente sin usar el atributo `required`, y después en Python del lado del servidor. Si el JS está desactivado o alguien manipula la petición, Flask igual valida y rechaza datos inválidos.

### Protección contra entradas maliciosas
- SQLAlchemy usa consultas parametrizadas automáticamente, previniendo SQL injection
- Los nombres de archivos se procesan con `secure_filename` de Werkzeug
- Jinja2 escapa automáticamente el HTML en los templates, previniendo XSS
- Se valida que el tipo de archivo sea imagen o video antes de guardarlo
- Se valida que el rol enviado sea uno de los valores permitidos

### Paginación
El listado usa `.paginate()` de SQLAlchemy que maneja la paginación del lado del servidor, mostrando 5 miembros por página.

### Mensajes al usuario
Se eliminó el uso de `alert()` de JavaScript. Los mensajes de éxito y error se muestran en el HTML usando el sistema `flash()` de Flask, garantizando que funcionen aunque el usuario tenga los alerts del navegador desactivados.

## Funcionalidades implementadas

- Portada con mensaje de bienvenida y últimos 5 miembros registrados
- Registro de miembros con validación JS y validación en servidor
- Formulario de actividades con subida de archivos a `static/media/`
- Listado de miembros desde la base de datos con paginación
- Detalle de miembro con sus actividades y fotos asociadas
- Indicadores con gráficos de ejemplo (pendiente tarea 3)
