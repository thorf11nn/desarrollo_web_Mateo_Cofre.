package cl.uchile.dcc.tarea4.repository;

import cl.uchile.dcc.tarea4.model.Miembro;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MiembroRepository extends JpaRepository<Miembro, Integer> {
}