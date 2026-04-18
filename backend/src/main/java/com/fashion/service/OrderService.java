package com.fashion.service;

import com.fashion.model.*;
import com.fashion.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CouponRepository couponRepository;

    @Transactional
    public Order createOrder(String userEmail, List<OrderItem> items, String addressId,
                              Order.PaymentMethod paymentMethod, String couponCode) {

        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found: " + userEmail));

        // Calculate totals
        BigDecimal subtotal = items.stream()
            .map(i -> i.getUnitPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal discount = BigDecimal.ZERO;
        if (couponCode != null && !couponCode.isBlank()) {
            discount = applyCoupon(couponCode, subtotal, userEmail);
        }

        BigDecimal shipping = subtotal.subtract(discount).compareTo(BigDecimal.valueOf(999)) >= 0
            ? BigDecimal.ZERO : BigDecimal.valueOf(99);
        BigDecimal tax = subtotal.subtract(discount).multiply(BigDecimal.valueOf(0.18)).setScale(2, java.math.RoundingMode.HALF_UP);
        BigDecimal total = subtotal.subtract(discount).add(shipping).add(tax);

        // Deduct stock
        for (OrderItem item : items) {
            Product product = productRepository.findById(item.getProduct().getId())
                .orElseThrow(() -> new RuntimeException("Product not found: " + item.getProduct().getId()));
            if (product.getStockQuantity() < item.getQuantity()) {
                throw new RuntimeException("Insufficient stock for: " + product.getName());
            }
            product.setStockQuantity(product.getStockQuantity() - item.getQuantity());
            productRepository.save(product);
            item.setProductName(product.getName());
            item.setProductImage(product.getImages().isEmpty() ? null : product.getImages().get(0));
            item.setTotalPrice(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
        }

        Order order = Order.builder()
            .orderNumber(generateOrderNumber())
            .user(user)
            .items(items)
            .subtotal(subtotal)
            .shippingCost(shipping)
            .taxAmount(tax)
            .discountAmount(discount)
            .totalAmount(total)
            .paymentMethod(paymentMethod)
            .couponCode(couponCode)
            .estimatedDeliveryDate(LocalDateTime.now().plusDays(5))
            .status(Order.OrderStatus.CONFIRMED)
            .paymentStatus(paymentMethod == Order.PaymentMethod.CASH_ON_DELIVERY
                ? Order.PaymentStatus.PENDING : Order.PaymentStatus.PAID)
            .build();

        items.forEach(item -> item.setOrder(order));

        Order saved = orderRepository.save(order);
        log.info("Order created: {} for user: {}", saved.getOrderNumber(), userEmail);

        // Award loyalty points (1 point per ₹10 spent)
        user.setLoyaltyPoints(user.getLoyaltyPoints() + total.intValue() / 10);
        userRepository.save(user);

        return saved;
    }

    public Page<Order> getUserOrders(String userEmail, int page, int size) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found: " + userEmail));
        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), PageRequest.of(page, size));
    }

    public Order getOrderByNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber)
            .orElseThrow(() -> new RuntimeException("Order not found: " + orderNumber));
    }

    @Transactional
    public Order updateOrderStatus(String orderId, Order.OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(newStatus);
        if (newStatus == Order.OrderStatus.DELIVERED) {
            order.setDeliveredAt(LocalDateTime.now());
        }
        if (newStatus == Order.OrderStatus.CANCELLED) {
            order.setCancelledAt(LocalDateTime.now());
            restoreStock(order);
        }
        return orderRepository.save(order);
    }

    @Transactional
    public Order cancelOrder(String orderId, String userEmail, String reason) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found: " + userEmail));
        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        if (!List.of(Order.OrderStatus.PENDING, Order.OrderStatus.CONFIRMED).contains(order.getStatus())) {
            throw new RuntimeException("Order cannot be cancelled at this stage");
        }
        order.setStatus(Order.OrderStatus.CANCELLED);
        order.setCancelledAt(LocalDateTime.now());
        order.setCancellationReason(reason);
        restoreStock(order);
        return orderRepository.save(order);
    }

    private void restoreStock(Order order) {
        order.getItems().forEach(item -> {
            productRepository.findById(item.getProduct().getId()).ifPresent(p -> {
                p.setStockQuantity(p.getStockQuantity() + item.getQuantity());
                productRepository.save(p);
            });
        });
    }

    private BigDecimal applyCoupon(String code, BigDecimal subtotal, String userEmail) {
        return couponRepository.findByCodeAndActiveTrue(code)
            .map(coupon -> {
                if (coupon.getMinimumOrderAmount() != null &&
                    subtotal.compareTo(coupon.getMinimumOrderAmount()) < 0) return BigDecimal.ZERO;
                BigDecimal discount = switch (coupon.getDiscountType()) {
                    case PERCENTAGE -> subtotal.multiply(coupon.getDiscountValue().divide(BigDecimal.valueOf(100)));
                    case FLAT_AMOUNT -> coupon.getDiscountValue();
                    case FREE_SHIPPING -> BigDecimal.valueOf(99);
                };
                if (coupon.getMaxDiscountAmount() != null) {
                    discount = discount.min(coupon.getMaxDiscountAmount());
                }
                coupon.setUsageCount(coupon.getUsageCount() + 1);
                couponRepository.save(coupon);
                return discount;
            }).orElse(BigDecimal.ZERO);
    }

    private String generateOrderNumber() {
        return "FAS" + System.currentTimeMillis();
    }
}
