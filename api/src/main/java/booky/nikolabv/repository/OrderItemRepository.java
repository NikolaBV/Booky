package booky.nikolabv.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import booky.nikolabv.model.OrderItem;
import booky.nikolabv.model.PurchaseOrder;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    List<OrderItem> findByOrder(PurchaseOrder order);
}
