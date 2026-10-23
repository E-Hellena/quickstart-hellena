import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { listProducts, searchProducts, getProductByIdOrSlug } from "@/actions/products";

interface PaginationParams { page?: number; limit?: number; }
interface SearchParams extends PaginationParams { ref: string; }

export function useProducts({ page = 1, limit = 20 }: PaginationParams = {}) {
    return useQuery({
        queryKey: ["products", { page, limit }],
        queryFn: () => listProducts({ page, limit }),
        placeholderData: keepPreviousData,
    });
}

export function useSearchProducts({ ref, page = 1, limit = 10 }: SearchParams) {
    return useQuery({
        queryKey: ["products", "search", { ref, page, limit }],
        queryFn: () => searchProducts({ ref, page, limit }),
        enabled: Boolean(ref && ref.trim().length > 0),
        placeholderData: keepPreviousData,
    });
}

export function useProductDetail(idOrSlug: string) {
    return useQuery({
        queryKey: ["product", idOrSlug],
        queryFn: () => getProductByIdOrSlug(idOrSlug),
        enabled: Boolean(idOrSlug),
    });
}
