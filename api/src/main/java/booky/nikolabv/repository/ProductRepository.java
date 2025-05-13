package booky.nikolabv.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import booky.nikolabv.model.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

}
