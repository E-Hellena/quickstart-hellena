"use server";

import { hellena } from "@/lib/hellena";

export async function getProductRatingSummary(stockId: string) {
    return hellena.rating.getProductRatingSummary(stockId);
}
export async function getCustomerProductRating(params: { stockId: string; customerId: string }) {
    return hellena.rating.getCustomerProductRating(params);
}
export async function createProductRating(payload: {
    stockId: string; score: number; customerId?: string; customerName?: string;
}) {
    return hellena.rating.createProductRating(payload);
}
export async function deleteProductRating(ratingId: string) {
    return hellena.rating.deleteProductRating(ratingId);
}
