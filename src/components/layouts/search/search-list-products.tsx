"use client";

import { X } from "lucide-react";
import { money } from "@/lib/store";
import Link from "next/link";
import useGetURLquery from "@/hooks/search/useGetURLquery";
import { useProductFulter } from "@/hooks/search/useProductFilter";
import useUpdateURLQuery from "@/hooks/search/useUpdateURLquery";
import { useGetProducts } from "@/hooks/search/useGetProducts";
import { ProductResultsSkeleton } from "@/components/skeleton/SearchSkeleton";

export default function SearchListProducts() {
    const { products, isLoading, page, lastProductRef } = useGetProducts()
    const { category } = useGetURLquery();
    const { selBrands, selColors, tog, setBrands, setColors, sort, setSort } = useProductFulter();
    const updateQuery = useUpdateURLQuery();

    if (isLoading && page === 1) return <ProductResultsSkeleton />

    return (
        <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                {/* Badges dos filtros ativos */}
                <div className="flex flex-wrap gap-2">
                    {selBrands.map((b) => (
                        <span key={b} className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs">
                            {b}
                            <X className="h-3 w-3 cursor-pointer" onClick={() => tog(selBrands, setBrands, b)} />
                        </span>
                    ))}
                    {selColors.map((c) => (
                        <span key={c} className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs">
                            {c}
                            <X className="h-3 w-3 cursor-pointer" onClick={() => tog(selColors, setColors, c)} />
                        </span>
                    ))}
                    {category && (
                        <span className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs">
                            {category}
                            <X className="h-3 w-3 cursor-pointer" onClick={() => updateQuery({ category: null })} />
                        </span>
                    )}
                </div>

                {/* Ordenação */}
                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="rounded-md border bg-background px-3 py-2 text-xs"
                >
                    <option value="featured">Featured</option>
                    <option value="low">Price: low to high</option>
                    <option value="high">Price: high to low</option>
                </select>
            </div>

            {/* Lista de Produtos */}
            {products.length === 0 && !isLoading ? (
                <p className="rounded-lg bg-surface p-10 text-center text-sm text-muted-foreground">
                    No shoes match these filters.
                </p>
            ) : (
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                    {products.map((p, idx) => {
                        const currentPrice = p?.prices?.find((priceItem) => priceItem.priceType === "CURRENT")?.price;
                        const promotionalPrice = p?.prices?.find((priceItem) => priceItem.priceType === "PROMOTIONAL")?.price;

                        const percent = promotionalPrice && currentPrice ? ((currentPrice - promotionalPrice) / currentPrice) * 100 : 0;
                        const discountLabel = percent > 0 ? `${percent.toFixed(0)}% OFF` : null;

                        // Verificamos se é o último elemento do array para anexar a ref
                        const isLast = idx === products.length - 1;

                        return (
                            <div
                                key={`${p.id}-${idx}`}
                                ref={isLast ? lastProductRef : null}
                            >
                                <Link
                                    href={`/product/${p.id}`}
                                    className="relative rounded-lg bg-surface p-4 group block border h-full"
                                >
                                    {promotionalPrice && (
                                        <span className="absolute z-30 left-3 top-3 rounded bg-sale px-2 py-0.5 text-[10px] text-primary-foreground">
                                            {discountLabel}
                                        </span>
                                    )}
                                    <div className="aspect-square relative w-full overflow-hidden rounded-md bg-background flex items-center justify-center p-2">
                                        <img
                                            src={p.image || "https://media.wallmantra.com/product/original/product_placeholder.webp"}
                                            alt={p.name}
                                            loading="lazy"
                                            className="h-full w-full object-contain transition group-hover:scale-105"
                                        />
                                    </div>
                                    <p className="mt-3 text-xs text-muted-foreground font-bold">
                                        {p.brand || "Geral"} · {Array.isArray(p.category) ? p.category[0] : (p.category || "Shoes")}
                                    </p>
                                    <p className="text-sm font-medium">{p.name}</p>
                                    <p className="mt-1 font-semibold">
                                        {money(promotionalPrice ?? currentPrice ?? 0)}{" "}
                                        {promotionalPrice && currentPrice && (
                                            <span className="ml-1 text-xs font-normal text-muted-foreground line-through">
                                                {money(currentPrice)}
                                            </span>
                                        )}
                                    </p>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            )}

            {isLoading && page > 1 && (
                <p className="text-center text-sm text-muted-foreground my-4">A carregar mais produtos...</p>
            )}
        </div>
    );
}