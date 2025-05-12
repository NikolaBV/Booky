package booky.nikolabv.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import booky.nikolabv.model.AppUser;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PurchaseOrderDTO {
    private Long id;
    private AppUser appUser;
    private LocalDate orderDate;
    private BigDecimal totalAmount;
}