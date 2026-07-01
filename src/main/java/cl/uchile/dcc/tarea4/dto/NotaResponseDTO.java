package cl.uchile.dcc.tarea4.dto;

public class NotaResponseDTO {
    private Double notaPromedio;

    public NotaResponseDTO(Double notaPromedio) {
        this.notaPromedio = notaPromedio;
    }

    public Double getNotaPromedio() { return notaPromedio; }
}