package booky.nikolabv.service.orderItem;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import booky.nikolabv.dto.OrderItemDTO;
import booky.nikolabv.model.OrderItem;
import booky.nikolabv.model.Product;
import booky.nikolabv.model.PurchaseOrder;
import booky.nikolabv.repository.OrderItemRepository;
import booky.nikolabv.repository.ProductRepository;
import booky.nikolabv.repository.PurchaseOrderRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderItemServiceImpl implements OrderItemService {

    private final OrderItemRepository orderItemRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final ProductRepository productRepository;

    @Override
    @Transactional
    public OrderItem createOrderItem(OrderItemDTO orderItemDTO) {
        PurchaseOrder order = purchaseOrderRepository.findById(orderItemDTO.getOrderId())
                .orElseThrow(() -> new EntityNotFoundException("Order not found with id: " + orderItemDTO.getOrderId()));

        Product product = productRepository.findById(orderItemDTO.getProductId())
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + orderItemDTO.getProductId()));

        Double priceAtPurchase = orderItemDTO.getPriceAtPurchase() != null
                ? orderItemDTO.getPriceAtPurchase()
                : product.getPrice();

        OrderItem orderItem = OrderItem.builder()
                .order(order)
                .product(product)
                .quantity(orderItemDTO.getQuantity())
                .priceAtPurchase(priceAtPurchase)
                .build();

        return orderItemRepository.save(orderItem);
    }

    @Override
    public List<OrderItem> getAllOrderItems() {
        return orderItemRepository.findAll();
    }

    @Override
    public List<OrderItem> getOrderItemsByOrder(Long orderId) {
        return orderItemRepository.findByOrderId(orderId);
    }

    @Override
    public Optional<OrderItem> getOrderItemById(Long id) {
        return orderItemRepository.findById(id);
    }

    @Override
    @Transactional
    public OrderItem updateOrderItem(Long id, OrderItemDTO orderItemDTO) {
        OrderItem existingOrderItem = orderItemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("OrderItem not found with id: " + id));

        if (orderItemDTO.getOrderId() != null) {
            PurchaseOrder order = purchaseOrderRepository.findById(orderItemDTO.getOrderId())
                    .orElseThrow(() -> new EntityNotFoundException("Order not found with id: " + orderItemDTO.getOrderId()));
            existingOrderItem.setOrder(order);
        }

        if (orderItemDTO.getProductId() != null) {
            Product product = productRepository.findById(orderItemDTO.getProductId())
                    .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + orderItemDTO.getProductId()));
            existingOrderItem.setProduct(product);
        }

        if (orderItemDTO.getQuantity() != null) {
            existingOrderItem.setQuantity(orderItemDTO.getQuantity());
        }

        if (orderItemDTO.getPriceAtPurchase() != null) {
            existingOrderItem.setPriceAtPurchase(orderItemDTO.getPriceAtPurchase());
        }

        return orderItemRepository.save(existingOrderItem);
    }

    @Override
    @Transactional
    public void deleteOrderItem(Long id) {
        if (!orderItemRepository.existsById(id)) {
            throw new EntityNotFoundException("OrderItem not found with id: " + id);
        }
        orderItemRepository.deleteById(id);
    }

    @Override
    public List<OrderItem> searchOrderItems(String productName, Long orderId) {
        if (productName != null && !productName.trim().isEmpty() && orderId != null) {
            return orderItemRepository.searchByOrderIdAndProductNameContaining(orderId, productName.trim());
        }

        if (productName != null && !productName.trim().isEmpty()) {
            return orderItemRepository.searchByProductNameContaining(productName.trim());
        }

        if (orderId != null) {
            return orderItemRepository.findByOrderId(orderId);
        }

        return getAllOrderItems();
    }

    @Override
    public List<OrderItem> searchByProductName(String productName) {
        if (productName == null || productName.trim().isEmpty()) {
            return getAllOrderItems();
        }

        return orderItemRepository.searchByProductNameContaining(productName.trim());
    }
}
