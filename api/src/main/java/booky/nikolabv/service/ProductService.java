package booky.nikolabv.service;

import java.util.List;
import java.util.Optional;

import booky.nikolabv.dto.ProductDTO;
import booky.nikolabv.model.Product;

public interface ProductService {

    Product createProduct(ProductDTO productDTO);

    List<Product> getAllProducts();

    Optional<Product> getProductById(Long id);

    Product updateProduct(Long id, ProductDTO productDTO);

    void deleteProduct(Long id);
}
