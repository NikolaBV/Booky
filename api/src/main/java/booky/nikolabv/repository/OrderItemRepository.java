package booky.nikolabv.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import booky.nikolabv.model.OrderItem;
import booky.nikolabv.model.PurchaseOrder;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    List<OrderItem> findByOrder(PurchaseOrder order);

    @Query("SELECT oi FROM OrderItem oi JOIN oi.product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :productName, '%'))")
    List<OrderItem> searchByProductNameContaining(@Param("productName") String productName);

    @Query("SELECT oi FROM OrderItem oi JOIN oi.product p WHERE oi.order.id = :orderId AND LOWER(p.name) LIKE LOWER(CONCAT('%', :productName, '%'))")
    List<OrderItem> searchByOrderIdAndProductNameContaining(@Param("orderId") Long orderId, @Param("productName") String productName);

    @Query("SELECT oi FROM OrderItem oi WHERE oi.order.id = :orderId")
    List<OrderItem> findByOrderId(@Param("orderId") Long orderId);
}
