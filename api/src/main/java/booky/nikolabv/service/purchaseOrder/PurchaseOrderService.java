package booky.nikolabv.service.purchaseOrder;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import booky.nikolabv.dto.PurchaseOrderDTO;
import booky.nikolabv.model.PurchaseOrder;

public interface PurchaseOrderService {

    PurchaseOrder createOrder(PurchaseOrderDTO orderDTO);

    List<PurchaseOrder> getAllOrders();

    Optional<PurchaseOrder> getOrderById(Long id);

    PurchaseOrder updateOrder(Long id, PurchaseOrderDTO orderDTO);

    void deleteOrder(Long id);

    List<PurchaseOrder> searchOrders(String username, LocalDate startDate, LocalDate endDate);
}
