package tarefas02.api.models.projections;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserUpdateDTO {

    private Long Id;
@NotBlank
@Size(min = 8, max = 60)
private String password;
}