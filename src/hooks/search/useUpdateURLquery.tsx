"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function useUpdateURLQuery() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const updateQuery = useCallback((paramsToUpdate: Record<string, string | boolean | null>) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(paramsToUpdate).forEach(([key, value]) => {
            if (value === null || value === "" || value === false) {
                params.delete(key);
            } else {
                params.set(key, String(value));
            }
        });

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, [pathname, router, searchParams]);

    return updateQuery;
}