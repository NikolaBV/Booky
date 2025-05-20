package booky.nikolabv.service.category;
import java.util.List;
import java.util.Optional;

import booky.nikolabv.dto.CategoryDTO;
import booky.nikolabv.model.Category;

public interface  CategoryService {
    Category createCategory(CategoryDTO category);
    List<Category> getAllCategories();
    Optional<Category> getCategoryById(Long id);
    Category updateCategory(Long id, CategoryDTO categoryDTO);
    void deleteCategory(Long id);
}
