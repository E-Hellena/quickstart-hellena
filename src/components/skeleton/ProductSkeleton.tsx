import { Skeleton } from "@/components/ui/skeleton";
import { Star } from "lucide-react";

function Stars({ n, size = 14 }: { n: number; size?: number }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
                <Star
                    key={i}
                    style={{ width: size, height: size }}
                    className={i <= Math.round(n) ? "fill-rating text-rating" : "fill-muted text-muted"}
                />
            ))}
        </div>
    );
}

export function ProductSkeleton() {
    return (
        <main className="mx-auto max-w-6xl px-6 pb-20">
            {/* Breadcrumb Skeleton */}
            <div className="py-3">
                <Skeleton className="h-8 w-48" />
            </div>

            {/* Grid Principal: Imagem + Informações */}
            <section className="grid gap-12 md:grid-cols-2">
                {/* Galeria de Imagens */}
                <div>
                    <Skeleton className="aspect-[4/3] w-full rounded-lg" />
                    <div className="mt-3 grid grid-cols-5 gap-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} className="aspect-square w-full rounded-md" />
                        ))}
                    </div>
                </div>

                {/* Detalhes do Produto */}
                <div>
                    {/* Categoria e Marca */}
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-4 w-16" />
                    </div>

                    {/* Título do Produto */}
                    <Skeleton className="mt-4 h-10 w-3/4" />

                    {/* Avaliação (Estrelas) */}
                    <div className="mt-2 flex items-center gap-2">
                        <Stars n={0} size={20} />
                        <Skeleton className="h-7 w-20" />
                    </div>

                    {/* Preço e Desconto */}
                    <div className="mt-6 space-y-2">
                        <div className="flex  gap-2">
                            <Skeleton className="h-11 w-60" />
                            <Skeleton className="h-6 w-16 rounded-md" />
                        </div>
                        <Skeleton className="h-6 w-28" />
                    </div>

                    {/* Descrição */}
                    <div className="mt-4 space-y-2">
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-5/6" />
                    </div>

                    {/* Variantes e Cores */}
                    <div className="mt-6 flex gap-8 justify-between">
                        <div>
                            <Skeleton className="h-4 w-20 mb-2" />
                            <div className="flex gap-2">
                                <Skeleton className="h-12 w-12 rounded-md" />
                                <Skeleton className="h-12 w-12 rounded-md" />
                            </div>
                        </div>
                        <div>
                            <Skeleton className="h-4 w-16 mb-2" />
                            <div className="flex gap-2">
                                <Skeleton className="h-9 w-9 rounded-md" />
                                <Skeleton className="h-9 w-9 rounded-md" />
                                <Skeleton className="h-9 w-9 rounded-md" />
                            </div>
                        </div>
                    </div>

                    {/* Tamanhos */}
                    <div className="mt-6">
                        <Skeleton className="h-4 w-20 mb-2" />
                        <div className="grid grid-cols-6 gap-2">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                                <Skeleton key={i} className="h-10 w-full rounded-md" />
                            ))}
                        </div>
                    </div>

                    {/* Botões de Ação */}
                    <div className="mt-8 flex gap-3">
                        <Skeleton className="h-12 flex-1 rounded-md" />
                        <Skeleton className="h-12 w-12 rounded-md" />
                    </div>

                    {/* Entrega */}
                    <Skeleton className="mt-4 h-4 w-60" />
                </div>
            </section>

            {/* Abas de Comentários / Detalhes */}
            <section className="mt-16 grid gap-12 md:grid-cols-[1fr_320px]">
                <CommentsSkeleton />

                {/* Lateral com Notas */}
                <aside className="space-y-6">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-6 w-28" />
                        <Skeleton className="h-8 w-12" />
                    </div>
                    <div className="space-y-3">
                        {[5, 4, 3, 2, 1].map((s) => (
                            <div key={s} className="flex items-center gap-3">
                                <Skeleton className="h-3 w-3" />
                                <Skeleton className="h-2 flex-1 rounded-full" />
                                <Skeleton className="h-3 w-5" />
                            </div>
                        ))}
                    </div>
                </aside>
            </section>
        </main>
    );
}

export function CommentsSkeleton() {
    return (
        <div>
            <div className="flex gap-8 border-b pb-4">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-8 w-24" />
            </div>

            {/* Form de Comentário */}
            <div className="mt-6 flex gap-2">
                <Skeleton className="h-10 flex-1 rounded-md" />
                <Skeleton className="h-10 w-24 rounded-md" />
            </div>

            {/* Lista de Comentários */}
            <div className="mt-6 space-y-6 divide-y">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="pt-6 space-y-3 pb-4">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                        <Skeleton className="h-4 w-4/5 ml-11" />
                    </div>
                ))}
            </div>
        </div>
    )
}