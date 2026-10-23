"use client";

import { useState } from "react";
import Link from "next/link";
import { CreditCard, Lock, CheckCircle2, Smartphone, Landmark } from "lucide-react";
import { useCart } from "@/lib/store";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { Steps } from "../checkout/page";
import { Summary } from "../cart/page";
import { useAvailablePaymentMethods } from "@/hooks/usePayments";

const field = "w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none focus:border-foreground";

export default function PaymentPage() {
    const [method, setMethod] = useState("card");
    const [done, setDone] = useState(false);
    const { clear } = useCart();
    const paymentMethodsQuery = useAvailablePaymentMethods();

    if (done) {
        return (
            <div className="min-h-screen bg-background font-sans text-foreground">
                <SiteHeader />
                <main className="mx-auto max-w-xl px-6 py-24 text-center">
                    <CheckCircle2 className="mx-auto h-14 w-14 text-rating" />
                    <h1 className="mt-6 font-display text-5xl">Thank you!</h1>
                    <p className="mt-3 text-sm text-muted-foreground">
                        Your order has been placed. (Demo only — no real payment was taken.)
                    </p>
                    <Link
                        href="/"
                        className="mt-8 inline-block rounded-md bg-primary px-6 py-3 text-sm text-primary-foreground"
                    >
                        Back to home
                    </Link>
                </main>
                <SiteFooter />
            </div>
        );
    }

    const methods = [
        ["card", "Credit / debit card", CreditCard],
        ["mobile", "Mobile payment", Smartphone],
        ["bank", "Bank transfer", Landmark],
    ] as const;

    return (
        <div className="min-h-screen bg-background font-sans text-foreground">
            <SiteHeader />
            <main className="mx-auto max-w-6xl px-6 pb-20 pt-8">
                <h1 className="font-display text-5xl">Payment</h1>
                <Steps at={2} />
                <p aria-live="polite" className="mt-3 text-xs text-muted-foreground">
                    {paymentMethodsQuery.isPending
                        ? "Checking payment methods with Hellena…"
                        : paymentMethodsQuery.isError
                            ? "Hellena payment methods unavailable. The options below are for demonstration only."
                            : "Hellena payment methods loaded. The options below remain demonstrative and do not process a real payment."}
                </p>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        clear();
                        setDone(true);
                    }}
                    className="mt-10 grid gap-10 md:grid-cols-[1fr_340px]"
                >
                    <div className="space-y-6">
                        <div className="grid gap-3 md:grid-cols-3">
                            {methods.map(([v, l, Icon]) => (
                                <button
                                    type="button"
                                    key={v}
                                    onClick={() => setMethod(v)}
                                    className={`flex flex-col items-center gap-2 rounded-md border p-4 text-xs ${method === v ? "border-foreground bg-surface" : ""
                                        }`}
                                >
                                    <Icon className="h-5 w-5" />
                                    {l}
                                </button>
                            ))}
                        </div>
                        {method === "card" && (
                            <div className="grid gap-4 md:grid-cols-2">
                                <input required placeholder="Name on card" className={`${field} md:col-span-2`} />
                                <input required inputMode="numeric" placeholder="Card number" className={`${field} md:col-span-2`} />
                                <input required placeholder="MM / YY" className={field} />
                                <input required placeholder="CVC" className={field} />
                            </div>
                        )}
                        {method === "mobile" && <input required placeholder="Phone number" className={field} />}
                        {method === "bank" && (
                            <p className="rounded-md bg-surface p-4 text-sm text-muted-foreground">
                                You&apos;ll receive our bank details by email after placing the order.
                            </p>
                        )}
                        <p className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Lock className="h-3 w-3" />
                            Your payment details are encrypted.
                        </p>
                    </div>
                    <Summary>
                        <button type="submit" className="mt-6 w-full rounded-md bg-primary py-3 text-sm text-primary-foreground">
                            Place order
                        </button>
                    </Summary>
                </form>
            </main>
            <SiteFooter />
        </div>
    );
}