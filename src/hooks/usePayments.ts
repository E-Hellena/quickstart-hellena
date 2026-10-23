import { useQuery, useMutation } from "@tanstack/react-query";
import { listAvailablePaymentMethods, createWiPayPayment } from "@/actions/payments";

interface WiPayPaymentPayload { customer: string; reference: string; failure_url: string; success_url: string; }

export function useAvailablePaymentMethods() {
    return useQuery({
        queryKey: ["payment", "methods"],
        queryFn: () => listAvailablePaymentMethods(),
    });
}

export function useCreateWiPayPayment() {
    return useMutation({ mutationFn: (payload: WiPayPaymentPayload) => createWiPayPayment(payload) });
}
