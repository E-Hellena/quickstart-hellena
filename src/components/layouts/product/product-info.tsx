"use client"

import Image from "next/image";
import { ShoppingBag, Heart, Truck } from "lucide-react";
import { useCart, money } from "@/lib/store";
import { useProductRatingSummary } from "@/hooks/useRatings"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "cn";
import { useState, useEffect } from "react";
import { ProductDTO } from "@hellena-sdk/hellena";
import ProductStars from "../../ui/product-stars";
import { Skeleton } from "../../ui/skeleton";

export default function ProductInfo({ product }: { product: ProductDTO }) {
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [size, setSize] = useState("");
    const [fav, setFav] = useState(false);

    const { add } = useCart();
    const { data: ratingSummary, isLoading } = useProductRatingSummary(product.id);

    // Seleciona automaticamente se houver apenas 1 cor ou 1 tamanho disponível
    useEffect(() => {
        if (product?.color?.length === 1) {
            setSelectedColor(product.color[0]);
        }
        if (product?.size?.length === 1) {
            setSize(product.size[0]);
        }
    }, [product]);

    const productName = product?.name || "Produto Hellena";
    const productBrand = product?.brand || "Geral";

    const currentPrice = product?.prices?.find((p) => p.priceType === "CURRENT")?.price;
    const promotionalPrice = product?.prices?.find((p) => p.priceType === "PROMOTIONAL")?.price;

    const percent = promotionalPrice && currentPrice ? ((currentPrice - promotionalPrice) / currentPrice) * 100 : 0;
    const discountLabel = percent > 0 ? `${percent.toFixed(0)}% OFF` : null;

    return (
        <div>
            <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-primary" />
                    {product?.category || "Categoria"}
                </span>
                <span className="text-xs text-muted-foreground">{productBrand}</span>
            </div>

            <h1 className="mt-4 text-2xl font-semibold">{productName}</h1>

            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">

                <ProductStars n={ratingSummary?.averageRating || 0} />
                {isLoading ? (
                    <Skeleton className="h-4 w-30 border-none" />
                ) : (
                    <>
                        <span>{ratingSummary?.averageRating ? ratingSummary.averageRating.toFixed(1) : "0.0"}</span>
                        <span>({ratingSummary?.ratingCount || 0} avaliações)</span>
                    </>
                )}

            </div>

            {/* Preço e Desconto */}
            <div className="flex flex-col items-start mt-6">
                <div className="flex items-center gap-2">
                    <p className="text-4xl font-semibold">{money(promotionalPrice ?? currentPrice ?? 0)}</p>
                    {promotionalPrice && discountLabel && (
                        <div className="bg-red-100 dark:bg-red-950/50 px-2 py-0.5 rounded-md">
                            <span className="text-red-600 text-xs font-semibold dark:text-red-400">
                                -{discountLabel}
                            </span>
                        </div>
                    )}
                </div>
                {promotionalPrice && (
                    <p className="mt-1 text-xl font-semibold line-through text-muted-foreground">
                        {money(currentPrice ?? 0)}
                    </p>
                )}
            </div>

            {/* Descrição Curta */}
            {product?.description && (
                <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
                    {product.description}
                </p>
            )}

            {/* Cores e Variantes */}
            <div className="flex flex-wrap justify-between gap-6">
                {product?.variants && product.variants.length > 0 && (
                    <div>
                        <p className="mt-6 text-sm font-medium">Variantes</p>
                        <div className="mt-2 flex gap-2">
                            {product.variants.map((c) => (
                                <Link
                                    key={c.id}
                                    href={`/product/${c.variantProduct?.id}`}
                                    className="h-12 w-12 p-1 overflow-hidden rounded-md border bg-surface relative flex items-center justify-center hover:border-foreground"
                                >
                                    <Image
                                        src={c.variantProduct?.image || "https://media.wallmantra.com/product/original/product_placeholder.webp"}
                                        alt={c.variantProduct?.name || "variante"}
                                        width={100}
                                        height={100}
                                        className="h-full w-full object-contain"
                                    />
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
                {product?.color && product.color.length > 0 && (
                    <div>
                        <p className="mt-6 text-sm font-medium">Cores</p>
                        <div className="mt-2 flex gap-2">
                            {product.color.map((c) => (
                                <Button
                                    key={c}
                                    size={"icon"}
                                    variant={"default"}
                                    className={cn("px-3 py-1 text-xs border-2 rounded-md", selectedColor == c ? "border-rating" : "border-black")}
                                    style={{ backgroundColor: c }}
                                    onClick={() => setSelectedColor(c)}
                                />
                            ))}
                        </div>
                    </div>
                )}

            </div>

            {/* Tamanhos */}
            {product?.size && product.size.length > 0 && (
                <>
                    <p className="mt-6 text-sm font-medium">Tamanho</p>
                    <div className="mt-2 grid grid-cols-6 gap-2">
                        {product.size.map((s) => (
                            <button
                                key={s}
                                onClick={() => setSize(s)}
                                className={`rounded-md border py-2 text-sm transition ${size === s ? "border-primary bg-primary text-primary-foreground" : "hover:border-foreground"}`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </>
            )}

            {/* Ações do Carrinho */}
            <div className="mt-8 flex gap-3">
                <button
                    onClick={() => add(product, size, selectedColor ?? "")}
                    disabled={Boolean(product?.color?.length && !selectedColor) || Boolean(product?.size?.length && !size)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-md bg-primary py-3 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <ShoppingBag className="h-4 w-4" /> Adicionar ao carrinho
                </button>
                <button
                    onClick={() => setFav(!fav)}
                    aria-label="Favorito"
                    className="rounded-md border px-4 flex items-center justify-center hover:bg-surface"
                >
                    <Heart className={`h-4 w-4 ${fav ? "fill-red-500 text-red-500" : ""}`} />
                </button>
            </div>

            <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <Truck className="h-4 w-4" /> Entrega disponível para Luanda e províncias.
            </p>
        </div>
    );
}