"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { Summary } from "../cart/page";

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
    const [method, setMethod] = useState("standard");

    return (
        <main className="mx-auto max-w-6xl px-6 pb-20 pt-8">
            <h1 className="font-display text-5xl">Checkout</h1>
            <Steps at={1} />
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    router.push("/payment");
                }}
                className="mt-10 grid gap-10 md:grid-cols-[1fr_340px]"
            >
                <div className="space-y-8">
                    <fieldset className="grid gap-4 md:grid-cols-2">
                        <legend className="mb-4 text-lg font-semibold">Contact</legend>
                        <input required placeholder="First name" className={field} />
                        <input required placeholder="Last name" className={field} />
                        <input required type="email" placeholder="Email" className={field} />
                        <input required placeholder="Phone" className={field} />
                    </fieldset>
                    <fieldset className="grid gap-4 md:grid-cols-2">
                        <legend className="mb-4 text-lg font-semibold">Delivery address</legend>
                        <input required placeholder="Street address" className={`${field} md:col-span-2`} />
                        <input required placeholder="City" className={field} />
                        <input placeholder="Postal code" className={field} />
                        <input required placeholder="Country" className={`${field} md:col-span-2`} />
                    </fieldset>
                    <fieldset className="space-y-3">
                        <legend className="mb-4 text-lg font-semibold">Delivery method</legend>
                        {[
                            ["standard", "Standard · 3–5 days", "Free"],
                            ["express", "Express · 1–2 days", "$15.00"],
                        ].map(([v, l, p]) => (
                            <label
                                key={v}
                                className={`flex cursor-pointer items-center justify-between rounded-md border p-4 text-sm ${method === v ? "border-foreground" : ""
                                    }`}
                            >
                                <span className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        checked={method === v}
                                        onChange={() => setMethod(v!)}
                                        className="accent-primary cursor-pointer"
                                    />
                                    {l}
                                </span>
                                <span>{p}</span>
                            </label>
                        ))}
                    </fieldset>
                </div>
                <Summary>
                    <button type="submit" className="mt-6 w-full rounded-md bg-primary py-3 text-sm text-primary-foreground">
                        Continue to payment
                    </button>
                </Summary>
            </form>
        </main>
    );
}