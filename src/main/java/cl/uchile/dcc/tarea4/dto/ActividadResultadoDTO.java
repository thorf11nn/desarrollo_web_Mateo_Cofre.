package cl.uchile.dcc.tarea4.dto;

public class ActividadResultadoDTO {

    private Integer actividadId;
    private String nombreMiembro;
    private String dia;
    private String tipo;
    private String comuna;
    private String nombre;
    private String descripcion;
    private Double notaPromedio; // null si no tiene notas aún

    public ActividadResultadoDTO(Integer actividadId, String nombreMiembro, String dia,
                                  String tipo, String comuna, String nombre,
                                  String descripcion, Double notaPromedio) {
        this.actividadId = actividadId;
        this.nombreMiembro = nombreMiembro;
        this.dia = dia;
        this.tipo = tipo;
        this.comuna = comuna;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.notaPromedio = notaPromedio;
    }

    // Getters (necesarios para que Jackson serialice a JSON)
    public Integer getActividadId() { return actividadId; }
    public String getNombreMiembro() { return nombreMiembro; }
    public String getDia() { return dia; }
    public String getTipo() { return tipo; }
    public String getComuna() { return comuna; }
    public String getNombre() { return nombre; }
    public String getDescripcion() { return descripcion; }
    public Double getNotaPromedio() { return notaPromedio; }
}