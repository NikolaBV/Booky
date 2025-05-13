package booky.nikolabv.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import booky.nikolabv.model.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    
}
