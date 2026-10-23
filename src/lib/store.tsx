"use client"

import { createContext, useContext, useState, type ReactNode } from "react";
import side from "@/assets/shoe-side.jpg";
import top from "@/assets/shoe-top.jpg";
import back from "@/assets/shoe-back.jpg";
import black from "@/assets/shoe-black.jpg";

export type Product = { id: string; name: string; brand: string; price: number; old?: number; img: string; category: string; color: string };

export const products: Product[] = [
    { id: "zig-kinetica-3", name: "Zig Kinetica 3", brand: "Reebok", price: 199, img: side.src, category: "Running", color: "White" },
    { id: "bb550", name: "BB550", brand: "New Balance", price: 210, img: top.src, category: "Lifestyle", color: "White" },
    { id: "gel-lyte-3", name: "Gel-Lyte III OG", brand: "ASICS", price: 196.5, old: 240, img: back.src, category: "Lifestyle", color: "Grey" },
    { id: "classic-leather", name: "Classic Leather", brand: "Reebok", price: 149.15, img: black.src, category: "Lifestyle", color: "Black" },
    { id: "zig-dynamica", name: "Zig Dynamica", brand: "Reebok", price: 129, old: 165, img: side.src, category: "Running", color: "White" },
    { id: "fresh-foam", name: "Fresh Foam X", brand: "New Balance", price: 175, img: back.src, category: "Running", color: "Grey" },
    { id: "court-low", name: "Court Low", brand: "ASICS", price: 99, old: 130, img: black.src, category: "Tennis", color: "Black" },
    { id: "club-c", name: "Club C 85", brand: "Reebok", price: 110, img: top.src, category: "Tennis", color: "White" },
];

export const money = (n: number) => `$${n.toFixed(2)}`;

export type CartItem = { id: string; size: string; qty: number };
type Ctx = {
    items: CartItem[];
    add: (id: string, size: string) => void;
    setQty: (i: number, qty: number) => void;
    remove: (i: number) => void;
    clear: () => void;
    count: number;
    subtotal: number;
};
const CartCtx = createContext<Ctx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([{ id: "zig-kinetica-3", size: "41", qty: 1 }, { id: "bb550", size: "42", qty: 1 }]);
    const add = (id: string, size: string) =>
        setItems((p) => {
            const i = p.findIndex((x) => x.id === id && x.size === size);
            if (i >= 0) return p.map((x, j) => (j === i ? { ...x, qty: x.qty + 1 } : x));
            return [...p, { id, size, qty: 1 }];
        });
    const setQty = (i: number, qty: number) => setItems((p) => p.map((x, j) => (j === i ? { ...x, qty: Math.max(1, qty) } : x)));
    const remove = (i: number) => setItems((p) => p.filter((_, j) => j !== i));
    const count = items.reduce((s, x) => s + x.qty, 0);
    const subtotal = items.reduce((s, x) => s + x.qty * (products.find((p) => p.id === x.id)?.price ?? 0), 0);
    return <CartCtx.Provider value={{ items, add, setQty, remove, clear: () => setItems([]), count, subtotal }}>{children}</CartCtx.Provider>;
}

export function useCart() {
    const c = useContext(CartCtx);
    if (!c) throw new Error("useCart outside CartProvider");
    return c;
}
