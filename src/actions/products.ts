"use server";

import { hellena } from "@/lib/hellena";

export async function listProducts(params: { page?: number; limit?: number }) {
    return hellena.product.listProducts(params);
}
export async function searchProducts(params: { ref: string; page?: number; limit?: number }) {
    return hellena.product.searchProducts(params);
}
export async function getProductByIdOrSlug(idOrSlug: string) {
    return hellena.product.getProductByIdOrSlug(idOrSlug);
}
