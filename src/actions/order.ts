"use server";

import { hellena } from "@/lib/hellena";

export async function createOrder(payload: {
    info: {
        customerId: string; customerName: string; customerEmail: string; customerPhone: string;
        address: string; lat: number; lng: number; notes?: string;
    };
    items: { productId: string; name: string; quantity: number; price: number }[];
    coupon?: string; frete: number; localization: string;
}) {
    return hellena.order.createOrder(payload);
}
