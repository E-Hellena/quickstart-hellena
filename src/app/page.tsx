"use client"

import { Truck, RotateCcw, Globe, MessageCircle, ArrowRight } from "lucide-react";
import hero from "@/assets/hero.jpg";
import { products, money } from "@/lib/store";
import black from "@/assets/shoe-black.jpg";
import top from "@/assets/shoe-top.jpg";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import Link from "next/link";
import { useProducts } from "@/hooks/useProduct";
import Image from "next/image";

export default function Page() {
  const { data: productsQuery, isLoading, isError } = useProducts({ page: 1, limit: 20 });
  const apiProducts = productsQuery?.data ?? [];
  const homeProducts = apiProducts.length > 0
    ? apiProducts.map((p, index) => ({
      id: p.slug || p.id,
      name: p.name,
      slug: p.slug,
      brand: p.brand || "Brand",
      price: p.prices?.[0]?.price ?? 0,
      old: undefined as number | undefined,
      img: p.image || products[index % products.length].img,
    }))
    : products;

  const marquee = Array(10).fill("New season ✦ Sale up to 25% ✦");

  return (
    <main>
      <section className="mx-auto max-w-6xl px-6 pt-8">
        <div className="relative overflow-hidden rounded-lg bg-surface">
          <img src={hero.src} alt="Sneakers hanging on a rail" width={1536} height={1024} className="h-[520px] w-full object-cover" />
          <div className="absolute inset-0 flex flex-col items-end justify-center pr-10 text-right">
            <h1 className="font-display text-5xl leading-[1.05] md:text-7xl">
              <span className="relative">Fresh<span className="absolute -left-4 -top-2 -z-10 h-16 w-16 rounded-full bg-sale md:h-20 md:w-20" /></span><br />Sneaker<br />Collection
            </h1>
            <Link href="/search" className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm text-primary-foreground">Shop now <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      <div className="mt-10 -rotate-1 overflow-hidden bg-promo py-3">
        <div className="flex whitespace-nowrap font-display text-xl">{marquee.map((m, i) => <span key={i} className="px-3">{m}</span>)}</div>
      </div>

      <section className="mx-auto mt-20 grid max-w-6xl items-center gap-10 px-6 md:grid-cols-[1fr_1fr_200px]">
        <div className="overflow-hidden rounded-lg bg-promo"><img src={black.src} alt="Reebok Classic Leather" loading="lazy" className="aspect-[4/5] w-full object-cover" /></div>
        <div>
          <h2 className="font-display text-5xl leading-tight">Pre Spring<br />Collection</h2>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">Light, breathable and ready for longer days. Our spring picks for running and everyday wear.</p>
          <Link href="/search" className="mt-6 inline-block rounded-md bg-primary px-5 py-2.5 text-xs text-primary-foreground">Learn more</Link>
        </div>
        <div className="hidden overflow-hidden rounded-lg bg-surface md:block"><img src={top.src} alt="" loading="lazy" className="aspect-[3/4] w-full object-cover" /></div>
      </section>

      <section className="mx-auto mt-24 max-w-6xl px-6">
        <h2 className="text-center font-display text-5xl">New Arrivals</h2>
        <p aria-live="polite" className="mt-2 text-center text-xs text-muted-foreground">
          {isLoading
            ? "Loading products from Hellena…"
            : isError
              ? "Hellena is unavailable; showing demo products."
              : apiProducts.length > 0
                ? "Products loaded from Hellena."
                : "No products returned by Hellena; showing demo products."}
        </p>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {homeProducts.map((p) => (
            <Link key={p.id} href={`/product/${p.id}`} className="group rounded-lg bg-surface p-4">
              <div className="aspect-square p-6 w-full overflow-hidden rounded-md bg-background flex items-center justify-center">
                <Image
                  src={p.img}
                  alt={p.name}
                  loading="lazy"
                  width={500}
                  height={500}
                  className="h-full w-full object-contain transition group-hover:scale-105"
                />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">{p.brand}</p>
              <p className="text-sm">{p.name}</p>
              <p className="mt-1 font-semibold">{money(p.price)}</p>
            </Link>
          ))}
        </div>
      </section>
      {/* 
        <section className="mx-auto mt-24 max-w-6xl px-6 text-center">
          <p className="mx-auto w-fit rounded-full border px-6 font-display text-3xl">03</p>
          <h2 className="mt-2 font-display text-5xl">Just For <span className="text-sale">You</span></h2>
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {homeProducts.filter((p) => p.old).concat(homeProducts.slice(0, 1)).map((p) => (
              <Link key={p.id} href={`/product/${p.id}`} className="rounded-lg bg-surface p-4 text-left">
                <img src={p.img} alt={p.name} loading="lazy" className="aspect-square w-full rounded-md object-cover" />
                <p className="mt-3 text-sm">{p.brand} {p.name}</p>
                <p className="mt-1 font-semibold">{money(p.price)} {p.old && <span className="ml-1 text-xs font-normal text-muted-foreground line-through">{money(p.old)}</span>}</p>
              </Link>
            ))}
          </div>
        </section> */}

      <section className="mx-auto my-20 grid max-w-6xl grid-cols-2 border px-0 md:grid-cols-4">
        {[[Truck, "Free delivery", "On orders over $30"], [RotateCcw, "Free returns", "Within 30 days"], [Globe, "International shipping", "To 40+ countries"], [MessageCircle, "Any questions?", "We reply in 24h"]].map(([I, t, s], i) => {
          const Icon = I as typeof Truck;
          return (
            <div key={i} className="flex flex-col items-center gap-1 border p-6 text-center text-xs">
              <Icon className="h-5 w-5" /><p className="font-medium">{t as string}</p><p className="text-muted-foreground">{s as string}</p>
            </div>
          );
        })}
      </section>
    </main>
  );
}
