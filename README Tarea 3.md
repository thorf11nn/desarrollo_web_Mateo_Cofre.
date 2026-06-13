# Sistema de Gestión de Actividades - Área de Calidad de Vida DCC
## Tarea 3 - Desarrollo de Aplicaciones Web

## Descripción

Extensión del sistema desarrollado en la Tarea 2. Se agregaron estadísticas con gráficos en tiempo real y un sistema de comentarios por actividad, ambos implementados con llamadas asíncronas (`fetch`) desde el cliente hacia el servidor Flask.

## Estructura del proyecto

```
Tarea 3/
├── app.py                          # Servidor Flask principal
├── tarea2.sql                      # Estructura base de datos (provisto por el curso)
├── region-comuna.sql               # Datos de regiones y comunas (provisto por el curso)
├── tabla-comentario.sql            # Tabla comentario (provisto por el curso)
├── README.md                       # Este archivo
└── static/
    ├── styles.css                  # Estilos globales
    ├── validaciones.js             # Validaciones JS de formularios
    ├── listado.js                  # Lógica de filtrado del directorio
    ├── indicadores.js              # Gráficos con Chart.js (fetch a endpoints Flask)
    └── uploads/                    # Archivos multimedia subidos
└── templates/
    ├── index.html                  # Portada con últimos 5 miembros
    ├── registro_miembros.html      # Formulario de registro
    ├── informar_actividades.html   # Formulario de actividades
    ├── listado_miembros.html       # Directorio con paginación
    ├── detalle_miembro.html        # Detalle de miembro, actividades y comentarios
    └── indicadores.html            # Panel de indicadores con 3 gráficos
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

### Pasos para configurar la BD (ejecutar en orden)

1. Ejecutar `tarea2.sql` para crear la estructura base
2. Ejecutar `region-comuna.sql` para cargar regiones y comunas
3. Ejecutar `tabla-comentario.sql` para crear la tabla de comentarios
4. Ejecutar estas sentencias adicionales:

```sql
-- Permite teléfono opcional
ALTER TABLE miembro MODIFY COLUMN telefono VARCHAR(15) NULL;

-- Columna de rol para distinguir tipo de miembro
ALTER TABLE miembro ADD COLUMN rol VARCHAR(50) NOT NULL DEFAULT 'estudiante-pre';

-- Columna para enlace externo de la actividad
ALTER TABLE actividad ADD COLUMN enlace VARCHAR(300) NULL;

-- Cambia tipo de actividad de ENUM a VARCHAR para permitir los valores del sistema
ALTER TABLE actividad MODIFY COLUMN tipo VARCHAR(30) NOT NULL;

-- Valor por defecto para fecha de comentario
ALTER TABLE comentario MODIFY COLUMN fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
```

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

## Nuevas funcionalidades en Tarea 3

### Estadísticas (indicadores.html)
Se implementaron 3 gráficos usando **Chart.js** con datos reales desde la base de datos. Cada gráfico hace una llamada `fetch` independiente a un endpoint Flask que retorna JSON:

- `GET /api/estadisticas/miembros_por_dia` → gráfico de **líneas**: miembros registrados por día
- `GET /api/estadisticas/actividades_por_tipo` → gráfico de **torta**: actividades por categoría
- `GET /api/estadisticas/actividades_por_comuna` → gráfico de **barras**: actividades por comuna del miembro

Al final de la página hay un enlace para volver a la portada.

### Comentarios en actividades (detalle_miembro.html)
Cada actividad muestra un formulario para dejar comentarios y un listado de los ya existentes. Todo funciona de forma asíncrona sin recargar la página:

- `GET /api/comentarios/<actividad_id>` → carga los comentarios al abrir la página
- `POST /api/comentarios` → guarda un nuevo comentario y lo inserta en el DOM

#### Validaciones del formulario de comentario
- **Nombre**: obligatorio, mínimo 3 y máximo 80 caracteres
- **Texto**: obligatorio, mínimo 5 caracteres, textarea de 4 filas y 50 columnas
- Validación en cliente (JS) antes del fetch y validación en servidor (Flask) antes de guardar

## Biblioteca externa utilizada

- **Chart.js** (v4, CDN): `https://cdn.jsdelivr.net/npm/chart.js`  
  Licencia MIT, libre uso.

## Decisiones de diseño

### Columnas adicionales al modelo base
- `miembro.telefono` — se modificó a `NULL` para permitir registro sin teléfono
- `miembro.rol` — distingue entre los cuatro tipos de miembro del DCC
- `actividad.enlace` — guarda el enlace a contenido propio de la actividad

### Fetch independiente por gráfico
Cada gráfico hace su propia llamada `fetch` de forma independiente. Esto permite que si un endpoint falla, los otros gráficos igual se rendericen.

### Comentarios sin recarga
El formulario de comentario usa `fetch` con `POST` en JSON. Al recibir respuesta exitosa, el nuevo comentario se inserta directamente en el DOM sin recargar la página, mejorando la experiencia del usuario.

### Validación doble
Todas las validaciones se realizan en JavaScript del lado del cliente y luego en Python del lado del servidor. Si JS está desactivado o alguien manipula la petición, Flask igual valida y rechaza datos inválidos.

### Protección contra entradas maliciosas
- SQLAlchemy usa consultas parametrizadas, previniendo SQL injection
- Jinja2 escapa automáticamente el HTML en los templates, previniendo XSS
- En el JS los comentarios se insertan con `createTextNode`, no con `innerHTML`
- Se valida que el rol y tipo de actividad sean valores permitidos
