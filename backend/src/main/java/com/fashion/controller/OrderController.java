package com.fashion.controller;

import com.fashion.model.Order;
import com.fashion.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/v1/orders")
@RequiredArgsConstructor
@Tag(name = "Orders", description = "Order management endpoints")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class OrderController {

    private final OrderService orderService;

    record CreateOrderRequest(
        java.util.List<OrderItemRequest> items,
        String addressId,
        String paymentMethod,
        String couponCode
    ) {}
    record OrderItemRequest(String productId, int quantity, String size, String color, java.math.BigDecimal unitPrice) {}

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Place a new order")
    public ResponseEntity<Order> createOrder(@RequestBody CreateOrderRequest req, Authentication auth) {
        // Map request items to domain objects
        var items = req.items().stream().map(i -> {
            var item = new com.fashion.model.OrderItem();
            var product = new com.fashion.model.Product();
            product.setId(java.util.UUID.fromString(i.productId()));
            item.setProduct(product);
            item.setQuantity(i.quantity());
            item.setSize(i.size());
            item.setColor(i.color());
            item.setUnitPrice(i.unitPrice());
            return item;
        }).toList();

        String userId = (String) auth.getPrincipal();
        Order order = orderService.createOrder(userId, items, req.addressId(),
            Order.PaymentMethod.valueOf(req.paymentMethod()), req.couponCode());
        return ResponseEntity.ok(order);
    }

    @GetMapping("/my")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get current user's orders")
    public ResponseEntity<Page<Order>> getMyOrders(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        Authentication auth
    ) {
        String userId = (String) auth.getPrincipal();
        return ResponseEntity.ok(orderService.getUserOrders(userId, page, size));
    }

    @GetMapping("/{orderNumber}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get order details by order number")
    public ResponseEntity<Order> getOrder(@PathVariable String orderNumber) {
        return ResponseEntity.ok(orderService.getOrderByNumber(orderNumber));
    }

    @PostMapping("/{orderId}/cancel")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Cancel an order")
    public ResponseEntity<Order> cancelOrder(@PathVariable String orderId,
                                              @RequestBody Map<String, String> body,
                                              Authentication auth) {
        String userId = (String) auth.getPrincipal();
        return ResponseEntity.ok(orderService.cancelOrder(orderId, userId, body.get("reason")));
    }

    @PutMapping("/{orderId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update order status (Admin only)")
    public ResponseEntity<Order> updateStatus(@PathVariable String orderId,
                                               @RequestBody Map<String, String> body) {
        Order.OrderStatus status = Order.OrderStatus.valueOf(body.get("status"));
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status));
    }
}
