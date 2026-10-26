import { Skeleton } from "@/components/ui/skeleton";
import { SlidersHorizontal } from "lucide-react";

export function SearchSkeleton() {
    return (
        <main className="mx-auto max-w-6xl px-6 pb-20 pt-8 animate-pulse">
            {/* Header / Título e Input de Pesquisa */}
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-12 w-64" />
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-10 w-72 rounded-md" />
            </div>

            {/* Layout Principal: Sidebar + Conteúdo */}
            <div className="mt-8 grid gap-10 md:grid-cols-[220px_1fr]">
                {/* Sidebar de Filtros */}
                <SearchSideSkeleton />

                {/* Grelha de Resultados */}
                <div>
                    {/* Barra de Ordenação / Filtros Ativos */}
                    <ProductResultsSkeleton />

                    {/* Grelha de Produtos Skeleton */}
                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="rounded-lg bg-surface p-4 space-y-3">
                                <Skeleton className="aspect-square w-full rounded-md" />
                                <Skeleton className="h-3 w-28" />
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-5 w-24" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}


{/* Grelha de Produtos Skeleton */ }
export function ProductResultsSkeleton() {
    return (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-lg bg-surface p-4 space-y-3">
                    <Skeleton className="aspect-square w-full rounded-md" />
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-5 w-24" />
                </div>
            ))}
        </div>
    );
}

{/* Sidebar de Filtros */ }
export function SearchSideSkeleton() {
    return (
        <aside className="space-y-8">
            <div className="flex items-center justify-between text-sm font-semibold">
                <span className="flex items-center gap-2 text-muted-foreground">
                    <SlidersHorizontal className="h-4 w-4" /> Filters
                </span>
                <Skeleton className="h-3 w-12" />
            </div>

            {/* Grupo de Filtros: Categoria */}
            <div className="space-y-3">
                <Skeleton className="h-3 w-20" />
                <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4 rounded" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Grupo de Filtros: Brand */}
            <div className="space-y-3">
                <Skeleton className="h-3 w-16" />
                <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4 rounded" />
                            <Skeleton className="h-4 w-28" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Grupo de Filtros: Color */}
            <div className="space-y-3">
                <Skeleton className="h-3 w-14" />
                <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4 rounded" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Preço Máximo */}
            <div className="space-y-2">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-4 w-full rounded-full" />
            </div>

            {/* Checkbox On Sale */}
            <div className="flex items-center gap-2 pt-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-24" />
            </div>
        </aside>
    );
}