package cl.uchile.dcc.tarea4.controller;

import cl.uchile.dcc.tarea4.dto.ActividadResultadoDTO;
import cl.uchile.dcc.tarea4.dto.NotaRequestDTO;
import cl.uchile.dcc.tarea4.dto.NotaResponseDTO;
import cl.uchile.dcc.tarea4.model.Actividad;
import cl.uchile.dcc.tarea4.model.Nota;
import cl.uchile.dcc.tarea4.repository.ActividadRepository;
import cl.uchile.dcc.tarea4.repository.NotaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/actividades")
public class ActividadController {

    @Autowired
    private ActividadRepository actividadRepository;

    @Autowired
    private NotaRepository notaRepository;

    @GetMapping("/buscar")
    public List<ActividadResultadoDTO> buscar(@RequestParam String texto) {
        List<Actividad> resultados = actividadRepository.buscarPorTexto(texto);

        return resultados.stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @PostMapping("/{id}/nota")
    public ResponseEntity<?> agregarNota(@PathVariable Integer id, @RequestBody NotaRequestDTO body) {

        if (body.getNota() == null || body.getNota() < 1 || body.getNota() > 7) {
            return ResponseEntity.badRequest().body("La nota debe ser un número entero entre 1 y 7.");
        }

        Actividad actividad = actividadRepository.findById(id).orElse(null);
        if (actividad == null) {
            return ResponseEntity.notFound().build();
        }

        Nota nuevaNota = new Nota();
        nuevaNota.setActividad(actividad);
        nuevaNota.setNota(body.getNota());
        notaRepository.save(nuevaNota);

        List<Nota> notas = notaRepository.findByActividadId(id);
        double suma = 0;
        for (Nota n : notas) {
            suma += n.getNota();
        }
        double promedio = suma / notas.size();

        return ResponseEntity.ok(new NotaResponseDTO(promedio));
    }

    private ActividadResultadoDTO convertirADTO(Actividad a) {
        List<Nota> notas = notaRepository.findByActividadId(a.getId());

        Double promedio = null;
        if (!notas.isEmpty()) {
            double suma = 0;
            for (Nota n : notas) {
                suma += n.getNota();
            }
            promedio = suma / notas.size();
        }

        return new ActividadResultadoDTO(
                a.getId(),
                a.getMiembro().getNombre(),
                a.getDia(),
                a.getTipo(),
                a.getMiembro().getComuna().getNombre(),
                a.getNombre(),
                a.getDescripcion(),
                promedio
        );
    }
}