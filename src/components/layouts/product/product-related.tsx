"use client"

import { ProductDTO } from "@hellena-sdk/hellena"
import side from "@/assets/shoe-side.jpg";
import top from "@/assets/shoe-top.jpg";
import back from "@/assets/shoe-back.jpg";
import black from "@/assets/shoe-black.jpg";
import { money } from "@/lib/store";
import Image from "next/image";

const related = [
    { name: "New Balance BB550", price: 21000, img: top },
    { name: "ASICS Gel-Lyte III OG", price: 19650, img: back },
    { name: "Reebok Classic Leather", price: 14915, img: black },
    { name: "Reebok Zig Dynamica", price: 12900, img: side },
];

export default function ProductRelated({ product }: { product: ProductDTO }) {
    return (
        <section className="mt-16">
            <h2 className="text-xl font-semibold">Poderá também gostar</h2>
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                {related.map((p) => (
                    <div key={p.name} className="rounded-lg bg-surface p-4 text-center block group border">
                        <div className="aspect-square relative w-full overflow-hidden rounded-md bg-background flex items-center justify-center p-2">
                            <Image
                                src={p.img}
                                alt={p.name}
                                fill
                                className="object-contain transition group-hover:scale-105"
                            />
                        </div>
                        <p className="mt-3 text-xs font-medium">{p.name}</p>
                        <p className="mt-1 font-semibold text-sm">{money(p.price)}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}