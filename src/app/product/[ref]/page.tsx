"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingBag, Heart, Star, Truck, ChevronRight, ChevronDown, ThumbsUp, ThumbsDown } from "lucide-react";
import side from "@/assets/shoe-side.jpg";
import top from "@/assets/shoe-top.jpg";
import back from "@/assets/shoe-back.jpg";
import black from "@/assets/shoe-black.jpg";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { useCart, money } from "@/lib/store";
import { useProductDetail } from "@/hooks/useProduct";
import { useProductComments } from "@/hooks/useComments";
import { useProductRatingSummary } from "@/hooks/useRatings";
import { useParams } from "next/navigation";
import Link from "next/link";

const images = [side, top, back, side];
const sizes = ["40.5", "41", "42", "43", "43.5", "44", "44.5", "45", "46"];
const colors = [
    { name: "White", img: side },
    { name: "Grey", img: back },
    { name: "Black", img: black },
];
const reviews = [
    { name: "Helen M.", date: "Yesterday", stars: 5, text: "Excellent running shoes. It turns very sharply on the foot.", up: 42, down: 0 },
    { name: "Ann D.", date: "2 days ago", stars: 4, text: "Good shoes", up: 35, down: 2 },
    { name: "Andrew G.", date: "2 days ago", stars: 5, text: "Is it suitable for running? Comfortable all day so far.", up: 12, down: 1 },
];
const dist: [number, number][] = [[5, 28], [4, 9], [3, 4], [2, 1], [1, 1]];
const related = [
    { name: "New Balance BB550", price: "$210.00", img: top },
    { name: "ASICS Gel-Lyte III OG", price: "$196.50", img: back },
    { name: "Reebok Classic Leather", price: "$149.15", img: black },
    { name: "Reebok Zig Dynamica", price: "$129.00", img: side },
];

function Stars({ n, size = 14 }: { n: number; size?: number }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} style={{ width: size, height: size }} className={i <= n ? "fill-rating text-rating" : "fill-muted text-muted"} />
            ))}
        </div>
    );
}

export default function ProductPage() {
    const params = useParams<{ ref: string }>();
    const stockId = params?.ref || "zig-kinetica-3";
    const productQuery = useProductDetail(stockId);
    const apiProduct = productQuery.data;
    const productName = apiProduct?.name || "Shoes Reebok Zig Kinetica 3";
    const productBrand = apiProduct?.brand || "Reebok";
    const commentsQuery = useProductComments({ stockId, page: 1, limit: 10 });
    const ratingQuery = useProductRatingSummary(stockId);
    const [img, setImg] = useState(0);
    const [color, setColor] = useState(0);
    const [size, setSize] = useState("41");
    const [tab, setTab] = useState("Reviews");
    const [fav, setFav] = useState(false);
    const { add } = useCart();
    const main = color === 0 ? images[img]! : colors[color]!.img;

    const currentPrice = apiProduct?.prices?.find((p) => p.priceType === "CURRENT")?.price;
    const currentPriceID = apiProduct?.prices?.find((p) => p.priceType === "CURRENT")?.id;

    const promotionalPrice = apiProduct?.prices?.find((p) => p.priceType === "PROMOTIONAL")?.price;
    const promotionalPriceID = apiProduct?.prices?.find((p) => p.priceType === "PROMOTIONAL")?.id;

    const percent = promotionalPrice && currentPrice ? ((currentPrice - promotionalPrice) / currentPrice) * 100 : 0;
    const discountLabel = percent > 0 ? `${percent.toFixed(0)}% OFF` : null;

    return (
        <div className="min-h-screen bg-background font-sans text-foreground">
            <SiteHeader />
            <div className="mx-auto max-w-6xl px-6">
                <div className="flex items-center gap-1 py-5 text-xs text-muted-foreground">
                    Clothes and shoes <ChevronRight className="h-3 w-3" /> Shoes <ChevronRight className="h-3 w-3" /> Reebok
                </div>
            </div>

            <main className="mx-auto max-w-6xl px-6 pb-20">
                <section className="grid gap-12 md:grid-cols-2">
                    <div>
                        <div className="aspect-[4/3] overflow-hidden rounded-lg bg-surface relative">
                            <Image src={apiProduct?.image || "https://media.wallmantra.com/product/original/product_placeholder.webp"} alt="Reebok Zig Kinetica 3" width={1024} height={1024} className="h-full w-full object-cover" priority />
                        </div>
                        <div className="mt-3 grid grid-cols-5 gap-2">
                            {apiProduct?.image_sides?.map((src, i) => (
                                <button key={i} onClick={() => { setImg(i); setColor(0); }}
                                    className={`aspect-square overflow-hidden rounded-md border-2 bg-surface relative ${img === i && color === 0 ? "border-foreground" : "border-transparent"}`}>
                                    <Image src={src} alt="" width={200} height={200} className="h-full w-full object-cover" />
                                </button>
                            ))}
                            <button className="rounded-md border text-xs">+4 more</button>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2"><span className="h-6 w-6 rounded-full bg-primary" />{productBrand}</span>
                            <span className="text-xs text-muted-foreground">HR1325ROG-48</span>
                        </div>
                        <h1 className="mt-4 text-2xl font-semibold">{productName}</h1>
                        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground"><Stars n={4} /> 42 demo reviews</div>
                        <p aria-live="polite" className="mt-1 text-xs text-muted-foreground">
                            {commentsQuery.isPending || ratingQuery.isPending
                                ? "Loading reviews from Hellena…"
                                : commentsQuery.isError || ratingQuery.isError
                                    ? "Hellena reviews unavailable — showing sample reviews."
                                    : "Hellena review data loaded; sample reviews are shown in this demo."}
                        </p>
                        <p className="mt-6 text-4xl font-semibold">{money(promotionalPrice ?? currentPrice ?? 0)}</p>
                        <p aria-live="polite" className="mt-1 text-xs text-muted-foreground">
                            {productQuery.isPending ? "Loading product from Hellena…" : productQuery.isError ? "Hellena product unavailable — showing demo details." : apiProduct ? "Product loaded from Hellena." : "Product not found in Hellena — showing demo details."}
                        </p>

                        <p className="mt-8 text-sm">Variants <span className="ml-2 text-muted-foreground">· {colors[color]!.name}</span></p>
                        <div className="mt-3 flex gap-2">
                            {apiProduct?.variants?.map((c, i) => (
                                <Link key={c.id} href={`/product/${c.variantProduct?.id}`}
                                    className={`h-14 w-14 overflow-hidden rounded-md border-2 bg-surface relative ${color === i ? "border-foreground" : "border-transparent"}`}>
                                    <Image
                                        src={c.variantProduct?.image || "https://media.wallmantra.com/product/original/product_placeholder.webp"}
                                        alt={c.variantProduct?.name || "product"}
                                        width={100}
                                        height={100}
                                        className="h-full w-full object-cover" />
                                </Link>
                            ))}
                        </div>

                        <p className="mt-8 text-sm">Color <span className="ml-2 text-muted-foreground">· EU Men</span></p>
                        <div className="mt-3 grid grid-cols-6 gap-2">
                            {apiProduct?.color!.map((s) => (
                                <button
                                    key={s} onClick={() => setSize(s)}
                                    className={`rounded-md h-8 w-8 bg-white border-2 transition ${size === s ? "border-primary bg-primary text-primary-foreground" : "hover:border-foreground"}`} />
                            ))}
                        </div>


                        <p className="mt-8 text-sm">Size <span className="ml-2 text-muted-foreground">· EU Men</span></p>
                        <div className="mt-3 grid grid-cols-6 gap-2">
                            {apiProduct?.size!.map((s) => (
                                <button key={s} onClick={() => setSize(s)}
                                    className={`rounded-md border py-2 text-sm transition ${size === s ? "border-primary bg-primary text-primary-foreground" : "hover:border-foreground"}`}>{s}</button>
                            ))}
                        </div>
                        <a href="#" className="mt-3 inline-block text-xs text-rating">Size guide</a>

                        <div className="mt-6 flex gap-3">
                            <button onClick={() => add("zig-kinetica-3", size)} className="flex flex-1 items-center justify-center gap-2 rounded-md bg-primary py-3 text-sm font-medium text-primary-foreground hover:opacity-90">
                                <ShoppingBag className="h-4 w-4" /> Add to cart
                            </button>
                            <button onClick={() => setFav(!fav)} aria-label="Favorite" className="rounded-md border px-4 flex items-center justify-center">
                                <Heart className={`h-4 w-4 ${fav ? "fill-sale text-sale" : ""}`} />
                            </button>
                        </div>
                        <p className="mt-4 flex items-center gap-2 text-xs"><Truck className="h-4 w-4" /> Free delivery on orders over $30.0</p>
                    </div>
                </section>

                <section className="mt-16 grid gap-12 md:grid-cols-[1fr_320px]">
                    <div>
                        <div className="flex gap-8 text-2xl">
                            {["Details", "Reviews", "Discussion"].map((t) => (
                                <button key={t} onClick={() => setTab(t)} className={tab === t ? "font-semibold" : "text-muted-foreground"}>{t}</button>
                            ))}
                        </div>
                        {tab === "Reviews" ? (
                            <>
                                <button className="mt-6 flex items-center gap-6 rounded-md border px-3 py-2 text-xs">Newest <ChevronDown className="h-3 w-3" /></button>
                                <div className="mt-4 divide-y">
                                    {reviews.map((r) => (
                                        <div key={r.name} className="py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-promo" />
                                                <div><p className="text-xs font-medium">{r.name} <span className="ml-2 font-normal text-muted-foreground">{r.date}</span></p><Stars n={r.stars} size={12} /></div>
                                            </div>
                                            <p className="mt-3 pl-11 text-sm">{r.text}</p>
                                            <div className="mt-3 flex items-center gap-4 pl-11 text-xs text-muted-foreground">
                                                <span className="text-rating cursor-pointer">Reply</span>
                                                <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" />{r.up}</span>
                                                <span className="flex items-center gap-1"><ThumbsDown className="h-3 w-3" />{r.down}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <p className="mt-6 text-sm text-muted-foreground">
                                {tab === "Details" ? "Breathable mesh upper, Zig Energy Shell cushioning and a durable rubber outsole for everyday runs." : "No questions yet. Be the first to ask."}
                            </p>
                        )}
                    </div>

                    <aside>
                        <div className="flex items-center justify-between"><Stars n={5} size={22} /><span className="text-2xl font-semibold">4.8</span></div>
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
                </section>

                <section className="mt-16">
                    <h2 className="text-xl font-semibold">You may also like</h2>
                    <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                        {related.map((p) => (
                            <a key={p.name} href="#" className="rounded-lg bg-surface p-4 text-center block">
                                <div className="aspect-square relative w-full overflow-hidden rounded-md">
                                    <Image src={p.img} alt={p.name} fill className="object-cover" />
                                </div>
                                <p className="mt-3 text-xs">{p.name}</p>
                                <p className="mt-1 font-semibold">{p.price}</p>
                            </a>
                        ))}
                    </div>
                </section>
            </main>
            <SiteFooter />
        </div>
    );
}