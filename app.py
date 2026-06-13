import os
import re
from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.utils import secure_filename
 
app = Flask(__name__)
app.secret_key = "clave_secreta_dcc"
 
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://cc5002:programacionweb@localhost:3306/tarea2'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = os.path.join('static', 'uploads')
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB máximo
 
EXTENSIONES_PERMITIDAS = {'png', 'jpg', 'jpeg', 'gif', 'webp', 'mp4', 'mov', 'avi'}
 
db = SQLAlchemy(app)
 
 
# ==========================================
# MODELOS
# ==========================================
 
class Region(db.Model):
    __tablename__ = 'region'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(200), nullable=False)
    comunas = db.relationship('Comuna', backref='region', lazy=True)
 
class Comuna(db.Model):
    __tablename__ = 'comuna'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(200), nullable=False)
    region_id = db.Column(db.Integer, db.ForeignKey('region.id'), nullable=False)
    miembros = db.relationship('Miembro', backref='comuna', lazy=True)
 
class Miembro(db.Model):
    __tablename__ = 'miembro'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombre = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(80), nullable=False, unique=True)
    telefono = db.Column(db.String(20), nullable=True)
    fecha_registro = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    comuna_id = db.Column(db.Integer, db.ForeignKey('comuna.id'), nullable=False)
    rol = db.Column(db.String(50), nullable=False)
    actividades = db.relationship('Actividad', backref='miembro', lazy=True)
 
class Actividad(db.Model):
    __tablename__ = 'actividad'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    miembro_id = db.Column(db.Integer, db.ForeignKey('miembro.id'), nullable=False)
    dia = db.Column(db.String(20), nullable=False)
    hora_inicio = db.Column(db.String(5), nullable=False)
    duracion = db.Column(db.String(5), nullable=False)
    tipo = db.Column(db.String(30), nullable=False)
    nombre = db.Column(db.String(45), nullable=False)
    descripcion = db.Column(db.Text, nullable=True)
    enlace = db.Column(db.String(300), nullable=True)
    fotos = db.relationship('Foto', backref='actividad', lazy=True)
 
class Foto(db.Model):
    __tablename__ = 'foto'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    ruta_archivo = db.Column(db.String(300), nullable=False)
    nombre_archivo = db.Column(db.String(300), nullable=False)
    actividad_id = db.Column(db.Integer, db.ForeignKey('actividad.id'), nullable=False)

class Comentario(db.Model):
    __tablename__ = 'comentario'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombre = db.Column(db.String(80), nullable=False)
    texto = db.Column(db.String(300), nullable=False)
    fecha = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    actividad_id = db.Column(db.Integer, db.ForeignKey('actividad.id'), nullable=False)
 
 
# ==========================================
# FUNCIONES AUXILIARES
# ==========================================
 
def extension_permitida(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in EXTENSIONES_PERMITIDAS
 
def validar_email(email):
    regex = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
    return re.match(regex, email) is not None
 
def validar_telefono(telefono):
    regex = r'^\+?[\d\s\-]{7,20}$'
    return re.match(regex, telefono) is not None
 
def validar_url(url):
    return url.startswith('http://') or url.startswith('https://')
 
 
# ==========================================
# RUTAS GET
# ==========================================
 
@app.route('/')
def index():
    ultimos_miembros = Miembro.query.order_by(Miembro.fecha_registro.desc()).limit(5).all()
    return render_template('index.html', ultimos_miembros=ultimos_miembros)
 
@app.route('/registro_miembros')
def registro_miembros():
    regiones = Region.query.order_by(Region.nombre).all()
    comunas = Comuna.query.order_by(Comuna.nombre).all()
    return render_template('registro_miembros.html', regiones=regiones, comunas=comunas)
 
@app.route('/informar_actividades')
def informar_actividades():
    miembros = Miembro.query.order_by(Miembro.nombre).all()
    return render_template('informar_actividades.html', miembros=miembros)
 
@app.route('/listado_miembros')
def listado_miembros():
    pagina = request.args.get('pagina', 1, type=int)
    por_pagina = 5
    paginacion = Miembro.query.order_by(Miembro.nombre).paginate(
        page=pagina, per_page=por_pagina, error_out=False
    )
    return render_template('listado_miembros.html', paginacion=paginacion)
 
@app.route('/miembro/<int:miembro_id>')
def detalle_miembro(miembro_id):
    miembro = Miembro.query.get_or_404(miembro_id)
    return render_template('detalle_miembro.html', miembro=miembro)
 
@app.route('/indicadores')
def indicadores():
    return render_template('indicadores.html')
 
 
# ==========================================
# RUTA POST: REGISTRAR MIEMBRO
# ==========================================
 
@app.route('/procesar_registro', methods=['POST'])
def procesar_registro():
    nombre = request.form.get('nombre', '').strip()
    email = request.form.get('email', '').strip()
    telefono = request.form.get('telefono', '').strip()
    tipo_miembro = request.form.get('tipo-miembro', '').strip()
    comuna_id = request.form.get('comuna_id', '').strip()
 
    errores = []
 
    if not nombre:
        errores.append("El nombre es obligatorio.")
    if not email or not validar_email(email):
        errores.append("Debe ingresar un correo electrónico válido.")
    if telefono and not validar_telefono(telefono):
        errores.append("El formato del teléfono no es válido.")
    if not tipo_miembro:
        errores.append("Debe seleccionar un rol.")
    if not comuna_id:
        errores.append("Debe seleccionar una comuna.")
 
    roles_validos = ['estudiante-pre', 'estudiante-post', 'academico', 'funcionario']
    if tipo_miembro and tipo_miembro not in roles_validos:
        errores.append("El rol seleccionado no es válido.")
 
    if errores:
        for e in errores:
            flash(e, "error")
        regiones = Region.query.order_by(Region.nombre).all()
        comunas = Comuna.query.order_by(Comuna.nombre).all()
        return render_template('registro_miembros.html', regiones=regiones, comunas=comunas)
 
    try:
        nuevo_miembro = Miembro(
            nombre=nombre,
            email=email,
            telefono=telefono if telefono else None,
            comuna_id=int(comuna_id),
            rol=tipo_miembro,
            fecha_registro=datetime.utcnow()
        )
        db.session.add(nuevo_miembro)
        db.session.commit()
        flash(f"¡Registro exitoso! Bienvenido/a a la comunidad, {nombre}.", "success")
        return redirect(url_for('index'))
 
    except Exception:
        db.session.rollback()
        flash("Error al registrar: el correo ya existe o los datos son inválidos.", "error")
        regiones = Region.query.order_by(Region.nombre).all()
        comunas = Comuna.query.order_by(Comuna.nombre).all()
        return render_template('registro_miembros.html', regiones=regiones, comunas=comunas)
 
 
# ==========================================
# RUTA POST: INFORMAR ACTIVIDAD
# ==========================================
 
@app.route('/procesar_actividad', methods=['POST'])
def procesar_actividad():
    miembro_id = request.form.get('miembro_id', '').strip()
    nombre_act = request.form.get('nombre-actividad', '').strip()
    tipo_act = request.form.get('tipo-actividad', '').strip()
    dias = request.form.getlist('dias')
    hora_inicio = request.form.get('hora-inicio', '').strip()
    hora_fin = request.form.get('hora-fin', '').strip()
    enlace = request.form.get('enlace-evidencia', '').strip()
    archivo = request.files.get('archivo-evidencia')
 
    errores = []
 
    if not miembro_id:
        errores.append("Debe seleccionar un miembro.")
    if not nombre_act:
        errores.append("El nombre de la actividad es obligatorio.")
 
    tipos_validos = ['artistica', 'deportiva', 'tecnologica', 'social', 'recreativa']
    if not tipo_act or tipo_act not in tipos_validos:
        errores.append("Debe seleccionar una categoría válida.")
 
    if not dias:
        errores.append("Debe seleccionar al menos un día.")
 
    dias_validos = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']
    for dia in dias:
        if dia not in dias_validos:
            errores.append("Uno de los días seleccionados no es válido.")
            break
 
    if not hora_inicio:
        errores.append("Debe indicar la hora de inicio.")
    if not hora_fin:
        errores.append("Debe indicar la hora de término.")
    if hora_inicio and hora_fin and hora_fin <= hora_inicio:
        errores.append("La hora de término debe ser posterior a la de inicio.")
 
    if not enlace or not validar_url(enlace):
        errores.append("Debe ingresar un enlace válido (http:// o https://).")
 
    if not archivo or archivo.filename == '':
        errores.append("Debe adjuntar al menos un archivo multimedia.")
    elif not extension_permitida(archivo.filename):
        errores.append("El archivo debe ser una imagen o video (png, jpg, gif, mp4, etc.).")
 
    if errores:
        for e in errores:
            flash(e, "error")
        miembros = Miembro.query.order_by(Miembro.nombre).all()
        return render_template('informar_actividades.html', miembros=miembros)
 
    try:
        duracion = ""
        if hora_inicio and hora_fin:
            h_ini = int(hora_inicio.split(':')[0]) * 60 + int(hora_inicio.split(':')[1])
            h_fin = int(hora_fin.split(':')[0]) * 60 + int(hora_fin.split(':')[1])
            diff = h_fin - h_ini
            duracion = f"{diff // 60}h{diff % 60:02d}"
 
        # Guardar el archivo UNA SOLA VEZ antes del loop
        os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
        nombre_seguro = secure_filename(archivo.filename)
        timestamp = datetime.utcnow().strftime('%Y%m%d%H%M%S')
        nombre_final = f"{timestamp}_{nombre_seguro}"
        ruta = os.path.join(app.config['UPLOAD_FOLDER'], nombre_final)
        archivo.save(ruta)

        for dia in dias:
            nueva_actividad = Actividad(
                miembro_id=int(miembro_id),
                dia=dia,
                hora_inicio=hora_inicio,
                duracion=duracion,
                tipo=tipo_act,
                nombre=nombre_act,
                enlace=enlace
            )
            db.session.add(nueva_actividad)
            db.session.flush()

            nueva_foto = Foto(
                ruta_archivo='uploads/' + nombre_final,
                nombre_archivo=nombre_final,
                actividad_id=nueva_actividad.id
            )
            db.session.add(nueva_foto)
 
        db.session.commit()
        flash("¡Actividad registrada exitosamente!", "success")
        return redirect(url_for('index'))
 
    except Exception as ex:
        db.session.rollback()
        flash(f"Error al guardar la actividad: {str(ex)}", "error")
        miembros = Miembro.query.order_by(Miembro.nombre).all()
        return render_template('informar_actividades.html', miembros=miembros)
 
 

# ==========================================
# RUTAS API: ESTADÍSTICAS (JSON para fetch)
# ==========================================

@app.route('/api/estadisticas/miembros_por_dia')
def api_miembros_por_dia():
    """Retorna cantidad de miembros registrados por día (fecha)."""
    from sqlalchemy import func, cast, Date
    resultados = (
        db.session.query(
            cast(Miembro.fecha_registro, Date).label('dia'),
            func.count(Miembro.id).label('total')
        )
        .group_by(cast(Miembro.fecha_registro, Date))
        .order_by(cast(Miembro.fecha_registro, Date))
        .all()
    )
    datos = [{'dia': str(r.dia), 'total': r.total} for r in resultados]
    return jsonify(datos)


@app.route('/api/estadisticas/actividades_por_tipo')
def api_actividades_por_tipo():
    """Retorna total de actividades agrupadas por tipo."""
    from sqlalchemy import func
    resultados = (
        db.session.query(
            Actividad.tipo.label('tipo'),
            func.count(Actividad.id).label('total')
        )
        .group_by(Actividad.tipo)
        .order_by(Actividad.tipo)
        .all()
    )
    datos = [{'tipo': r.tipo, 'total': r.total} for r in resultados]
    return jsonify(datos)


@app.route('/api/estadisticas/actividades_por_comuna')
def api_actividades_por_comuna():
    """Retorna total de actividades por comuna (basado en la comuna del miembro)."""
    from sqlalchemy import func
    resultados = (
        db.session.query(
            Comuna.nombre.label('comuna'),
            func.count(Actividad.id).label('total')
        )
        .join(Miembro, Actividad.miembro_id == Miembro.id)
        .join(Comuna, Miembro.comuna_id == Comuna.id)
        .group_by(Comuna.nombre)
        .order_by(func.count(Actividad.id).desc())
        .all()
    )
    datos = [{'comuna': r.comuna, 'total': r.total} for r in resultados]
    return jsonify(datos)


# ==========================================
# RUTAS API: COMENTARIOS
# ==========================================

@app.route('/api/comentarios/<int:actividad_id>')
def api_get_comentarios(actividad_id):
    """Retorna la lista de comentarios de una actividad como JSON."""
    actividad = Actividad.query.get_or_404(actividad_id)
    comentarios = (
        Comentario.query
        .filter_by(actividad_id=actividad.id)
        .order_by(Comentario.fecha.asc())
        .all()
    )
    datos = [
        {
            'id': c.id,
            'nombre': c.nombre,
            'texto': c.texto,
            'fecha': c.fecha.strftime('%d/%m/%Y %H:%M')
        }
        for c in comentarios
    ]
    return jsonify(datos)


@app.route('/api/comentarios', methods=['POST'])
def api_post_comentario():
    """Recibe un comentario vía JSON y lo guarda. Retorna el comentario creado o errores."""
    datos = request.get_json(silent=True)
    if not datos:
        return jsonify({'ok': False, 'errores': ['Datos inválidos.']}), 400

    actividad_id = datos.get('actividad_id', '')
    nombre = str(datos.get('nombre', '')).strip()
    texto = str(datos.get('texto', '')).strip()

    errores = []

    if not actividad_id:
        errores.append('Falta el ID de la actividad.')
    else:
        actividad = Actividad.query.get(actividad_id)
        if not actividad:
            errores.append('La actividad indicada no existe.')

    if len(nombre) < 3 or len(nombre) > 80:
        errores.append('El nombre debe tener entre 3 y 80 caracteres.')

    if len(texto) < 5:
        errores.append('El comentario debe tener al menos 5 caracteres.')

    if errores:
        return jsonify({'ok': False, 'errores': errores}), 422

    try:
        nuevo = Comentario(
            nombre=nombre,
            texto=texto,
            fecha=datetime.utcnow(),
            actividad_id=int(actividad_id)
        )
        db.session.add(nuevo)
        db.session.commit()
        return jsonify({
            'ok': True,
            'comentario': {
                'id': nuevo.id,
                'nombre': nuevo.nombre,
                'texto': nuevo.texto,
                'fecha': nuevo.fecha.strftime('%d/%m/%Y %H:%M')
            }
        }), 201
    except Exception as ex:
        db.session.rollback()
        return jsonify({'ok': False, 'errores': [str(ex)]}), 500


if __name__ == '__main__':
    os.makedirs(os.path.join('static', 'uploads'), exist_ok=True)
    app.run(debug=True)