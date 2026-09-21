import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Filter,
  Minus,
  Plus,
  SlidersHorizontal,
  ShoppingCart,
} from "lucide-react";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { useCartStore } from "@/features/cart/store/cart.store";
import { useProducts } from "@/features/products/hooks/use-products";
import type { Product } from "@/features/products/types/product.types";
import { useCatalogStore } from "@/stores/catalog.store";

function ProductCartControl({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  const cartItem = useCartStore((state) =>
    state.items.find((item) => item.productId === product._id),
  );
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  if (cartItem) {
    return (
      <div className="inline-flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 p-1 dark:border-amber-400/40 dark:bg-amber-400/10">
        <button
          type="button"
          onClick={() => updateQuantity(product._id, cartItem.quantity - 1)}
          aria-label={`Decrease ${product.name} quantity`}
          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-slate-700 hover:bg-white dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="min-w-5 text-center text-sm font-bold text-slate-950 dark:text-white">
          {cartItem.quantity}
        </span>
        <button
          type="button"
          onClick={() => updateQuantity(product._id, cartItem.quantity + 1)}
          aria-label={`Increase ${product.name} quantity`}
          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg bg-[#F5B942] text-slate-950 hover:bg-[#E5A52E]"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      disabled={product.stock < 1}
      onClick={() =>
        addItem({
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.imageUrl,
        })
      }
      aria-label={
        product.stock > 0
          ? `Add ${product.name} to cart`
          : `${product.name} is sold out`
      }
      className="cursor-pointer rounded-xl bg-slate-950 p-2 text-white transition hover:bg-[#F5B942] hover:text-slate-950 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 sm:px-3 sm:py-2 sm:text-xs sm:font-bold dark:bg-[#F5B942] dark:text-slate-950 dark:hover:bg-[#E5A52E]"
    >
      <ShoppingCart className="h-4 w-4 sm:hidden" />
      <span className="hidden sm:inline">
        {product.stock > 0 ? "Add to cart" : "Sold out"}
      </span>
    </button>
  );
}

export function ProductsPage() {
  const { data, isPending, isError } = useProducts(1, 100);
  const query = useCatalogStore((state) => state.query);
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");

  if (isPending) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12">
        <div className="h-64 animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800" />
        <p className="mt-8 text-center text-slate-500">Loading products...</p>
      </main>
    );
  }

  if (isError) {
    return (
      <p className="p-10 text-center text-red-600">Unable to load products.</p>
    );
  }

  const categories = [
    "All",
    ...Array.from(new Set(data.data.map((product) => product.category))),
  ];
  const normalizedQuery = query.trim().toLowerCase();
  const filteredProducts = data.data
    .filter((product) => category === "All" || product.category === category)
    .filter(
      (product) =>
        !normalizedQuery ||
        `${product.name} ${product.description} ${product.category}`
          .toLowerCase()
          .includes(normalizedQuery),
    )
    .sort((first, second) => {
      if (sort === "price-low") return first.price - second.price;
      if (sort === "price-high") return second.price - first.price;
      if (sort === "rating") return second.rating - first.rating;
      return 0;
    });
  const bestProducts = [...data.data]
    .sort((first, second) => second.rating - first.rating)
    .slice(0, 8);

  return (
    <main className="mx-auto max-w-360 px-4 pb-12 sm:px-6 lg:px-8">
      <section className="border-b border-slate-200 py-5 dark:border-slate-800 sm:py-6">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600">
              Top picks
            </p>
            <h1 className="font-display mt-1 text-2xl font-bold text-slate-950 dark:text-white sm:text-3xl">
              Best products for you
            </h1>
          </div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Swipe to explore
          </span>
        </div>
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          spaceBetween={12}
          slidesPerView={1.15}
          breakpoints={{
            640: { slidesPerView: 2.2 },
            1024: { slidesPerView: 3.5 },
            1280: { slidesPerView: 4.5 },
          }}
          className="best-products-swiper"
        >
          {bestProducts.map((product) => (
            <SwiperSlide key={product._id}>
              <Link
                to="/products/$productId"
                params={{ productId: product._id }}
                className="group flex h-36 overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 sm:h-40"
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-2/5 object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="min-w-0 flex-1 p-3">
                  <p className="truncate text-[11px] font-bold uppercase tracking-wider text-amber-600">
                    {product.category}
                  </p>
                  <h2 className="mt-1 line-clamp-2 font-bold text-slate-950 dark:text-white">
                    {product.name}
                  </h2>
                  <span className="mt-2 inline-flex rounded bg-emerald-600 px-1.5 py-0.5 text-[11px] font-bold text-white">
                    {product.rating.toFixed(1)} ★
                  </span>
                  <p className="mt-2 font-bold text-slate-950 dark:text-white">
                    ₹{product.price.toFixed(2)}
                  </p>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <section className="border-b border-slate-200 py-5 dark:border-slate-800">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`shrink-0 cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition ${category === item ? "bg-slate-950 text-white dark:bg-amber-400 dark:text-slate-950" : "bg-slate-100 text-slate-600 hover:bg-amber-50 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"}`}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <section id="catalog" className="mt-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {filteredProducts.length} of {data.meta.total} products
            </p>
            <h2 className="font-display mt-1 text-2xl font-bold text-slate-950 dark:text-white">
              {normalizedQuery
                ? `Results for “${query}”`
                : category === "All"
                  ? "Recommended for you"
                  : category}
            </h2>
          </div>
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            <SlidersHorizontal className="h-4 w-4" />
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="cursor-pointer bg-transparent outline-none dark:bg-slate-900"
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
              <article
                key={product._id}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
              >
                <Link
                  to="/products/$productId"
                  params={{ productId: product._id }}
                  className="relative block overflow-hidden bg-slate-100 dark:bg-slate-800"
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="aspect-4/3 w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  {product.stock < 5 && product.stock > 0 && (
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-rose-600">
                      Only {product.stock} left
                    </span>
                  )}
                </Link>
                <div className="p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-600">
                    {product.category}
                  </p>
                  <Link
                    to="/products/$productId"
                    params={{ productId: product._id }}
                  >
                    <h3 className="mt-1 truncate text-lg font-bold text-slate-950 dark:text-white">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded bg-emerald-600 px-2 py-0.5 text-xs font-bold text-white">
                      {product.rating.toFixed(1)} ★
                    </span>
                    <span className="text-xs text-slate-400">
                      {product.numReviews} reviews
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500 dark:text-slate-400">
                    {product.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="text-lg font-bold text-slate-950 dark:text-white">
                      ₹{product.price.toFixed(2)}
                    </span>
                    <ProductCartControl product={product} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
