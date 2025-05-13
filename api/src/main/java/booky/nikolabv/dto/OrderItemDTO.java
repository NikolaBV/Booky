package booky.nikolabv.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemDTO {

    private Long orderId;
    private Long productId;
    private Integer quantity;
    private Double priceAtPurchase;
}
