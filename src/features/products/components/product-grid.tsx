"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";

import { ProductCard } from "./product-card";

import { useGetProductsQuery } from "@/services/api/products.api";
import type { Product } from "@/types/product";

const EMPTY_PRODUCTS: Product[] = [];

export function ProductGrid() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const { data, isLoading, isError, refetch } = useGetProductsQuery({
    page: 1,
    limit: 100,
  });
  const availableProducts = data?.products ?? EMPTY_PRODUCTS;
  const categories = [
    "All",
    ...Array.from(new Set(availableProducts.map((product) => product.category))).sort(),
  ];
  const products = useMemo(
    () =>
      availableProducts.filter((product) => {
        const matchesQuery = `${product.name} ${product.category}`
          .toLowerCase()
          .includes(query.trim().toLowerCase());
        const matchesCategory =
          activeCategory === "All" || product.category === activeCategory;

        return matchesQuery && matchesCategory;
      }),
    [activeCategory, availableProducts, query],
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="aspect-square animate-pulse rounded-lg bg-muted"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-12 text-center">
        <p className="mb-4">Failed to load products.</p>

        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-md border px-4 py-2"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!availableProducts.length) {
    return <div className="py-12 text-center">No products found.</div>;
  }

  return (
    <div>
      <div className="mb-7 flex flex-col gap-4 rounded-2xl border bg-card p-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl bg-muted/70 px-3 py-2.5">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search the collection"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </label>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:max-w-[52%] sm:pb-0">
          <SlidersHorizontal className="size-4 shrink-0 text-muted-foreground" />
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                activeCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <p className="mb-5 text-sm text-muted-foreground">
        {products.length} {products.length === 1 ? "item" : "items"} found
      </p>

      {products.length ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed py-16 text-center">
          <p className="font-medium">No matching products</p>
          <button type="button" onClick={() => { setQuery(""); setActiveCategory("All"); }} className="mt-3 text-sm font-medium text-primary underline-offset-4 hover:underline">
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
