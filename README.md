# Sistema de Gestión de Actividades - Área de Calidad de Vida DCC
## Tarea 4 - Desarrollo de Aplicaciones Web

## Descripción

Esta tarea agrega dos funcionalidades nuevas al sistema desarrollado en las tareas anteriores:

1. **Buscador de actividades**: búsqueda asíncrona que se dispara automáticamente al escribir 3 o más caracteres, buscando coincidencias en el nombre, la descripción o la comuna de la actividad. Los resultados destacan el texto que calza con lo buscado.
2. **Evaluación de actividades (notas)**: cada resultado del buscador muestra su nota (promedio de las evaluaciones) o un guion si aún no ha sido evaluada. Permite asignar una nota entera entre 1 y 7, que se guarda en la base de datos y recalcula el promedio en pantalla sin recargar.

Según lo pedido en el enunciado, estas funcionalidades nuevas se implementaron con **Spring Boot (Java 17) y JPA** en el backend, y **JavaScript con fetch** para las llamadas asíncronas en el frontend.

## Arquitectura: dos servidores

Una decisión importante de esta entrega es que el sistema queda distribuido en **dos servidores independientes**:

| Servidor | Puerto | Contenido |
|----------|--------|-----------|
| Flask (Tareas 2 y 3) | `127.0.0.1:5000` | Registro de miembros, informar actividades, directorio, detalle, indicadores y comentarios |
| Spring Boot (Tarea 4) | `localhost:8080` | Buscador de actividades y sistema de notas |

**Justificación**: el enunciado de la Tarea 4 pide implementar únicamente las funcionalidades nuevas en Spring Boot. Las tareas anteriores ya estaban desarrolladas, probadas y evaluadas en Flask. Reescribir todo lo existente en Spring Boot habría sido innecesario y habría introducido riesgo de regresión sobre funcionalidad ya validada. Por eso se mantuvo cada funcionalidad en su stack correspondiente y se conectaron ambos sistemas mediante enlaces de navegación cruzados. Ambos servidores usan la **misma base de datos MySQL** (`tarea2`), por lo que los datos son consistentes entre ambos.

## Estructura del proyecto (Spring Boot)

```
tarea4/
├── pom.xml                              # Dependencias Maven
├── mvnw / mvnw.cmd                      # Maven Wrapper
└── src/main/
    ├── java/cl/uchile/dcc/tarea4/
    │   ├── Tarea4Application.java       # Punto de entrada
    │   ├── model/                       # Entidades JPA
    │   │   ├── Miembro.java
    │   │   ├── Comuna.java
    │   │   ├── Actividad.java
    │   │   └── Nota.java
    │   ├── repository/                  # Repositorios Spring Data JPA
    │   │   ├── MiembroRepository.java
    │   │   ├── ComunaRepository.java
    │   │   ├── ActividadRepository.java
    │   │   └── NotaRepository.java
    │   ├── dto/                         # Objetos de transferencia (JSON)
    │   │   ├── ActividadResultadoDTO.java
    │   │   ├── NotaRequestDTO.java
    │   │   └── NotaResponseDTO.java
    │   └── controller/
    │       └── ActividadController.java # Endpoints REST
    └── resources/
        ├── application.properties       # Configuración de la BD
        └── static/                      # Servido en localhost:8080
            ├── buscador.html
            ├── buscador.js
            └── styles.css
```

## Base de datos

Se usa la **misma base de datos `tarea2`** de las tareas anteriores. Para esta tarea se agrega una tabla nueva, `nota`, usando el script oficial del curso `tabla-nota.sql`:

```sql
CREATE TABLE IF NOT EXISTS `tarea2`.`nota` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `actividad_id` INT NOT NULL,
  `nota` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_nota_actividad1_idx` (`actividad_id` ASC),
  CONSTRAINT `fk_nota_actividad1`
    FOREIGN KEY (`actividad_id`)
    REFERENCES `tarea2`.`actividad` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
```

Cada fila de `nota` representa una evaluación individual asociada a una actividad. La nota mostrada en la interfaz es el **promedio** de todas las evaluaciones de esa actividad, calculado en el servidor.

### Credenciales

```
Host: localhost
Puerto: 3306
Base de datos: tarea2
Usuario: cc5002
Contraseña: programacionweb
```

Si el usuario `cc5002` no existe en la instancia de MySQL, crear con:

```sql
CREATE USER 'cc5002'@'localhost' IDENTIFIED BY 'programacionweb';
GRANT ALL PRIVILEGES ON tarea2.* TO 'cc5002'@'localhost';
```

## Requisitos e instalación

- **JDK 17** o superior (probado con Eclipse Temurin 17)
- **MySQL** corriendo (probado con XAMPP)
- No es necesario instalar Maven: el proyecto incluye el Maven Wrapper (`mvnw`)

## Cómo ejecutar

1. Asegurarse de que MySQL esté corriendo y la base `tarea2` exista con la tabla `nota` creada.
2. Desde la carpeta raíz del proyecto (donde está `pom.xml`):

```bash
./mvnw spring-boot:run        # Linux/Mac
.\mvnw.cmd spring-boot:run    # Windows PowerShell
```

3. Abrir en el navegador: `http://localhost:8080/buscador.html`
4. (Opcional) Levantar también el servidor Flask de las tareas anteriores en `http://127.0.0.1:5000` para usar el sistema completo con navegación entre ambos.

## Endpoints implementados

### `GET /api/actividades/buscar?texto={texto}`
Busca actividades cuyo nombre, descripción o comuna asociada contengan el texto (insensible a mayúsculas/minúsculas). Devuelve un arreglo JSON con: id de la actividad, nombre del miembro, día, tipo, comuna, nombre, descripción y nota promedio (`null` si no tiene evaluaciones).

### `POST /api/actividades/{id}/nota`
Recibe un JSON `{ "nota": n }`, valida que sea un entero entre 1 y 7, lo inserta en la base de datos asociado a la actividad indicada, y devuelve el nuevo promedio recalculado. Si la nota está fuera de rango, responde con error 400 y un mensaje. Si la actividad no existe, responde 404.

## Decisiones de diseño

### Uso de DTOs
En lugar de exponer las entidades JPA directamente en las respuestas JSON, se usan objetos DTO (`Data Transfer Object`). Esto evita problemas de serialización circular (una actividad referencia a un miembro, que referencia a sus actividades, y así sucesivamente) y permite controlar exactamente qué campos se envían al cliente, sin exponer datos de más.

### Cálculo del promedio en el servidor
El promedio de las notas se calcula en el backend (en `ActividadController`) recorriendo todas las notas asociadas a la actividad tras cada inserción. Esto garantiza que el valor mostrado siempre refleje el estado real de la base de datos.

### Validación doble de la nota
La nota se valida en dos niveles: en el cliente, el selector solo ofrece valores enteros del 1 al 7; en el servidor, se verifica explícitamente el rango antes de insertar. Así, aunque alguien manipule la petición directamente (por ejemplo enviando `{ "nota": 9 }`), el servidor la rechaza.

### Prevención de entradas maliciosas
- Las consultas a la base de datos usan JPQL con parámetros (`:texto`), lo que previene inyección SQL.
- En el frontend, el contenido dinámico de las tarjetas se escapa con una función `escaparHtml()` antes de insertarse en el DOM, previniendo inyección de HTML/XSS si algún nombre de actividad o comentario contuviera etiquetas.
- El término buscado se escapa antes de construir la expresión regular del resaltado, evitando que caracteres especiales rompan la búsqueda.

### `ddl-auto=none`
Hibernate está configurado para **no modificar** el esquema de la base de datos. El esquema se gestiona manualmente con los scripts SQL del curso, evitando que el ORM altere o recree tablas de tareas anteriores.

### CORS
El controlador habilita CORS (`@CrossOrigin`) para permitir que el frontend haga peticiones fetch entre orígenes durante el desarrollo. En un entorno de producción se restringiría al origen específico.

## Bibliotecas y tecnologías utilizadas

- **Spring Boot 4.1.0** (Spring Web, Spring Data JPA)
- **Hibernate** (implementación de JPA, incluida en Spring Data JPA)
- **MySQL Connector/J** (driver JDBC)
- **JavaScript nativo** con `fetch` para las llamadas asíncronas (sin bibliotecas externas de frontend)
- **HTML5 y CSS3** validados con los validadores del W3C

## Validación W3C

Los archivos `buscador.html` y `styles.css` fueron validados con:
- HTML: http://validator.w3.org/
- CSS: http://jigsaw.w3.org/css-validator/
