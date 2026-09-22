import { useEffect, useRef, useState } from "react";
import { Filter, SlidersHorizontal } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";

import { ProductCard } from "@/features/products/components/ProductCard";
import { BestProductsSection } from "@/features/products/components/BestProductsSection";
import { useInfiniteProducts } from "@/features/products/hooks/use-products";
import { useCatalogStore } from "@/stores/catalog.store";

export function ProductsPage() {
  const query = useCatalogStore((state) => state.query);
  const normalizedQuery = query.trim().toLowerCase();
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");
  const {
    data,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteProducts(
    12,
    normalizedQuery,
    sort,
    category === "All" ? "" : category,
  );
  const loadMoreRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const loadMoreElement = loadMoreRef.current;
    if (!loadMoreElement || !hasNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { rootMargin: "480px 0px" },
    );

    observer.observe(loadMoreElement);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, normalizedQuery]);

  if (isPending) {
    return (
      <main className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <section className="border-b border-slate-200 py-5 dark:border-slate-800 sm:py-6">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="brand-accent text-xs font-bold uppercase tracking-[0.2em]">
                Top picks
              </p>
              <h1 className="font-display mt-1 text-2xl font-bold text-slate-950 dark:text-white sm:text-3xl">
                Best products for you
              </h1>
            </div>
          </div>
          <div className="grid gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <div
                key={index}
                className="h-44 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800 sm:h-48"
              />
            ))}
          </div>
        </section>

        <section className="border-b border-slate-200 py-5 dark:border-slate-800">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {Array.from({ length: 5 }, (_, index) => (
              <div
                key={index}
                className="h-9 w-24 shrink-0 animate-pulse rounded-full bg-slate-100 dark:bg-slate-900"
              />
            ))}
          </div>
        </section>

        <section className="mt-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="h-4 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              <div className="mt-2 h-7 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="h-10 w-40 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-900" />
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }, (_, index) => (
              <div
                key={index}
                className="h-80 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800"
              />
            ))}
          </div>
        </section>
      </main>
    );
  }

  if (isError) {
    return (
      <p className="p-10 text-center text-red-600">Unable to load products.</p>
    );
  }

  const products = data.pages.flatMap((page) => page.data);
  const total = data.pages.at(-1)?.meta.total ?? 0;
  const categories = ["All", ...(data.pages[0]?.meta.categories ?? [])];
  const filteredProducts = products.filter(
    (product) =>
      !normalizedQuery ||
      `${product.name} ${product.description} ${product.category}`
        .toLowerCase()
        .includes(normalizedQuery),
  );
  const bestProducts = [...products]
    .sort((first, second) => second.rating - first.rating)
    .slice(0, 8);

  return (
    <main className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
      <BestProductsSection products={bestProducts} />

      <section className="border-b border-slate-200 py-5 dark:border-slate-800">
        <Swiper
          spaceBetween={8}
          slidesPerView="auto"
          className="-mx-4 px-4 pb-1 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0"
        >
          {categories.map((item) => (
            <SwiperSlide key={item} className="w-auto!">
              <button
                type="button"
                onClick={() => setCategory(item)}
                className={`shrink-0 cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition ${category === item ? "brand-primary brand-primary-hover" : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"}`}
              >
                {item}
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <section id="catalog" className="mt-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {normalizedQuery || category !== "All"
                ? `${filteredProducts.length} matching products`
                : `${total} products to explore`}
            </p>
            <h2 className="font-display mt-1 text-2xl font-bold text-slate-950 dark:text-white">
              {normalizedQuery
                ? `Results for “${query}”`
                : category === "All"
                  ? "All products"
                  : category}
            </h2>
          </div>
          <label className="brand-focus-within flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 transition dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            <SlidersHorizontal className="h-4 w-4" />
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="cursor-pointer bg-transparent outline-none focus:outline-none focus:ring-0 dark:bg-slate-900"
            >
              <option value="featured">Sort: Featured</option>
              <option value="rating">Top rated</option>
              <option value="price-low">Price: Low to high</option>
              <option value="price-high">Price: High to low</option>
            </select>
          </label>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-700">
            <Filter className="mx-auto h-8 w-8 text-slate-400" />
            <h3 className="mt-4 font-bold text-slate-950 dark:text-white">
              No products found
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Try another search or category.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
        {hasNextPage && (
          <div
            ref={loadMoreRef}
            className="flex min-h-20 items-center justify-center"
          >
            {isFetchingNextPage && (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Loading more products...
              </p>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
