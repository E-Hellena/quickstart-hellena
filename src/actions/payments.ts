"use server";

import { hellena } from "@/lib/hellena";

export async function listAvailablePaymentMethods() {
    return hellena.payment.listAvailablePaymentMethods();
}
export async function createWiPayPayment(payload: {
    customer: string; reference: string; failure_url: string; success_url: string;
}) {
    return hellena.payment.createWiPayPayment(payload);
}
