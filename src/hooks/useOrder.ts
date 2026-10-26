import { useMutation } from "@tanstack/react-query";
import { createOrder } from "@/actions/order";
import { OrderDTO } from "@hellena-sdk/hellena";


export function useCreateOrder() {
    return useMutation({ mutationFn: (payload: OrderDTO) => createOrder(payload) });
}
