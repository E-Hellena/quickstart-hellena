"use client";

import { useProducts, useSearchProducts } from "@/hooks/useProduct";
import useGetURLquery from "@/hooks/search/useGetURLquery";
import { useProductFulter } from "@/hooks/search/useProductFilter";
import { matchesHexColorFamily } from "@/lib/matchesHexColorFamily";
import { useRef, useState, useEffect, createContext, useContext } from "react";
import { ProductDTO as Product } from "@hellena-sdk/hellena";
import { useDebounce } from "./useDebounce";

const Contex = createContext<{
    products: Product[];
    isLoading: boolean;
    page: number;
    lastProductRef: React.RefObject<HTMLDivElement | null>;
}>({} as any);

export const useGetProducts = () => useContext(Contex);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
    const [page, setPage] = useState<number>(1);
    const [products, setProducts] = useState<Product[]>([]);
    const lastProductRef = useRef<HTMLDivElement | null>(null);
    const limit = 50;

    const { q, category, sale } = useGetURLquery();
    const { selBrands, selColors, max } = useProductFulter();

    const debouncedSearchQuery = useDebounce(q, 500);
    useEffect(() => {
        setPage(1);
        setProducts([]);
    }, [debouncedSearchQuery, category, sale]);

    const { data: productsQuery, isLoading: productsQueryIsLoading } = useProducts({ page, limit });
    const { data: searchQuery, isLoading: searchQueryIsLoading } = useSearchProducts({
        ref: debouncedSearchQuery,
        page,
        limit
    });

    const hellenaQuery = debouncedSearchQuery.trim() ? searchQuery : productsQuery;
    const isLoading = debouncedSearchQuery.trim() ? searchQueryIsLoading : productsQueryIsLoading;

    const apiProducts = hellenaQuery?.data ?? [];

    // 3. Atualizar a lista acumulando ou reiniciando consoante a página
    useEffect(() => {
        if (apiProducts.length > 0) {
            setProducts((prevProducts) => {
                if (page === 1) return apiProducts;

                // Evita duplicados baseados no ID
                const existingIds = new Set(prevProducts.map(p => p.id));
                const uniqueNewProducts = apiProducts.filter(p => !existingIds.has(p.id));

                return [...prevProducts, ...uniqueNewProducts];
            });
        }
    }, [apiProducts, page]);

    // 4. Configuração do IntersectionObserver
    useEffect(() => {
        const currentElement = lastProductRef.current;
        if (!currentElement) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !isLoading) {
                    if (hellenaQuery?.meta?.hasNextPage) {
                        setPage((prevPage) => prevPage + 1);
                    } else {
                        console.log("No more products");
                    }
                }
            });
        }, { threshold: 0.1 }); // 0.1 dá uma margem melhor para disparar antes de chegar totalmente ao fim

        observer.observe(currentElement);

        return () => {
            if (currentElement) {
                observer.unobserve(currentElement);
            }
        };
    }, [isLoading, hellenaQuery?.meta?.hasNextPage]);

    const filteredProducts = products.filter((product) => {
        const price = product?.prices?.find((priceItem) => priceItem.priceType === "CURRENT");
        const promotionalPrice = product?.prices?.find((priceItem) => priceItem.priceType === "PROMOTIONAL");

        const currentPriceValue = price?.price ?? 0;
        const promotionalPriceValue = promotionalPrice?.price ?? 0;

        return (
            (selBrands.length === 0 || selBrands.includes(product.brand || "Geral")) &&
            (selColors.length === 0 || matchesHexColorFamily(product.color, selColors)) &&
            (sale === true ? promotionalPriceValue < currentPriceValue : true) &&
            ((promotionalPriceValue && promotionalPriceValue <= max) || (currentPriceValue && currentPriceValue <= max))
        );
    });

    return (
        <Contex.Provider value={{ products: filteredProducts, isLoading, page, lastProductRef }}>
            {children}
        </Contex.Provider>
    );
}