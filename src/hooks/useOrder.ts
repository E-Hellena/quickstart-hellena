import { useMutation } from "@tanstack/react-query";
import { createOrder } from "@/actions/order";

interface OrderInfo {
    customerId: string; customerName: string; customerEmail: string; customerPhone: string;
    address: string; lat: number; lng: number; notes?: string;
}
interface OrderItem { productId: string; name: string; quantity: number; price: number; }
interface CreateOrderPayload { info: OrderInfo; items: OrderItem[]; coupon?: string; frete: number; localization: string; }

export function useCreateOrder() {
    return useMutation({ mutationFn: (payload: CreateOrderPayload) => createOrder(payload) });
}
