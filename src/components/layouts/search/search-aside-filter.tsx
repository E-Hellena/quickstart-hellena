"use client";

import { SlidersHorizontal } from "lucide-react";
import { money } from "@/lib/store";
import useUpdateURLQuery from "@/hooks/search/useUpdateURLquery";
import useGetURLquery from "@/hooks/search/useGetURLquery";
import { MyCheck as Check } from "@/components/ui/my-check";
import { useProductFulter } from "@/hooks/search/useProductFilter";

export default function SearchAsideFilter() {
    const { selBrands, setBrands, selColors, setColors, max, setMax, tog, reset } = useProductFulter();
    const { category, sale } = useGetURLquery();
    const updateQuery = useUpdateURLQuery();

    const cats = ["Running", "Lifestyle", "Tennis", "Training", "Basketball"];
    const brands = ["Nike", "Adidas", "New Balance", "ASICS", "Reebok", "Puma", "Salomon"];
    const colors = [
        { name: "White", hex: "#FFFFFF" },
        { name: "Black", hex: "#000000" },
        { name: "Grey", hex: "#808080" },
        { name: "Blue", hex: "#2563EB" },
        { name: "Red", hex: "#DC2626" },
        { name: "Green", hex: "#16A34A" },
        { name: "Beige", hex: "#D4D4D8" },
    ];

    return (
        <aside className="space-y-8">
            <div className="flex items-center justify-between text-sm font-semibold">
                <span className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4" /> Filters
                </span>
                <button onClick={reset} className="text-xs font-normal text-rating hover:underline">
                    Clear all
                </button>
            </div>

            {/* Categoria */}
            <div className="space-y-2">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Category</p>
                {cats.map((c) => (
                    <Check
                        key={c}
                        label={c}
                        on={category === c}
                        toggle={() => updateQuery({ category: category === c ? null : c })}
                    />
                ))}
            </div>

            {/* Marcas */}
            <div className="space-y-2">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Brand</p>
                {brands.map((b) => (
                    <Check
                        key={b}
                        label={b}
                        on={selBrands.includes(b)}
                        toggle={() => tog(selBrands, setBrands, b)}
                    />
                ))}
            </div>

            {/* Cores */}
            <div className="space-y-2">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Color</p>
                {colors.map((c) => (
                    <div key={c.name} className="flex items-center gap-2">
                        <Check
                            label={c.name}
                            on={selColors.includes(c.name)}
                            toggle={() => tog(selColors, setColors, c.name)}
                        />
                        <span
                            className="h-3 w-3 rounded-full border border-gray-300"
                            style={{ backgroundColor: c.hex }}
                        />
                    </div>
                ))}
            </div>

            {/* Preço Máximo */}
            <div className="space-y-2">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    Max price · {money(max)}
                </p>
                <input
                    type="range"
                    min={100}
                    max={4000000}
                    step={10}
                    value={max}
                    onChange={(e) => setMax(+e.target.value)}
                    className="w-full accent-primary"
                />
            </div>

            {/* Promoções */}
            <Check
                label="On sale only"
                on={Boolean(sale)}
                toggle={() => updateQuery({ sale: !sale })}
            />
        </aside>
    );
}