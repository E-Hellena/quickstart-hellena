import SearchHeaderInput from "@/components/layouts/search/search-header-input";
import SearchAsideFilter from "@/components/layouts/search/search-aside-filter";
import SearchListProducts from "@/components/layouts/search/search-list-products";
import { ProductFilterProvider } from "@/hooks/search/useProductFilter";
import { ProductsProvider } from "@/hooks/search/useGetProducts";

export default async function SearchPage() {
    return (
        <main className="mx-auto max-w-6xl px-6 pb-20 pt-8">
            <ProductFilterProvider>
                <ProductsProvider>
                    <SearchHeaderInput />
                    <div className="mt-8 grid gap-10 md:grid-cols-[220px_1fr]">
                        <SearchAsideFilter />
                        <SearchListProducts />
                    </div>
                </ProductsProvider>
            </ProductFilterProvider>
        </main>
    );
}