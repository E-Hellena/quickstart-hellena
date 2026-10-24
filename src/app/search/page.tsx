"use client";

import { useState, useCallback } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { products, money } from "@/lib/store";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { useProducts, useSearchProducts } from "@/hooks/useProduct";

function Check({ label, on, toggle }: { label: string; on: boolean; toggle: () => void }) {
    return (
        <label className="flex cursor-pointer items-center gap-2 text-sm select-none">
            <input type="checkbox" checked={on} onChange={toggle} className="accent-primary cursor-pointer" />
            {label}
        </label>
    );
}

export default function SearchPage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Ler parâmetros da URL
    const q = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";
    const sale = searchParams.get("sale") === "true";

    // Usa a pesquisa da Hellena quando existe texto e o catálogo quando a pesquisa está vazia.
    const productsQuery = useProducts({ page: 1, limit: 20 });
    const searchQuery = useSearchProducts({ ref: q, page: 1, limit: 20 });
    const hellenaQuery = q.trim() ? searchQuery : productsQuery;
    const apiProducts = hellenaQuery.data?.data ?? [];
    const catalog = apiProducts.length > 0
        ? apiProducts.map((p, index) => ({
            id: p.slug || p.id,
            name: p.name,
            brand: p.brand || "Brand",
            price: Number(p.prices?.[0]?.price ?? 0),
            old: undefined as number | undefined,
            img: p.image || products[index % products.length].img,
            category: Array.isArray(p.category) ? (p.category[0] || "Shoes") : (p.category || "Shoes"),
            color: Array.isArray(p.color) ? (p.color[0] || "Other") : (p.color || "Other"),
        }))
        : products;
    const brands = [...new Set(catalog.map((p) => p.brand))];
    const cats = [...new Set(catalog.map((p) => p.category))];
    const colors = [...new Set(catalog.map((p) => p.color))];

    // Estados locais de filtros
    const [selBrands, setBrands] = useState<string[]>([]);
    const [selColors, setColors] = useState<string[]>([]);
    const [max, setMax] = useState(250);
    const [sort, setSort] = useState("featured");

    // Função auxiliar para atualizar a Query String na URL sem perder outros parâmetros
    const updateQuery = useCallback((paramsToUpdate: Record<string, string | boolean | null>) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(paramsToUpdate).forEach(([key, value]) => {
            if (value === null || value === "" || value === false) {
                params.delete(key);
            } else {
                params.set(key, String(value));
            }
        });

        router.push(`${pathname}?${params.toString()}`);
    }, [pathname, router, searchParams]);

    const tog = (arr: string[], set: (v: string[]) => void, v: string) => {
        set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
    };

    const list = (() => {
        let r = catalog.filter((p) =>
            (!q || `${p.brand} ${p.name}`.toLowerCase().includes(q.toLowerCase())) &&
            (!category || p.category === category) &&
            (!sale || p.old) &&
            (!selBrands.length || selBrands.includes(p.brand)) &&
            (!selColors.length || selColors.includes(p.color)) &&
            p.price <= max
        );

        if (sort === "low") r = [...r].sort((a, b) => a.price - b.price);
        if (sort === "high") r = [...r].sort((a, b) => b.price - a.price);
        return r;
    })();

    const reset = () => {
        setBrands([]);
        setColors([]);
        setMax(250);
        router.push(pathname); // Reseta a URL limpando todos os parâmetros
    };

    return (
        <main className="mx-auto max-w-6xl px-6 pb-20 pt-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="font-display text-5xl">
                        {q ? `"${q}"` : sale ? "Sale" : category || "All shoes"}
                    </h1>
                    <p className="mt-2 text-xs text-muted-foreground">{list.length} results</p>
                    <p aria-live="polite" className="mt-1 text-xs text-muted-foreground">
                        {hellenaQuery.isPending
                            ? "Checking the Hellena catalogue…"
                            : hellenaQuery.isError
                                ? "Hellena API unavailable — showing demo products."
                                : apiProducts.length > 0
                                    ? "Products loaded from Hellena."
                                    : "No products returned by Hellena — showing demo products."}
                    </p>
                </div>
                <input
                    value={q}
                    onChange={(e) => updateQuery({ q: e.target.value })}
                    placeholder="Search by name or brand"
                    className="w-72 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                />
            </div>

            <div className="mt-8 grid gap-10 md:grid-cols-[220px_1fr]">
                <aside className="space-y-8">
                    <div className="flex items-center justify-between text-sm font-semibold">
                        <span className="flex items-center gap-2">
                            <SlidersHorizontal className="h-4 w-4" /> Filters
                        </span>
                        <button onClick={reset} className="text-xs font-normal text-rating hover:underline">
                            Clear all
                        </button>
                    </div>

                    {/* Categoria */}
                    <div className="space-y-2">
                        <p className="text-xs uppercase tracking-wider text-muted-foreground">Category</p>
                        {cats.map((c) => (
                            <Check
                                key={c}
                                label={c}
                                on={category === c}
                                toggle={() => updateQuery({ category: category === c ? null : c })}
                            />
                        ))}
                    </div>

                    {/* Marcas */}
                    <div className="space-y-2">
                        <p className="text-xs uppercase tracking-wider text-muted-foreground">Brand</p>
                        {brands.map((b) => (
                            <Check
                                key={b}
                                label={b}
                                on={selBrands.includes(b)}
                                toggle={() => tog(selBrands, setBrands, b)}
                            />
                        ))}
                    </div>

                    {/* Cores */}
                    <div className="space-y-2">
                        <p className="text-xs uppercase tracking-wider text-muted-foreground">Color</p>
                        {colors.map((c) => (
                            <Check
                                key={c}
                                label={c}
                                on={selColors.includes(c)}
                                toggle={() => tog(selColors, setColors, c)}
                            />
                        ))}
                    </div>

                    {/* Preço Máximo */}
                    <div className="space-y-2">
                        <p className="text-xs uppercase tracking-wider text-muted-foreground">
                            Max price · {money(max)}
                        </p>
                        <input
                            type="range"
                            min={50}
                            max={250}
                            step={5}
                            value={max}
                            onChange={(e) => setMax(+e.target.value)}
                            className="w-full accent-primary"
                        />
                    </div>

                    {/* Promoções */}
                    <Check
                        label="On sale only"
                        on={sale}
                        toggle={() => updateQuery({ sale: !sale })}
                    />
                </aside>

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
                    {list.length === 0 ? (
                        <p className="rounded-lg bg-surface p-10 text-center text-sm text-muted-foreground">
                            No shoes match these filters.
                        </p>
                    ) : (
                        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                            {list.map((p) => (
                                <Link key={p.id} href={`/product/${p.id}`} className="relative rounded-lg bg-surface p-4">
                                    {p.old && (
                                        <span className="absolute left-3 top-3 rounded bg-sale px-2 py-0.5 text-[10px] text-primary-foreground">
                                            Sale
                                        </span>
                                    )}
                                    <img
                                        src={p.img}
                                        alt={p.name}
                                        loading="lazy"
                                        className="aspect-square w-full rounded-md object-cover"
                                    />
                                    <p className="mt-3 text-xs text-muted-foreground">
                                        {p.brand} · {p.category}
                                    </p>
                                    <p className="text-sm font-medium">{p.name}</p>
                                    <p className="mt-1 font-semibold">
                                        {money(p.price)}{" "}
                                        {p.old && (
                                            <span className="ml-1 text-xs font-normal text-muted-foreground line-through">
                                                {money(p.old)}
                                            </span>
                                        )}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}