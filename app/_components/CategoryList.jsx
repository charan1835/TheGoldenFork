"use client";

import { useEffect, useState, useRef } from "react";
import GlobalApi from "../_utils/GlobalApi";
import { motion } from "framer-motion";
import { ArrowRightCircle, ArrowLeftCircle, X } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

function CategoryList() {
  const [categoryList, setCategoryList] = useState([]);
  const scrollRef = useRef(null);
  const params = useSearchParams();
  const router = useRouter();
  const selectedCategory = params.get("category");

  useEffect(() => {
    getCategoryList();
  }, []);

  const getCategoryList = () => {
    GlobalApi.getCategory().then((resp) => {
      setCategoryList(resp.categories);
    });
  };

  const handleScroll = (direction) => {
    const container = scrollRef.current;
    if (container) {
      const scrollAmount = container.clientWidth * 0.8; // scroll ~80% of visible width
      container.scrollBy({
        left: direction === "right" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleClearSelection = () => {
    router.push("/");
  };

  return (
    <div className="relative px-4 py-4 sm:px-6 md:px-8" id="home">
      {/* Selected category display */}
      {selectedCategory && (
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Selected:</span>
            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium capitalize">
              {selectedCategory}
            </span>
          </div>
          <button
            onClick={handleClearSelection}
            className="flex items-center gap-1 text-gray-600 hover:text-gray-800 text-sm transition-colors"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        </div>
      )}

      {/* Scroll Arrows (show only on md+) */}
      <div className="hidden md:flex justify-between items-center mb-3">
        <button
          onClick={() => handleScroll("left")}
          className="p-2 rounded-full hover:bg-gray-100 transition"
        >
          <ArrowLeftCircle className="w-6 h-6 text-gray-600" />
        </button>
        <button
          onClick={() => handleScroll("right")}
          className="p-2 rounded-full hover:bg-gray-100 transition"
        >
          <ArrowRightCircle className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* Scrollable Category Row */}
      <motion.div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide snap-x snap-mandatory"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
      >
        {categoryList.map((c, idx) => (
          <button
            key={idx}
            onClick={() => router.push(`?category=${c.slug}`)}
            className="relative flex-shrink-0 snap-center overflow-hidden rounded-2xl border border-border/60 bg-surface shadow-soft
            w-[45%] sm:w-[30%] md:w-[22%] lg:w-[18%] xl:w-[16%] h-44 sm:h-52 md:h-60"
          >
            {c.icon?.url ? (
              <img
                src={c.icon.url}
                alt={c.name}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center text-muted-foreground">
                {c.name}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
            <div className="absolute bottom-2 left-2 right-2 flex justify-center">
              <span className="inline-flex items-center rounded-full border border-white/20 bg-black/40 px-3 py-1 text-sm font-semibold text-white backdrop-blur">
                {c.name}
              </span>
            </div>
          </button>
        ))}
      </motion.div>
    </div>
  );
}

export default CategoryList;
