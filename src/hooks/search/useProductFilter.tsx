"use client"

import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useState } from "react";

const context = createContext<{
    selBrands: string[];
    setBrands: (v: string[]) => void;
    selColors: string[];
    setColors: (v: string[]) => void;
    max: number;
    setMax: (v: number) => void;
    sort: string;
    setSort: (v: string) => void;
    tog: (arr: string[], set: (v: string[]) => void, v: string) => void;
    reset: () => void;

}>({} as any);

export const useProductFulter = () => useContext(context);

export function ProductFilterProvider({ children }: { children: React.ReactNode }) {
    const [selBrands, setBrands] = useState<string[]>([]);
    const [selColors, setColors] = useState<string[]>([]);
    const [max, setMax] = useState(4000000);
    const [sort, setSort] = useState("featured");

    const router = useRouter();
    const pathname = usePathname();

    const tog = (arr: string[], set: (v: string[]) => void, v: string) => {
        set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
    };

    const reset = () => {
        setBrands([]);
        setColors([]);
        setMax(4000000);
        router.push(pathname);
    };

    return (
        <context.Provider value={{ selBrands, setBrands, selColors, setColors, max, setMax, sort, setSort, tog, reset }}>
            {children}
        </context.Provider>
    );
}   