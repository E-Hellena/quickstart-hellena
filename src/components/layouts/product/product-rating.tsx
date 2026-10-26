"use client"

import { useProductRatingSummary } from "@/hooks/useRatings";
import { ProductDTO } from "@hellena-sdk/hellena";
import ProductStars from "../../ui/product-stars";

const dist: [number, number][] = [[5, 28], [4, 9], [3, 4], [2, 1], [1, 1]];

export default function ProductRating({ product }: { product: ProductDTO }) {
    const ratingQuery = useProductRatingSummary(product.id);
    const ratingSummary = ratingQuery.data;

    return (
        <aside>
            <div className="flex items-center justify-between">
                <ProductStars n={ratingSummary?.averageRating || 0} size={22} />
                <span className="text-2xl font-semibold">
                    {ratingSummary?.averageRating ? ratingSummary.averageRating.toFixed(1) : "0.0"}
                </span>
            </div>
            <div className="mt-6 space-y-3">
                {dist.map(([s, c]) => (
                    <div key={s} className="flex items-center gap-3 text-xs">
                        <span className="w-3">{s}</span>
                        <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden"><div className="h-2 rounded-full bg-rating" style={{ width: `${(c / 30) * 100}%` }} /></div>
                        <span className="w-5 text-right">{c}</span>
                    </div>
                ))}
            </div>
            <div className="mt-10 rounded-lg bg-promo p-6">
                <p className="text-2xl font-medium leading-snug">Popular brands with discounts over 25%</p>
                <button className="mt-6 rounded-md border border-foreground px-5 py-2 text-xs">View more</button>
            </div>
        </aside>
    );
}