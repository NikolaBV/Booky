package booky.nikolabv.service;

import java.util.List;
import java.util.Optional;

import booky.nikolabv.dto.OrderItemDTO;
import booky.nikolabv.model.OrderItem;

public interface OrderItemService {

    OrderItem createOrderItem(OrderItemDTO orderItemDTO);

    List<OrderItem> getAllOrderItems();

    List<OrderItem> getOrderItemsByOrder(Long orderId);

    Optional<OrderItem> getOrderItemById(Long id);

    OrderItem updateOrderItem(Long id, OrderItemDTO orderItemDTO);

    void deleteOrderItem(Long id);
}
