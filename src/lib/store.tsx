"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { ProductDTO } from "@hellena-sdk/hellena";
import side from "@/assets/shoe-side.jpg";
import top from "@/assets/shoe-top.jpg";
import back from "@/assets/shoe-back.jpg";
import black from "@/assets/shoe-black.jpg";

// Mantido para componentes antigos da homepage; o carrinho usa exclusivamente o produto real adicionado via API.
export type Product = { id: string; name: string; slug: string; brand: string; price: number; old?: number; img: string; category: string; color: string };
export const products: Product[] = [
    { id: "zig-kinetica-3", name: "Zig Kinetica 3", slug: "zig-kinetica-3", brand: "Reebok", price: 199, img: side.src, category: "Running", color: "White" },
    { id: "bb550", name: "BB550", slug: "bb550", brand: "New Balance", price: 210, img: top.src, category: "Lifestyle", color: "White" },
    { id: "gel-lyte-3", name: "Gel-Lyte III OG", slug: "gel-lyte-3", brand: "ASICS", price: 196.5, old: 240, img: back.src, category: "Lifestyle", color: "Grey" },
    { id: "classic-leather", name: "Classic Leather", slug: "classic-leather", brand: "Reebok", price: 149.15, img: black.src, category: "Lifestyle", color: "Black" },
    { id: "zig-dynamica", name: "Zig Dynamica", slug: "zig-dynamica", brand: "Reebok", price: 129, old: 165, img: side.src, category: "Running", color: "White" },
    { id: "fresh-foam", name: "Fresh Foam X", slug: "fresh-foam", brand: "New Balance", price: 175, img: back.src, category: "Running", color: "Grey" },
    { id: "court-low", name: "Court Low", slug: "court-low", brand: "ASICS", price: 99, old: 130, img: black.src, category: "Tennis", color: "Black" },
    { id: "club-c", name: "Club C 85", slug: "club-c", brand: "Reebok", price: 110, img: top.src, category: "Tennis", color: "White" },
];

export const money = (n: number | string) => {
    const amount = Number(n);
    return (Number.isFinite(amount) ? amount : 0).toLocaleString("pt-br", {
        style: "currency",
        currency: "AOA",
    });
};

export type CartProduct = {
    id: string;
    name: string;
    brand: string;
    price: number;
    img: string;
    category: string;
    color: string;
};

export type CartItem = { id: string; size: string; color: string; qty: number; product: CartProduct };
type Ctx = {
    items: CartItem[];
    add: (product: ProductDTO, size: string, color: string) => void;
    setQty: (i: number, qty: number) => void;
    remove: (i: number) => void;
    clear: () => void;
    count: number;
    subtotal: number;
};
const CartCtx = createContext<Ctx | null>(null);

function toCartProduct(product: ProductDTO): CartProduct {
    const currentPrice = product.prices?.find((p) => p.priceType === "CURRENT")?.price;
    const promotionalPrice = product.prices?.find((p) => p.priceType === "PROMOTIONAL")?.price;
    const category = Array.isArray(product.category) ? product.category[0] : product.category;

    return {
        id: product.id,
        name: product.name || "Produto Hellena",
        brand: product.brand || "Geral",
        price: Number(promotionalPrice ?? currentPrice ?? 0),
        img: product.image || "https://media.wallmantra.com/product/original/product_placeholder.webp",
        category: category || "Categoria",
        color: Array.isArray(product.color) ? product.color.join(", ") : (product.color || "—"),
    };
}

const STORAGE_KEY = "@hellena:cart";

export function CartProvider({ children }: { children: ReactNode }) {
    // Inicializa o estado buscando do sessionStorage (se estiver rodando no client)
    const [items, setItems] = useState<CartItem[]>(() => {
        if (typeof window === "undefined") return [];
        try {
            const saved = sessionStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error("Erro ao carregar o carrinho do sessionStorage", e);
            return [];
        }
    });

    // Salva no sessionStorage toda vez que os itens mudarem
    useEffect(() => {
        try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch (e) {
            console.error("Erro ao salvar o carrinho no sessionStorage", e);
        }
    }, [items]);

    const add = (product: ProductDTO, size: string, color: string) => {
        const cartProduct = toCartProduct(product);
        setItems((previous) => {
            const index = previous.findIndex((item) => item.id === product.id && item.size === size && item.color === color);
            if (index >= 0) {
                return previous.map((item, i) => i === index ? { ...item, qty: item.qty + 1, product: { ...cartProduct, color } } : item);
            }
            return [...previous, { id: product.id, size, color, qty: 1, product: { ...cartProduct, color } }];
        });
    };

    const setQty = (i: number, qty: number) => setItems((previous) => previous.map((item, j) => j === i ? { ...item, qty: Math.max(1, qty) } : item));
    const remove = (i: number) => setItems((previous) => previous.filter((_, j) => j !== i));
    const clear = () => setItems([]);

    const count = items.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = items.reduce((sum, item) => sum + item.qty * item.product.price, 0);

    return <CartCtx.Provider value={{ items, add, setQty, remove, clear, count, subtotal }}>{children}</CartCtx.Provider>;
}

export function useCart() {
    const context = useContext(CartCtx);
    if (!context) throw new Error("useCart outside CartProvider");
    return context;
}