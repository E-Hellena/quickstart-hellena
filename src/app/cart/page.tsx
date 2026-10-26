"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, Truck } from "lucide-react";
import { money, useCart } from "@/lib/store";

export function Summary({ children }: { children?: React.ReactNode }) {
    const { subtotal } = useCart();
    const ship = subtotal >= 30 || subtotal === 0 ? 0 : 7.5;

    return (
        <aside className="h-fit rounded-lg bg-surface p-6">
            <h2 className="font-display text-3xl">Summary</h2>
            <div className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{money(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Delivery</span>
                    <span>{ship ? money(ship) : "Free"}</span>
                </div>
                <div className="flex justify-between border-t pt-3 text-base font-semibold">
                    <span>Total</span>
                    <span>{money(subtotal + ship)}</span>
                </div>
            </div>
            {children}
        </aside>
    );
}

export default function CartPage() {
    const { items, setQty, remove } = useCart();

    return (
        <main className="mx-auto max-w-6xl px-6 pb-20 pt-8">
            <h1 className="font-display text-5xl">Your Cart</h1>
            {items.length === 0 ? (
                <div className="mt-10 rounded-lg bg-surface p-12 text-center">
                    <p className="text-sm text-muted-foreground">Your cart is empty.</p>
                    <Link href="/search" className="mt-6 inline-block rounded-md bg-primary px-6 py-3 text-sm text-primary-foreground">
                        Start shopping
                    </Link>
                </div>
            ) : (
                <div className="mt-10 grid gap-10 md:grid-cols-[1fr_340px]">
                    <div className="divide-y border-y">
                        {items.map((item, index) => {
                            const product = item.product;
                            return (
                                <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-5 py-6">
                                    <img src={product.img} alt={product.name} className="border h-28 w-28 rounded-md bg-surface object-cover" />
                                    <div className="flex flex-1 flex-col">
                                        <div className="flex justify-between">
                                            <div>
                                                <p className="text-xs text-muted-foreground">{product.brand}</p>
                                                <p className="font-medium">{product.name}</p>
                                            </div>
                                            <p className="font-semibold">{money(product.price * item.qty)}</p>
                                        </div>
                                        <div className="flex items-center gap-1 mt-1">
                                            {item.size && (
                                                <div className="h-5 px-1 flex border items-center justify-center rounded-sm">
                                                    <p className="text-xs text-muted-foreground">{item.size}</p>
                                                </div>
                                            )}
                                            {item.color && (
                                                <div
                                                    style={{ background: item.color }}
                                                    className="h-5 w-6 px-2 py-1 rounded-sm border"
                                                />
                                            )}
                                        </div>
                                        <div className="mt-auto flex items-center justify-between">
                                            <div className="flex items-center rounded-md border">
                                                <button aria-label="Less" onClick={() => setQty(index, item.qty - 1)} className="px-3 py-1.5">
                                                    <Minus className="h-3 w-3" />
                                                </button>
                                                <span className="w-6 text-center text-sm">{item.qty}</span>
                                                <button aria-label="More" onClick={() => setQty(index, item.qty + 1)} className="px-3 py-1.5">
                                                    <Plus className="h-3 w-3" />
                                                </button>
                                            </div>
                                            <button onClick={() => remove(index)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-sale">
                                                <Trash2 className="h-3 w-3" />
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <Summary>
                        <Link href="/checkout" className="mt-6 block rounded-md bg-primary py-3 text-center text-sm text-primary-foreground">
                            Checkout
                        </Link>
                        <p className="mt-4 flex items-center gap-2 text-xs">
                            <Truck className="h-4 w-4" />
                            Free delivery on orders over $30.0
                        </p>
                    </Summary>
                </div>
            )}
        </main>
    );
}
