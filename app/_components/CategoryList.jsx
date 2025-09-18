"use client";

import { useEffect, useState, useRef } from "react";
import GlobalApi from "../_utils/GlobalApi";
import GlareCard from "./animations/GlareCard";
import FlowingMenu from "./FlowingMenu";
import { ArrowRightCircle, ArrowLeftCircle, X } from "lucide-react";
import Link from "next/link";
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
      container.scrollLeft += direction === "right" ? 250 : -250;
    }
  };

  const handleClearSelection = () => {
    router.push("/");
  };

  const flowingItems = categoryList.map((c) => ({
    link: `?category=${c.slug}`,
    text: c.name,
    image: c.icon?.url,
  }));

  return (
    <div className="relative px-4 py-4 sm:px-6 md:px-8" id="home">
      {/* Clear Selection Button - Show only when category is selected */}
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

      {/* Mobile: 3-up grid with full visible images */}
      <ul className="grid grid-cols-2 gap-4 px-2 sm:hidden">
        {categoryList.map((c, idx) => (
          <li key={idx}>
            <button
              onClick={() => router.push(`?category=${c.slug}`)}
              className="relative block h-40 w-full overflow-hidden rounded-xl border border-border/60 bg-surface shadow-soft"
            >
              {c.icon?.url ? (
                <img src={c.icon.url} alt={c.name} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
              ) : (
                <div className="absolute inset-0 grid place-items-center text-muted-foreground text-xs">{c.name}</div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
              <div className="absolute bottom-1 left-1 right-1 flex justify-center">
                <span className="inline-flex items-center rounded-full border border-white/20 bg-black/40 px-3 py-0.5 text-xs font-semibold text-white backdrop-blur">
                  {c.name}
                </span>
              </div>
            </button>
          </li>
        ))}
      </ul>

      {/* Tablet/Desktop: responsive grid with larger images */}
      <ul className="hidden sm:grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {categoryList.map((c, idx) => (
          <li key={idx}>
            <button
              onClick={() => router.push(`?category=${c.slug}`)}
              className="relative block h-48 md:h-56 lg:h-64 w-full overflow-hidden rounded-2xl border border-border/60 bg-surface shadow-soft"
            >
              {c.icon?.url ? (
                <img src={c.icon.url} alt={c.name} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
              ) : (
                <div className="absolute inset-0 grid place-items-center text-muted-foreground">{c.name}</div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
              <div className="absolute bottom-2 left-2 right-2 flex justify-center">
                <span className="inline-flex items-center rounded-full border border-white/20 bg-black/40 px-3 py-1 text-sm font-semibold text-white backdrop-blur">
                  {c.name}
                </span>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryList;