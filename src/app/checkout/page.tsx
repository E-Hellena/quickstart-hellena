"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Summary } from "../cart/page";
import { useCart } from "@/lib/store";
import { useCreateOrder } from "@/hooks/useOrder";

export function Steps({ at }: { at: number }) {
    return (
        <div className="mt-4 flex gap-6 text-xs">
            {["Cart", "Delivery", "Payment"].map((s, i) => (
                <span key={s} className={i <= at ? "font-semibold" : "text-muted-foreground"}>
                    {i + 1}. {s}
                </span>
            ))}
        </div>
    );
}

const field = "w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none focus:border-foreground";

export default function CheckoutPage() {
    const router = useRouter();
    const { items } = useCart();
    const createOrder = useCreateOrder();
    const [method, setMethod] = useState("standard");
    const [error, setError] = useState("");

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");

        if (items.length === 0) {
            setError("O carrinho está vazio. Adicione produtos antes de continuar.");
            return;
        }

        const form = new FormData(event.currentTarget);
        const firstName = String(form.get("firstName") ?? "").trim();
        const lastName = String(form.get("lastName") ?? "").trim();
        const city = String(form.get("city") ?? "").trim();
        const country = String(form.get("country") ?? "").trim();
        const address = String(form.get("address") ?? "").trim();
        const postalCode = String(form.get("postalCode") ?? "").trim();
        const localization = [city, country].filter(Boolean).join(", ");
        const notes = String(form.get("notes") ?? "").trim();

        try {
            const order = await createOrder.mutateAsync({
                info: {
                    customerId: "a19421ef-6f90-4fe5-994d-5f6f10e88716",
                    customerName: [firstName, lastName].filter(Boolean).join(" "),
                    customerEmail: String(form.get("email") ?? "").trim(),
                    customerPhone: String(form.get("phone") ?? "").trim(),
                    customerNIF: "000000000",
                    notes: notes,
                    lat: 0,
                    lng: 0,
                    address: [address, city, postalCode, country].filter(Boolean).join(", ")
                },
                items: items.map(({ product, qty, size, color }) => ({
                    productId: product.id,
                    name: product.name,
                    category: product.category,
                    image: product.img,
                    quantity: Number(qty),
                    size: size ? String(size) : undefined,
                    color: color,
                    price: Number(product.price),
                })),
                coupon: "",
                frete: method === "express" ? 15 : 0,
                localization: localization,
            });

            if (order?.id) {
                router.push(`/payment?orderId=${encodeURIComponent(order.id)}`);
            }
        } catch (cause) {
            console.error("Erro ao criar encomenda Hellena:", cause);
            setError(cause instanceof Error ? cause.message : "Não foi possível criar a encomenda. Verifique os dados e tente novamente.");
        }
    }

    return (
        <main className="mx-auto max-w-6xl px-6 pb-20 pt-8">
            <h1 className="font-display text-5xl">Checkout</h1>
            <Steps at={1} />
            <form onSubmit={handleSubmit} className="mt-10 grid gap-10 md:grid-cols-[1fr_340px]">
                <div className="space-y-8">
                    <fieldset className="grid gap-4 md:grid-cols-2">
                        <legend className="mb-4 text-lg font-semibold">Contact</legend>
                        <input name="firstName" required placeholder="First name" autoComplete="given-name" className={field} />
                        <input name="lastName" required placeholder="Last name" autoComplete="family-name" className={field} />
                        <input name="email" required type="email" placeholder="Email" autoComplete="email" className={field} />
                        <input name="phone" required type="tel" placeholder="Phone" autoComplete="tel" className={field} />
                    </fieldset>
                    <fieldset className="grid gap-4 md:grid-cols-2">
                        <legend className="mb-4 text-lg font-semibold">Delivery address</legend>
                        <input name="address" required placeholder="Street address" autoComplete="street-address" className={`${field} md:col-span-2`} />
                        <input name="city" required placeholder="City" autoComplete="address-level2" className={field} />
                        <input name="postalCode" placeholder="Postal code" autoComplete="postal-code" className={field} />
                        <input name="country" required placeholder="Country" autoComplete="country-name" className={`${field} md:col-span-2`} />
                        <textarea name="notes" placeholder="Delivery notes (optional)" className={`${field} md:col-span-2`} rows={3} />
                    </fieldset>
                    <fieldset className="space-y-3">
                        <legend className="mb-4 text-lg font-semibold">Delivery method</legend>
                        {[
                            ["standard", "Standard · 3–5 days", "Free"],
                            ["express", "Express · 1–2 days", "$15.00"],
                        ].map(([value, label, price]) => (
                            <label key={value} className={`flex cursor-pointer items-center justify-between rounded-md border p-4 text-sm ${method === value ? "border-foreground" : ""}`}>
                                <span className="flex items-center gap-3">
                                    <input type="radio" name="deliveryMethod" checked={method === value} onChange={() => setMethod(value!)} className="accent-primary cursor-pointer" />
                                    {label}
                                </span>
                                <span>{price}</span>
                            </label>
                        ))}
                    </fieldset>
                    {error && <p role="alert" className="rounded-md border border-red-500/40 bg-red-500/5 p-3 text-sm text-red-600">{error}</p>}
                </div>
                <Summary>
                    <button type="submit" disabled={createOrder.isPending || items.length === 0} className="mt-6 w-full rounded-md bg-primary py-3 text-sm text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50">
                        {createOrder.isPending ? "A criar encomenda..." : "Continue to payment"}
                    </button>
                    <Link href="/cart" className="mt-3 block text-center text-xs text-muted-foreground hover:underline">Back to cart</Link>
                </Summary>
            </form>
        </main>
    );
}
