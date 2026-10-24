"use client"

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import ProductRenderImages from "@/components/layouts/Product-render-image";
import { ProductDTO } from "@hellena-sdk/hellena";
import ProductInfo from "@/components/layouts/product-info";
import ProductComments from "@/components/layouts/product-comment";
import ProductRating from "@/components/layouts/product-rating";
import { Suspense } from "react";
import { ProductSkeleton } from "@/components/skeleton/ProductSkeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductRelated from "@/components/layouts/product-related";
import { useParams } from "next/navigation";
import { useProductDetail } from "@/hooks/useProduct";

export default function ProductPage() {
    const parms = useParams<{ ref: string }>();
    const { data: product, isLoading } = useProductDetail(parms.ref);

    if (isLoading) return <ProductSkeleton />;

    return (
        <main className="mx-auto max-w-6xl px-6 pb-20">
            {/* Breadcrumbs */}
            <section className="mx-auto max-w-6xl">
                <div className="flex items-center gap-1 py-5 text-xs text-muted-foreground">
                    Loja <ChevronRight className="h-3 w-3" />
                    <Link href={`/category/${product?.category || ""}`} className="hover:underline">
                        {product?.category || "Produtos"}
                    </Link>{" "}
                    <ChevronRight className="h-3 w-3" />
                    <Link href={`/brand/${product?.brand || ""}`} className="hover:underline">
                        {product?.brand || "Geral"}
                    </Link>
                </div>
            </section>

            {/* Secção Principal do Produto */}
            <section className="grid gap-12 md:grid-cols-2">
                <ProductRenderImages product={product as ProductDTO} />

                <Suspense fallback={<span className="text-xs text-muted-foreground">Carregando detalhes...</span>}>
                    <ProductInfo product={product as ProductDTO} />
                </Suspense>
            </section>

            {/* Abas com shadcn/ui e Avaliações */}
            <section className="mt-16 grid gap-12 md:grid-cols-[1fr_320px]">
                <Tabs defaultValue="reviews" className="w-full">
                    <TabsList className="w-full justify-start border-b bg-transparent p-0 rounded-none h-auto gap-8 shadow-none">
                        <TabsTrigger
                            value="reviews"
                            className="text-2xl font-normal text-muted-foreground border-b-2 border-transparent bg-transparent rounded-none pb-4 px-0 shadow-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:font-semibold data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                        >
                            Comentários
                        </TabsTrigger>
                        <TabsTrigger
                            value="details"
                            className="text-2xl font-normal text-muted-foreground border-b-2 border-transparent bg-transparent rounded-none pb-4 px-0 shadow-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:font-semibold data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                        >
                            Detalhes
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="reviews" className="mt-6">
                        <Suspense fallback={<span className="text-xs text-muted-foreground">Carregando comentários...</span>}>
                            <ProductComments product={product as ProductDTO} />
                        </Suspense>
                    </TabsContent>

                    <TabsContent value="details" className="mt-6">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {product?.description || "Sem detalhes adicionais disponíveis para este produto."}
                        </p>
                    </TabsContent>
                </Tabs>

                {/* Lateral com Notas */}
                <Suspense fallback={<span className="text-xs text-muted-foreground">Carregando notas...</span>}>
                    <ProductRating product={product as ProductDTO} />
                </Suspense>
            </section>

            {/* Produtos Relacionados */}
            <ProductRelated product={product as ProductDTO} />
        </main>
    );
}