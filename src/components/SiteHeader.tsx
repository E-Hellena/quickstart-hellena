"use client"

import { useCart } from "@/lib/store";
import { Search, ShoppingBag, Heart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SiteHeader() {
    const { count } = useCart();
    const [q, setQ] = useState("");
    const router = useRouter();

    return (
        <header className="px-6">
            <div className="mx-auto max-w-6xl px-6">
                <div className="flex items-center justify-between py-5">
                    <Link href="/" className="text-xl font-bold tracking-tight">BR.<span className="text-rating">F</span></Link>
                    <form onSubmit={(e) => { e.preventDefault(); router.push(`/search?q=${q}`); }}
                        className="hidden w-80 items-center gap-2 rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground md:flex">
                        <Search className="h-4 w-4" />
                        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" className="w-full bg-transparent outline-none" />
                    </form>
                    <div className="flex items-center gap-5 text-xs">
                        <Link href="/search" className="flex flex-col items-center md:hidden"><Search className="h-5 w-5" />Search</Link>
                        <Link href="/cart" className="relative flex flex-col items-center"><ShoppingBag className="h-5 w-5" />Cart
                            {count > 0 && <span className="absolute -right-2 -top-1 rounded-full bg-rating px-1.5 text-[10px] font-semibold">{count}</span>}
                        </Link>
                        <button className="flex flex-col items-center"><Heart className="h-5 w-5" />Favorites</button>
                        <div className="h-9 w-9 rounded-full bg-promo" />
                    </div>
                </div>
                <nav className="flex gap-7 overflow-x-auto border-b pb-4 text-sm">
                    {["Running", "Lifestyle", "Tennis"].map((l) => (
                        <Link key={l} href={`/search?category=${l}`} className="hover:text-muted-foreground">{l}</Link>
                    ))}
                    <Link href="/search" className="hover:text-muted-foreground">All shoes</Link>
                    <Link href="/search?sale=true" className="text-sale">Sale</Link>
                </nav>
            </div>
        </header>
    );
}

export function SiteFooter() {
    return (
        <footer className="bg-primary text-primary-foreground">
            <div className="mx-auto grid max-w-6xl gap-8 px-6 py-14 md:grid-cols-3">
                <div><p className="text-xl font-bold">BR.<span className="text-rating">F</span></p><p className="mt-3 text-xs opacity-70">Sneakers for every step.</p></div>
                <div className="space-y-2 text-xs opacity-80">
                    <Link href="/search" className="block">Shop all</Link>
                    <Link href="/cart" className="block">Cart</Link>
                    <Link href={`/search?sale=true`} className="block">Sale</Link>
                </div>
                <p className="font-display text-3xl">Let's walk together.</p>
            </div>
            <p className="border-t border-primary-foreground/20 py-4 text-center text-[10px] opacity-60">© 2026 BR.F — All rights reserved</p>
        </footer>
    );
}
