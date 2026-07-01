package cl.uchile.dcc.tarea4.repository;

import cl.uchile.dcc.tarea4.model.Nota;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotaRepository extends JpaRepository<Nota, Integer> {

    List<Nota> findByActividadId(Integer actividadId);
}