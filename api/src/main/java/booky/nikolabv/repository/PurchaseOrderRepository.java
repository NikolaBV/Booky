package booky.nikolabv.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import booky.nikolabv.model.PurchaseOrder;

public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {
}
