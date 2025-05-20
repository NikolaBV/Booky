package booky.nikolabv.service.purchaseOrder;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import booky.nikolabv.dto.PurchaseOrderDTO;
import booky.nikolabv.model.AppUser;
import booky.nikolabv.model.PurchaseOrder;
import booky.nikolabv.repository.AppUserRepository;
import booky.nikolabv.repository.PurchaseOrderRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PurchaseOrderServiceImpl implements PurchaseOrderService {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final AppUserRepository appUserRepository;

    @Override
    @Transactional
    public PurchaseOrder createOrder(PurchaseOrderDTO orderDTO) {
        AppUser user = appUserRepository.findById(orderDTO.getAppUser().getId())
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + orderDTO.getAppUser().getId()));

        PurchaseOrder order = PurchaseOrder.builder()
                .appUser(user)
                .orderDate(orderDTO.getOrderDate())
                .totalAmount(orderDTO.getTotalAmount())
                .build();

        return purchaseOrderRepository.save(order);
    }

    @Override
    public List<PurchaseOrder> getAllOrders() {
        return purchaseOrderRepository.findAll();
    }

    @Override
    public Optional<PurchaseOrder> getOrderById(Long id) {
        return purchaseOrderRepository.findById(id);
    }

    @Override
    @Transactional
    public PurchaseOrder updateOrder(Long id, PurchaseOrderDTO orderDTO) {
        PurchaseOrder existingOrder = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Order not found with id: " + id));

        if (orderDTO.getAppUser() != null && orderDTO.getAppUser().getId() != null) {
            AppUser user = appUserRepository.findById(orderDTO.getAppUser().getId())
                    .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + orderDTO.getAppUser().getId()));
            existingOrder.setAppUser(user);
        }

        if (orderDTO.getOrderDate() != null) {
            existingOrder.setOrderDate(orderDTO.getOrderDate());
        }
        if (orderDTO.getTotalAmount() != null) {
            existingOrder.setTotalAmount(orderDTO.getTotalAmount());
        }

        return purchaseOrderRepository.save(existingOrder);
    }

    @Override
    @Transactional
    public void deleteOrder(Long id) {
        if (!purchaseOrderRepository.existsById(id)) {
            throw new EntityNotFoundException("Order not found with id: " + id);
        }
        purchaseOrderRepository.deleteById(id);
    }
}