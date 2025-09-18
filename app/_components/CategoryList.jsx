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

      {/* Flowing menu for categories */}
      <FlowingMenu items={flowingItems} />

      {/* Scroll Arrows */}
      <ArrowLeftCircle
        className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-700 cursor-pointer z-10 opacity-70 hover:opacity-100 transition-opacity hidden sm:block"
        size={35}
        onClick={() => handleScroll("left")}
      />
      <ArrowRightCircle
        className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-700 cursor-pointer z-10 opacity-70 hover:opacity-100 transition-opacity hidden sm:block"
        size={35}
        onClick={() => handleScroll("right")}
      />
    </div>
  );
}

export default CategoryList;