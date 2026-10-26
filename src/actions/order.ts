"use server";

import { hellena } from "@/lib/hellena";
import { OrderDTO } from "@hellena-sdk/hellena";

export async function createOrder(payload: OrderDTO) {
    console.log(payload)
    return hellena.order.createOrder(payload);
}
