"use client";

import useUpdateURLQuery from "@/hooks/search/useUpdateURLquery";
import useGetURLquery from "@/hooks/search/useGetURLquery";

export default function SearchHeaderInput() {
    const updateQuery = useUpdateURLQuery();
    const { q, category, sale } = useGetURLquery();

    return (
        <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
                <h1 className="font-display text-5xl">
                    {q ? `"${q}"` : sale ? "Sale" : category || "All shoes"}
                </h1>
                <p className="mt-2 text-xs text-muted-foreground">0 results</p>
                <p aria-live="polite" className="mt-1 text-xs text-muted-foreground">
                    Checking the Hellena catalogue…
                </p>
            </div>
            <input
                value={q}
                onChange={(e) => updateQuery({ q: e.target.value })}
                placeholder="Search by name or brand"
                className="w-72 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
            />
        </div>
    );
}