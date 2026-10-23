import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProductRatingSummary, getCustomerProductRating, createProductRating, deleteProductRating } from "@/actions/ratings";

interface CustomerRatingParams { stockId: string; customerId: string; }
interface CreateRatingPayload { stockId: string; score: number; customerId?: string; customerName?: string; }

export function useProductRatingSummary(stockId: string) {
    return useQuery({
        queryKey: ["ratings", "summary", stockId],
        queryFn: () => getProductRatingSummary(stockId),
        enabled: Boolean(stockId),
    });
}

export function useCustomerProductRating({ stockId, customerId }: CustomerRatingParams) {
    return useQuery({
        queryKey: ["ratings", "customer", stockId, customerId],
        queryFn: () => getCustomerProductRating({ stockId, customerId }),
        enabled: Boolean(stockId && customerId),
    });
}

export function useCreateProductRating() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreateRatingPayload) => createProductRating(payload),
        onSuccess: (_, variables) => queryClient.invalidateQueries({ queryKey: ["ratings", "summary", variables.stockId] }),
    });
}

export function useDeleteProductRating() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (ratingId: string) => deleteProductRating(ratingId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["ratings"] }),
    });
}
