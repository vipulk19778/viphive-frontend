import { Link } from "@tanstack/react-router";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import type { Product } from "@/features/products/types/product.types";
import { formatCurrency } from "@/utils/format-currency";

type BestProductsSectionProps = {
  products: Product[];
};

export function BestProductsSection({ products }: BestProductsSectionProps) {
  return (
    <section className="border-b border-slate-200 py-5 dark:border-slate-800 sm:py-6">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="brand-accent text-xs font-bold uppercase tracking-[0.2em]">
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
        modules={[Autoplay]}
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
        {products.map((product) => (
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
                <p className="brand-accent truncate text-[11px] font-bold uppercase tracking-wider">
                  {product.category}
                </p>
                <h2 className="mt-1 line-clamp-2 font-bold text-slate-950 dark:text-white">
                  {product.name}
                </h2>
                <span className="mt-2 inline-flex rounded bg-emerald-600 px-1.5 py-0.5 text-[11px] font-bold text-white">
                  {product.rating.toFixed(1)} ★
                </span>
                <p className="mt-2 font-bold text-slate-950 dark:text-white">
                  {formatCurrency(product.price)}
                </p>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
