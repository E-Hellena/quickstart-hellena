"use client"

import Image from "next/image";
import { getDominantColor } from "@/lib/getDominantColor";
import { useEffect, useState } from "react";
import { ProductDTO } from "@hellena-sdk/hellena";

export default function ProductRenderImages({ product }: { product: ProductDTO }) {
    const [bgColor, setBgColor] = useState("#ffffff");
    const [selectedImg, setSelectedImg] = useState<string | null>(null);

    const mainImage = selectedImg || product?.image || "https://media.wallmantra.com/product/original/product_placeholder.webp";

    useEffect(() => {
        getDominantColor(mainImage).then((color) => {
            setBgColor(color);
        });
    }, [mainImage]);

    return (
        <div>
            <div className="aspect-[4/3] overflow-hidden rounded-lg bg-white border relative flex items-center justify-center">
                <Image
                    src={mainImage}
                    style={{ backgroundColor: bgColor }}
                    alt={product.name}
                    width={1024}
                    height={1024}
                    className="h-full w-full object-contain transition-all rounded-lg"
                    priority
                />
            </div>
            {product?.image_sides && product?.image_sides.length > 0 && (
                <div className="mt-3 grid grid-cols-5 gap-2">
                    <button
                        onClick={() => setSelectedImg(product.image)}
                        className={`aspect-square overflow-hidden rounded-md border-2 bg-surface relative flex items-center justify-center ${selectedImg === product.image || !selectedImg ? "border-foreground" : "border-transparent"}`}
                    >
                        <Image src={product.image || ""} alt="" width={200} height={200} className="h-full w-full object-cover" />
                    </button>
                    {product?.image_sides?.map((src, i) => (
                        <button key={i} onClick={() => setSelectedImg(src)}
                            className={`aspect-square overflow-hidden rounded-md border-2 bg-surface relative ${selectedImg === src ? "border-foreground" : "border-transparent"}`}>
                            <Image src={src} alt="" width={200} height={200} className="h-full w-full object-cover" />
                        </button>
                    ))}

                </div>
            )}
        </div>
    );
}