package cl.uchile.dcc.tarea4.repository;

import cl.uchile.dcc.tarea4.model.Comuna;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ComunaRepository extends JpaRepository<Comuna, Integer> {
}