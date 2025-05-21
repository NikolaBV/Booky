package booky.nikolabv.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import booky.nikolabv.model.PurchaseOrder;

@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {

    @Query("SELECT o FROM PurchaseOrder o JOIN o.appUser u "
            + "WHERE LOWER(u.username) LIKE LOWER(CONCAT('%', :username, '%')) "
            + "AND o.orderDate BETWEEN :startDate AND :endDate")
    List<PurchaseOrder> searchOrders(
            @Param("username") String username,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
}
