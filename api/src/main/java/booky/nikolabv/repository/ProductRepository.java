package booky.nikolabv.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import booky.nikolabv.model.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT p FROM Product p JOIN p.category c "
            + "WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%')) "
            + "AND (:categoryId IS NULL OR c.id = :categoryId)")
    List<Product> searchProducts(
            @Param("name") String name,
            @Param("categoryId") Long categoryId
    );
}
