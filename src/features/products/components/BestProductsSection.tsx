import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { BestProductCard } from "@/features/products/components/BestProductCard";
import type { Product } from "@/features/products/types/product.types";

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
            <BestProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
