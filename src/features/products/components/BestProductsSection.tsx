import { BestProductCard } from "@/features/products/components/BestProductCard";
import type { Product } from "@/features/products/types/product.types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

type BestProductsSectionProps = {
  products: Product[];
};

export function BestProductsSection({ products }: BestProductsSectionProps) {
  return (
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
        <span className="hidden text-xs font-semibold text-slate-500 dark:text-slate-400 sm:block">
          Curated picks
        </span>
      </div>
      <Swiper
        modules={[Autoplay]}
        spaceBetween={16}
        slidesPerView={1.1}
        autoplay={{ delay: 2000 }}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
        className="-mx-4 px-4 pb-3 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0"
      >
        {products.map((product, index) => (
          <SwiperSlide key={product._id} className="h-auto overflow-hidden">
            <BestProductCard product={product} priority={index < 4} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
