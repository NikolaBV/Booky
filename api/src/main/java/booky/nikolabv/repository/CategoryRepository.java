package booky.nikolabv.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import booky.nikolabv.model.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    @Query("SELECT c FROM Category c WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Category> searchByNameContaining(@Param("name") String name);

    @Query("SELECT c FROM Category c WHERE LOWER(c.description) LIKE LOWER(CONCAT('%', :description, '%'))")
    List<Category> searchByDescriptionContaining(@Param("description") String description);

    @Query("SELECT c FROM Category c WHERE "
            + "LOWER(c.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR "
            + "LOWER(c.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Category> searchByNameOrDescriptionContaining(@Param("searchTerm") String searchTerm);
}
