"use client";

import { useSearchParams } from "next/navigation";

export default function useGetURLquery() {
    const searchParams = useSearchParams();

    const q: string = searchParams.get("q") || "";
    const category: string | null = searchParams.get("category");
    const sale: boolean = searchParams.get("sale") === "true";

    return { q, category, sale };
}