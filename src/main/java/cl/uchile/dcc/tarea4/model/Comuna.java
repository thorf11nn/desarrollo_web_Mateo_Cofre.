package cl.uchile.dcc.tarea4.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "comuna")
public class Comuna {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 200)
    private String nombre;

    @OneToMany(mappedBy = "comuna")
    private List<Miembro> miembros;

    // Getters y setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public List<Miembro> getMiembros() { return miembros; }
    public void setMiembros(List<Miembro> miembros) { this.miembros = miembros; }
}